import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart3, User, Gauge, Shield, Bell, X, Plus, Minus, ChevronRight, TrendingDown, TrendingUp, Settings, Loader2, FileText, Printer, RefreshCw, Wifi } from 'lucide-react';
import { useApp } from '../App';
import { vendors } from '../data/vendors';
import { supabase } from '../services/supabaseClient';

const ZONE_AVG = 44333;
const MY_PRICE = 45000;
const COMPETITORS = [
  { name: 'Maderera Verde', price: 52000, humidity: 21, dist: 1.2, certified: true },
  { name: 'Comercial Aromo', price: 41000, humidity: 18, dist: 2.8, certified: true },
  { name: 'Don Pedro Leña', price: 30000, humidity: null, dist: 3.5, certified: false },
];
const TIPS = [
  'Los vendedores que miden 2+ veces por semana reciben 3x más contactos.',
  'Agregar fotos de tu leña puede aumentar las visitas hasta un 40%.',
  'Mantener el precio dentro del promedio mejora tu tasa de contacto.',
];

interface Alerta { id: number; tipo: 'verde'|'amarilla'|'roja'|'gris'; icon: string; texto: string; }

const INITIAL_ALERTS: Alerta[] = [
  { id: 1, tipo: 'verde', icon: '👥', texto: '3 compradores visitaron tu perfil en la última hora.' },
  { id: 2, tipo: 'amarilla', icon: '⏰', texto: 'Tu certificación vence en 6 días. Mide pronto.' },
  { id: 3, tipo: 'gris', icon: '📍', texto: 'Hay 1 vendedor nuevo en tu zona esta semana.' },
];

const alertBg: Record<string, string> = {
  verde: 'bg-[#E8F5E9] border-[#A5D6A7]',
  amarilla: 'bg-[#FFF8E1] border-yellow-300',
  roja: 'bg-red-50 border-red-300',
  gris: 'bg-gray-50 border-gray-200',
};

type IotFlowState = 'idle' | 'verifying' | 'preview' | 'success';

export function VendorDashboard() {
  const navigate = useNavigate();
  const { setShowComingSoon } = useApp();
  const isCamilaSession = window.localStorage.getItem('lume_demo_identity') === 'vendedor_camila';
  const currentVendor = isCamilaSession
    ? vendors.find(v => v.id === 'vendedor_camila')
    : vendors.find(v => v.id === 1);
  const [activeTab, setActiveTab] = useState<'inicio'|'mizona'>('inicio');
  const [alertas, setAlertas] = useState<Alerta[]>(INITIAL_ALERTS);
  const [stock, setStock] = useState(15);
  const [tipsVisible, setTipsVisible] = useState(true);
  const [iotHumidity, setIotHumidity] = useState<number | null>(null);
  const [iotLoading, setIotLoading] = useState(false);
  const [iotError, setIotError] = useState('');
  const [hasValidHumidityReading, setHasValidHumidityReading] = useState(false);
  const [iotFlowState, setIotFlowState] = useState<IotFlowState>('idle');
  const [connectionTime, setConnectionTime] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const priceDiff = MY_PRICE - ZONE_AVG;
  const publishedAt = window.localStorage.getItem('lume_camila_published_at');
  const todayLabel = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    if (iotFlowState !== 'verifying' || !isCamilaSession) return;
    const verifyTimeout = window.setTimeout(() => {
      setIotFlowState('preview');
    }, 2500);

    return () => {
      window.clearTimeout(verifyTimeout);
    };
  }, [iotFlowState, isCamilaSession]);

  useEffect(() => {
    if (iotFlowState !== 'preview' || !isCamilaSession || !connectionTime) return;
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
  }, [iotFlowState, isCamilaSession, connectionTime, hasValidHumidityReading]);

  const handlePublishLot = () => {
    if (iotHumidity === null) {
      return;
    }
    setIotFlowState('success');
    window.localStorage.setItem('lume_camila_published_humidity', iotHumidity.toString());
    window.localStorage.setItem('lume_camila_published_at', new Date().toISOString());
  };

  const handleResetMeasurement = () => {
    setIotFlowState('idle');
    setIotHumidity(null);
    setIotError('');
    setIotLoading(false);
    setHasValidHumidityReading(false);
    setShowCertificateModal(false);
    setConnectionTime('');
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-[#F9FBE7]">
      {/* Status Bar sin hora y centrado */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-center items-center text-xs flex-shrink-0">
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top bar with settings icon */}
      <div className="bg-[#2E7D32] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-bold text-base">{isCamilaSession ? 'Hola, Leñería Camila 🔥' : `Hola, ${currentVendor?.name ?? 'Vendedor'} 👋`}</h1>
          <p className="text-[#A5D6A7] text-xs">Panel de vendedor · {isCamilaSession ? 'Temuco' : currentVendor?.zone === 'padre-las-casas' ? 'Padre Las Casas' : currentVendor?.zone === 'alrededores' ? 'Alrededores' : 'Temuco'}</p>
        </div>
        <button onClick={() => navigate('/profile/vendor')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Settings size={20}/>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="bg-white border-b border-gray-100 flex flex-shrink-0">
        <button onClick={() => setActiveTab('inicio')} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'inicio' ? 'text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-gray-400'}`}>Inicio</button>
        <button onClick={() => setActiveTab('mizona')} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${activeTab === 'mizona' ? 'text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-gray-400'}`}>📍 Mi Zona</button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {activeTab === 'inicio' ? (
          <div className="p-4 space-y-4">
            {/* Alerts */}
            {alertas.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Bell size={14} className="text-[#1B5E20]"/><h3 className="text-sm font-bold text-[#1B5E20]">Alertas</h3></div>
                {alertas.map(a => (
                  <div key={a.id} className={`flex items-start gap-2 p-3 rounded-xl border ${alertBg[a.tipo]}`}>
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <p className="text-xs text-gray-700 flex-1">{a.texto}</p>
                    <button onClick={() => setAlertas(p => p.filter(x => x.id !== a.id))} className="text-gray-400 flex-shrink-0"><X size={14}/></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl p-3 text-center">
                <p className="text-sm text-[#2E7D32] font-medium">✓ Todo en orden</p>
              </div>
            )}

            {/* Certification */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-[#1B5E20]">Certificación</h2>
                <span className="bg-[#2E7D32] text-white text-xs px-2 py-1 rounded-full">✓ Activa</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-[#2E7D32]">17%</span>
                <span className="text-sm text-gray-500 pb-1">humedad · Eucaliptus</span>
              </div>
              <div className="bg-[#E8F5E9] rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-[#2E7D32] h-full rounded-full" style={{ width: '17%' }}/>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Medido hace 1 día</span><span>Vigente 6 días más</span>
              </div>
            </div>

            {isCamilaSession && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#BBDEFB]">
                <h3 className="font-bold text-[#0D47A1] mb-2">Módulo IoT Activado</h3>
                <p className="text-xs text-slate-600 mb-3">Conectado a mediciones_humedad · vendedor_camila</p>
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
                    <div className="mt-3 mx-auto h-28 w-28 rounded-full border-4 border-[#90CAF9] bg-white flex items-center justify-center">
                      {iotHumidity !== null ? (
                        <p className="text-3xl font-bold text-[#0D47A1]">{`${iotHumidity}%`}</p>
                      ) : (
                        <Wifi size={34} className="text-[#0D47A1] animate-pulse" />
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
                      disabled={iotHumidity === null}
                      className="mt-3 w-full rounded-lg bg-[#2E7D32] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B5E20] disabled:cursor-not-allowed disabled:bg-[#A5D6A7]"
                    >
                      Certificar y Publicar Lote
                    </button>
                    <button
                      onClick={handleResetMeasurement}
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
                    {iotHumidity !== null && iotHumidity < 20 && (
                      <button
                        onClick={() => setShowCertificateModal(true)}
                        className="mt-3 w-full rounded-lg bg-[#0D47A1] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b3f91] flex items-center justify-center gap-2"
                      >
                        <FileText size={16} />
                        Descargar Certificado de Calidad LumeApp
                      </button>
                    )}
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

            {/* Stock control */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-[#1B5E20] mb-3 text-sm">Gestión de stock</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Metros disponibles</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setStock(s => Math.max(0, s - 1))} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><Minus size={16}/></button>
                  <span className="text-2xl font-bold text-[#2E7D32] w-10 text-center">{stock}</span>
                  <button onClick={() => setStock(s => s + 1)} className="w-8 h-8 bg-[#2E7D32] text-white rounded-full flex items-center justify-center hover:bg-[#1B5E20] transition-colors"><Plus size={16}/></button>
                </div>
              </div>
              {stock === 0 && <p className="text-xs text-red-600 text-center mb-2">⚠️ Sin stock — los compradores verán que no tienes disponibilidad</p>}
              <button onClick={() => setShowComingSoon(true)} className="w-full bg-[#2E7D32] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">Actualizar stock</button>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-2 text-sm">Métricas de hoy</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { num: '24', label: 'Vistas de perfil', sub: '↑ 6 vs ayer', fn: () => setShowComingSoon(true) },
                  { num: '8', label: 'Contactos', sub: '↑ 2 vs ayer', fn: () => setShowComingSoon(true) },
                  { num: `${stock}m³`, label: 'Stock actual', sub: stock === 0 ? '⚠️ Sin stock' : 'Disponible', fn: () => {} },
                  { num: '4.8⭐', label: 'Calificación', sub: '34 reseñas', fn: () => setShowComingSoon(true) },
                ].map((m, i) => (
                  <button key={i} onClick={m.fn} className="bg-[#E8F5E9] rounded-xl p-3 text-left hover:bg-[#C8E6C9] transition-colors">
                    <div className="text-xl font-bold text-[#2E7D32] mb-0.5">{m.num}</div>
                    <div className="text-xs text-gray-600">{m.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Measure CTA */}
            <button onClick={() => navigate('/measure')} className="w-full bg-[#2E7D32] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#1B5E20] transition-colors shadow-lg">
              <Gauge size={22}/>Medir mi leña ahora
            </button>

            {/* Recent activity */}
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-2 text-sm">Actividad reciente</h3>
              <div className="bg-white rounded-xl divide-y divide-gray-50 shadow-sm">
                {[
                  { text: 'José Muñoz vio tu perfil', time: 'Hace 2 horas', tag: 'Nuevo', color: 'text-[#2E7D32]' },
                  { text: 'María González te contactó por WhatsApp', time: 'Hace 5 horas', tag: '💬', color: '' },
                  { text: 'Medición registrada: 17% · Eucaliptus', time: 'Hace 1 día', tag: '✓', color: 'text-[#2E7D32]' },
                ].map((a, i) => (
                  <div key={i} className="p-3 flex justify-between items-start">
                    <div><p className="text-sm text-gray-700">{a.text}</p><p className="text-xs text-gray-400 mt-0.5">{a.time}</p></div>
                    <span className={`text-xs ${a.color}`}>{a.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {tipsVisible && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#1B5E20] text-sm">💡 Cómo mejorar tu perfil</h3>
                  <button onClick={() => setTipsVisible(false)}><X size={16} className="text-gray-400"/></button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {TIPS.map((tip, i) => (
                    <div key={i} className="flex-shrink-0 w-60 bg-[#F9FBE7] rounded-lg p-3 border border-[#A5D6A7]">
                      <p className="text-xs text-gray-700 mb-3">{tip}</p>
                      <button onClick={() => setShowComingSoon(true)} className="flex items-center gap-1 text-xs text-[#2E7D32] font-medium">Ver más <ChevronRight size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="h-4"/>
          </div>
        ) : (
          /* Mi Zona */
          <div className="p-4 space-y-4">
            <div className={`rounded-xl p-4 shadow-sm border ${priceDiff <= 0 ? 'bg-[#E8F5E9] border-[#A5D6A7]' : 'bg-[#FFF8E1] border-yellow-300'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-[#1B5E20]">Tu precio vs la zona</h3>
                {priceDiff <= 0
                  ? <span className="flex items-center gap-1 text-[#2E7D32] text-xs font-medium"><TrendingDown size={14}/> Competitivo</span>
                  : <span className="flex items-center gap-1 text-orange-500 text-xs font-medium"><TrendingUp size={14}/> Sobre el promedio</span>
                }
              </div>
              <div className="flex justify-between text-sm mb-3">
                <div><p className="text-gray-500 text-xs">Promedio zona</p><p className="font-bold text-gray-700">${ZONE_AVG.toLocaleString('es-CL')}</p></div>
                <div className="text-right"><p className="text-gray-500 text-xs">Tu precio</p><p className={`font-bold ${priceDiff <= 0 ? 'text-[#2E7D32]' : 'text-orange-500'}`}>${MY_PRICE.toLocaleString('es-CL')}</p></div>
              </div>
              <p className="text-xs text-gray-600">
                {priceDiff <= 0
                  ? `✓ Estás $${Math.abs(priceDiff).toLocaleString('es-CL')} bajo el promedio — eso atrae más compradores.`
                  : `Tu precio está $${priceDiff.toLocaleString('es-CL')} sobre el promedio de la zona.`}
              </p>
            </div>

            {/* Competitors */}
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-2 text-sm">Competidores cercanos</h3>
              <div className="space-y-2">
                {COMPETITORS.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${c.certified ? 'bg-[#2E7D32]' : 'bg-orange-400'}`}>
                        {c.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.dist} km · {c.certified ? `${c.humidity}% hum.` : 'Sin certif.'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-800">${c.price.toLocaleString('es-CL')}</p>
                      <p className={`text-xs ${c.price < MY_PRICE ? 'text-orange-500' : 'text-[#2E7D32]'}`}>
                        {c.price < MY_PRICE ? `$${(MY_PRICE - c.price).toLocaleString('es-CL')} menos` : `$${(c.price - MY_PRICE).toLocaleString('es-CL')} más`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Solo datos públicos de certificación</p>
            </div>

            <div className="bg-[#2E7D32] text-white rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">🏆</div>
              <p className="font-bold">Eres el vendedor #1 más visitado</p>
              <p className="text-[#A5D6A7] text-xs mt-1">en Temuco esta semana</p>
            </div>
            <div className="h-4"/>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center flex-shrink-0">
        <button className="flex flex-col items-center gap-1 text-[#2E7D32]"><Home size={22}/><span className="text-xs">Inicio</span></button>
        <button onClick={() => navigate('/stats')} className="flex flex-col items-center gap-1 text-gray-400"><BarChart3 size={22}/><span className="text-xs">Stats</span></button>
        <button onClick={() => navigate('/certification')} className="flex flex-col items-center gap-1 text-gray-400"><Shield size={22}/><span className="text-xs">Certificación</span></button>
        <button onClick={() => navigate('/profile/vendor')} className="flex flex-col items-center gap-1 text-gray-400"><User size={22}/><span className="text-xs">Perfil</span></button>
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