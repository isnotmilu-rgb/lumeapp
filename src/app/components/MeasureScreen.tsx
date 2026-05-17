import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bluetooth, Check } from 'lucide-react';
import { useApp } from '../App';

export function MeasureScreen() {
  const navigate = useNavigate();
  const { setShowComingSoon } = useApp();
  const [species, setSpecies] = useState('Eucaliptus');

  const handleSubmit = () => {
    setShowComingSoon(true);
  };

  return (
    <div className="h-[820px] flex flex-col bg-[#F9FBE7] overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span>
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Device Status */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2E7D32] animate-pulse"></div>
          <Bluetooth size={16} className="text-[#2E7D32]" />
          <span className="text-sm text-gray-700">Dispositivo conectado · Bluetooth</span>
        </div>

        {/* Humidity Reading */}
        <div className="text-center mb-8">
          <div className="text-7xl font-bold text-[#2E7D32] mb-2">17%</div>
          <p className="text-gray-600">humedad de la leña</p>
        </div>

        {/* Certification Badge */}
        <div className="bg-[#2E7D32] text-white px-4 py-2 rounded-full mb-8">
          Norma NCh 2965 ✓ Seco
        </div>

        {/* Species Selector */}
        <div className="w-full max-w-sm mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especie de leña
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
          >
            <option>Eucaliptus</option>
            <option>Roble</option>
            <option>Coigüe</option>
            <option>Aromo</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full max-w-sm bg-[#2E7D32] text-white py-4 rounded-xl font-bold hover:bg-[#1B5E20] transition-colors shadow-lg"
        >
          Subir medición a la app
        </button>

        {/* Info List */}
        <div className="w-full max-w-sm mt-8 bg-white rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Check size={20} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Humedad</p>
              <p className="text-xs text-gray-500">Dispositivo IoT · 17%</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Especie</p>
              <p className="text-xs text-gray-500">Vendedor · {species}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Fecha y hora</p>
              <p className="text-xs text-gray-500">Automático · 11 May 2026, 9:41</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check size={20} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Ubicación</p>
              <p className="text-xs text-gray-500">GPS · Av. Alemania 850, Temuco</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
