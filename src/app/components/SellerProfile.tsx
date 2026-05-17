import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MessageCircle, MapPin, List, User, CheckCircle, Droplet, DollarSign, Package, Tag, ShieldCheck, Wind, Leaf, Scissors, Star, type LucideIcon } from 'lucide-react';
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

const featureItems: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: 'Cert. NCh 2965' },
  { icon: Wind, label: 'Secado controlado' },
  { icon: Leaf, label: 'Leña seleccionada' },
  { icon: Scissors, label: 'Corte a medida' },
];

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(v => v.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(1);

  if (!vendor) return (
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <p>Vendedor no encontrado</p>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );

  const totalPrice = vendor.price * selectedMeters;
  const measurements = [
    { date: '10 May 2026', time: '08:32', humidity: vendor.humidity ?? 26, species: vendor.species, status: (vendor.humidity ?? 26) <= 20 ? 'Óptimo' : 'Aceptable' },
    { date: '07 May 2026', time: '09:15', humidity: vendor.humidity !== null ? vendor.humidity + 1 : 24, species: vendor.species, status: (vendor.humidity ?? 24) <= 20 ? 'Óptimo' : 'Aceptable' },
    { date: '04 May 2026', time: '11:00', humidity: vendor.humidity !== null ? vendor.humidity + 3 : 26, species: vendor.species, status: (vendor.humidity ?? 26) <= 20 ? 'Óptimo' : 'Aceptable' },
  ];

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      <div className="mx-auto grid w-full max-w-[1100px] gap-8 px-4 py-6 md:grid-cols-[400px_1fr] md:px-6 md:py-8">
        <div className="relative">
          <div className="relative h-[320px] overflow-hidden rounded-b-[32px] bg-[linear-gradient(160deg,#071a08_0%,#0d2e10_30%,#1B5E20_70%,#2E7D32_100%)] p-5 md:min-h-[400px] md:rounded-[16px]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white active:scale-95"
              >
                <ArrowLeft size={20} className="text-[#1B5E20]" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white active:scale-95"
                >
                  <Share2 size={18} className="text-[#1B5E20]" />
                </button>
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white active:scale-95"
                >
                  <Heart size={18} className="text-[#1B5E20]" />
                </button>
              </div>
            </div>

            <div className="flex-1" />

            <div className="space-y-3">
              {vendor.certified && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-3.5 py-1.5 text-white text-[12px] font-semibold">
                  <CheckCircle size={14} />
                  Proveedor verificado
                </span>
              )}
              <div className="space-y-2">
                <h1 className="text-[32px] font-extrabold leading-[1.1] text-white md:text-[36px]">{vendor.name}</h1>
                <div className="flex items-center gap-2 text-white/70 text-[14px]">
                  <MapPin size={14} />
                  <span>{vendor.address}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[#A5D6A7] text-[13px]">
                  <span className="h-2 w-2 rounded-full bg-[#A5D6A7]" />
                  <span>En línea · Responde rápido</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 rounded-[16px] bg-white px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#FBBF24]" />
                <span className="font-bold text-[#1B5E20]">{vendor.rating}</span>
                <span className="text-sm text-gray-500">({vendor.reviews} reseñas)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pb-40 md:pb-0">
          <div className="grid grid-cols-1 gap-3 mt-[-20px] mx-4 md:mt-0 md:mx-0 md:grid-cols-3">
            <div className="rounded-[20px] bg-[#E8F5E9] border border-[#C8E6C9] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">HUMEDAD</p>
                <Droplet size={22} className="text-[#2E7D32]" />
              </div>
              <p className="mt-4 text-[28px] font-bold text-[#1B5E20]">{vendor.humidity ?? '—'}%</p>
              <span className="mt-3 inline-flex rounded-[10px] bg-[#2E7D32] px-3 py-1 text-[11px] font-semibold text-white">Óptimo</span>
            </div>
            <div className="rounded-[20px] bg-[#E3F2FD] border border-[#BBDEFB] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">PRECIO/M³</p>
                <Tag size={22} className="text-[#1565C0]" />
              </div>
              <p className="mt-4 text-[24px] font-bold text-[#1565C0]">${(vendor.price / 1000).toFixed(0)}k</p>
              <p className="mt-2 text-[12px] text-[#6B7280]">por metro</p>
            </div>
            <div className="rounded-[20px] bg-[#F3E5F5] border border-[#E1BEE7] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">STOCK</p>
                <Package size={22} className="text-[#7B1FA2]" />
              </div>
              <p className="mt-4 text-[24px] font-bold text-[#7B1FA2]">{vendor.available}m³</p>
              <p className="mt-2 text-[12px] text-[#6B7280]">metros disp.</p>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar px-4 md:px-0">
            <div className="flex gap-2">
              {featureItems.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-shrink-0 items-center gap-2 rounded-[20px] border border-[#E5E7EB] bg-white px-3.5 py-2">
                    <Icon size={16} className="text-[#2E7D32]" />
                    <span className="text-[13px] text-[#374151]">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <p className="text-[16px] font-semibold text-[#111827]">¿Cuántos metros necesitas?</p>
            <div className="mt-6 flex items-center justify-center gap-6">
              <button
                onClick={() => setSelectedMeters(m => Math.max(1, m - 1))}
                disabled={selectedMeters <= 1}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-[22px] font-bold transition ${selectedMeters <= 1 ? 'border-[#D1D5DB] text-[#9CA3AF] bg-white' : 'border-[#2E7D32] text-[#2E7D32] bg-white hover:bg-[#F3F9F4]'}`}
              >
                −
              </button>
              <div className="min-w-[60px] text-center text-[40px] font-black text-[#111827]">{selectedMeters}</div>
              <button
                onClick={() => setSelectedMeters(m => Math.min(vendor.available, m + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2E7D32] text-white text-[22px] shadow-[0_4px_12px_rgba(46,125,50,0.25)] transition hover:bg-[#25682b]"
              >
                +
              </button>
            </div>
            <div className="mt-3 rounded-[14px] bg-[#F9FBE7] p-4">
              <p className="text-[13px] text-[#6B7280]">Total estimado</p>
              <p className="mt-2 text-[30px] font-extrabold text-[#1B5E20]">${totalPrice.toLocaleString('es-CL')}</p>
              <p className="mt-1 text-[12px] text-[#6B7280]">${vendor.price.toLocaleString('es-CL')} por metro</p>
            </div>
            <button
              onClick={() => navigate(`/contact/${id}`)}
              className="mt-4 w-full rounded-[16px] border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#1B5E20] transition hover:bg-[#F3F7F3]"
            >
              Ver contacto directo
            </button>
          </div>

          <div className="px-4 md:px-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111827]">Últimas mediciones</h2>
              <button onClick={() => navigate(`/history/${id}`)} className="text-[#1B5E20] text-sm font-semibold">Ver histórico</button>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
              {measurements.map((m, i) => {
                const isOptimal = m.humidity <= 20;
                return (
                  <div key={i} className="min-w-[140px] flex-shrink-0 rounded-[16px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                    <span className={`mb-3 inline-block h-2 w-2 rounded-full ${isOptimal ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    <p className={`text-[22px] font-bold ${isOptimal ? 'text-emerald-700' : 'text-amber-700'}`}>{m.humidity}%</p>
                    <p className="mt-2 text-[12px] text-[#6B7280]">{m.date} · {m.time}</p>
                    <span className={`mt-3 inline-flex rounded-[8px] px-2 py-1 text-[11px] font-semibold ${isOptimal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {m.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 md:px-0">
            <div className="rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[40px] font-extrabold text-[#111827]">{vendor.rating}</p>
                  <div className="mt-2 flex items-center gap-1">
                    {stars.map(i => (
                      <Star key={i} size={16} className={i <= Math.round(vendor.rating) ? 'text-[#FBBF24]' : 'text-[#D1D5DB]'} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-[#6B7280]">({vendor.reviews} reseñas)</p>
                </div>
                <div className="space-y-3 md:max-w-[320px]">
                  <div className="rounded-[16px] bg-[#F8FAFB] p-4">
                    <p className="text-[13px] text-[#4B5563]">Servicio rápido y detallado. Leña lista para entrega.</p>
                    <div className="mt-3 flex items-center gap-1">
                      {stars.map(i => (
                        <Star key={i} size={12} className="text-[#FBBF24]" />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[16px] bg-[#F8FAFB] p-4">
                    <p className="text-[13px] text-[#4B5563]">Respuesta clara, despacho seguro y seguimiento por WhatsApp.</p>
                    <div className="mt-3 flex items-center gap-1">
                      {stars.map(i => (
                        <Star key={i} size={12} className="text-[#FBBF24]" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-5 text-sm font-semibold text-[#1B5E20]">Ver todas las reseñas</button>
            </div>
          </div>

          <div className="h-20" />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] px-4" style={{ transform: 'translateX(-50%)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="rounded-[24px] border border-[#E5E7EB] bg-white/95 backdrop-blur-sm p-3 shadow-sm">
          <div className="mb-3 flex justify-around rounded-[20px] bg-white p-2 shadow-sm">
            <button onClick={() => navigate('/map')} className="flex flex-col items-center gap-1 text-gray-500"><MapPin size={20} /><span className="text-[11px]">Mapa</span></button>
            <button onClick={() => navigate('/list')} className="flex flex-col items-center gap-1 text-gray-500"><List size={20} /><span className="text-[11px]">Lista</span></button>
            <button onClick={() => navigate('/profile/buyer')} className="flex flex-col items-center gap-1 text-gray-500"><User size={20} /><span className="text-[11px]">Perfil</span></button>
          </div>
          <button
            onClick={() => {
              setCurrentStep(4);
              const message = `Hola, vi tu leña en LumeApp. Me interesa ${vendor.species} a $${vendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega de ${selectedMeters}m³?`;
              const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="w-full rounded-[16px] bg-[linear-gradient(135deg,#1B5E20_0%,#2E7D32_100%)] px-5 py-4 text-base font-semibold text-white shadow-[0_4px_16px_rgba(27,94,32,0.4)]"
          >
            <div className="flex items-center justify-center gap-3">
              <MessageCircle size={20} />
              <div className="text-left">
                <span>Contactar por WhatsApp</span>
                <p className="text-[12px] text-white/80">Te responderá {vendor.name}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

