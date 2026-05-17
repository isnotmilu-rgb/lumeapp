import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, List, User, SlidersHorizontal, X, Check } from 'lucide-react';
import { useApp } from '../App';
import { MapView } from './MapView';
import { vendors, Vendor } from '../data/vendors';
import { analyticsService } from '../../services/analytics';
import L from 'leaflet';

const vendors = [
  { id: 1, name: 'Leñas Boyeco', initials: 'LB', humidity: 17, certified: true, zone: 'temuco', x: 26, y: 33, species: 'Eucaliptus', price: 45000, daysAgo: 1, lat: -38.7259, lng: -72.5804 },
  { id: 2, name: 'Maderera Verde', initials: 'MV', humidity: 21, certified: true, zone: 'temuco', x: 44, y: 24, species: 'Roble', price: 52000, daysAgo: 2, lat: -38.7459, lng: -72.6004 },
  { id: 3, name: 'Juan Rojas', initials: 'JR', humidity: null, certified: false, zone: 'padre-las-casas', x: 66, y: 43, species: 'Coigüe', price: 33000, daysAgo: null, lat: -38.7659, lng: -72.6204 },
  { id: 4, name: 'Leñas del Sur', initials: 'LS', humidity: 19, certified: true, zone: 'padre-las-casas', x: 72, y: 57, species: 'Eucaliptus', price: 48000, daysAgo: 5, lat: -38.7559, lng: -72.6404 },
  { id: 5, name: 'Comercial Aromo', initials: 'CA', humidity: 18, certified: true, zone: 'alrededores', x: 34, y: 71, species: 'Aromo', price: 41000, daysAgo: 1, lat: -38.7159, lng: -72.5604 },
  { id: 6, name: 'Don Pedro Leña', initials: 'DP', humidity: null, certified: false, zone: 'alrededores', x: 14, y: 62, species: 'Roble', price: 30000, daysAgo: null, lat: -38.7059, lng: -72.5404 },
  { id: 7, name: 'Forestal Cautín', initials: 'FC', humidity: 23, certified: true, zone: 'temuco', x: 58, y: 42, species: 'Roble', price: 44000, daysAgo: 5, lat: -38.7359, lng: -72.6104 },
];

const SPECIES_OPTIONS = ['Eucaliptus', 'Roble', 'Coigüe', 'Aromo', 'Raulí'];
const ZONE_OPTIONS = ['Temuco centro', 'Padre Las Casas', 'Lautaro', 'Freire', 'Vilcún'];

const pinColor = (v: Vendor) => {
  if (!v.certified) return '#FF6F00';
  if (v.daysAgo !== null && v.daysAgo <= 2) return '#2E7D32';
  if (v.daysAgo !== null && v.daysAgo <= 5) return '#F9A825';
  return '#558B2F';
};

const createCustomIcon = (color: string, initials: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        ${initials}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

interface Filtros { search: string; species: string[]; zones: string[]; precioMax: number; soloCertificados: boolean; }

export function MapScreen() {
  const navigate = useNavigate();
  const { setCurrentFlow, setCurrentStep } = useApp();
  const [activeTab, setActiveTab] = useState('map');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({ search: '', species: [], zones: [], precioMax: 60000, soloCertificados: false });
  const [tempFiltros, setTempFiltros] = useState<Filtros>(filtros);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [screenStartTime, setScreenStartTime] = useState<Date>(new Date());
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filterVendors = (filters: Filtros) => {
    return vendors.filter(v => {
      if (filters.search && !v.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.species.length > 0 && !filters.species.includes(v.species)) return false;
      if (filters.zones.length > 0) {
        const ok = filters.zones.some(z => (z === 'Temuco centro' && v.zone === 'temuco') || (z === 'Padre Las Casas' && v.zone === 'padre-las-casas') || (v.zone === 'alrededores'));
        if (!ok) return false;
      }
      if (v.price > filters.precioMax) return false;
      if (filters.soloCertificados && !v.certified) return false;
      return true;
    });
  };

  const filtered = filterVendors(filtros);

  useEffect(() => {
    analyticsService.trackScreenView('map_screen');
    setScreenStartTime(new Date());
    return () => {
      const timeSpent = (new Date().getTime() - screenStartTime.getTime()) / 1000;
      analyticsService.trackScreenTime('map_screen', timeSpent);
    };
  }, []);

  useEffect(() => {
    if (Object.keys(filtros).some(key => filtros[key] !== tempFiltros[key])) {
      analyticsService.trackFilterUsage('filters_applied', filtros, filtered.length);
    }
  }, [filtros, filtered.length]);

  const chips = [...filtros.species, ...filtros.zones, ...(filtros.soloCertificados ? ['Solo certif.'] : []), ...(filtros.precioMax !== 60000 ? [`Hasta $${(filtros.precioMax/1000).toFixed(0)}k`] : [])];

  const removeChip = (chip: string) => setFiltros(p => ({ ...p, species: p.species.filter(s => s !== chip), zones: p.zones.filter(z => z !== chip), soloCertificados: chip === 'Solo certif.' ? false : p.soloCertificados, ...(chip.startsWith('Hasta') ? { precioMax: 60000 } : {}) }));

  const applyFilters = () => {
    const newFilters = tempFiltros;
    const resultsCount = filterVendors(newFilters).length;
    analyticsService.trackFilterUsage('filters_applied', newFilters, resultsCount);
    setFiltros(newFilters);
    setFilterPanelOpen(false);
  };

  const toggleSp = (s: string) => {
    const newSpecies = tempFiltros.species.includes(s)
      ? tempFiltros.species.filter(x => x !== s)
      : [...tempFiltros.species, s];
    setTempFiltros(p => ({ ...p, species: newSpecies }));
    analyticsService.trackFilterUsage('species_toggle', { species: s, action: newSpecies.includes(s) ? 'added' : 'removed' }, 0);
  };

  const toggleZone = (z: string) => {
    const newZones = tempFiltros.zones.includes(z)
      ? tempFiltros.zones.filter(x => x !== z)
      : [...tempFiltros.zones, z];
    setTempFiltros(p => ({ ...p, zones: newZones }));
    analyticsService.trackFilterUsage('zone_toggle', { zone: z, action: newZones.includes(z) ? 'added' : 'removed' }, 0);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F0F7F0] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white px-4 py-3 flex-shrink-0 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs opacity-90">9:41</span>
          <span className="font-bold text-sm">LumeApp</span>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-lg mb-1">Leña Seca y Certificada</h1>
          <p className="text-[#A5D6A7] text-xs">Calidad garantizada • Medición certificada • Entrega rápida</p>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="bg-white px-4 py-2 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span>Medición certificada</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span>Actualizado recientemente</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span>Respuesta rápida</span></div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white px-3 pt-3 pb-2 flex-shrink-0 border-b border-gray-100">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 bg-[#F9FBE7] border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Buscar vendedor..." value={filtros.search} onChange={e => setFiltros(p => ({ ...p, search: e.target.value }))} className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400" />
            {filtros.search && <button onClick={() => setFiltros(p => ({ ...p, search: '' }))}><X size={13} className="text-gray-400" /></button>}
          </div>
          <button onClick={() => { setTempFiltros(filtros); setFilterPanelOpen(true); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-[#2E7D32] text-white flex-shrink-0">
            <SlidersHorizontal size={15} /><span>Filtros</span>
            {chips.length > 0 && <span className="bg-white text-[#2E7D32] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{chips.length}</span>}
          </button>
        </div>
        {chips.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {chips.map((c, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#2E7D32] text-white rounded-full text-xs whitespace-nowrap flex-shrink-0">
                <span>{c}</span><button onClick={() => removeChip(c)}><X size={11} /></button>
              </div>
            ))}
            <button onClick={() => setFiltros(p => ({ ...p, species: [], zones: [], precioMax: 60000, soloCertificados: false }))} className="text-xs text-[#2E7D32] whitespace-nowrap underline flex-shrink-0 px-1">Limpiar</button>
          </div>
        )}
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4 pb-24">
        {/* Map Section - Fixed Height */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-md flex-shrink-0" style={{ height: '300px', minHeight: '300px' }}>
          <MapView
            className="w-full h-full"
            center={[-38.7359, -72.5904]}
            zoom={12}
            markers={[
              ...(userLocation ? [{
                id: 'user-location',
                position: userLocation,
                icon: L.divIcon({
                  html: `<div style="background-color: #1976D2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
                  className: 'user-location-marker',
                  iconSize: [26, 26],
                  iconAnchor: [13, 13],
                }),
                popup: 'Tu ubicación actual'
              }] : []),
              ...filtered.map(v => ({
                id: v.id,
                position: [v.lat, v.lng] as [number, number],
                icon: createCustomIcon(pinColor(v), v.initials),
                popup: `<div class="text-center p-2"><strong class="text-gray-800">${v.name}</strong><br/><span class="text-sm text-gray-600">${v.certified ? `${v.humidity}% humedad` : 'Sin medición'}</span><br/><span class="text-sm font-medium text-green-600">$${v.price.toLocaleString('es-CL')} / m³</span></div>`
              }))
            ]}
            onMarkerClick={(markerId) => {
              if (markerId === 'user-location') {
                analyticsService.trackMapInteraction('marker_click', { markerId, markerType: 'user_location' });
                return;
              }
              const v = vendors.find(x => x.id === markerId);
              if (v) {
                setSelectedVendor(v);
                analyticsService.trackVendorInteraction(v.id.toString(), 'marker_clicked', { name: v.name, certified: v.certified, humidity: v.humidity, price: v.price });
              }
            }}
            onLocationFound={(position) => {
              setUserLocation(position);
              analyticsService.trackMapInteraction('geolocation_success', { position });
            }}
            onLocationError={(error) => {
              console.warn('Error getting location:', error.message);
              analyticsService.trackMapInteraction('geolocation_error', { error: error.message });
            }}
            trackInteractions={true}
            onInteraction={(type, data) => {
              analyticsService.trackMapInteraction(type, data);
            }}
            enableGeolocation={false}
          />

          {filtered.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
              <div className="text-4xl mb-2">🌲</div>
              <h3 className="text-sm font-bold text-gray-800 mb-1 text-center">Sin resultados</h3>
              <p className="text-xs text-gray-600 text-center">Ajusta tus filtros</p>
            </div>
          )}

          {userLocation === null && (
            <div className="absolute top-2 left-2 right-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 z-10">
              <div className="flex items-center gap-2">
                <div className="text-yellow-600 text-sm">📍</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-yellow-800">Ubicación no disponible</p>
                  <p className="text-xs text-yellow-700">Activa la ubicación para vendedores cercanos</p>
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 text-xs space-y-0.5 shadow-lg z-10">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#2E7D32]"/><span className="text-gray-700">Reciente</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#F9A825]"/><span className="text-gray-700">Por vencer</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#FF6F00]"/><span className="text-gray-700">Sin medición</span></div>
          </div>
        </div>

        {/* Vendors List */}
        <div className="flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {filtered.length === 0 ? 'Sin resultados' : `${filtered.length} vendedor${filtered.length !== 1 ? 'es' : ''}`}
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm mb-4">Prueba ajustando tus filtros</p>
              <button
                onClick={() => {
                  setFiltros(p => ({ ...p, species: [], zones: [], precioMax: 60000, soloCertificados: false }));
                  analyticsService.trackFilterUsage('clear_filters_empty_state', {}, 0);
                }}
                className="bg-[#2E7D32] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-[#1B5E20] transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedVendor(v);
                    analyticsService.trackVendorInteraction(v.id.toString(), 'card_clicked', {
                      name: v.name,
                      certified: v.certified,
                      humidity: v.humidity,
                      price: v.price
                    });
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{v.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-600">{v.species}</span>
                        {v.certified && (
                          <div className="flex items-center gap-1 bg-green-100 px-1.5 py-0.5 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-700 font-medium">Cert.</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {v.daysAgo !== null && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">Hace {v.daysAgo}d</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-gray-500">Humedad</span>
                      <p className="font-semibold text-gray-800">{v.humidity ? `${v.humidity}%` : 'Sin medir'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Precio</span>
                      <p className="font-semibold text-green-600">${(v.price / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="absolute inset-0 z-40 flex items-end justify-center p-4 pointer-events-none" onClick={() => setSelectedVendor(null)}>
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{selectedVendor.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{selectedVendor.species}</span>
                  {selectedVendor.certified && (
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-700 font-medium">Certificado</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Humedad</span>
                <span className="font-semibold text-gray-800">{selectedVendor.humidity ? `${selectedVendor.humidity}%` : 'Sin medición'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Precio</span>
                <span className="font-bold text-lg text-green-600">${selectedVendor.price.toLocaleString('es-CL')} / m³</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ubicación</span>
                <span className="text-sm text-gray-800">
                  {selectedVendor.zone === 'temuco' ? 'Temuco Centro' :
                   selectedVendor.zone === 'padre-las-casas' ? 'Padre Las Casas' : 'Alrededores'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  analyticsService.trackVendorInteraction(selectedVendor.id.toString(), 'view_details', { name: selectedVendor.name, certified: selectedVendor.certified });
                  setCurrentFlow(selectedVendor.certified ? ['Ver mapa', `Seleccionar: ${selectedVendor.name}`, 'Ver detalles', 'Contactar por WhatsApp'] : ['Ver mapa', `Seleccionar: ${selectedVendor.name}`, 'Sin certificación', 'Ver advertencia']);
                  setCurrentStep(1);
                  navigate(`/seller/${selectedVendor.id}`);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Ver detalles
              </button>
              <button
                onClick={() => {
                  const message = `Hola, vi su leña en LumeApp. Me interesa ${selectedVendor.species} a $${selectedVendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega?`;
                  const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                  analyticsService.trackVendorInteraction(selectedVendor.id.toString(), 'whatsapp_contact', { name: selectedVendor.name, price: selectedVendor.price, species: selectedVendor.species, certified: selectedVendor.certified });
                }}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>📱 WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-around items-center flex-shrink-0 safe-area-bottom">
        <button
          onClick={() => {
            setActiveTab('map');
            analyticsService.trackNavigation('bottom_nav', 'map_tab');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'map' ? 'text-[#2E7D32]' : 'text-gray-400'}`}
        >
          <MapPin size={24}/><span className="text-xs">Mapa</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('list');
            analyticsService.trackNavigation('bottom_nav', 'list_tab');
            navigate('/list');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'list' ? 'text-[#2E7D32]' : 'text-gray-400'}`}
        >
          <List size={24}/><span className="text-xs">Lista</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('profile');
            analyticsService.trackNavigation('bottom_nav', 'profile_tab');
            navigate('/profile/buyer');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-[#2E7D32]' : 'text-gray-400'}`}
        >
          <User size={24}/><span className="text-xs">Perfil</span>
        </button>
      </div>

      {/* Filter Panel Modal */}
      {filterPanelOpen && (
        <div className="absolute inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/40" onClick={() => setFilterPanelOpen(false)} />
          <div className="bg-white rounded-t-2xl shadow-xl overflow-y-auto max-h-[80%]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-[#1B5E20] text-base">Filtros</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setTempFiltros(p => ({ ...p, species: [], zones: [], precioMax: 60000, soloCertificados: false }))} className="text-sm text-gray-500 underline">Limpiar</button>
                <button onClick={() => setFilterPanelOpen(false)} className="text-gray-400"><X size={20}/></button>
              </div>
            </div>
            <div className="px-4 py-4 space-y-5">
              <div className="flex items-center justify-between">
                <div><p className="font-medium text-sm text-gray-800">Solo certificados</p><p className="text-xs text-gray-500">Ocultar sin medición</p></div>
                <button onClick={() => setTempFiltros(p => ({ ...p, soloCertificados: !p.soloCertificados }))} className={`w-12 h-6 rounded-full transition-colors relative ${tempFiltros.soloCertificados ? 'bg-[#2E7D32]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${tempFiltros.soloCertificados ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 mb-2">Tipo de madera</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIES_OPTIONS.map(s => (
                    <button key={s} onClick={() => toggleSp(s)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors ${tempFiltros.species.includes(s) ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : 'bg-white text-gray-700 border-gray-300'}`}>
                      🌲 {s}{tempFiltros.species.includes(s) && <Check size={12}/>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 mb-2">Zona</p>
                <div className="flex flex-wrap gap-2">
                  {ZONE_OPTIONS.map(z => (
                    <button key={z} onClick={() => toggleZone(z)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors ${tempFiltros.zones.includes(z) ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : 'bg-white text-gray-700 border-gray-300'}`}>
                      📍 {z}{tempFiltros.zones.includes(z) && <Check size={12}/>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 mb-1">Precio máximo por metro</p>
                <div className="flex justify-between text-sm font-medium text-[#2E7D32] mb-2">
                  <span>$30.000</span><span className="font-bold">${tempFiltros.precioMax.toLocaleString('es-CL')}</span>
                </div>
                <input type="range" min={30000} max={60000} step={5000} value={tempFiltros.precioMax} onChange={e => setTempFiltros(p => ({ ...p, precioMax: Number(e.target.value) }))} className="w-full accent-[#2E7D32]" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$30.000</span><span>$60.000</span></div>
              </div>
            </div>
            <div className="px-4 pb-8 pt-2">
              <button onClick={applyFilters} className="w-full bg-[#2E7D32] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#1B5E20] transition-colors">Aplicar filtros</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
