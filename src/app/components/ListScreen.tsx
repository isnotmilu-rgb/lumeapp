import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, List, User, Star, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { vendors } from '../data/vendors';

const AVG_PRICE = 43167;

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={10} className={i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
    ))}
    <span className="text-xs text-gray-500 ml-0.5">{rating}</span>
  </div>
);

const PriceTag = ({ price }: { price: number }) => {
  const diff = price - AVG_PRICE;
  const pct = Math.round(Math.abs(diff) / AVG_PRICE * 100);
  if (Math.abs(diff) < 2000) return <span className="text-xs text-gray-400 flex items-center gap-0.5"><Minus size={10}/> Precio promedio</span>;
  if (diff < 0) return <span className="text-xs text-[#2E7D32] font-medium flex items-center gap-0.5"><TrendingDown size={11}/> {pct}% bajo el promedio</span>;
  return <span className="text-xs text-orange-500 flex items-center gap-0.5"><TrendingUp size={11}/> {pct}% sobre el promedio</span>;
};

export function ListScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'distance'|'price'|'rating'>('distance');

  const sorted = [...vendors]
    .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'distance' ? a.distance - b.distance : sortBy === 'price' ? a.price - b.price : b.rating - a.rating);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-[#F9FBE7]">
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span><span className="font-bold">LumeApp</span>
      </div>
      <div className="bg-[#2E7D32] text-white px-4 py-3 flex-shrink-0">
        <h1 className="font-bold">Lista de vendedores</h1>
        <p className="text-[#A5D6A7] text-xs">{vendors.filter(v => v.certified).length} certificados · {vendors.length} en total</p>
      </div>

      <div className="bg-white px-3 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
        <div className="bg-[#F9FBE7] border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
          <Search size={15} className="text-gray-400"/>
          <input type="text" placeholder="Buscar vendedor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 bg-transparent text-sm outline-none"/>
        </div>
        <div className="flex gap-2">
          {([['distance','📍 Distancia'],['price','💰 Precio'],['rating','⭐ Calificación']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setSortBy(key)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${sortBy === key ? 'bg-[#2E7D32] text-white' : 'bg-[#F9FBE7] text-gray-600 border border-gray-200'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ WebkitOverflowScrolling: 'touch' }}>
        {sorted.map(v => (
          <button key={v.id} onClick={() => navigate(`/seller/${v.id}`)} className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${v.certified ? 'bg-[#2E7D32]' : 'bg-orange-400'}`}>{v.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-bold text-[#1B5E20] text-sm truncate">{v.name}</h3>
                  {v.certified
                    ? <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-1">✓ Seca</span>
                    : <span className="bg-orange-50 text-orange-500 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-1">Sin medición</span>
                  }
                </div>
                <Stars rating={v.rating}/>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{v.species}</span>
                  {v.certified && <span className="text-[#2E7D32] font-medium">{v.humidity}% hum.</span>}
                  {v.daysAgo !== null && <span className="text-gray-400">· hace {v.daysAgo === 1 ? '1 día' : `${v.daysAgo} días`}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between mt-3 pt-2 border-t border-gray-50">
              <div>
                <span className="text-base font-bold text-gray-800">${v.price.toLocaleString('es-CL')}</span>
                <span className="text-xs text-gray-500">/m³</span>
              </div>
              <div className="flex items-center gap-3">
                <PriceTag price={v.price}/>
                <span className="text-xs text-gray-400">{v.distance} km</span>
              </div>
            </div>
          </button>
        ))}
        <div className="h-4"/>
      </div>

      <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-around items-center flex-shrink-0">
        <button onClick={() => navigate('/map')} className="flex flex-col items-center gap-1 text-gray-400"><MapPin size={24}/><span className="text-xs">Mapa</span></button>
        <button className="flex flex-col items-center gap-1 text-[#2E7D32]"><List size={24}/><span className="text-xs">Lista</span></button>
        <button onClick={() => navigate('/profile/buyer')} className="flex flex-col items-center gap-1 text-gray-400"><User size={24}/><span className="text-xs">Perfil</span></button>
      </div>
    </div>
  );
}