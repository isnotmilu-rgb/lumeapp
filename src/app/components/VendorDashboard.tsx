import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart3, User, Gauge, Shield, Bell, X, Plus, Minus, ChevronRight, TrendingDown, TrendingUp, Settings } from 'lucide-react';
import { useApp } from '../App';

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

export function VendorDashboard() {
  const navigate = useNavigate();
  const { setShowComingSoon } = useApp();
  const [activeTab, setActiveTab] = useState<'inicio'|'mizona'>('inicio');
  const [alertas, setAlertas] = useState<Alerta[]>(INITIAL_ALERTS);
  const [stock, setStock] = useState(15);
  const [tipsVisible, setTipsVisible] = useState(true);

  const priceDiff = MY_PRICE - ZONE_AVG;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-[#F9FBE7]">
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span><span className="font-bold">LumeApp</span>
      </div>

      {/* Top bar with settings icon */}
      <div className="bg-[#2E7D32] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-bold text-base">Hola, Leñas Boyeco 👋</h1>
          <p className="text-[#A5D6A7] text-xs">Panel de vendedor · Temuco</p>
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
        <button onClick={() => navigate('/profile/vendor')} className="flex flex-col items-center gap-1 text-gray-400"><User size={22}/><span className="text-xs">Perfil</span></button>
      </div>
    </div>
  );
}
