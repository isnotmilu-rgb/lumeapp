import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, MapPin } from 'lucide-react';
import { useApp } from '../App';
import { vendors } from '../data/vendors';

export function ContactScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(v => v.id === Number(id));

  if (!vendor) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FBE7] px-4 py-10">
      <div className="rounded-[32px] bg-white/95 px-6 py-8 shadow-[0_35px_90px_rgba(15,23,42,0.14)] backdrop-blur-sm text-center">
        <p className="text-lg font-semibold text-slate-900">Vendedor no encontrado</p>
        <button onClick={() => navigate(-1)} className="mt-6 rounded-[18px] bg-[#1B5E20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#165a1c]">
          Volver
        </button>
      </div>
    </div>
  );

  const meters = 3;
  const total = vendor.price * meters;

  return (
    <div className="min-h-screen bg-[#F9FBE7]">
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold">Contactar vendedor</h1>
          <p className="text-sm text-white/85">Coordina tu pedido directamente con el proveedor.</p>
        </div>
      </div>

      <div className="px-4 pb-10">
        <div className="mt-4 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <img src={vendor.imageUrl} alt={`${vendor.name}`} className="h-56 w-full object-cover" />
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-xl font-bold ${vendor.certified ? 'bg-[#2E7D32]' : 'bg-[#FF6F00]'}`}>
                {vendor.initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{vendor.name}</h2>
                <p className="text-sm text-slate-500">{vendor.address}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[28px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Especie</p>
                <p className="mt-2 font-semibold text-slate-900">{vendor.species}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Humedad</p>
                <p className={`mt-2 font-semibold ${vendor.certified ? 'text-[#2E7D32]' : 'text-[#FF6F00]'}`}>{vendor.certified ? `${vendor.humidity}% ✓ Seca` : 'No verificada'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cantidad</p>
                <p className="mt-2 font-semibold text-slate-900">{meters} m³</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Precio/m³</p>
                <p className="mt-2 font-semibold text-slate-900">${vendor.price.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <p className="text-xs text-[#2E7D32] font-bold uppercase tracking-[0.2em]">Resumen del pedido</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between"><span>Especie</span><span className="font-medium text-slate-900">{vendor.species}</span></div>
              <div className="flex justify-between"><span>Humedad</span><span className={`font-medium ${vendor.certified ? 'text-[#2E7D32]' : 'text-[#FF6F00]'}`}>{vendor.certified ? `${vendor.humidity}% ✓ Seca` : 'No verificada'}</span></div>
              <div className="flex justify-between"><span>Cantidad</span><span className="font-medium text-slate-900">{meters} m³</span></div>
              <div className="flex justify-between"><span>Precio/m³</span><span className="font-medium text-slate-900">${vendor.price.toLocaleString('es-CL')}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 mt-3"><span className="font-bold text-slate-900">Total estimado</span><span className="font-bold text-[#1B5E20] text-lg">${total.toLocaleString('es-CL')}</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setCurrentStep(5); setShowComingSoon(true); }}
              className="w-full rounded-[28px] bg-[#25D366] py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,211,102,0.22)] transition hover:bg-[#1ebd5d] flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} /> Abrir WhatsApp
            </button>
            <button
              onClick={() => setShowComingSoon(true)}
              className="w-full rounded-[28px] border-2 border-[#2E7D32] bg-white py-4 text-sm font-semibold text-[#2E7D32] transition hover:bg-[#f3f9f2] flex items-center justify-center gap-2"
            >
              <Phone size={18} /> Llamar al vendedor
            </button>
            <button
              onClick={() => navigate(`/seller/${id}`)}
              className="w-full rounded-[28px] border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <MapPin size={16} /> Ver perfil completo
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">Dato verificado por dispositivo, no por el vendedor.</p>
        </div>
      </div>
    </div>
  );
}
