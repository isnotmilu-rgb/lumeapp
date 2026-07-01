import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2, Printer, RefreshCw, Wifi, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

type IotFlowState = 'idle' | 'verifying' | 'preview' | 'success';

export function MeasureScreen() {
  const navigate = useNavigate();
  const [selectedWoodType, setSelectedWoodType] = useState('');
  const [showIotPanel, setShowIotPanel] = useState(false);
  const [iotHumidity, setIotHumidity] = useState<number | null>(null);
  const [iotLoading, setIotLoading] = useState(false);
  const [iotError, setIotError] = useState('');
  const [hasValidHumidityReading, setHasValidHumidityReading] = useState(false);
  const [iotFlowState, setIotFlowState] = useState<IotFlowState>('idle');
  const [publishUiState, setPublishUiState] = useState<'idle' | 'loading' | 'published'>('idle');
  const [connectionTime, setConnectionTime] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const publishedAt = window.localStorage.getItem('lume_camila_published_at');
  const todayLabel = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  const humidityVisualTone =
    iotHumidity === null
      ? {
          circle: 'border-[#90CAF9] bg-white',
          text: 'text-[#0D47A1]',
        }
      : iotHumidity < 20
        ? {
            circle: 'border-green-500 bg-green-50',
            text: 'text-green-600',
          }
        : iotHumidity <= 25
          ? {
              circle: 'border-amber-500 bg-amber-50',
              text: 'text-amber-500',
            }
          : {
              circle: 'border-red-500 bg-red-50',
              text: 'text-red-600',
            };

  useEffect(() => {
    if (iotFlowState !== 'verifying') return;
    const verifyTimeout = window.setTimeout(() => {
      setIotFlowState('preview');
    }, 2500);

    return () => {
      window.clearTimeout(verifyTimeout);
    };
  }, [iotFlowState]);

  useEffect(() => {
    if (iotFlowState !== 'preview' || !connectionTime) return;
    let isMounted = true;

    const applyRealtimeHumidity = (humidityValue: unknown) => {
      const parsedHumidity = typeof humidityValue === 'number' ? humidityValue : Number(humidityValue);
      if (Number.isNaN(parsedHumidity)) {
        setIotError('La lectura recibida no tiene un formato válido.');
        return;
      }
      if (parsedHumidity <= 0) {
        return;
      }
      setIotHumidity(parsedHumidity);
      setIotError('');
      setIotLoading(false);
      setHasValidHumidityReading(true);
    };

    const fetchHumidity = async () => {
      if (isMounted && !hasValidHumidityReading) {
        setIotLoading(true);
      }
      try {
        const { data, error } = await supabase
          .from('mediciones_humedad')
          .select('valor_humedad, created_at')
          .eq('vendedor_id', '1')
          .gte('created_at', connectionTime)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!isMounted) return;

        setIotLoading(false);
        if (error) {
          console.error('Error real de Supabase:', error);
          setIotError('No se pudo consultar el sensor en este momento.');
          return;
        }

        if (!data || data.length === 0) {
          setIotError('');
          return;
        }

        applyRealtimeHumidity(data[0]?.valor_humedad);
      } catch (error) {
        if (!isMounted) return;
        setIotLoading(false);
        console.error('Error real de Supabase:', error);
        setIotError('No se pudo consultar el sensor en este momento.');
      }
    };

    void fetchHumidity();
    const intervalId = window.setInterval(() => {
      void fetchHumidity();
    }, 2000);
    const realtimeChannel = supabase
      .channel(`mediciones-humedad-camila-${connectionTime}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mediciones_humedad',
          filter: 'vendedor_id=eq.1',
        },
        (payload: { new?: { vendedor_id?: string; valor_humedad?: unknown; created_at?: string } }) => {
          if (!isMounted) return;
          console.log('¡Dato Realtime recibido!', payload.new);
          applyRealtimeHumidity(payload.new?.valor_humedad);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      void supabase.removeChannel(realtimeChannel);
    };
  }, [iotFlowState, connectionTime, hasValidHumidityReading]);

  const handlePublishLot = () => {
    if (iotHumidity === null || publishUiState !== 'idle') {
      return;
    }
    setPublishUiState('loading');
    window.setTimeout(() => {
      setPublishUiState('published');
      window.setTimeout(() => {
        setShowCertificateModal(true);
        setIotFlowState('success');
        window.localStorage.setItem('lume_camila_published_humidity', iotHumidity.toString());
        window.localStorage.setItem('lume_camila_published_at', new Date().toISOString());
      }, 450);
    }, 700);
  };

  const handleResetMeasurement = () => {
    setIotFlowState('idle');
    setIotHumidity(null);
    setIotError('');
    setIotLoading(false);
    setHasValidHumidityReading(false);
    setPublishUiState('idle');
    setShowCertificateModal(false);
    setConnectionTime('');
  };

  return (
    <div className="h-[820px] flex flex-col bg-[#F9FBE7] overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-center items-center text-xs flex-shrink-0">
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold">Medir mi leña</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Paso 1: Configura el lote</h3>
          <p className="mt-1 text-xs text-slate-600">Selecciona el tipo de leña para iniciar la medición.</p>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              Tipo de leña
            </label>
            <select
              value={selectedWoodType}
              onChange={(event) => setSelectedWoodType(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0D47A1]"
            >
              <option value="">Seleccionar tipo de leña</option>
              <option value="Eucaliptus">Eucaliptus</option>
              <option value="Roble">Roble</option>
              <option value="Coigüe">Coigüe</option>
              <option value="Aromo">Aromo</option>
            </select>
          </div>
          <button
            onClick={() => setShowIotPanel(true)}
            disabled={!selectedWoodType}
            className="mt-4 w-full rounded-lg bg-[#2E7D32] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B5E20] disabled:cursor-not-allowed disabled:bg-[#A5D6A7]"
          >
            Iniciar Medición
          </button>
        </div>

        {showIotPanel && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#BBDEFB]">
            <h3 className="font-bold text-[#0D47A1] mb-2">Módulo IoT Activado</h3>
            <p className="text-xs text-slate-600 mb-3">
              Conectado a mediciones_humedad · vendedor_camila · Lote: {selectedWoodType}
            </p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#F8FBFF] px-3 py-2 text-xs text-[#0D47A1] border border-[#BBDEFB]">Batería: 87% 🔋</div>
              <div className="rounded-lg bg-[#F8FBFF] px-3 py-2 text-xs text-[#0D47A1] border border-[#BBDEFB]">Señal Wi-Fi: Excelente 📶</div>
            </div>
            {iotFlowState === 'idle' && (
              <button
                onClick={() => {
                  handleResetMeasurement();
                  setConnectionTime(new Date().toISOString());
                  setIotFlowState('verifying');
                }}
                className="w-full bg-[#0D47A1] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0b3f91] transition-colors"
              >
                Conectar con Sensor ESP32
              </button>
            )}

            {iotFlowState === 'verifying' && (
              <div className="mt-3 rounded-lg bg-[#E3F2FD] p-3">
                <div className="flex items-center gap-2 text-[#0D47A1] text-sm font-medium">
                  <Loader2 size={16} className="animate-spin" />
                  Verificando estado del sensor en terreno...
                </div>
              </div>
            )}

            {iotFlowState === 'preview' && (
              <div className="mt-3 rounded-lg bg-[#E3F2FD] p-4">
                <p className="text-sm font-semibold text-[#0D47A1] text-center">Sensor Conectado 📶. Humedad actual en vivo:</p>
                <div className={`mt-3 mx-auto h-28 w-28 rounded-full border-4 flex items-center justify-center transition-all duration-500 ease-in-out ${humidityVisualTone.circle}`}>
                  {iotHumidity !== null ? (
                    <p className={`text-3xl font-bold transition-all duration-500 ease-in-out ${humidityVisualTone.text}`}>{`${iotHumidity}%`}</p>
                  ) : (
                    <Wifi size={34} className={`animate-pulse transition-all duration-500 ease-in-out ${humidityVisualTone.text}`} />
                  )}
                </div>
                {iotHumidity === null && !iotError && (
                  <p className="mt-3 text-center text-xs font-medium text-[#0D47A1] animate-pulse">
                    Esperando señal...
                  </p>
                )}
                {iotHumidity === null && !iotError && (
                  <p className="mt-1 text-center text-xs text-[#0D47A1]/80">
                    Sensor en línea 📶. Por favor, realiza la medición en terreno ahora...
                  </p>
                )}
                {iotLoading && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-[#0D47A1] text-xs">
                    <Loader2 size={14} className="animate-spin" />
                    Actualizando lectura...
                  </div>
                )}
                {iotError && <p className="mt-2 text-xs text-red-600">{iotError}</p>}
                <button
                  onClick={handlePublishLot}
                  disabled={iotHumidity === null || publishUiState !== 'idle'}
                  className={`mt-3 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
                    publishUiState === 'published'
                      ? 'bg-green-600'
                      : publishUiState === 'loading'
                        ? 'bg-[#2E7D32]'
                        : 'bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#A5D6A7]'
                  }`}
                >
                  {publishUiState === 'loading' ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 size={15} className="animate-spin" />
                      Publicando lote certificado...
                    </span>
                  ) : publishUiState === 'published' ? (
                    '✅ ¡Lote Publicado!'
                  ) : (
                    'Certificar y Publicar Lote'
                  )}
                </button>
                <button
                  onClick={() => {
                    handleResetMeasurement();
                    setShowIotPanel(false);
                  }}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar / Volver
                </button>
              </div>
            )}

            {iotFlowState === 'success' && (
              <div className="mt-3 rounded-lg border border-[#A5D6A7] bg-[#E8F5E9] p-3">
                <p className="text-sm font-semibold text-[#1B5E20]">¡Humedad publicada para los compradores! ✅</p>
                <p className="mt-2 text-3xl font-bold text-[#1B5E20]">{iotHumidity !== null ? `${iotHumidity}%` : '--%'}</p>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="mt-3 w-full rounded-lg bg-[#0D47A1] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3f91] flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Ver certificado de registro
                </button>
                <button
                  onClick={handleResetMeasurement}
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Medir otro Lote
                </button>
                {publishedAt && (
                  <p className="mt-2 text-xs text-[#1B5E20]/75">Publicado: {new Date(publishedAt).toLocaleString('es-CL')}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showCertificateModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0_35px_90px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1B5E20]">Certificado de Calidad LumeApp</h3>
              <button onClick={() => setShowCertificateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="rounded-xl border border-[#A5D6A7] bg-[#F7FCF8] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#2E7D32]">Leña Seca Certificada</p>
              <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Proveedor:</span> Leñería Camila</p>
              <p className="text-sm text-slate-700"><span className="font-semibold">Fecha:</span> {todayLabel}</p>
              <p className="text-sm text-slate-700"><span className="font-semibold">Humedad medida:</span> {iotHumidity !== null ? `${iotHumidity}%` : '--%'}</p>
              <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
                <div className="text-xs text-slate-600">Código de validación: LUME-CAMILA-{new Date().getFullYear()}-001</div>
                <div className="h-20 w-20 rounded-md border border-slate-300 bg-[repeating-linear-gradient(45deg,#0f172a_0,#0f172a_2px,#fff_2px,#fff_4px)]" />
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="mt-4 w-full rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20] flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              Imprimir / Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
