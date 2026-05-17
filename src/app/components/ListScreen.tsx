import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, List, User, Star, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { vendors } from '../data/vendors';

const AVG_PRICE = 43167;

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star
        key={i}
        size={10}
        className={i <= Math.round(rating)
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-200 fill-gray-200'}
      />
    ))}
    <span className="text-xs text-gray-500 ml-0.5">{rating}</span>
  </div>
);

const PriceTag = ({ price }: { price: number }) => {
  const diff = price - AVG_PRICE;
  const pct = Math.round(Math.abs(diff) / AVG_PRICE * 100);

  if (Math.abs(diff) < 2000) {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-0.5">
        <Minus size={10}/>
        Precio promedio
      </span>
    );
  }

  if (diff < 0) {
    return (
      <span className="text-xs text-[#2E7D32] font-medium flex items-center gap-0.5">
        <TrendingDown size={11}/>
        {pct}% bajo el promedio
      </span>
    );
  }

  return (
    <span className="text-xs text-orange-500 flex items-center gap-0.5">
      <TrendingUp size={11}/>
      {pct}% sobre el promedio
    </span>
  );
};

export function ListScreen() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  const sorted = [...vendors]
    .filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === 'distance'
        ? a.distance - b.distance
        : sortBy === 'price'
          ? a.price - b.price
          : b.rating - a.rating
    );

  return (
    <div className="min-h-screen bg-[#F9FBE7]">
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      <div className="bg-[#2E7D32] text-white px-4 py-4">
        <h1 className="font-bold">Lista de vendedores</h1>

        <p className="text-[#A5D6A7] text-xs mt-1">
          {vendors.filter(v => v.certified).length} certificados · {vendors.length} en total
        </p>
      </div>

      <div className="bg-white px-3 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
        <div className="bg-[#F9FBE7] border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
          <Search size={15} className="text-gray-400"/>

          <input
            type="text"
            placeholder="Buscar vendedor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex gap-2">
          {([
            ['distance','📍 Distancia'],
            ['price','💰 Precio'],
            ['rating','⭐ Calificación']
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sortBy === key
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-[#F9FBE7] text-gray-600 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-3 space-y-3">
        {sorted.map(v => (
          <button
            key={v.id}
            onClick={() => navigate(`/seller/${v.id}`)}
            className="w-full overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition hover:shadow-md text-left"
          >
            <div className="grid gap-4 md:grid-cols-[100px_1fr] p-4">

              {/* FOTO DEL VENDEDOR */}
              <img
                src={v.heroImage}
                alt={`${v.name} preview`}
                className="h-24 w-full rounded-3xl object-cover md:h-24 md:w-24"
              />

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-[#1B5E20] text-sm truncate">
                      {v.name}
                    </h3>

                    {v.certified ? (
                      <span className="rounded-full bg-[#E8F5E9] px-2 py-1 text-[11px] font-semibold text-[#2E7D32]">
                        ✓ Seca
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-600">
                        Sin medición
                      </span>
                    )}
                  </div>

                  <Stars rating={v.rating}/>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                    <span>{v.species}</span>

                    {v.certified && (
                      <span className="text-[#2E7D32] font-medium">
                        {v.humidity}% hum.
                      </span>
                    )}

                    {v.daysAgo !== null && (
                      <span className="text-gray-400">
                        · hace {v.daysAgo === 1 ? '1 día' : `${v.daysAgo} días`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                  <div>
                    <span className="font-semibold text-gray-900">
                      ${v.price.toLocaleString('es-CL')}
                    </span>

                    <span className="ml-1">/m³</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriceTag price={v.price}/>
                    <span>{v.distance} km</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}

        <div className="h-4" />
      </div>

      <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-around items-center flex-shrink-0">
        <button
          onClick={() => navigate('/map')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <MapPin size={24}/>
          <span className="text-xs">Mapa</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
          <List size={24}/>
          <span className="text-xs">Lista</span>
        </button>

        <button
          onClick={() => navigate('/profile/buyer')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <User size={24}/>
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  );
}