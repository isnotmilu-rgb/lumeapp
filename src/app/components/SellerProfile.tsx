import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Heart,
  Leaf,
  CreditCard,
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
import { supabase } from '../services/supabaseClient';

const featureItems = [
  { icon: ShieldCheck, label: 'Cert. NCh 2965' },
  { icon: Wind, label: 'Secado controlado' },
  { icon: Leaf, label: 'Leña seleccionada' },
  { icon: Scissors, label: 'Corte a medida' },
];

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setCurrentStep, userType } = useApp();
  const vendor = vendors.find(vendor => String(vendor.id) === String(id));
  const isCamilaLiveVendor = id === 'vendedor_camila' && userType === 'buyer';
  const realtimeSourceVendorId = String(vendor?.id ?? id ?? '') === 'vendedor_camila' ? '1' : String(vendor?.id ?? id ?? '');
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMeters, setModalMeters] = useState(1);
  const [liveHumidity, setLiveHumidity] = useState<number | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState('');
  const [publishedHumidity, setPublishedHumidity] = useState<number | null>(null);
  const [measurementHistory, setMeasurementHistory] = useState<Array<{
    valor_humedad: number;
    created_at: string;
    tipo_madera?: string;
    tipo_lena?: string;
    wood_type?: string;
    id?: string | number;
    id_medicion?: string | number;
  }>>([]);

  const startCheckout = (quantity: number) => {
    setCurrentStep(4);
    setSelectedMeters(quantity);
    setIsConfirmModalOpen(false);
    navigate('/checkout', {
      state: {
        vendorName: vendor?.name,
        woodType: selectedWoodOption?.name ?? selectedWood,
        quantity,
        meters: quantity,
        unitPrice: selectedWoodOption?.price ?? vendor?.price ?? 15000,
        totalPrice: (selectedWoodOption?.price ?? vendor?.price ?? 15000) * quantity,
        total: (selectedWoodOption?.price ?? vendor?.price ?? 15000) * quantity,
      },
    });
  };

  const openCheckoutConfirmation = () => {
    setModalMeters(selectedMeters);
    setIsConfirmModalOpen(true);
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

  useEffect(() => {
    if (!isCamilaLiveVendor) return;
    const storedPublishedHumidity = window.localStorage.getItem('lume_camila_published_humidity');
    if (storedPublishedHumidity !== null) {
      const parsedHumidity = Number(storedPublishedHumidity);
      if (!Number.isNaN(parsedHumidity)) {
        setPublishedHumidity(parsedHumidity);
      }
    }

    let isMounted = true;

    const fetchLatestCamilaMeasurement = async () => {
      if (isMounted) {
        setLiveLoading(true);
      }
      const { data, error } = await supabase
        .from('mediciones_humedad')
        .select('*')
        .eq('vendedor_id', realtimeSourceVendorId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!isMounted) return;

      setLiveLoading(false);
      if (error) {
        setLiveError('No fue posible actualizar el sensor en vivo.');
        return;
      }

      const parsedHistory = (data ?? [])
        .map((item) => {
          const humidityValue = Number(item?.valor_humedad);
          if (Number.isNaN(humidityValue) || typeof item?.created_at !== 'string') {
            return null;
          }
          return {
            valor_humedad: humidityValue,
            created_at: item.created_at,
            tipo_madera: typeof item?.tipo_madera === 'string' ? item.tipo_madera : undefined,
            tipo_lena: typeof item?.tipo_lena === 'string' ? item.tipo_lena : undefined,
            wood_type: typeof item?.wood_type === 'string' ? item.wood_type : undefined,
            id: item?.id,
            id_medicion: item?.id_medicion,
          };
        })
        .filter((item): item is {
          valor_humedad: number;
          created_at: string;
          tipo_madera?: string;
          tipo_lena?: string;
          wood_type?: string;
          id?: string | number;
          id_medicion?: string | number;
        } => item !== null);
      const storedPublishedHumidity = window.localStorage.getItem('lume_camila_published_humidity');
      const storedPublishedAt = window.localStorage.getItem('lume_camila_published_at');
      const storedPublishedWoodType = window.localStorage.getItem('lume_camila_published_wood_type');
      const parsedPublishedHumidity = storedPublishedHumidity !== null ? Number(storedPublishedHumidity) : NaN;
      const mergedHistory = [...parsedHistory];
      if (!Number.isNaN(parsedPublishedHumidity) && typeof storedPublishedAt === 'string') {
        mergedHistory.push({
          valor_humedad: parsedPublishedHumidity,
          created_at: storedPublishedAt,
          tipo_madera: storedPublishedWoodType ?? undefined,
        });
      }
      mergedHistory.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setMeasurementHistory(mergedHistory);
      setLiveError('');
      setLiveHumidity(mergedHistory.length > 0 ? mergedHistory[0].valor_humedad : null);
    };

    void fetchLatestCamilaMeasurement();
    const interval = window.setInterval(() => {
      void fetchLatestCamilaMeasurement();
    }, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [isCamilaLiveVendor, realtimeSourceVendorId]);

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
  const uniqueMeasurementsForRender: Array<{
    valor_humedad: number;
    created_at: string;
    tipo_madera?: string;
    tipo_lena?: string;
    wood_type?: string;
    id_medicion?: string | number;
    id?: string | number;
  }> = [];
  const seenIds = new Set<string | number>();

  (measurementHistory || []).forEach((item) => {
    const uniqueKey = (item as { id_medicion?: string | number; id?: string | number; created_at?: string }).id_medicion
      || (item as { id?: string | number; created_at?: string }).id
      || item.created_at;
    if (uniqueKey && !seenIds.has(uniqueKey)) {
      seenIds.add(uniqueKey);
      uniqueMeasurementsForRender.push(item as { valor_humedad: number; created_at: string; id_medicion?: string | number; id?: string | number });
    }
  });
  const historyListForTimeline = uniqueMeasurementsForRender.slice(1);

  const timelineMeasurements = isCamilaLiveVendor
    ? historyListForTimeline.map((measurement) => {
        const measurementDate = new Date(measurement.created_at);
        return {
          key: measurement.created_at,
          humidity: measurement.valor_humedad,
          woodType: measurement.tipo_madera || measurement.tipo_lena || measurement.wood_type || 'Eucaliptus',
          date: measurementDate.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          time: measurementDate.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      })
    : measurements.map((measurement, index) => ({
        key: `${measurement.date}-${measurement.time}-${index}`,
        humidity: measurement.humidity,
        woodType: 'Eucaliptus',
        date: measurement.date,
        time: measurement.time,
      }));

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
                  onClick={() => navigate(`/history/${String(vendor?.id ?? id ?? '')}`)}
                  className="rounded-full bg-[#E8F5E9] px-5 py-2 text-sm font-semibold text-[#1B5E20] transition hover:bg-[#D7EDDB] hover:shadow-sm"
                >
                  Ver histórico completo
                </button>
              </div>

              {isCamilaLiveVendor && (
                <div className="mb-6 rounded-[20px] border border-[#BBDEFB] bg-[#E3F2FD] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D47A1]">Sensor en vivo · Vendedor 11</p>
                  {liveLoading ? (
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0D47A1]">
                      <Loader2 size={16} className="animate-spin" />
                      Actualizando humedad...
                    </div>
                  ) : (
                    <p className="mt-2 text-xl font-bold text-[#0D47A1]">
                      {publishedHumidity !== null ? `${publishedHumidity}%` : liveHumidity !== null ? `${liveHumidity}%` : 'Sin dato disponible'}
                    </p>
                  )}
                  {(publishedHumidity !== null || liveHumidity !== null) && (
                    <p className={`mt-2 text-sm font-semibold ${(publishedHumidity ?? liveHumidity ?? 0) < 20 ? 'text-[#047857]' : 'text-red-600'}`}>
                      {(publishedHumidity ?? liveHumidity ?? 0) < 20 ? 'Leña Seca Certificada Real ✅' : 'Leña Húmeda ❌'}
                    </p>
                  )}
                  {liveError && <p className="mt-2 text-sm text-red-600">{liveError}</p>}
                </div>
              )}

              {isCamilaLiveVendor && timelineMeasurements.length === 0 ? (
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
                  Este vendedor aún no registra un historial de mediciones certificadas.
                </div>
              ) : (
                <div className="space-y-3">
                  {timelineMeasurements.map((measurement, index) => {
                    const isDry = measurement.humidity < 20;
                    return (
                      <div key={measurement.key} className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`h-2.5 w-2.5 rounded-full ${isDry ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <p className="text-base font-bold text-slate-900">{measurement.humidity.toFixed(1)}% Humedad</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              isDry ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {isDry ? 'Seca' : 'Húmeda'}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {measurement.date} · {measurement.time}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {measurement.woodType || 'Eucaliptus'}
                        </p>
                        {index < timelineMeasurements.length - 1 && <div className="mt-3 h-px bg-slate-100" />}
                      </div>
                    );
                  })}
                </div>
              )}
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
                onClick={openCheckoutConfirmation}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#1ebd5d] text-white py-4 px-4 rounded-[18px] font-bold text-base flex items-center justify-center gap-3 shadow-[0_12px_30px_rgba(37,211,102,0.3)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-95"
              >
                <CreditCard size={20} />
                Pagar con Webpay Plus
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

      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <h3 className="text-xl font-bold text-[#1B5E20]">Confirmar Pedido de Leña</h3>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Cantidad (m³)</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setModalMeters(value => Math.max(1, value - 1))}
                  className="h-10 w-10 rounded-full border-2 border-slate-300 text-xl font-bold text-slate-700 transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
                >
                  −
                </button>
                <div className="flex-1 text-center text-2xl font-bold text-slate-900">{modalMeters}</div>
                <button
                  onClick={() => setModalMeters(value => Math.min(selectedWoodOption?.available ?? value, value + 1))}
                  className="h-10 w-10 rounded-full border-2 border-[#2E7D32] bg-[#2E7D32] text-xl font-bold text-white transition hover:bg-[#1B5E20]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#C8E6C9] bg-[#F1F8E9] p-4">
              <p className="text-sm text-slate-700">
                Precio por metro: <span className="font-semibold text-slate-900">${(selectedWoodOption?.price ?? vendor.price).toLocaleString('es-CL')}</span>
              </p>
              <p className="mt-2 text-lg font-bold text-[#1B5E20]">
                Total a Pagar: ${((selectedWoodOption?.price ?? vendor.price) * modalMeters).toLocaleString('es-CL')}
              </p>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              ¿Estás seguro de que deseas proceder al pago seguro de este pedido?
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => startCheckout(modalMeters)}
                className="rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20] flex items-center justify-center gap-2"
              >
                <CreditCard size={16} />
                Confirmar e ir a Pagar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
