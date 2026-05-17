import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Share2, Heart, MessageCircle, MapPin, List, User } from 'lucide-react';
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

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#F9A825' : '#D1D5DB', fontSize: 14 }}>★</span>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating} ({reviews} reseñas)</span>
    </div>
  );
}

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(v => v.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(3);

  if (!vendor) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F9FBE7]">
      <p className="text-gray-500 text-sm mb-4">Vendedor no encontrado</p>
      <button onClick={() => navigate('/map')} className="bg-[#2E7D32] text-white px-6 py-2 rounded-xl text-sm">Volver al mapa</button>
    </div>
  );

  const totalPrice = vendor.price * selectedMeters;
  const measurements = [
    { date: '10 May 2026', time: '08:32', humidity: vendor.humidity ?? 26, species: vendor.species, verified: vendor.certified },
    { date: '07 May 2026', time: '09:15', humidity: vendor.certified ? (vendor.humidity ?? 0) + 2 : 28, species: vendor.species, verified: vendor.certified },
    { date: '04 May 2026', time: '11:00', humidity: vendor.certified ? (vendor.humidity ?? 0) + 3 : 30, species: vendor.species, verified: vendor.certified },
  ];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span><span className="font-bold">LumeApp</span>
      </div>

      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-b from-[#2E7D32] via-[#1B5E20] to-white px-4 pt-4 pb-20 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/20 transition-colors mb-3">
          <ArrowLeft size={22} className="text-white" />
        </button>
        
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-3xl font-black text-white leading-tight">{vendor.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-[#A5D6A7]" />
              <p className="text-[#A5D6A7] text-sm">{vendor.address}</p>
            </div>
          </div>
          <button onClick={() => setShowComingSoon(true)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <Heart size={20} className="text-white" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          {vendor.certified ? (
            <span className="inline-flex items-center gap-1.5 bg-white text-[#2E7D32] px-3 py-1.5 rounded-full font-bold text-xs">
              <div className="w-2 h-2 bg-[#2E7D32] rounded-full"></div>
              ✓ Certificado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-bold text-xs">
              ⚠ Sin certificación
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium">
            ⭐ {vendor.rating} ({vendor.reviews})
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-32" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* Warnings */}
        {!vendor.certified && (
          <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
            <p className="font-bold text-orange-700 text-sm mb-1">⚠️ Sin certificación activa</p>
            <p className="text-xs text-orange-600">No podemos garantizar la calidad. Contáctalo bajo tu propio riesgo.</p>
          </div>
        )}

        {vendor.certified && vendor.daysAgo !== null && vendor.daysAgo >= 5 && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <p className="font-bold text-yellow-700 text-sm mb-1">⏰ Certificación por vencer</p>
            <p className="text-xs text-yellow-600">Medido hace {vendor.daysAgo} días — la certificación expira a los 7.</p>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* Humedad Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Humedad</p>
            {vendor.humidity !== null && vendor.certified ? (
              <>
                <p className="text-3xl font-black text-green-700">{vendor.humidity}%</p>
                <p className="text-xs text-green-600 mt-2 font-medium">✓ Norma NCh 2965 (&lt;25%)</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-400">—</p>
            )}
          </div>

          {/* Precio Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Precio/m³</p>
            <p className="text-3xl font-black text-blue-700">${(vendor.price / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-500 mt-2">Disponible: {vendor.available}m³</p>
          </div>
        </div>

        {/* Species + Details */}
        <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Detalles</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tipo de leña</span>
              <span className="font-bold text-gray-900">{vendor.species}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medido</span>
              <span className="font-bold text-gray-900">{vendor.lastMeasured || 'Nunca'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estado</span>
              {vendor.certified ? (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  ✓ Verificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  Sin medir
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meters Selector */}
        <div className="mt-6 bg-gradient-to-br from-[#F9FBE7] to-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <label className="font-bold text-gray-900">¿Cuántos metros?</label>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-2 py-1">
              <button 
                onClick={() => setSelectedMeters(m => Math.max(1, m - 1))} 
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#2E7D32] hover:text-white text-gray-700 font-bold flex items-center justify-center transition-colors text-sm"
              >
                −
              </button>
              <span className="font-black text-[#2E7D32] w-6 text-center text-lg">{selectedMeters}</span>
              <button 
                onClick={() => setSelectedMeters(m => Math.min(vendor.available, m + 1))} 
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#2E7D32] hover:text-white text-gray-700 font-bold flex items-center justify-center transition-colors text-sm"
              >
                +
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total estimado</p>
                <p className="text-2xl font-black text-[#2E7D32]">${totalPrice.toLocaleString('es-CL')}</p>
              </div>
              <p className="text-sm text-gray-500">{selectedMeters} × ${vendor.price.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        {/* Measurements */}
        {vendor.certified && (
          <div className="mt-6 mb-4">
            <h3 className="font-bold text-gray-900 mb-4">Últimas mediciones</h3>
            <div className="space-y-2">
              {measurements.map((m, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center hover:border-green-300 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{m.date}</p>
                    <p className="text-xs text-gray-400">{m.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-700 text-lg">{m.humidity}%</p>
                    <p className="text-xs text-green-600 font-medium">✓ {m.species}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Datos de dispositivo — no editables</p>
          </div>
        )}

        {/* Additional Actions */}
        <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-4 shadow-sm">
          <button 
            onClick={() => navigate(`/history/${id}`)} 
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700 flex justify-between items-center"
          >
            <span>Ver historial completo</span>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Action - WhatsApp */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 py-4 safe-area-bottom">
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
      <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-around items-center flex-shrink-0 safe-area-bottom">
        <button onClick={() => navigate('/map')} className="flex flex-col items-center gap-1 text-gray-400"><MapPin size={22} /><span className="text-xs">Mapa</span></button>
        <button onClick={() => navigate('/list')} className="flex flex-col items-center gap-1 text-gray-400"><List size={22} /><span className="text-xs">Lista</span></button>
        <button onClick={() => navigate('/profile/buyer')} className="flex flex-col items-center gap-1 text-gray-400"><User size={22} /><span className="text-xs">Perfil</span></button>
      </div>
    </div>
  );
}

