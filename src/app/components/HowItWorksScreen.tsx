import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gauge, Database, Smartphone } from 'lucide-react';

export function HowItWorksScreen() {
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
        <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">Cómo funciona LumeApp</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">3 pasos simples</h2>
          <p className="text-gray-600 text-sm">
            Certificación transparente de leña seca
          </p>
        </div>

        {/* Step 1 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <Gauge size={24} className="text-[#2E7D32]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-sm flex items-center justify-center font-bold">
                  1
                </span>
                <h3 className="font-bold text-[#1B5E20]">Dispositivo mide</h3>
              </div>
              <p className="text-sm text-gray-700">
                El vendedor utiliza un dispositivo IoT certificado que mide la humedad de la leña de forma precisa. El dispositivo está calibrado según la Norma NCh 2965.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <Database size={24} className="text-[#2E7D32]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-sm flex items-center justify-center font-bold">
                  2
                </span>
                <h3 className="font-bold text-[#1B5E20]">Base de datos guarda</h3>
              </div>
              <p className="text-sm text-gray-700">
                Los datos de humedad se envían automáticamente a nuestra base de datos segura. Esto elimina la posibilidad de manipulación y garantiza transparencia total.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <Smartphone size={24} className="text-[#2E7D32]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white text-sm flex items-center justify-center font-bold">
                  3
                </span>
                <h3 className="font-bold text-[#1B5E20]">App muestra</h3>
              </div>
              <p className="text-sm text-gray-700">
                Tú ves los datos reales en tiempo real. Puedes verificar el historial completo de mediciones y la fecha de la última medición antes de comprar.
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#E8F5E9] rounded-xl p-4 border-l-4 border-[#2E7D32]">
          <h4 className="font-bold text-[#1B5E20] mb-2">Norma NCh 2965</h4>
          <p className="text-sm text-gray-700">
            Esta norma chilena establece que la leña con menos de 25% de humedad es considerada seca y apta para uso doméstico, garantizando mejor combustión y menos contaminación.
          </p>
        </div>
      </div>
    </div>
  );
}
