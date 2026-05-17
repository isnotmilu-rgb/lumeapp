import { useNavigate } from 'react-router-dom';
import { Home, BarChart3, User, Shield, TrendingUp, TrendingDown, Trophy, Clock } from 'lucide-react';
import { useApp } from '../App';

const visitasHoy = 24;
const visitasAyer = 18;
const cambio = visitasHoy - visitasAyer;

const datosSemana = [
  { dia: 'Lun', visitas: 12 },
  { dia: 'Mar', visitas: 15 },
  { dia: 'Mié', visitas: 18 },
  { dia: 'Jue', visitas: 14 },
  { dia: 'Vie', visitas: 22 },
  { dia: 'Sáb', visitas: 28 },
  { dia: 'Dom', visitas: 24 },
];
const maxVisitas = Math.max(...datosSemana.map(d => d.visitas));

export function StatsScreen() {
  const navigate = useNavigate();
  const { setShowComingSoon } = useApp();

  return (
    <div className="h-[820px] flex flex-col bg-[#F9FBE7] overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span><span className="font-bold">LumeApp</span>
      </div>
      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-3 flex-shrink-0">
        <h1 className="font-bold text-base">Rendimiento</h1>
        <p className="text-[#A5D6A7] text-xs">Estadísticas y métricas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>

        {/* Visitas + gráfico */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1B5E20]">Visitas al perfil</h2>
            <div className="flex items-center gap-1">
              {cambio > 0
                ? <TrendingUp size={18} className="text-green-600"/>
                : <TrendingDown size={18} className="text-red-600"/>
              }
              <span className={`text-sm font-bold ${cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cambio > 0 ? '+' : ''}{cambio}
              </span>
            </div>
          </div>

          <div className="text-center mb-5">
            <p className="text-4xl font-bold text-[#2E7D32]">{visitasHoy}</p>
            <p className="text-sm text-gray-600 mt-1">visitas hoy</p>
            <p className="text-xs text-gray-400 mt-0.5">vs {visitasAyer} ayer</p>
          </div>

          {/* Bar chart */}
          <div className="flex justify-between items-end h-28 gap-1.5">
            {datosSemana.map(d => (
              <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end items-center" style={{ height: '80px' }}>
                  <div
                    className="w-full bg-[#2E7D32] rounded-t-sm transition-all"
                    style={{ height: `${(d.visitas / maxVisitas) * 80}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{d.dia}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contactos + tasa */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-3 font-medium">Contactos recibidos</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">WhatsApp</span>
                <span className="text-xl font-bold text-[#2E7D32]">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Llamadas</span>
                <span className="text-xl font-bold text-[#2E7D32]">2</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-2 font-medium">Tasa de contacto</p>
            <p className="text-3xl font-bold text-[#2E7D32]">33%</p>
            <p className="text-xs text-gray-400 mt-1">8 de cada 24 visitas</p>
          </div>
        </div>

        {/* Horario peak */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-[#2E7D32]"/>
            <h3 className="font-bold text-[#1B5E20]">Horario peak</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">La mayoría de tus visitantes llegan entre:</p>
          <div className="bg-[#E8F5E9] rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-[#2E7D32]">18:00 - 20:00</p>
            <p className="text-xs text-gray-500 mt-1">62% de las visitas diarias</p>
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={22} className="text-yellow-600"/>
            <h3 className="font-bold text-yellow-800">Ranking de zona</h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Eres el vendedor <strong className="text-yellow-700">#2</strong> más visitado en <strong>Temuco centro</strong> esta semana
          </p>
          <div className="mt-2 p-2 bg-white/70 rounded text-xs text-gray-600 text-center">
            🥇 Continúa midiendo regularmente para subir al #1
          </div>
        </div>

        {/* Distribución */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-[#1B5E20] mb-3">Origen de las visitas</h3>
          <div className="space-y-3">
            {[
              { label: 'Desde el mapa', pct: 65 },
              { label: 'Desde la lista', pct: 25 },
              { label: 'Búsqueda directa', pct: 10 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-xs font-bold text-[#2E7D32]">{item.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${item.pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4"/>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center flex-shrink-0">
        <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-gray-400"><Home size={22}/><span className="text-xs">Inicio</span></button>
        <button className="flex flex-col items-center gap-1 text-[#2E7D32]"><BarChart3 size={22}/><span className="text-xs">Stats</span></button>
        <button onClick={() => navigate('/certification')} className="flex flex-col items-center gap-1 text-gray-400"><Shield size={22}/><span className="text-xs">Certif.</span></button>
        <button onClick={() => navigate('/profile/vendor')} className="flex flex-col items-center gap-1 text-gray-400"><User size={22}/><span className="text-xs">Perfil</span></button>
      </div>
    </div>
  );
}
