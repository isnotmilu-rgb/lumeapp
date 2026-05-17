import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { ShoppingBag, Store } from 'lucide-react';
import { analyticsService } from '../../services/analytics';

const LOGO_URL = "https://i.imgur.com/Bxwa7aX.png";

export function Onboarding() {
  const navigate = useNavigate();
  const { setUserType, setCurrentFlow, setCurrentStep } = useApp();

  const handleBuyer = () => {
    analyticsService.trackFlowStep('user_type_selected', 1, 5);
    analyticsService.setUser('anonymous_buyer', { user_type: 'buyer' });

    setUserType('buyer');
    setCurrentFlow(['Seleccionar "Soy comprador"', 'Ver mapa de vendedores', 'Seleccionar vendedor', 'Revisar certificación', 'Contactar por WhatsApp']);
    setCurrentStep(1);
    navigate('/map');
  };

  const handleVendor = () => {
    analyticsService.trackFlowStep('user_type_selected', 1, 5);
    analyticsService.setUser('anonymous_vendor', { user_type: 'vendor' });

    setUserType('vendor');
    setCurrentFlow(['Seleccionar "Soy vendedor"', 'Ver dashboard', 'Medir leña con dispositivo', 'Certificación activa', 'Perfil visible para compradores']);
    setCurrentStep(1);
    navigate('/dashboard');
  };

  return (
    <div
      className="h-[820px] flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d3d11 0%, #1B5E20 55%, #2E7D32 100%)' }}
    >
      {/* Logo + nombre */}
      <div className="flex flex-col items-center mb-12">
        <div style={{
          width: '90px', height: '90px',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(165,214,167,0.35), 0 6px 20px rgba(0,0,0,0.4)',
          marginBottom: '18px',
        }}>
          <img src={LOGO_URL} alt="LumeApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 className="text-white text-3xl font-extrabold tracking-wide">LumeApp</h1>
        <p className="text-[#A5D6A7] text-xs tracking-widest uppercase mt-1">¿Cómo quieres continuar?</p>
      </div>

      {/* Botones */}
      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={handleBuyer}
          className="w-full bg-white text-[#1B5E20] p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <ShoppingBag size={38} strokeWidth={1.5} className="flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold text-lg">Soy Comprador</div>
              <div className="text-sm text-gray-500 mt-0.5">Buscar leña seca certificada</div>
            </div>
          </div>
        </button>

        <button
          onClick={handleVendor}
          className="w-full bg-white text-[#1B5E20] p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <Store size={38} strokeWidth={1.5} className="flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold text-lg">Soy Vendedor</div>
              <div className="text-sm text-gray-500 mt-0.5">Certificar y vender mi leña</div>
            </div>
          </div>
        </button>
      </div>

      <p className="mt-10 text-white/40 text-xs text-center">
        Certificación bajo Norma NCh 2965 · Dispositivo IoT
      </p>
    </div>
  );
}
