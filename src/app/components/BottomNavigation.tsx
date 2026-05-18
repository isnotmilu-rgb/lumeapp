import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { List, MapPin, User } from 'lucide-react';

type NavigationTab = 'map' | 'list' | 'profile' | undefined;

const items: Array<{ key: NavigationTab; label: string; Icon: typeof MapPin; path: string }> = [
  { key: 'map', label: 'Mapa', Icon: MapPin, path: '/map' },
  { key: 'list', label: 'Lista', Icon: List, path: '/list' },
  { key: 'profile', label: 'Perfil', Icon: User, path: '/profile/buyer' },
];

export function BottomNavigation({ activeTab }: { activeTab?: NavigationTab }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-[0_-15px_40px_rgba(15,23,42,0.08)] safe-area-bottom">
      <div className="mx-auto flex max-w-3xl justify-around">
        {items.map((item) => {
          const isActive = item.key !== undefined && activeTab === item.key;
          return (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.96 }}
              className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none ${
                isActive ? 'text-[#1B5E20]' : 'text-gray-400 hover:text-slate-700'
              }`}
            >
              <item.Icon size={24} className={isActive ? 'text-[#1B5E20]' : 'text-gray-400'} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
