import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Droplet,
  Heart,
  Leaf,
  MessageCircle,
  MapPin,
  Package,
  Scissors,
  Share2,
  ShieldCheck,
  Star,
  Tag,
  Wind,
} from 'lucide-react';
import { useApp } from '../App';

const vendors = [
  { id: 1, name: 'Leñas Boyeco', initials: 'LB', humidity: 17, certified: true, species: 'Eucaliptus', available: 15, price: 45000, address: 'Av. Alemania 850, Temuco', rating: 4.9, reviews: 38 },
  { id: 2, name: 'Maderera Verde', initials: 'MV', humidity: 21, certified: true, species: 'Roble', available: 20, price: 52000, address: 'Rudecindo Ortega 234, Temuco', rating: 4.6, reviews: 24 },
  { id: 3, name: 'Juan Rojas', initials: 'JR', humidity: null, certified: false, species: 'Coigüe', available: 10, price: 33000, address: 'Los Boldos 123, Padre Las Casas', rating: 3.8, reviews: 11 },
  { id: 4, name: 'Leñas del Sur', initials: 'LS', humidity: 19, certified: true, species: 'Eucaliptus', available: 25, price: 48000, address: 'Balmaceda 456, Padre Las Casas', rating: 4.7, reviews: 29 },
];

const featureItems = [
  { icon: ShieldCheck, label: 'Cert. NCh 2965' },
  { icon: Wind, label: 'Secado controlado' },
  { icon: Leaf, label: 'Leña seleccionada' },
  { icon: Scissors, label: 'Corte a medida' },
];

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(vendor => vendor.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(1);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#F5F7F4] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-[24px] bg-white px-8 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <p className="text-center text-base font-semibold text-slate-900">Vendedor no encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 w-full rounded-2xl bg-[#1B5E20] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#165a1c]"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = vendor.price * selectedMeters;
  const measurements = [
    {
      date: '10 May 2026',
      time: '08:32',
      humidity: vendor.humidity ?? 23,
      status: (vendor.humidity ?? 23) <= 20 ? 'Óptimo' : 'Aceptable',
    },
    {
      date: '07 May 2026',
      time: '09:15',
      humidity: vendor.humidity !== null ? vendor.humidity + 1 : 24,
      status: (vendor.humidity !== null ? vendor.humidity + 1 : 24) <= 20 ? 'Óptimo' : 'Aceptable',
    },
    {
      date: '04 May 2026',
      time: '11:00',
      humidity: vendor.humidity !== null ? vendor.humidity + 2 : 26,
      status: (vendor.humidity !== null ? vendor.humidity + 2 : 26) <= 20 ? 'Óptimo' : 'Aceptable',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F4] text-slate-900 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="overflow-hidden rounded-[28px] bg-gradient-to-b from-[#071a08] via-[#1B5E20] to-[#2E7D32] shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="relative min-h-[300px] flex flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B5E20] shadow-sm transition hover:shadow-md"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowComingSoon(true)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B5E20] shadow-sm transition hover:shadow-md"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={() => setShowComingSoon(true)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B5E20] shadow-sm transition hover:shadow-md"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1" />

                <div className="space-y-3">
                  {vendor.certified && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                      <CheckCircle size={14} />
                      Proveedor verificado
                    </div>
                  )}

                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-white sm:text-4xl">{vendor.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <MapPin size={14} />
                      <span>{vendor.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#A5D6A7]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#A5D6A7]" />
                      <span>En línea · Responde rápido</span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-6 bottom-6 flex items-center gap-3 rounded-[18px] bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
                  <Star size={16} className="text-[#FBBF24]" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1B5E20]">{vendor.rating}</p>
                    <p className="text-xs text-slate-500">({vendor.reviews} reseñas)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[20px] border border-white/60 bg-[#E8F5E9] p-5 shadow-[0_18px_40px_rgba(16,185,129,0.08)]">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-600">
                  <span>Humedad</span>
                  <Droplet size={18} className="text-[#2E7D32]" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-[#1B5E20]">{vendor.humidity ?? '—'}%</p>
                <span className="mt-4 inline-flex rounded-full bg-[#2E7D32] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">Óptimo</span>
              </div>

              <div className="rounded-[20px] border border-white/60 bg-[#E3F2FD] p-5 shadow-[0_18px_40px_rgba(59,130,246,0.08)]">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-600">
                  <span>Precio/m³</span>
                  <Tag size={18} className="text-[#1565C0]" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-[#1565C0]">${(vendor.price / 1000).toFixed(0)}k</p>
              </div>

              <div className="rounded-[20px] border border-white/60 bg-[#F3E5F5] p-5 shadow-[0_18px_40px_rgba(123,31,162,0.08)]">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-600">
                  <span>Stock</span>
                  <Package size={18} className="text-[#7B1FA2]" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-[#7B1FA2]">{vendor.available}m³</p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <p className="text-base font-semibold text-slate-900">¿Cuántos metros necesitas?</p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setSelectedMeters(value => Math.max(1, value - 1))}
                  disabled={selectedMeters <= 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 transition disabled:border-slate-200 disabled:text-slate-400 enabled:border-[#2E7D32] enabled:text-[#2E7D32] bg-white"
                >
                  −
                </button>
                <div className="min-w-[70px] text-center text-4xl font-semibold text-slate-900">{selectedMeters}</div>
                <button
                  onClick={() => setSelectedMeters(value => Math.min(vendor.available, value + 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2E7D32] text-white shadow-[0_12px_30px_rgba(46,125,50,0.24)] transition hover:bg-[#25672b]"
                >
                  +
                </button>
              </div>
              <div className="mt-6 rounded-[20px] bg-[#F9FBE7] p-5">
                <p className="text-sm text-slate-600">Total estimado</p>
                <p className="mt-2 text-3xl font-semibold text-[#1B5E20]">${totalPrice.toLocaleString('es-CL')}</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <p className="text-base font-semibold text-slate-900">Características</p>
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {featureItems.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex min-w-max items-center gap-2 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                      <Icon size={16} className="text-[#2E7D32]" />
                      <span className="font-medium">{feature.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-slate-900">Últimas mediciones</p>
                <button
                  onClick={() => navigate(`/history/${id}`)}
                  className="text-sm font-semibold text-[#1B5E20] transition hover:text-[#165a1c]"
                >
                  Ver histórico
                </button>
              </div>
              <div className="mt-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {measurements.map((measurement, index) => {
                  const isOptimal = measurement.status === 'Óptimo';
                  return (
                    <div key={index} className="min-w-[150px] rounded-[20px] bg-[#FEFEFF] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                      <div className={`h-2.5 w-2.5 rounded-full ${isOptimal ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
                      <p className={`mt-4 text-2xl font-semibold ${isOptimal ? 'text-[#047857]' : 'text-[#B45309]'}`}>{measurement.humidity}%</p>
                      <p className="mt-3 text-xs text-slate-500">{measurement.date}</p>
                      <p className="mt-1 text-xs text-slate-500">{measurement.time}</p>
                      <span
                        className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
                          isOptimal ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFFBEB] text-[#B45309]'
                        }`}
                      >
                        {measurement.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:block rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sticky top-20">
              <p className="text-base font-semibold text-slate-900">Contacto rápido</p>
              <p className="mt-3 text-sm text-slate-600">Ponte en contacto directo por WhatsApp y coordina tu entrega en minutos.</p>
              <button
                onClick={() => {
                  setCurrentStep(4);
                  const message = `Hola, vi tu leña en LumeApp. Me interesa ${vendor.species} a $${vendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega de ${selectedMeters}m³?`;
                  const whatsappUrl = `https://wa.me/56900000000?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-4 text-sm font-semibold text-white shadow-xl transition hover:from-[#25672b] hover:to-[#1B5E20]"
              >
                <MessageCircle size={20} />
                Contactar por WhatsApp
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4">
        <button
          onClick={() => {
            setCurrentStep(4);
            const message = `Hola, vi tu leña en LumeApp. Me interesa ${vendor.species} a $${vendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega de ${selectedMeters}m³?`;
            const whatsappUrl = `https://wa.me/56900000000?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="flex w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-4 text-sm font-semibold text-white shadow-xl transition hover:from-[#25672b] hover:to-[#1B5E20]"
        >
          <MessageCircle size={20} />
          Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
}
