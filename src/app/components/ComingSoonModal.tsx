import { useApp } from '../App';
import { Clock } from 'lucide-react';

export function ComingSoonModal() {
  const { setShowComingSoon } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowComingSoon(false)}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF8E1] flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-[#FF8F00]" />
        </div>

        <h2 className="text-xl font-bold text-[#1B5E20] mb-2">Próximamente</h2>
        <p className="text-gray-600 mb-6">
          Esta función estará disponible en la versión final de LumeApp
        </p>

        <button
          onClick={() => setShowComingSoon(false)}
          className="w-full bg-[#2E7D32] text-white py-3 rounded-xl font-medium hover:bg-[#1B5E20] transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
