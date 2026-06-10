import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Leaf,
  MessageCircle,
  MapPin,
  Package,
  Scissors,
  ShieldCheck,
  Star,
  Tag,
  Wind,
  Droplet,
} from 'lucide-react';
import { useApp } from '../App';
import { BottomNavigation } from './BottomNavigation';
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
  const woodTypes = vendor?.woods.map(wood => wood.name) ?? ['Eucaliptus', 'Roble', 'Coigüe'];
  const [selectedWood, setSelectedWood] = useState<string>(vendor?.woods?.[0]?.name ?? woodTypes[0]);
  const selectedWoodOption = vendor?.woods.find(wood => wood.name === selectedWood) ?? vendor?.woods?.[0];
  const totalPrice = selectedWoodOption ? selectedWoodOption.price * selectedMeters : 0;
  const stockStatus = selectedWoodOption
    ? selectedWoodOption.available <= 4
      ? 'Stock bajo'
      : selectedWoodOption.available <= 10
      ? 'Stock limitado'
      : 'En stock'
    : '';
  const deliveryStatus = selectedWoodOption
    ? selectedWoodOption.available >= 10
      ? 'Entrega hoy'
      : selectedWoodOption.available >= 5
      ? 'Entrega 24h'
      : 'Entrega 48h'
    : '';
  const heroBadges = [
    { icon: Package, label: 'Disponible hoy', show: deliveryStatus === 'Entrega hoy' },
    { icon: Package, label: 'Entrega 24h', show: deliveryStatus === 'Entrega 24h' },
    { icon: Tag, label: 'Stock bajo', show: selectedWoodOption?.available !== undefined && selectedWoodOption.available <= 3 },
    { icon: Heart, label: 'Más vendido', show: vendor?.reviews !== undefined && vendor.reviews >= 25 },
    { icon: Leaf, label: 'Leña premium', show: true },
  ];
  const ratingStars = Array.from({ length: 5 }, (_, index) => index < Math.round(vendor?.rating ?? 0));
  const [loading, setLoading] = useState(true);
  const [woodImageLoaded, setWoodImageLoaded] = useState(false);

  const sendWhatsApp = () => {
    setCurrentStep(4);
    const total = selectedWoodOption ? selectedWoodOption.price * selectedMeters : 0;
    const message = `Hola, vi tu publicación en LumeApp. Me interesa comprar ${selectedMeters}m³ de ${selectedWoodOption?.name ?? selectedWood} con ${vendor?.name} por un total de $${total.toLocaleString('es-CL')}. ¿Podemos coordinar entrega?`;
    const whatsappUrl = `https://wa.me/56900000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    setWoodImageLoaded(false);
  }, [selectedWood]);

  useEffect(() => {
    if (selectedWoodOption && selectedMeters > selectedWoodOption.available) {
      setSelectedMeters(selectedWoodOption.available);
    }
  }, [selectedWoodOption, selectedMeters]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, [vendor?.id]);

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

  if (loading) {
    return (
      <div className="bg-[#F5F7F4] text-slate-900">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-[340px] rounded-[28px] bg-slate-200/60 shadow-lg" />
            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-4">
                <div className="h-16 rounded-[24px] bg-slate-200/60" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="h-28 rounded-[24px] bg-slate-200/60" />
                  <div className="h-28 rounded-[24px] bg-slate-200/60" />
                  <div className="h-28 rounded-[24px] bg-slate-200/60" />
                </div>
                <div className="h-48 rounded-[28px] bg-slate-200/60" />
              </div>
              <div className="space-y-4">
                <div className="h-80 rounded-[28px] bg-slate-200/60" />
                <div className="h-48 rounded-[24px] bg-slate-200/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="bg-[#F5F7F4] text-slate-900 pb-28">
      {/* Sticky Back Button */}
      <div className="lg:hidden sticky top-0 z-50 bg-gradient-to-b from-white/95 to-transparent py-3 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
      <div className="hidden lg:block">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="absolute left-6 top-6 z-50 h-10 w-10 flex items-center justify-center rounded-full bg-white text-[#1B5E20] shadow-sm transition hover:shadow-md hover:bg-slate-50">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* MEJORA 1: Hero Section con Overlay Reducido y Glassmorphism */}
        <section className="relative overflow-hidden rounded-[32px] shadow-[0_35px_80px_rgba(15,23,42,0.15)]">
          <img src={vendor.heroImage} alt={`${vendor.name} hero`} className="absolute inset-0 h-full w-full object-cover" />
          {/* Overlay reducido de 0.5 a 0.3 para mejorar visibilidad de textura */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081004]/65 via-[#0f3d12]/55 to-[#1B5E20]/50" />

          <div className="relative grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-center p-6 sm:p-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-sm font-semibold text-[#D9F3C2] shadow-sm border border-white/20">
                <CheckCircle size={16} />
                Proveedor verificado
              </div>

              {/* Glassmorphism Card */}
              <div className="rounded-[24px] border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-[0_40px_80px_rgba(15,23,42,0.2)]">
                <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight mb-3">{vendor.name}</h1>
                <p className="text-base leading-7 text-slate-100/95 sm:text-lg mb-6">
                  Leña seca certificada, entrega rápida y medición confiable. Navega el stock, revisa el historial y coordina la compra en un solo lugar.
                </p>

                {/* Stars & Rating */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="inline-flex items-center gap-1.5">
                    {ratingStars.map((filled, index) => (
                      <Star key={index} size={18} fill={filled ? '#FBBF24' : 'none'} stroke="#FBBF24" strokeWidth={filled ? 0 : 2} color="#FBBF24" />
                    ))}
                  </div>
                  <span className="font-semibold text-white text-lg">{vendor.rating.toFixed(1)}</span>
                  <span className="text-slate-200">· {vendor.reviews} reseñas</span>
                </div>
              </div>

              {/* MEJORA 3: Tarjetas Precio/Stock/Reseñas con Jerarquía Mejorada */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-5 text-white shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Precio</p>
                  <p className="text-4xl font-bold mb-1">${selectedWoodOption?.price.toLocaleString('es-CL')}</p>
                  <p className="text-xs text-white/70">por m³</p>
                </div>
                <div className="rounded-[24px] border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-5 text-white shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Stock</p>
                  <p className="text-4xl font-bold mb-1">{selectedWoodOption?.available}</p>
                  <p className="text-xs text-white/70">m³ disponible</p>
                </div>
                <div className="rounded-[24px] border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-5 text-white shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Reseñas</p>
                  <p className="text-4xl font-bold mb-1">{vendor.reviews}</p>
                  <p className="text-xs text-white/70">opiniones</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {heroBadges.filter((badge) => badge.show).map((badge, index) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <span key={index} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 shadow-sm hover:bg-white/15 transition-colors">
                      <BadgeIcon size={13} />
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* MEJORA 2: Panel Premium Reestructurado */}
            <div className="rounded-[32px] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-[0_35px_70px_rgba(15,23,42,0.15)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-5">Información del proveedor</p>

              <div className="space-y-4">
                {/* Especie */}
                <div className="rounded-[20px] bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Especie principal</p>
                  <p className="text-xl font-semibold text-white">{vendor.species}</p>
                </div>

                {/* Humedad */}
                <div className="rounded-[20px] bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Humedad certificada</p>
                  <p className="text-xl font-semibold text-[#D9F3C2]">{vendor.humidity ?? 23}% ✓</p>
                </div>

                {/* Calificación */}
                <div className="rounded-[20px] bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Calificación</p>
                  <p className="text-xl font-semibold text-white">{vendor.rating.toFixed(1)} ⭐</p>
                </div>

                {/* Ubicación */}
                <div className="rounded-[20px] bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                  <p className="text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Ubicación</p>
                  <p className="text-sm font-semibold text-white line-clamp-2">{vendor.address}</p>
                </div>

                {/* Entrega */}
                <div className="rounded-[20px] bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 p-4">
                  <p className="text-xs uppercase tracking-widest text-emerald-300 font-medium mb-2">Próxima entrega</p>
                  <p className="text-lg font-bold text-emerald-100">{deliveryStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_0.95fr] lg:items-start">
          <main className="space-y-8">
            {/* MEJORA 5: Información del Proveedor Mejorada */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-gray-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Acerca del proveedor</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Datos de confianza</h2>
                </div>
                <div className="rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#1B5E20]">{selectedWoodOption?.name}</div>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] border border-[#E0F2F1] bg-[#F1F8F6] p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-2">Calificación</p>
                  <p className="text-3xl font-bold text-[#1B5E20]">{vendor.rating}</p>
                </div>
                <div className="rounded-[20px] border border-[#E0F2F1] bg-[#F1F8F6] p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-2">Humedad</p>
                  <p className="text-3xl font-bold text-[#1B5E20]">{selectedWoodOption?.humidity ?? 23}%</p>
                </div>
                <div className="rounded-[20px] border border-[#E0F2F1] bg-[#F1F8F6] p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-2">Stock</p>
                  <p className="text-3xl font-bold text-[#1B5E20]">{selectedWoodOption?.available}</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Descripción rápida</h3>
                <p className="text-sm leading-7 text-slate-600">Este proveedor ofrece leña <strong>seca</strong> y <strong>certificada</strong> con entrega rápida y medición transparente. Ideal para hogares que buscan comodidad y rendimiento térmico.</p>
              </div>

              {/* MEJORA 6: Características como Badges Premium */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Características</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {featureItems.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 hover:border-[#2E7D32]/30 hover:bg-[#F9FBE7] transition-all duration-200">
                        <Icon size={18} className="text-[#2E7D32] flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* MEJORA 7: Mediciones Recientes Destacadas */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-gray-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Diferenciador Lume</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Mediciones certificadas</h2>
                  <p className="mt-1 text-sm text-slate-600">Historial de humedad verificado y transparente</p>
                </div>
                <button
                  onClick={() => navigate(`/history/${id}`)}
                  className="rounded-full bg-[#E8F5E9] px-5 py-2 text-sm font-semibold text-[#1B5E20] transition hover:bg-[#D7EDDB] hover:shadow-sm"
                >
                  Ver histórico completo
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {measurements.map((measurement, index) => {
                  const isOptimal = measurement.status === 'Óptimo';
                  const humidityPercent = measurement.humidity;
                  return (
                    <div key={index} className={`rounded-[22px] border-2 p-5 transition-all ${isOptimal ? 'border-[#10B981]/30 bg-gradient-to-br from-[#ECFDF5] to-white' : 'border-[#FCD34D]/30 bg-gradient-to-br from-[#FFFBEB] to-white'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-3 w-3 rounded-full ${isOptimal ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isOptimal ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFFBEB] text-[#B45309]'}`}>
                          {measurement.status}
                        </span>
                      </div>

                      <p className={`text-4xl font-bold mb-1 ${isOptimal ? 'text-[#047857]' : 'text-[#B45309]'}`}>
                        {humidityPercent}%
                      </p>
                      <p className="text-xs text-slate-500 mb-3">Humedad relativa</p>

                      {/* Barra visual de humedad */}
                      <div className="mb-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full transition-all ${isOptimal ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}
                          style={{ width: `${Math.min(humidityPercent * 2, 100)}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-600">{measurement.date}</p>
                      <p className="text-xs text-slate-500">{measurement.time}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          {/* MEJORA 4: Panel de Compra Mejorado */}
          <aside className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-gray-100 sticky top-20">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Panel de compra</p>
                <h3 className="text-xl font-bold text-slate-900">Comprar leña</h3>
              </div>

              {/* Precio Principal Destacado */}
              <div className="mb-6 rounded-[24px] bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] p-6 text-white text-center">
                <p className="text-xs uppercase tracking-widest text-white/80 mb-2 font-semibold">Precio por m³</p>
                <p className="text-5xl font-bold mb-2">${selectedWoodOption?.price.toLocaleString('es-CL')}</p>
                <p className="text-sm text-white/90">Precio unitario actual</p>
              </div>

              {/* Selector de Madera */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">Tipo de madera</label>
                <div className="flex flex-wrap gap-2">
                  {woodTypes.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWood(w)}
                      className={`px-3 py-2 rounded-[14px] border-2 transition-all duration-200 text-sm font-semibold ${
                        selectedWood === w
                          ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20] shadow-[0_4px_12px_rgba(46,125,50,0.2)]'
                          : 'bg-white border-gray-300 text-slate-700 hover:border-[#2E7D32] hover:bg-[#F9FBE7]'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Foto con Badge Flotante */}
              <div className="relative mb-5 overflow-hidden rounded-[22px] bg-slate-100 shadow-md">
                <img
                  key={selectedWood}
                  src={selectedWoodOption?.imageUrl}
                  alt={`Madera ${selectedWood}`}
                  onLoad={() => setWoodImageLoaded(true)}
                  className={`w-full h-40 object-cover transition-all duration-300 ${woodImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                />

                {/* Badge Flotante Mejorado */}
                <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-sm border border-white/50 px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                  <Droplet size={13} className={vendor.humidity && vendor.humidity <= 20 ? 'text-[#10B981]' : 'text-[#F59E0B]'} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-900">{vendor.humidity}%</span>
                </div>
              </div>

              {/* Info secundaria */}
              <div className="mb-5 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-600 font-semibold">
                  <span>Disponible</span>
                  <span className="text-lg font-bold text-slate-900">{selectedWoodOption?.available} m³</span>
                </div>
              </div>

              {/* Cantidad y Total */}
              <div className="mb-5 rounded-[20px] border border-slate-200 bg-white p-4">
                <label className="block text-xs uppercase tracking-widest text-slate-600 font-semibold mb-3">Cantidad (m³)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMeters(m => Math.max(1, m - 1))}
                    className="h-10 w-10 rounded-full border-2 border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center text-2xl font-bold text-slate-900">{selectedMeters}</div>
                  <button
                    onClick={() => setSelectedMeters(m => Math.min(selectedWoodOption?.available ?? m, m + 1))}
                    className="h-10 w-10 rounded-full border-2 border-[#2E7D32] bg-[#2E7D32] text-lg font-bold text-white transition hover:bg-[#1B5E20]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Estimado */}
              <div className="mb-6 rounded-[20px] border-2 border-[#2E7D32]/20 bg-gradient-to-br from-[#F1F8F6] to-white p-5">
                <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-2">Total estimado</p>
                <p className="text-3xl font-bold text-[#1B5E20] mb-1">${totalPrice.toLocaleString('es-CL')}</p>
                <p className="text-xs text-slate-600">para {selectedMeters}m³ de {selectedWood}</p>
              </div>

              {/* MEJORA 8: Botón WhatsApp Premium */}
              <button
                onClick={sendWhatsApp}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#1ebd5d] text-white py-4 px-4 rounded-[18px] font-bold text-base flex items-center justify-center gap-3 shadow-[0_12px_30px_rgba(37,211,102,0.3)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle size={20} />
                Contactar por WhatsApp
              </button>

              {/* Quick Info */}
              <div className="mt-5 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">✓ Entrega en 24-48h</div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">✓ Medición certificada</div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">✓ Compra segura</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
