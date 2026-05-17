import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export function ConfirmationScreen() {
  const navigate = useNavigate();

  return (
    <div className="h-[820px] flex flex-col bg-[#F9FBE7] overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate('/dashboard')} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold">Medición registrada</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-6">
          <CheckCircle size={60} className="text-[#2E7D32]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#2E7D32] mb-2">Certificación activa</h2>
        <p className="text-gray-600 text-center mb-8">
          Tu perfil ya muestra la insignia verde
        </p>

        {/* Preview Card */}
        <div className="w-full max-w-sm bg-white rounded-xl p-4 shadow-sm mb-6">
          <h3 className="font-bold text-[#1B5E20] mb-3">Cómo te ven los compradores</h3>
          <div className="bg-[#E8F5E9] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-[#1B5E20]">Leñas Boyeco</h4>
              <span className="bg-[#2E7D32] text-white text-xs px-2 py-1 rounded-full">
                ✓ Seca
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Eucaliptus · 15 metros disponibles</p>
            <div className="mb-2">
              <span className="text-gray-700 text-sm">Humedad: </span>
              <span className="text-[#2E7D32] font-bold text-lg">17%</span>
            </div>
            <div className="bg-white rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-[#2E7D32] h-full rounded-full" style={{ width: '17%' }}></div>
            </div>
            <p className="text-xs text-gray-500">Medido hace 1 minuto · NCh 2965</p>
          </div>
        </div>

        {/* Validity Info */}
        <div className="w-full max-w-sm bg-[#FFF8E1] border-l-4 border-[#FFE082] rounded-lg p-4 mb-6">
          <h3 className="font-bold text-[#FF8F00] mb-2">Vigencia de la certificación</h3>
          <p className="text-sm text-gray-700 mb-2">
            Tu certificación es válida por <strong>7 días</strong> desde la última medición.
          </p>
          <p className="text-xs text-gray-600">
            💡 Mide regularmente para mantener la insignia verde activa
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full max-w-sm bg-[#2E7D32] text-white py-4 rounded-xl font-bold hover:bg-[#1B5E20] transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
