import { useNavigate } from 'react-router-dom';
import { MapPin, List, User, ChevronRight, User as UserIcon, ShoppingBag, Heart, Settings, HelpCircle, LogOut, Globe, Bell, Shield, Users } from 'lucide-react';
import { useApp } from '../App';

export function BuyerProfileScreen() {
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
    <div className="h-[820px] flex flex-col bg-[#F9FBE7] overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex-shrink-0">
        <h1 className="font-bold text-lg">Mi Perfil</h1>
        <p className="text-[#A5D6A7] text-xs">Comprador</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Profile Header */}
        <div className="bg-white p-6 mb-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-2xl font-bold">
              JM
            </div>
            <div>
              <h2 className="font-bold text-lg">José Muñoz</h2>
              <p className="text-sm text-gray-600">Temuco, Chile</p>
            </div>
          </div>
        </div>

        {/* Mi Cuenta */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-[#1B5E20]">Mi cuenta</h3>
          </div>
          <MenuItem
            icon={UserIcon}
            label="Editar perfil"
              onClick={() => setShowComingSoon(true)}
          />
        </div>

        {/* Mis Compras */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-[#1B5E20]">Mis compras</h3>
          </div>
          <MenuItem
            icon={ShoppingBag}
            label="Historial de compras"
              onClick={() => setShowComingSoon(true)}
          />
        </div>

        {/* Favoritos */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-[#1B5E20]">Favoritos</h3>
          </div>
          <MenuItem
            icon={Heart}
            label="Vendedores guardados"
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
            icon={Globe}
            label="Idioma"
              onClick={() => setShowComingSoon(true)}
          />
          <MenuItem
            icon={Shield}
            label="Privacidad"
              onClick={() => setShowComingSoon(true)}
          />
          <MenuItem
            icon={Users}
            label="Cambiar tipo de usuario"
              onClick={handleLogout}
          />
        </div>

        {/* Ayuda */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-[#1B5E20]">Ayuda</h3>
          </div>
          <MenuItem
            icon={HelpCircle}
            label="Preguntas frecuentes"
              onClick={() => navigate('/faq')}
          />
          <MenuItem
            icon={Settings}
            label="Cómo funciona LumeApp"
              onClick={() => navigate('/how-it-works')}
          />
          <MenuItem
            icon={HelpCircle}
            label="Contactar soporte"
              onClick={() => setShowComingSoon(true)}
          />
          <MenuItem
            icon={Settings}
            label="Términos y condiciones"
              onClick={() => setShowComingSoon(true)}
          />
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-16"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-around items-center flex-shrink-0">
        <button
          onClick={() => navigate('/map')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <MapPin size={24} />
          <span className="text-xs">Mapa</span>
        </button>
        <button
          onClick={() => navigate('/list')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <List size={24} />
          <span className="text-xs">Lista</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-[#2E7D32]"
        >
          <User size={24} />
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  );
}
