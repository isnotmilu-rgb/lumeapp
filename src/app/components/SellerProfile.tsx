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
  const { setCurrentStep } = useApp();
  const vendor = vendors.find(vendor => vendor.id === Number(id));
  const [loading, setLoading] = useState(true);

  const deliveryStatus = vendor?.woods?.[0]?.available
    ? vendor.woods[0].available >= 10
      ? 'Entrega hoy'
      : vendor.woods[0].available >= 5
      ? 'Entrega 24h'
      : 'Entrega 48h'
    : 'Entrega 48h';

  const sendWhatsApp = () => {
    setCurrentStep(4);
    const message = `Hola, vi tu perfil en LumeApp. Me interesa consultar por leña seca certificada. ¿Podemos coordinar?`;
    const whatsappUrl = `https://wa.me/56900000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
      <div className="bg-[#F9FBE7] text-slate-900 pb-28">
        <div className="mx-auto w-full max-w-[700px] px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-[280px] rounded-[24px] bg-slate-200" />
            <div className="space-y-3">
              <div className="h-8 rounded-lg bg-slate-200" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded-lg bg-slate-200" />
                <div className="h-24 rounded-lg bg-slate-200" />
                <div className="h-24 rounded-lg bg-slate-200" />
              </div>
              <div className="h-32 rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const measurements = [
    {
      date: '10 May 2026',
      humidity: vendor?.humidity ?? 23,
      status: (vendor?.humidity ?? 23) <= 20 ? 'Óptimo' : 'Aceptable',
    },
    {
      date: '07 May 2026',
      humidity: (vendor?.humidity ?? 23) + 1,
      status: ((vendor?.humidity ?? 23) + 1) <= 20 ? 'Óptimo' : 'Aceptable',
    },
    {
      date: '04 May 2026',
      humidity: (vendor?.humidity ?? 23) + 2,
      status: ((vendor?.humidity ?? 23) + 2) <= 20 ? 'Óptimo' : 'Aceptable',
    },
  ];

  return (
    <div className="bg-[#F9FBE7] text-slate-900 pb-28 min-h-screen">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-white/95 to-transparent py-2 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm text-sm font-semibold">
          <ArrowLeft size={16} /> Volver
        </button>
      </div>

      <div className="mx-auto w-full max-w-[700px] px-4 py-6 space-y-4">
        {/* Hero with Image */}
        <div className="relative overflow-hidden rounded-[24px] shadow-lg h-[280px]">
          <img src={vendor?.heroImage} alt={vendor?.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081004]/85 via-[#0f3d12]/80 to-[#1B5E20]/75" />

          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <h1 className="text-white font-bold text-[28px] leading-tight mb-2">{vendor?.name}</h1>
            <div className="inline-flex items-center px-2.5 py-1 rounded-[20px] text-[11px] font-medium text-[#A5D6A7] bg-[rgba(165,214,167,0.2)] border border-[#A5D6A7] w-fit">
              ✓ Proveedor verificado
            </div>
          </div>
        </div>

        {/* 3 Top Cards: Precio, Stock, Reseñas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-500 font-semibold">Precio</p>
            <p className="mt-2 text-lg font-bold text-gray-900">${vendor?.woods?.[0]?.price.toLocaleString('es-CL')}</p>
            <p className="text-xs text-gray-500">/ m³</p>
          </div>
          <div className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-500 font-semibold">Stock</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{vendor?.woods?.[0]?.available} m³</p>
          </div>
          <div className="rounded-[16px] border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-500 font-semibold">Reseñas</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{vendor?.reviews}</p>
          </div>
        </div>

        {/* Rating and Stars */}
        <div className="flex items-center gap-2 px-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < Math.floor(vendor?.rating ?? 0);
              const isPartial = index === Math.floor(vendor?.rating ?? 0) && (vendor?.rating ?? 0) % 1 > 0;
              return (
                <Star
                  key={index}
                  size={14}
                  fill={isFilled ? '#FBBF24' : 'none'}
                  stroke="#FBBF24"
                  strokeWidth={isFilled ? 0 : 1.5}
                  color="#FBBF24"
                />
              );
            })}
          </div>
          <span className="text-sm font-semibold text-gray-900">{vendor?.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-600">({vendor?.reviews} reviews)</span>
        </div>

        {/* 3 Green Cards: Calificación, Humedad, Stock */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[16px] border border-[#C8E6C9] bg-[#F1F8F6] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-600 font-semibold">Calificación</p>
            <p className="mt-2 text-2xl font-bold text-[#1B5E20]">{vendor?.rating}</p>
          </div>
          <div className="rounded-[16px] border border-[#C8E6C9] bg-[#F1F8F6] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-600 font-semibold">Humedad</p>
            <p className="mt-2 text-2xl font-bold text-[#1B5E20]">{vendor?.humidity ?? 23}%</p>
          </div>
          <div className="rounded-[16px] border border-[#C8E6C9] bg-[#F1F8F6] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-slate-600 font-semibold">Stock</p>
            <p className="mt-2 text-2xl font-bold text-[#1B5E20]">{vendor?.woods?.[0]?.available}</p>
          </div>
        </div>

        {/* Mediciones Recientes */}
        <div className="bg-white rounded-[16px] p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Mediciones recientes</h3>
          <div className="space-y-2">
            {measurements.map((m, idx) => {
              const isOptimal = m.status === 'Óptimo';
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#F9FBE7] border border-gray-100">
                  <div>
                    <p className={`text-sm font-bold ${isOptimal ? 'text-[#047857]' : 'text-[#B45309]'}`}>{m.humidity}%</p>
                    <p className="text-xs text-gray-500">{m.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isOptimal ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFFBEB] text-[#B45309]'}`}>
                    {m.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={sendWhatsApp}
          className="w-full bg-[#25D366] text-white py-4 px-4 rounded-[14px] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#1ebd5d] transition-all duration-200 active:scale-95 shadow-md"
        >
          💬 Contactar por WhatsApp
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
