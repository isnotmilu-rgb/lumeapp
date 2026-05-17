import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Droplet,
  Heart,
  Leaf,
  MessageCircle,
  MapPin,
  Package,
  Scissors,
  Share2,
  ShieldCheck,
  Star,
  Tag,
  Wind,
} from 'lucide-react';
import { useApp } from '../App';

const vendors = [
  { id: 1, name: 'Leñas Boyeco', initials: 'LB', humidity: 17, certified: true, species: 'Eucaliptus', available: 15, price: 45000, address: 'Av. Alemania 850, Temuco', lastMeasured: '1 día', rating: 4.9, reviews: 38, daysAgo: 1 },
  { id: 2, name: 'Maderera Verde', initials: 'MV', humidity: 21, certified: true, species: 'Roble', available: 20, price: 52000, address: 'Rudecindo Ortega 234, Temuco', lastMeasured: '2 días', rating: 4.6, reviews: 24, daysAgo: 2 },
  { id: 3, name: 'Juan Rojas', initials: 'JR', humidity: null, certified: false, species: 'Coigüe', available: 10, price: 33000, address: 'Los Boldos 123, Padre Las Casas', lastMeasured: null, rating: 3.8, reviews: 11, daysAgo: null },
  { id: 4, name: 'Leñas del Sur', initials: 'LS', humidity: 19, certified: true, species: 'Eucaliptus', available: 25, price: 48000, address: 'Balmaceda 456, Padre Las Casas', lastMeasured: '3 días', rating: 4.7, reviews: 29, daysAgo: 3 },
  { id: 5, name: 'Comercial Aromo', initials: 'CA', humidity: 18, certified: true, species: 'Aromo', available: 12, price: 41000, address: 'Caupolicán 789, Temuco', lastMeasured: '1 día', rating: 4.8, reviews: 42, daysAgo: 1 },
  { id: 6, name: 'Don Pedro Leña', initials: 'DP', humidity: null, certified: false, species: 'Roble', available: 8, price: 30000, address: 'Las Encinas 321, Padre Las Casas', lastMeasured: null, rating: 3.5, reviews: 7, daysAgo: null },
  { id: 7, name: 'Forestal Cautín', initials: 'FC', humidity: 23, certified: true, species: 'Roble', available: 18, price: 44000, address: 'Ruta 5 Norte km 8, Temuco', lastMeasured: '5 días', rating: 4.5, reviews: 18, daysAgo: 5 },
];

const featureItems = [
  { icon: ShieldCheck, label: 'Cert. NCh 2965' },
  { icon: Wind, label: 'Secado controlado' },
  { icon: Leaf, label: 'Leña seleccionada' },
  { icon: Scissors, label: 'Corte a medida' },
];

export function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(v => v.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(1);

  if (!vendor) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p>Vendedor no encontrado</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const totalPrice = vendor.price * selectedMeters;
  const measurements = [
    { date: '10 May 2026', time: '08:32', humidity: vendor.humidity ?? 26, species: vendor.species, status: (vendor.humidity ?? 26) <= 20 ? 'Óptimo' : 'Aceptable' },
    { date: '07 May 2026', time: '09:15', humidity: vendor.humidity !== null ? vendor.humidity + 1 : 24, species: vendor.species, status: (vendor.humidity ?? 24) <= 20 ? 'Óptimo' : 'Aceptable' },
    { date: '04 May 2026', time: '11:00', humidity: vendor.humidity !== null ? vendor.humidity + 3 : 26, species: vendor.species, status: (vendor.humidity ?? 26) <= 20 ? 'Óptimo' : 'Aceptable' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F7F4', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: 'white', position: 'relative' }}>
        <div
          style={{
            height: 280,
            background: 'linear-gradient(160deg, #071a08 0%, #1B5E20 70%, #2E7D32 100%)',
            borderRadius: '0 0 28px 28px',
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color="#1B5E20" />
            </button>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowComingSoon(true)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Share2 size={18} color="#1B5E20" />
              </button>
              <button
                onClick={() => setShowComingSoon(true)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={18} color="#1B5E20" />
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {vendor.certified && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#2E7D32',
                  color: '#fff',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  width: 'fit-content',
                }}
              >
                <CheckCircle size={14} color="#fff" />
                Proveedor verificado
              </div>
            )}
            <h1 style={{ margin: 0, color: 'white', fontSize: 30, fontWeight: 800, lineHeight: 1.05 }}> {vendor.name} </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              <MapPin size={14} color="rgba(255,255,255,0.8)" />
              <span>{vendor.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#A5D6A7', fontSize: 13 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: '#A5D6A7', display: 'inline-block' }} />
              <span>En línea · Responde rápido</span>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'white',
              borderRadius: 16,
              padding: '8px 14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Star size={16} color="#FBBF24" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 700, color: '#1B5E20' }}>{vendor.rating}</span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>({vendor.reviews} reseñas)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, margin: '-20px 16px 0' }}>
          <div style={{ borderRadius: 16, padding: 14, background: '#E8F5E9', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, lineHeight: 1.4, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>Humedad</span>
              <Droplet size={20} color="#2E7D32" />
            </div>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#1B5E20' }}>{vendor.humidity ?? '—'}%</p>
            <span style={{ display: 'inline-block', marginTop: 10, borderRadius: 10, background: '#2E7D32', color: 'white', padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>Óptimo</span>
          </div>
          <div style={{ borderRadius: 16, padding: 14, background: '#E3F2FD', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, lineHeight: 1.4, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>Precio/m³</span>
              <Tag size={20} color="#1565C0" />
            </div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1565C0' }}>${(vendor.price / 1000).toFixed(0)}k</p>
          </div>
          <div style={{ borderRadius: 16, padding: 14, background: '#F3E5F5', boxShadow: '0 10px 30px rgba(123, 31, 162, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, lineHeight: 1.4, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7280' }}>Stock</span>
              <Package size={20} color="#7B1FA2" />
            </div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#7B1FA2' }}>{vendor.available}m³</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '16px 16px 0', display: 'flex', gap: 8 }} className="no-scrollbar">
          {featureItems.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, border: '1px solid #E5E7EB', background: '#ffffff' }}>
                <Icon size={16} color="#2E7D32" />
                <span style={{ fontSize: 13, color: '#374151' }}>{feature.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ borderRadius: 16, background: 'white', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)', padding: 20 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>¿Cuántos metros necesitas?</p>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
              <button
                onClick={() => setSelectedMeters(m => Math.max(1, m - 1))}
                disabled={selectedMeters <= 1}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  border: `2px solid ${selectedMeters <= 1 ? '#D1D5DB' : '#2E7D32'}`,
                  color: selectedMeters <= 1 ? '#9CA3AF' : '#2E7D32',
                  background: 'white',
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: selectedMeters <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                −
              </button>
              <div style={{ minWidth: 60, textAlign: 'center', fontSize: 40, fontWeight: 800, color: '#111827' }}>{selectedMeters}</div>
              <button
                onClick={() => setSelectedMeters(m => Math.min(vendor.available, m + 1))}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  border: 'none',
                  background: '#2E7D32',
                  color: 'white',
                  fontSize: 22,
                  fontWeight: 700,
                  boxShadow: '0 10px 30px rgba(46, 125, 50, 0.25)',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
            <div style={{ marginTop: 12, borderRadius: 14, background: '#F9FBE7', padding: 14 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>Total estimado</p>
              <p style={{ margin: '8px 0 0', fontSize: 30, fontWeight: 800, color: '#1B5E20' }}>${totalPrice.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Últimas mediciones</h2>
            <button onClick={() => navigate(`/history/${id}`)} style={{ border: 'none', background: 'transparent', color: '#1B5E20', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Ver histórico</button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 12px', }} className="no-scrollbar">
            {measurements.map((measurement, index) => {
              const isOptimal = measurement.humidity <= 20;
              return (
                <div key={index} style={{ minWidth: 130, borderRadius: 14, background: 'white', padding: 14, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)', flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: isOptimal ? '#10B981' : '#F59E0B', marginBottom: 10 }} />
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: isOptimal ? '#047857' : '#B45309' }}>{measurement.humidity}%</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6B7280' }}>{measurement.date}</p>
                  <p style={{ margin: '2px 0 10px', fontSize: 12, color: '#6B7280' }}>{measurement.time}</p>
                  <span style={{ display: 'inline-block', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 700, background: isOptimal ? '#ECFDF5' : '#FFFBEB', color: isOptimal ? '#047857' : '#B45309' }}>{measurement.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ borderRadius: 16, background: 'white', padding: 20, boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: '#111827' }}>{vendor.rating}</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star key={starIndex} size={16} color={starIndex <= Math.round(vendor.rating) ? '#FBBF24' : '#D1D5DB'} />
                  ))}
                </div>
                <p style={{ margin: '10px 0 0', fontSize: 14, color: '#6B7280' }}>({vendor.reviews} reseñas)</p>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ borderRadius: 16, background: '#F8FAFB', padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#4B5563' }}>Servicio rápido y detallado. Leña lista para entrega.</p>
                </div>
                <div style={{ borderRadius: 16, background: '#F8FAFB', padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#4B5563' }}>Respuesta clara, despacho seguro y seguimiento por WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 100 }} />
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 500, padding: '16px 20px', background: 'white', borderTop: '1px solid #E5E7EB', zIndex: 50, boxSizing: 'border-box' }}>
        <button
          onClick={() => {
            setCurrentStep(4);
            const message = `Hola, vi tu leña en LumeApp. Me interesa ${vendor.species} a $${vendor.price.toLocaleString('es-CL')}/m³. ¿Podemos coordinar entrega de ${selectedMeters}m³?`;
            const whatsappUrl = `https://wa.me/56900000000?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          style={{
            width: '100%',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
            padding: '16px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 4px 16px rgba(27,94,32,0.4)',
            cursor: 'pointer',
          }}
        >
          <MessageCircle size={20} />
          Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
}
