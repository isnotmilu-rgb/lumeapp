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
import { vendors } from '../data/vendors';

const featureItems = [
  { icon: ShieldCheck, label: 'Cert. NCh 2965' },
  { icon: Wind, label: 'Secado controlado' },
  { icon: Leaf, label: 'Leña seleccionada' },
  { icon: Scissors, label: 'Corte a medida' },
];

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(vendor => vendor.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(1);
  const woodTypes = ['Eucaliptus', 'Roble', 'Coigüe'];
  const [selectedWood, setSelectedWood] = useState<string>(vendor?.species ?? woodTypes[0]);

  const sendWhatsApp = () => {
    setCurrentStep(4);
    const total = (vendor?.price ?? 0) * selectedMeters;
    const message = `Hola, vi tu publicación en LumeApp. Me interesa comprar ${selectedMeters}m³ de ${selectedWood} con ${vendor?.name} por un total de $${total.toLocaleString('es-CL')}. ¿Podemos coordinar entrega?`;
    const whatsappUrl = `https://wa.me/56900000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
    <div className="bg-[#F5F7F4] text-slate-900">
      {/* Floating / Sticky Back Buttons */}
      <div className="mx-auto w-full max-w-[1280px] px-4 py-2 sm:px-6 lg:px-8">
        <div className="lg:hidden sticky top-0 z-50 bg-gradient-to-b from-white/90 to-transparent py-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold">
            <ArrowLeft size={16} /> Volver
          </button>
        </div>
        <div className="hidden lg:block">
          <button onClick={() => navigate(-1)} aria-label="Volver" className="absolute left-6 top-6 z-50 hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B5E20] shadow-sm transition hover:shadow-md">
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[32px] bg-gradient-to-r from-[#081004] via-[#0f3d12] to-[#1B5E20] p-6 sm:p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#D9F3C2] shadow-sm">
                <CheckCircle size={16} />
                Proveedor verificado
              </div>
              <div>
                <h1 className="text-4xl font-semibold text-white sm:text-5xl">{vendor.name}</h1>
                <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
                  Leña seca certificada, entrega rápida y medición confiable. Navega el stock, revisa el historial y coordina la compra en un solo lugar.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Precio</p>
                  <p className="mt-2 text-xl font-semibold">${vendor.price.toLocaleString('es-CL')} / m³</p>
                </div>
                <div className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Stock</p>
                  <p className="mt-2 text-xl font-semibold">{vendor.available} m³</p>
                </div>
                <div className="rounded-3xl bg-white/10 px-4 py-4 text-sm text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Reseñas</p>
                  <p className="mt-2 text-xl font-semibold">{vendor.reviews}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-sm text-white shadow-xl backdrop-blur-sm sm:max-w-sm lg:ml-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Ubicación</p>
                  <p className="mt-2 text-base font-semibold">{vendor.address}</p>
                </div>
                <div className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">Ambos modos</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/80">
                <span className="rounded-full bg-white/10 px-3 py-2">{vendor.certified ? 'Certificación activa' : 'Sin certificación'}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">{vendor.humidity !== null ? `${vendor.humidity}% humedad` : 'Humedad sin medir'}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:items-start">
          <main className="space-y-8">
            <section className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Perfil del proveedor</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Todo lo que necesitas saber</h2>
                </div>
                <div className="rounded-3xl bg-[#F9FBE7] px-4 py-2 text-sm font-semibold text-[#1B5E20]">{vendor.species}</div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-100 bg-[#F9FBE7] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Calificación</p>
                  <p className="mt-3 text-3xl font-semibold text-[#1B5E20]">{vendor.rating}</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-[#F9FBE7] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Última medición</p>
                  <p className="mt-3 text-3xl font-semibold text-[#1B5E20]">{vendor.humidity ?? '—'}%</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-[#F9FBE7] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
                  <p className="mt-3 text-3xl font-semibold text-[#1B5E20]">{vendor.available} m³</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Descripción rápida</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">Este proveedor ofrece leña <strong>seca</strong> y <strong>certificada</strong> con entrega rápida y medición transparente. Ideal para hogares que buscan comodidad y rendimiento térmico.</p>
                </div>

                <div className="rounded-[24px] bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Características</h3>
                      <p className="mt-2 text-sm text-slate-600">Detalles que importan al comprar leña certificada.</p>
                    </div>
                    <span className="text-sm font-semibold text-[#2E7D32]">Premium marketplace</span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                    {featureItems.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <Icon size={18} className="text-[#2E7D32]" />
                          <span className="text-sm font-medium text-slate-700">{feature.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Mediciones recientes</h2>
                  <p className="mt-2 text-sm text-slate-600">Historial de humedad reciente para este lote.</p>
                </div>
                <button
                  onClick={() => navigate(`/history/${id}`)}
                  className="rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#1B5E20] transition hover:bg-[#D7EDDB]"
                >
                  Ver histórico
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {measurements.map((measurement, index) => {
                  const isOptimal = measurement.status === 'Óptimo';
                  return (
                    <div key={index} className="rounded-[24px] border border-slate-200 bg-[#FAFFFA] p-5">
                      <div className={`h-2.5 w-2.5 rounded-full ${isOptimal ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
                      <p className={`mt-4 text-3xl font-semibold ${isOptimal ? 'text-[#047857]' : 'text-[#B45309]'}`}>{measurement.humidity}%</p>
                      <p className="mt-3 text-sm text-slate-500">{measurement.date}</p>
                      <p className="text-sm text-slate-500">{measurement.time}</p>
                      <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${isOptimal ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFFBEB] text-[#B45309]'}`}>
                        {measurement.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <p className="text-base font-semibold text-slate-900">Comprar</p>

              <div className="mt-4 text-sm text-slate-700">
                <label className="block text-xs text-slate-500 mb-2">Tipo de madera</label>
                <div className="flex gap-2 mb-4">
                  {woodTypes.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWood(w)}
                      className={`px-3 py-2 rounded-lg border ${selectedWood === w ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20]' : 'bg-white border-gray-200 text-slate-700'}`}>
                      {w}
                    </button>
                  ))}
                </div>

                <label className="block text-xs text-slate-500 mb-2">Cantidad (m³)</label>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setSelectedMeters(m => Math.max(1, m - 1))}
                    className="h-10 w-10 rounded-full border flex items-center justify-center text-lg"
                    aria-label="Disminuir cantidad"
                  >−</button>
                  <div className="min-w-[70px] text-center text-2xl font-semibold">{selectedMeters}</div>
                  <button
                    onClick={() => setSelectedMeters(m => Math.min(vendor.available, m + 1))}
                    className="h-10 w-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-lg"
                    aria-label="Aumentar cantidad"
                  >+</button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-slate-500">Precio unitario</div>
                  <div className="font-semibold">${vendor.price.toLocaleString('es-CL')} / m³</div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="text-sm text-slate-600">Total estimado</div>
                  <div className="text-xl font-semibold text-[#1B5E20]">${((vendor.price ?? 0) * selectedMeters).toLocaleString('es-CL')}</div>
                </div>

                <button
                  onClick={sendWhatsApp}
                  className="w-full mt-2 inline-flex items-center justify-center gap-3 rounded-[14px] bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-3 text-sm font-semibold text-white shadow transition hover:from-[#25672b]"
                >
                  <MessageCircle size={18} /> Contactar por WhatsApp
                </button>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Detalles rápidos</p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-3">Entrega estimada en 24-48h</div>
                <div className="rounded-2xl bg-slate-50 p-3">Medición certificada NCh 2965</div>
                <div className="rounded-2xl bg-slate-50 p-3">Retiro o envío disponible</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
