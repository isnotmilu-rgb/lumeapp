import { useNavigate } from 'react-router-dom';
import { Home, BarChart3, User, ChevronRight, Store, FileText, Settings, HelpCircle, LogOut, Bell, CreditCard, Gauge, Shield } from 'lucide-react';
import { useApp } from '../App';

export function VendorProfileScreen() {
  const navigate = useNavigate();
  const { setShowComingSoon, setUserType } = useApp();

  const handleLogout = () => {
    setUserType(null);
    navigate('/onboarding');
  };

  const MenuItem = ({ icon: Icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E8F5E9] transition-colors"
    >
      <Icon size={20} className="text-[#2E7D32]" />
      <span className="flex-1 text-left text-sm">{label}</span>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-[#F9FBE7]">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex-shrink-0">
        <h1 className="font-bold text-lg">Mi Perfil</h1>
        <p className="text-[#A5D6A7] text-xs">Vendedor</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Profile Header */}
        <div className="bg-white p-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-2xl font-bold">
            LB
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">Leñas Boyeco</h2>
            <p className="text-sm text-gray-600">Temuco, Chile</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#2E7D32] text-white text-xs px-2 py-0.5 rounded-full">
                ✓ Certificado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Status */}
      <div className="bg-white p-4 mb-2">
        <h3 className="font-bold text-[#1B5E20] mb-3">Estado de certificación</h3>
        <div className="bg-[#E8F5E9] rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-700">Humedad actual</span>
            <span className="text-2xl font-bold text-[#2E7D32]">17%</span>
          </div>
          <div className="bg-white rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-[#2E7D32] h-full rounded-full" style={{ width: '17%' }}></div>
          </div>
          <p className="text-xs text-gray-600">Medido hace 1 día · Vigente 6 días más</p>
        </div>
      </div>

      {/* Mi Negocio */}
      <div className="bg-white mb-2">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-[#1B5E20]">Mi negocio</h3>
        </div>
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500">Nombre comercial</p>
          <p className="text-sm font-medium">Leñas Boyeco</p>
        </div>
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500">RUT</p>
          <p className="text-sm font-medium">76.XXX.XXX-X</p>
        </div>
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500">Dirección</p>
          <p className="text-sm font-medium">Av. Alemania 850, Temuco</p>
        </div>
        <MenuItem
          icon={Store}
          label="Editar información"
          onClick={() => setShowComingSoon(true)}
        />
      </div>

      {/* Configuración */}
      <div className="bg-white mb-2">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-[#1B5E20]">Configuración</h3>
        </div>
        <MenuItem
          icon={Bell}
          label="Notificaciones"
          onClick={() => setShowComingSoon(true)}
        />
        <MenuItem
          icon={CreditCard}
          label="Plan actual: Básico"
          onClick={() => setShowComingSoon(true)}
        />
        <MenuItem
          icon={FileText}
          label="Facturación"
          onClick={() => setShowComingSoon(true)}
        />
      </div>

      {/* Ayuda */}
      <div className="bg-white mb-20">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-[#1B5E20]">Ayuda</h3>
        </div>
        <MenuItem
          icon={HelpCircle}
          label="Preguntas frecuentes del vendedor"
          onClick={() => setShowComingSoon(true)}
        />
        <MenuItem
          icon={Gauge}
          label="Cómo funciona el dispositivo"
          onClick={() => setShowComingSoon(true)}
        />
        <MenuItem
          icon={Settings}
          label="Contactar soporte"
          onClick={() => setShowComingSoon(true)}
        />
      </div>

        {/* Logout */}
        <div className="bg-white mb-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="flex-1 text-left text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-16"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <Home size={22} />
          <span className="text-xs">Inicio</span>
        </button>
        <button
          onClick={() => setShowComingSoon(true)}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <BarChart3 size={22} />
          <span className="text-xs">Stats</span>
        </button>
        <button
          onClick={() => navigate('/certification')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <Shield size={22} />
          <span className="text-xs">Certificación</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-[#2E7D32]"
        >
          <User size={22} />
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  );
}
