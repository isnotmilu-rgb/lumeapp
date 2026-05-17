import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageCircle, MapPin, Clock, Award, Leaf, Zap, Navigation2, Phone } from 'lucide-react';
import { useApp } from '../App';

const vendors = [
  { id: 1, name: 'Leñas Boyeco', initials: 'LB', humidity: 17, certified: true, species: 'Eucaliptus', available: 15, price: 45000, address: 'Temuco, La Araucanía', lastMeasured: '1 día', rating: 4.9, reviews: 127, daysAgo: 1, online: true, responseTime: 'Rápido', image: 'https://images.unsplash.com/photo-1574159194095-08c4b1aa9cf2?w=800&h=600&fit=crop' },
  { id: 2, name: 'Maderera Verde', initials: 'MV', humidity: 21, certified: true, species: 'Roble', available: 20, price: 52000, address: 'Temuco, La Araucanía', lastMeasured: '2 días', rating: 4.6, reviews: 84, daysAgo: 2, online: true, responseTime: 'Rápido', image: 'https://images.unsplash.com/photo-1566728822328-e4e99e345ef8?w=800&h=600&fit=crop' },
];

interface Vendor {
  id: number;
  name: string;
  humidity: number | null;
  certified: boolean;
  species: string;
  available: number;
  price: number;
  address: string;
  rating: number;
  reviews: number;
  daysAgo: number | null;
  online: boolean;
  responseTime: string;
  image: string;
  lastMeasured: string;
}

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon } = useApp();
  const vendor = (vendors as Vendor[]).find(v => v.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(2);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!vendor) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F5F7F4]">
        <p className="text-gray-500 text-sm mb-4">Vendedor no encontrado</p>
        <button onClick={() => navigate('/map')} className="bg-[#2E7D32] text-white px-6 py-2 rounded-2xl text-sm font-semibold">
          Volver al mapa
        </button>
      </div>
    );
  }

  const totalPrice = vendor.price * selectedMeters;

  return (
    <div className="h-screen bg-[#F5F7F4] flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-80 flex-shrink-0 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${vendor.image}')`,
            backgroundPosition: 'center'
          }}
        />

        {/* Elegant Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7F4] via-transparent to-transparent" />

        {/* Top Action Buttons */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 pt-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const url = `https://wa.me/${vendor.id}?text=Comparte este perfil`;
                window.open(url, '_blank');
              }}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Share2 size={20} className="text-gray-900" />
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`w-10 h-10 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 flex items-center justify-center ${
                isFavorited
                  ? 'bg-red-500/95 text-white'
                  : 'bg-white/95 hover:bg-white'
              }`}
            >
              <Heart size={20} fill={isFavorited ? 'white' : 'none'} />
            </button>
          </div>
        </div>

        {/* Floating Rating Card */}
        <div className="absolute bottom-0 left-5 right-5 mb-0 z-10 transform translate-y-1/2">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.round(vendor.rating) ? '⭐' : '☆'}`}>
                      {i < Math.round(vendor.rating) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-900">{vendor.rating}</p>
                <p className="text-xs text-gray-500">({vendor.reviews} reseñas)</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Verificado</p>
                {vendor.certified && <p className="text-lg">✓</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-24 pb-28 px-5" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Vendor Info */}
        <div className="mb-6">
          <p className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold mb-3">
            <span className="w-2 h-2 bg-[#2E7D32] rounded-full" />
            Proveedor Verificado
          </p>

          <h1 className="text-4xl font-black text-gray-900 mb-2 leading-tight">
            {vendor.name}
          </h1>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin size={16} className="text-[#2E7D32]" />
            <p className="text-sm">{vendor.address}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Zap size={16} className="text-amber-500" />
              <span className="font-semibold text-gray-900">Responde rápido</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={16} className="text-blue-500" />
              <span className="text-gray-600">En línea ahora</span>
            </div>
          </div>
        </div>

        {/* Premium Metrics Cards */}
        <div className="space-y-3 mb-6">
          {/* Humidity Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Humedad</p>
              </div>
              <Leaf size={24} className="text-[#2E7D32]" />
            </div>
            {vendor.humidity !== null ? (
              <>
                <p className="text-4xl font-black text-[#2E7D32] mb-1">{vendor.humidity}%</p>
                <p className="text-xs text-[#2E7D32] font-semibold">✓ Norma NCh 2965 (Óptimo)</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-300">—</p>
            )}
          </div>

          {/* Price Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio desde</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#2E7D32]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#2E7D32]">$</span>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">${(vendor.price / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-500">por m³</p>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Disponibilidad</p>
              </div>
              <Award size={24} className="text-amber-500" />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-1">{vendor.available}m³</p>
            <p className="text-xs text-amber-600 font-semibold">Inmediata</p>
          </div>
        </div>

        {/* Features Strip */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Por qué elegir este proveedor</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-[#2E7D32] flex items-center justify-center">
                <span className="text-xs font-bold text-[#2E7D32]">✓</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Medición certificada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-[#2E7D32] flex items-center justify-center">
                <span className="text-xs font-bold text-[#2E7D32]">✓</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Secado controlado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-[#2E7D32] flex items-center justify-center">
                <span className="text-xs font-bold text-[#2E7D32]">✓</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Leña seleccionada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-[#2E7D32] flex items-center justify-center">
                <span className="text-xs font-bold text-[#2E7D32]">✓</span>
              </div>
              <span className="text-sm text-gray-700 font-medium">Corte a medida</span>
            </div>
          </div>
        </div>

        {/* Wood Types */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Tipos disponibles</p>
          <div className="space-y-2">
            {['Eucaliptus', 'Roble', 'Coigüe'].map((type, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl">
                <span className="text-sm text-gray-700 font-medium">{type}</span>
                <span className="text-[#2E7D32] font-bold">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meters Calculator */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-6">¿Cuántos metros necesitas?</p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setSelectedMeters(m => Math.max(1, m - 1))}
              className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-[#2E7D32] hover:text-white text-gray-900 font-bold transition-all duration-300 text-lg"
            >
              −
            </button>
            <span className="text-5xl font-black text-[#2E7D32] w-20 text-center">{selectedMeters}</span>
            <button
              onClick={() => setSelectedMeters(m => Math.min(vendor.available, m + 1))}
              className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-[#2E7D32] hover:text-white text-gray-900 font-bold transition-all duration-300 text-lg"
            >
              +
            </button>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-[#E8F5E9] to-[#F5F7F4] rounded-2xl p-5">
            <p className="text-xs text-gray-600 mb-2">Total estimado</p>
            <p className="text-4xl font-black text-[#2E7D32] mb-3">${totalPrice.toLocaleString('es-CL')}</p>
            <p className="text-sm text-gray-600">{selectedMeters} m³ × ${vendor.price.toLocaleString('es-CL')}/m³</p>
          </div>
        </div>

        {/* Recent Measurements */}
        {vendor.certified && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Últimas mediciones</p>
            <div className="space-y-2">
              {[
                { humidity: vendor.humidity, days: 'Hoy' },
                { humidity: vendor.humidity! + 1, days: 'Hace 2 días' },
                { humidity: vendor.humidity! + 2, days: 'Hace 1 semana' }
              ].map((m, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex justify-between items-center hover:shadow-md transition-all duration-300">
                  <div>
                    <p className="text-sm text-gray-600">{m.days}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{vendor.species}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#2E7D32]">{m.humidity}%</p>
                    <p className="text-xs font-semibold text-[#2E7D32]">Óptimo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Ubicación</p>
          <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4 flex items-center justify-center">
            <Navigation2 size={32} className="text-[#2E7D32]/50" />
          </div>
          <p className="text-sm text-gray-700 font-semibold mb-2">{vendor.address}</p>
          <button className="w-full py-3 border-2 border-[#2E7D32] text-[#2E7D32] rounded-2xl font-semibold text-sm hover:bg-[#2E7D32]/5 transition-colors duration-300">
            Ver en mapa
          </button>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Reseñas destacadas</p>
          <div className="space-y-4">
            {[
              { text: 'Leña seca de excelente calidad. Recomendado', name: 'Carlos M.' },
              { text: 'Muy buena atención y entrega rápida', name: 'Patricia G.' }
            ].map((r, i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>⭐</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-1">{r.text}</p>
                <p className="text-xs text-gray-500">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA - WhatsApp */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-5 py-4 safe-area-bottom">
        <button
          onClick={() => {
            const message = `Hola, vi tu leña en LumeApp. Me interesa ${vendor.species} a $${vendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega de ${selectedMeters}m³?`;
            const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-full bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-4 rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
        >
          <MessageCircle size={22} />
          Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
}
