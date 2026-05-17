import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MessageCircle, MapPin, List, User, CheckCircle, Droplet, DollarSign, Package } from 'lucide-react';
import { useApp } from '../App';

const vendors = [
  { id: 1, name: 'Leñas Boyeco', initials: 'LB', humidity: 17, certified: true, species: 'Eucaliptus', available: 15, price: 45000, address: 'Av. Alemania 850, Temuco', lastMeasured: '1 día', rating: 4.9, reviews: 38, daysAgo: 1 },
  { id: 2, name: 'Maderera Verde', initials: 'MV', humidity: 21, certified: true, species: 'Roble', available: 20, price: 52000, address: 'Rudecindo Ortega 234, Temuco', lastMeasured: '2 días', rating: 4.6, reviews: 24, daysAgo: 2 },
  { id: 3, name: 'Juan Rojas', initials: 'JR', humidity: null, certified: false, species: 'Coigüe', available: 10, price: 33000, address: 'Los Boldos 123, Padre Las Casas', lastMeasured: null, rating: 3.8, reviews: 11, daysAgo: null },
  { id: 4, name: 'Leñas del Sur', initials: 'LS', humidity: 19, certified: true, species: 'Eucaliptus', available: 25, price: 48000, address: 'Balmaceda 456, Padre Las Casas', lastMeasured: '3 días', rating: 4.7, reviews: 29, daysAgo: 3 },
  { id: 5, name: 'Comercial Aromo', initials: 'CA', humidity: 18, certified: true, species: 'Aromo', available: 12, price: 41000, address: 'Caupolicán 789, Temuco', lastMeasured: '1 día', rating: 4.8, reviews: 42, daysAgo: 1 },
  { id: 6, name: 'Don Pedro Leña', initials: 'DP', humidity: null, certified: false, species: 'Roble', available: 8, price: 30000, address: 'Las Encinas 321, Padre Las Casas', lastMeasured: null, rating: 3.5, reviews: 7, daysAgo: null },
  { id: 7, name: 'Forestal Cautín', initials: 'FC', humidity: 23, certified: true, species: 'Roble', available: 18, price: 44000, address: 'Ruta 5 Norte km 8, Temuco', lastMeasured: '5 días', rating: 4.5, reviews: 18, daysAgo: 5 },
];

const features = [
  { icon: '✓', label: 'Medición certificada', color: 'bg-emerald-100 text-emerald-700' },
  { icon: '🌡', label: 'Secado controlado', color: 'bg-blue-100 text-blue-700' },
  { icon: '🌲', label: 'Leña seleccionada', color: 'bg-amber-100 text-amber-700' },
  { icon: '✂', label: 'Corte a medida', color: 'bg-purple-100 text-purple-700' },
];

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(v => v.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(3);

  if (!vendor) return (
    <div style={{height:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <p>Vendedor no encontrado</p>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );

  const totalPrice = vendor.price * selectedMeters;
  const measurements = [
    { date: '10 May 2026', time: '08:32', humidity: vendor.humidity ?? 26, species: vendor.species, verified: vendor.certified, status: 'Óptimo' },
    { date: '07 May 2026', time: '09:15', humidity: vendor.certified ? (vendor.humidity ?? 0) + 2 : 28, species: vendor.species, verified: vendor.certified, status: 'Aceptable' },
    { date: '04 May 2026', time: '11:00', humidity: vendor.certified ? (vendor.humidity ?? 0) + 3 : 30, species: vendor.species, verified: vendor.certified, status: 'Aceptable' },
  ];

  const speciesOptions = ['Eucaliptus', 'Roble', 'Coigüe', 'Aromo', 'Raulí'];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full bg-white relative" style={{ maxWidth: '430px' }}>
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Hero Section - Premium Gradient Dark Green */}
          <div 
            className="relative flex-shrink-0 px-4 pt-4 pb-6 flex flex-col rounded-b-3xl"
            style={{
              height: '320px',
              background: 'linear-gradient(160deg, #0a2e0d 0%, #1B5E20 50%, #2E7D32 100%)',
            }}
          >
            {/* Top Bar - Back, Share, Heart */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-95"
              >
                <ArrowLeft size={20} className="text-gray-900" />
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowComingSoon(true)}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-95"
                >
                  <Share2 size={18} className="text-gray-900" />
                </button>
                <button 
                  onClick={() => setShowComingSoon(true)}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all active:scale-95"
                >
                  <Heart size={18} className="text-gray-900" />
                </button>
              </div>
            </div>

            <div className="flex-1" />

            <div className="space-y-3">
              {vendor.certified && (
                <span className="inline-flex items-center gap-2 bg-emerald-400/90 text-white px-3.5 py-1.5 rounded-full font-bold text-xs w-fit">
                  <CheckCircle size={14} />
                  Proveedor verificado
                </span>
              )}
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-white leading-tight">{vendor.name}</h1>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-white flex-shrink-0" />
                  <p className="text-white text-sm">{vendor.address}</p>
                </div>
                <p className="text-sm text-emerald-200">En línea · Responde rápido</p>
              </div>
            </div>

            {/* Rating Badge - Bottom Right Floating */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⭐</span>
                <div>
                  <span className="font-bold text-gray-900">{vendor.rating}</span>
                  <span className="text-xs text-gray-600 ml-1">({vendor.reviews})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Features Strip */}
        <div className="px-4 py-4 space-y-2">
          {features.map((f, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl ${f.color}`}>
              <span className="text-lg font-bold">{f.icon}</span>
              <span className="font-semibold text-sm">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Metrics Grid - 3 Cards */}
        <div className="px-4 py-2 space-y-2">
          {/* Humedad */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Humedad</p>
                {vendor.humidity !== null && vendor.certified ? (
                  <>
                    <p className="text-3xl font-black text-emerald-700 mt-1">{vendor.humidity}%</p>
                    <p className="text-xs text-emerald-600 mt-2">Seca y certificada</p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-gray-400 mt-1">—</p>
                )}
              </div>
              <Droplet size={32} className="text-emerald-400" />
            </div>
          </div>

          {/* Precio */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-3xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Precio/m³</p>
                <p className="text-3xl font-black text-blue-700 mt-1">${(vendor.price / 1000).toFixed(0)}k</p>
              </div>
              <DollarSign size={32} className="text-blue-400" />
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-3xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Disponible</p>
                <p className="text-3xl font-black text-purple-700 mt-1">{vendor.available}m³</p>
              </div>
              <Package size={32} className="text-purple-400" />
            </div>
          </div>
        </div>

        {/* Specs & Calculator - Two Columns */}
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          {/* Species */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Tipo de leña</p>
            <p className="font-bold text-lg text-gray-900">{vendor.species}</p>
          </div>

          {/* Last Measured */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Última medición</p>
            <p className="font-bold text-gray-900">{vendor.lastMeasured || 'Nunca'}</p>
          </div>
        </div>

        {/* Meters Calculator */}
        <div className="px-4 py-3">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 rounded-3xl p-5">
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-900 mb-3">¿Cuántos metros?</p>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setSelectedMeters(m => Math.max(1, m - 1))} 
                  className="w-12 h-12 rounded-full bg-white border-2 border-yellow-300 font-bold text-xl text-gray-700 hover:bg-yellow-50 transition-all active:scale-95"
                >
                  −
                </button>
                <span className="font-black text-5xl text-yellow-700 w-16 text-center">{selectedMeters}</span>
                <button 
                  onClick={() => setSelectedMeters(m => Math.min(vendor.available, m + 1))} 
                  className="w-12 h-12 rounded-full bg-yellow-400 font-bold text-xl text-white hover:bg-yellow-500 transition-all active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Total estimado</p>
              <p className="text-3xl font-black text-yellow-700">${totalPrice.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        {/* Measurements with Status Badges */}
        {vendor.certified && (
          <div className="px-4 py-4">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Últimas mediciones</h3>
            <div className="space-y-2">
              {measurements.map((m, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{m.date}</p>
                      <p className="text-xs text-gray-500">{m.time}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.status === 'Óptimo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-emerald-700">{m.humidity}%</p>
                    <p className="text-xs text-gray-600">{m.species}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="px-4 py-4">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Reseñas</h3>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-4xl font-black text-gray-800 mb-1">{vendor.rating}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= Math.round(vendor.rating) ? '#F9A825' : '#D1D5DB', fontSize: 18 }}>★</span>
              ))}
            </div>
            <p className="text-sm text-gray-600">{vendor.reviews} evaluaciones</p>
          </div>
        </div>

        <div className="h-8"></div>
      </div>

      {/* Fixed Bottom WhatsApp */}
      <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-gray-200">
        <button
          onClick={() => {
            setCurrentStep(4);
            const message = `Hola, vi tu leña en LumeApp. Me interesa ${vendor.species} a $${vendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega de ${selectedMeters}m³?`;
            const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Contactar por WhatsApp
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-around items-center flex-shrink-0">
        <button onClick={() => navigate('/map')} className="flex flex-col items-center gap-1 text-gray-400"><MapPin size={22} /><span className="text-xs">Mapa</span></button>
        <button onClick={() => navigate('/list')} className="flex flex-col items-center gap-1 text-gray-400"><List size={22} /><span className="text-xs">Lista</span></button>
        <button onClick={() => navigate('/profile/buyer')} className="flex flex-col items-center gap-1 text-gray-400"><User size={22} /><span className="text-xs">Perfil</span></button>
      </div>
    </div>
  </div>
</div>
  );
}

