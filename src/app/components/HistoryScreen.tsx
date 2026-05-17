import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { vendors } from '../data/vendors';

const vendorHistory = {
  1: {
    name: 'Leñas Boyeco',
    measurements: [
      { date: '11 May 2026', time: '09:41', humidity: 17, species: 'Eucaliptus', verified: true, status: 'Vigente' },
      { date: '10 May 2026', time: '14:22', humidity: 17, species: 'Eucaliptus', verified: true, status: 'Vigente' },
      { date: '07 May 2026', time: '10:15', humidity: 18, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '04 May 2026', time: '16:30', humidity: 19, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '01 May 2026', time: '11:45', humidity: 20, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '28 Abr 2026', time: '09:00', humidity: 18, species: 'Eucaliptus', verified: true, status: 'Expirada' },
    ]
  },
  2: {
    name: 'Maderera Verde',
    measurements: [
      { date: '09 May 2026', time: '15:30', humidity: 21, species: 'Roble', verified: true, status: 'Vigente' },
      { date: '06 May 2026', time: '12:00', humidity: 22, species: 'Roble', verified: true, status: 'Expirada' },
      { date: '03 May 2026', time: '10:45', humidity: 23, species: 'Roble', verified: true, status: 'Expirada' },
    ]
  },
  3: {
    name: 'Juan Rojas',
    measurements: [
      { date: '29 Abr 2026', time: '11:00', humidity: 38, species: 'Coigüe', verified: false, status: 'Expirada' },
      { date: '15 Abr 2026', time: '09:30', humidity: 42, species: 'Coigüe', verified: false, status: 'Expirada' },
    ]
  },
  4: {
    name: 'Leñas del Sur',
    measurements: [
      { date: '07 May 2026', time: '08:00', humidity: 19, species: 'Eucaliptus', verified: true, status: 'Vigente' },
      { date: '04 May 2026', time: '14:00', humidity: 20, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '01 May 2026', time: '10:15', humidity: 22, species: 'Eucaliptus', verified: true, status: 'Expirada' },
    ]
  },
  5: {
    name: 'Comercial Aromo',
    measurements: [
      { date: '10 May 2026', time: '07:45', humidity: 18, species: 'Aromo', verified: true, status: 'Vigente' },
      { date: '08 May 2026', time: '11:30', humidity: 19, species: 'Aromo', verified: true, status: 'Expirada' },
      { date: '05 May 2026', time: '09:00', humidity: 21, species: 'Aromo', verified: true, status: 'Expirada' },
      { date: '02 May 2026', time: '16:00', humidity: 20, species: 'Aromo', verified: true, status: 'Expirada' },
    ]
  },
  6: {
    name: 'Don Pedro Leña',
    measurements: [
      { date: '02 Abr 2026', time: '13:00', humidity: 45, species: 'Roble', verified: false, status: 'Expirada' },
    ]
  },
  7: {
    name: 'Forestal Cautín',
    measurements: [
      { date: '05 May 2026', time: '09:00', humidity: 23, species: 'Roble', verified: true, status: 'Vigente' },
      { date: '02 May 2026', time: '14:30', humidity: 24, species: 'Roble', verified: true, status: 'Expirada' },
      { date: '28 Abr 2026', time: '10:00', humidity: 22, species: 'Roble', verified: true, status: 'Expirada' },
    ]
  }
};

export function HistoryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idNum = Number(id);
  const vendor = vendors.find(v => v.id === idNum);
  const history = vendorHistory[idNum as keyof typeof vendorHistory];

  if (!vendor) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p>Vendedor no encontrado</p>
      <button onClick={() => navigate(-1)} className="mt-3 px-3 py-2 bg-[#1B5E20] text-white rounded-lg">Volver</button>
    </div>
  );

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
          <h1 className="text-lg font-bold">Historial completo</h1>
          <p className="text-sm text-white/85">Registro de mediciones para {vendor.name}</p>
        </div>
      </div>

      <div className="px-4 pb-10">
        <div className="mt-4 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <img src={vendor.imageUrl} alt={`${vendor.name}`} className="h-56 w-full object-cover" />
          <div className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#2E7D32]">Proveedor</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{vendor.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{vendor.address}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Calificación</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1B5E20]">{vendor.rating}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1B5E20]">{vendor.available} m³</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Humedad</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1B5E20]">{vendor.humidity ?? '—'}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Todas las mediciones</h2>
              <p className="mt-1 text-sm text-slate-500">Revisa el historial completo de humedad y certificados.</p>
            </div>
            <span className="rounded-full bg-[#E8F5E9] px-3 py-2 text-xs font-semibold text-[#1B5E20]">{(history?.measurements ?? []).length} entradas</span>
          </div>

          <div className="mt-5 space-y-4">
            {(history?.measurements ?? []).map((measurement, index) => (
              <div
                key={index}
                className={`rounded-[24px] border p-4 ${measurement.status === 'Vigente' ? 'border-[#2E7D32] bg-[#F0FFF4]' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-[#1B5E20]">{measurement.date}</div>
                    <div className="text-xs text-slate-500">{measurement.time}</div>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${measurement.status === 'Vigente' ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#F3F4F6] text-slate-600'}`}>
                    {measurement.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-3xl font-semibold text-[#2E7D32]">{measurement.humidity}%</p>
                    <p className="text-sm text-slate-500">{measurement.species}</p>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden sm:max-w-[280px]">
                    <div
                      className="h-full rounded-full bg-[#2E7D32] transition-all"
                      style={{ width: `${measurement.humidity}%` }}
                    />
                  </div>
                </div>

                {measurement.verified && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#2E7D32]">
                    <CheckCircle size={14} />
                    <span>Certificado por dispositivo IoT</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
