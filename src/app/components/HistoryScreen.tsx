import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { vendors } from '../data/vendors';
import { supabase } from '../services/supabaseClient';

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

type HistoryMeasurement = {
  key: string;
  date: string;
  time: string;
  humidity: number;
  species: string;
  verified: boolean;
  status: 'Vigente' | 'Expirada';
  id?: string | number;
  id_medicion?: string | number;
  created_at?: string;
  vendedor_id?: string;
};

export function HistoryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sessionIdentity = window.localStorage.getItem('lume_demo_identity');
  const resolvedVendorId = String(id ?? (sessionIdentity === 'vendedor_camila' ? 'vendedor_camila' : ''));
  const idNum = Number(resolvedVendorId);
  const isCamilaVendor = resolvedVendorId === 'vendedor_camila';
  const vendor = vendors.find(v => String(v.id) === resolvedVendorId);
  const realtimeSourceVendorId = String(vendor?.id ?? resolvedVendorId) === 'vendedor_camila' ? '1' : String(vendor?.id ?? resolvedVendorId);
  const history = Number.isNaN(idNum) ? undefined : vendorHistory[idNum as keyof typeof vendorHistory];
  const [camilaMeasurements, setCamilaMeasurements] = useState<HistoryMeasurement[]>([]);
  const [camilaLoading, setCamilaLoading] = useState(false);
  const [camilaError, setCamilaError] = useState('');
  const latestPublishedWoodType = window.localStorage.getItem('lume_camila_published_wood_type');

  useEffect(() => {
    if (!isCamilaVendor || !realtimeSourceVendorId) return;
    let isMounted = true;

    const fetchCamilaHistory = async () => {
      if (isMounted) {
        setCamilaLoading(true);
      }

      const { data, error } = await supabase
        .from('mediciones_humedad')
        .select('*')
        .eq('vendedor_id', realtimeSourceVendorId)
        .order('created_at', { ascending: false })
        .limit(25);

      if (!isMounted) return;

      setCamilaLoading(false);
      if (error) {
        console.error('Error real de Supabase:', error);
        setCamilaError('No se pudo cargar el historial en este momento.');
        return;
      }

      const mappedMeasurements: HistoryMeasurement[] = (data ?? [])
        .map((measurement) => {
          const humidity = Number(measurement?.valor_humedad);
          const createdAt = typeof measurement?.created_at === 'string' ? new Date(measurement.created_at) : null;
          if (Number.isNaN(humidity) || !createdAt || Number.isNaN(createdAt.getTime())) {
            return null;
          }

          return {
            key: measurement.created_at,
            date: createdAt.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: createdAt.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
            humidity,
            species:
              (typeof measurement?.tipo_madera === 'string' && measurement.tipo_madera)
              || (typeof measurement?.tipo_lena === 'string' && measurement.tipo_lena)
              || (typeof measurement?.wood_type === 'string' && measurement.wood_type)
              || 'Coigüe',
            verified: true,
            status: 'Vigente',
            id: measurement?.id,
            id_medicion: measurement?.id_medicion,
            created_at: measurement?.created_at,
            vendedor_id: typeof measurement?.vendedor_id === 'string' ? measurement.vendedor_id : realtimeSourceVendorId,
          } as HistoryMeasurement;
        })
        .filter((measurement): measurement is HistoryMeasurement => measurement !== null);

      const storedPublishedHumidity = window.localStorage.getItem('lume_camila_published_humidity');
      const storedPublishedAt = window.localStorage.getItem('lume_camila_published_at');
      const storedPublishedWoodType = window.localStorage.getItem('lume_camila_published_wood_type');
      const parsedPublishedHumidity = storedPublishedHumidity !== null ? Number(storedPublishedHumidity) : NaN;
      const mergedMeasurements = [...mappedMeasurements];
      if (!Number.isNaN(parsedPublishedHumidity) && typeof storedPublishedAt === 'string') {
        const publishedDate = new Date(storedPublishedAt);
        if (!Number.isNaN(publishedDate.getTime())) {
          mergedMeasurements.push({
            key: storedPublishedAt,
            date: publishedDate.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: publishedDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
            humidity: parsedPublishedHumidity,
            species: storedPublishedWoodType || 'Coigüe',
            verified: true,
            status: 'Vigente',
            created_at: storedPublishedAt,
            vendedor_id: realtimeSourceVendorId,
          });
        }
      }
      mergedMeasurements.sort((a, b) => new Date(b.key).getTime() - new Date(a.key).getTime());

      setCamilaMeasurements(mergedMeasurements);
      setCamilaError('');
    };

    void fetchCamilaHistory();
    const interval = window.setInterval(() => {
      void fetchCamilaHistory();
    }, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [isCamilaVendor, realtimeSourceVendorId]);

  const renderedMeasurements: HistoryMeasurement[] = isCamilaVendor
    ? camilaMeasurements
    : (history?.measurements ?? []).map((measurement, index) => ({
        key: `${measurement.date}-${measurement.time}-${index}`,
        date: measurement.date,
        time: measurement.time,
        humidity: measurement.humidity,
        species: measurement.species,
        verified: measurement.verified,
        status: measurement.status as 'Vigente' | 'Expirada',
      }));
  const uniqueMeasurementsForRender: HistoryMeasurement[] = [];
  const seenIds = new Set<string | number>();
  const seenContentKeys = new Set<string>();
  const createContentKey = (item: HistoryMeasurement) =>
    `${item.humidity}-${String(item.vendedor_id ?? realtimeSourceVendorId)}-${String(item.created_at ?? item.key).substring(0, 16)}`;

  (renderedMeasurements || []).forEach((item) => {
    const uniqueKey = item.id_medicion || item.id || item.created_at || item.key;
    const contentKey = createContentKey(item);
    if (uniqueKey && !seenIds.has(uniqueKey) && !seenContentKeys.has(contentKey)) {
      seenIds.add(uniqueKey);
      seenContentKeys.add(contentKey);
      uniqueMeasurementsForRender.push(item);
    }
  });
  const historyListForTimeline = uniqueMeasurementsForRender;

  if (!vendor) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p>Vendedor no encontrado</p>
      <button onClick={() => navigate(-1)} className="mt-3 px-3 py-2 bg-[#1B5E20] text-white rounded-lg">Volver</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FBE7]">
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-center items-center text-xs">
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

      <div className="mx-auto w-full max-w-6xl px-4 pb-10">
        <div className="mt-4 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <img src={vendor.heroImage || vendor.imageUrl} alt={`${vendor.name}`} className="h-56 w-full object-cover" />
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
          <span className="rounded-full bg-[#E8F5E9] px-3 py-2 text-xs font-semibold text-[#1B5E20]">{historyListForTimeline.length} entradas</span>
          </div>

          <div className="mt-5 space-y-4">
          {isCamilaVendor && camilaLoading && historyListForTimeline.length === 0 && (
            <div className="rounded-[24px] border border-[#BBDEFB] bg-[#E3F2FD] p-4 text-sm text-[#0D47A1] inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Cargando historial en vivo...
            </div>
          )}
          {isCamilaVendor && !camilaLoading && historyListForTimeline.length === 0 && !camilaError && (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Este vendedor aún no registra un historial de mediciones certificadas.
            </div>
          )}
          {camilaError && (
            <div className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {camilaError}
            </div>
          )}
          {historyListForTimeline.map((measurement, index) => (
            <div
              key={measurement.key}
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
                    <p className="text-sm text-slate-500">{index === 0 ? (latestPublishedWoodType || measurement.species || 'Coigüe') : (measurement.species || 'Eucaliptus')}</p>
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
