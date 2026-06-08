import { useEffect, useState } from 'react';
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

  const humidityValue = vendor.humidity ?? 23;
  const humidityColor = humidityValue <= 25 ? '#2E7D32' : '#F9A825';

  return (
    <div className="bg-[#F9FBE7] text-slate-900 pb-28">
      {/* Back Button */}
      <div className="lg:hidden sticky top-0 z-50 bg-gradient-to-b from-white/90 to-transparent py-2 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold">
          <ArrowLeft size={16} /> Volver
        </button>
      </div>

      {/* CAMBIO 1: Header verde con foto + nombre + badge */}
      <div className="bg-[#1B5E20] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-[1280px] flex items-start gap-4">
          <img
            src={vendor.heroImage}
            alt={vendor.name}
            className="w-[90px] h-[90px] rounded-[16px] object-cover flex-shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
          />
          <div className="flex-1">
            <h1 className="text-white font-bold text-[22px] leading-tight">{vendor.name}</h1>
            <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-[20px] text-[11px] font-medium text-[#A5D6A7] bg-[rgba(165,214,167,0.2)] border border-[#A5D6A7]">
              ✓ Proveedor verificado
            </div>
          </div>
        </div>
      </div>

      {/* CAMBIO 2: Sección de humedad */}
      <div className="bg-white px-4 py-4 sm:px-6 border-b border-gray-100">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Certificación NCh 2965</p>
          <div className="flex items-end gap-2 mb-4">
            <p className="text-[48px] font-[800]" style={{ color: humidityColor }}>
              {humidityValue}
            </p>
            <p className="text-gray-600 text-sm mb-2">% humedad</p>
          </div>
          <div className="w-full bg-[#E8F5E9] rounded-[4px] h-2 overflow-hidden mb-2">
            <div
              className="h-full transition-all duration-300 rounded-[4px]"
              style={{ width: `${humidityValue}%`, backgroundColor: humidityColor }}
            />
          </div>
          <p className="text-xs text-gray-600">Medido hace 2 días · Norma NCh 2965 ✓</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* CAMBIO 3: Rating con estrellas amarillas */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < Math.floor(vendor.rating ?? 0);
              const isPartial = index === Math.floor(vendor.rating ?? 0) && (vendor.rating ?? 0) % 1 > 0;
              return (
                <Star
                  key={index}
                  size={16}
                  fill={isFilled ? '#FBBF24' : 'none'}
                  stroke={isPartial || !isFilled ? '#FBBF24' : '#FBBF24'}
                  strokeWidth={isPartial || !isFilled ? 1.5 : 0}
                  color={isFilled ? '#FBBF24' : isPartial ? '#FBBF24' : '#D1D5DB'}
                  style={{ color: isFilled ? '#FBBF24' : isPartial ? '#FBBF24' : '#D1D5DB' }}
                />
              );
            })}
          </div>
          <span className="text-sm font-semibold text-gray-900">{vendor.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-600">· {vendor.reviews} reseñas</span>
        </div>

        {/* CAMBIO 5: Cards de info organizadas */}
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">${selectedWoodOption?.price.toLocaleString('es-CL')}</p>
            <p className="text-xs text-gray-500 mt-1">/ m³</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">{selectedWoodOption?.available} m³</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reseñas</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">{vendor.reviews}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Especie</p>
            <p className="mt-3 text-base font-semibold text-gray-900">{vendor.species}</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ubicación</p>
            <p className="mt-3 text-base font-semibold text-gray-900">{vendor.address}</p>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Distancia</p>
            <p className="mt-3 text-base font-semibold text-gray-900">{vendor.distance.toFixed(1)} km</p>
          </div>
        </div>

        {/* Sección de contenido adicional */}
        <div>
          <section className="rounded-[32px] bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Perfil del proveedor</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Todo lo que necesitas saber</h2>
              </div>
              <div className="rounded-3xl bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#1B5E20]">{selectedWoodOption?.name}</div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-slate-100 bg-[#F9FBE7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Calificación</p>
                <p className="mt-3 text-3xl font-semibold text-[#1B5E20]">{vendor.rating}</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-[#F9FBE7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Humedad</p>
                <p className="mt-3 text-3xl font-semibold text-[#1B5E20]">{selectedWoodOption?.humidity ?? '—'}%</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-[#F9FBE7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
                <p className="mt-3 text-3xl font-semibold text-[#1B5E20]">{selectedWoodOption?.available} m³</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Descripción rápida</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">Este proveedor ofrece leña <strong>seca</strong> y <strong>certificada</strong> con entrega rápida y medición transparente. Ideal para hogares que buscan comodidad y rendimiento térmico.</p>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Características</h3>
                    <p className="mt-2 text-sm text-slate-600">Detalles que importan al comprar leña certificada.</p>
                  </div>
                  <span className="text-sm font-semibold text-[#2E7D32]">Premium marketplace</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {featureItems.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                        <Icon size={18} className="text-[#2E7D32]" />
                        <span className="text-sm font-medium text-slate-700">{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Mediciones recientes</h2>
                    <p className="mt-2 text-sm text-slate-600">Historial de humedad reciente para este lote.</p>
                  </div>
                  <button
                    onClick={() => navigate(`/history/${id}`)}
                    className="rounded-full bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-[#1B5E20] transition hover:bg-[#D7EDDB]"
                  >
                    Ver histórico
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {measurements.map((measurement, index) => {
                    const isOptimal = measurement.status === 'Óptimo';
                    return (
                      <div key={index} className="rounded-[28px] border border-slate-200 bg-[#FAFFFA] p-5 shadow-sm">
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
              </div>
            </div>
          </section>
        </div>

        {/* CAMBIO 4: Botón WhatsApp ancho completo al fondo */}
        <div className="mt-8 px-0">
          <button
            onClick={sendWhatsApp}
            className="w-full bg-[#25D366] text-white py-4 px-4 rounded-[14px] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#1ebd5d] transition-all duration-200 active:scale-95"
          >
            💬 Contactar por WhatsApp
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
