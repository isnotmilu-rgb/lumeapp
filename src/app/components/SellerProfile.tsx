import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
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
  { id: 1, name: 'Leñas Boyeco', initials: 'LB', humidity: 17, certified: true, species: 'Eucaliptus', available: 15, price: 45000, address: 'Av. Alemania 850, Temuco', rating: 4.9, reviews: 38 },
  { id: 2, name: 'Maderera Verde', initials: 'MV', humidity: 21, certified: true, species: 'Roble', available: 20, price: 52000, address: 'Rudecindo Ortega 234, Temuco', rating: 4.6, reviews: 24 },
  { id: 3, name: 'Juan Rojas', initials: 'JR', humidity: null, certified: false, species: 'Coigüe', available: 10, price: 33000, address: 'Los Boldos 123, Padre Las Casas', rating: 3.8, reviews: 11 },
  { id: 4, name: 'Leñas del Sur', initials: 'LS', humidity: 19, certified: true, species: 'Eucaliptus', available: 25, price: 48000, address: 'Balmaceda 456, Padre Las Casas', rating: 4.7, reviews: 29 },
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
  const vendor = vendors.find(vendor => vendor.id === Number(id));
  const [selectedMeters, setSelectedMeters] = useState(1);

  if (!vendor) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7F4', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#111827', fontSize: 16, fontWeight: 600 }}>Vendedor no encontrado</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: 16,
              border: 'none',
              borderRadius: 12,
              background: '#1B5E20',
              color: 'white',
              padding: '12px 20px',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = vendor.price * selectedMeters;
  const measurements = [
    {
      date: '10 May 2026',
      time: '08:32',
      humidity: vendor.humidity ?? 23,
      status: (vendor.humidity ?? 23) <= 20 ? 'Óptimo' : 'Aceptable',
    },
    {
      date: '07 May 2026',
      time: '09:15',
      humidity: vendor.humidity !== null ? vendor.humidity + 1 : 24,
      status: (vendor.humidity !== null ? vendor.humidity + 1 : 24) <= 20 ? 'Óptimo' : 'Aceptable',
    },
    {
      date: '04 May 2026',
      time: '11:00',
      humidity: vendor.humidity !== null ? vendor.humidity + 2 : 26,
      status: (vendor.humidity !== null ? vendor.humidity + 2 : 26) <= 20 ? 'Óptimo' : 'Aceptable',
    },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F7F4', display: 'flex', justifyContent: 'center', paddingBottom: 120 }}>
      <div style={{ width: '100%', maxWidth: 560, position: 'relative', boxSizing: 'border-box', paddingTop: 16 }}>
        <div style={{ background: '#FFFFFF', borderRadius: 28, boxShadow: '0 30px 80px rgba(15, 23, 42, 0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: 300,
              background: 'linear-gradient(180deg, #071a08 0%, #1B5E20 60%, #2E7D32 100%)',
              display: 'flex',
              flexDirection: 'column',
              padding: 20,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
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
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Heart size={18} color="#1B5E20" />
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {vendor.certified && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#2E7D32',
                    color: 'white',
                    borderRadius: 20,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    width: 'fit-content',
                  }}
                >
                  <CheckCircle size={14} color="white" />
                  Proveedor verificado
                </div>
              )}

              <h1 style={{ margin: 0, color: 'white', fontSize: 28, fontWeight: 800, lineHeight: 1.05 }}>{vendor.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
                <MapPin size={14} color="rgba(255,255,255,0.85)" />
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
                bottom: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'white',
                borderRadius: 14,
                padding: '8px 12px',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.16)',
              }}
            >
              <Star size={16} color="#FBBF24" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1B5E20' }}>{vendor.rating}</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>({vendor.reviews} reseñas)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, padding: 16 }}>
            <div style={{ borderRadius: 16, padding: 14, background: '#E8F5E9', boxShadow: '0 16px 40px rgba(16, 185, 129, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563' }}>Humedad</span>
                <Droplet size={20} color="#2E7D32" />
              </div>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#1B5E20' }}>{vendor.humidity ?? '—'}%</p>
              <span style={{ display: 'inline-flex', marginTop: 12, borderRadius: 10, background: '#2E7D32', color: 'white', padding: '5px 10px', fontSize: 11, fontWeight: 700 }}>Óptimo</span>
            </div>

            <div style={{ borderRadius: 16, padding: 14, background: '#E3F2FD', boxShadow: '0 16px 40px rgba(59, 130, 246, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563' }}>Precio/m³</span>
                <Tag size={20} color="#1565C0" />
              </div>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1565C0' }}>${(vendor.price / 1000).toFixed(0)}k</p>
            </div>

            <div style={{ borderRadius: 16, padding: 14, background: '#F3E5F5', boxShadow: '0 16px 40px rgba(123, 31, 162, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563' }}>Stock</span>
                <Package size={20} color="#7B1FA2" />
              </div>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#7B1FA2' }}>{vendor.available}m³</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto', padding: '0 16px', display: 'flex', gap: 10, marginBottom: 16 }} className="no-scrollbar">
            {featureItems.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 20,
                    border: '1px solid #E5E7EB',
                    background: 'white',
                  }}
                >
                  <Icon size={16} color="#2E7D32" />
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{feature.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ borderRadius: 16, background: 'white', padding: 20, boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>¿Cuántos metros necesitas?</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 24 }}>
                <button
                  onClick={() => setSelectedMeters(value => Math.max(1, value - 1))}
                  disabled={selectedMeters <= 1}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    border: `2px solid ${selectedMeters <= 1 ? '#D1D5DB' : '#2E7D32'}`,
                    background: 'white',
                    color: selectedMeters <= 1 ? '#9CA3AF' : '#2E7D32',
                    fontSize: 24,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: selectedMeters <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  −
                </button>
                <div style={{ minWidth: 60, textAlign: 'center', fontSize: 40, fontWeight: 800, color: '#111827' }}>{selectedMeters}</div>
                <button
                  onClick={() => setSelectedMeters(value => Math.min(vendor.available, value + 1))}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    border: 'none',
                    background: '#2E7D32',
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(46, 125, 50, 0.24)',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
              <div style={{ marginTop: 16, borderRadius: 16, background: '#F9FBE7', padding: 16 }}>
                <p style={{ margin: 0, color: '#6B7280', fontSize: 13 }}>Total estimado</p>
                <p style={{ margin: '8px 0 0', fontSize: 30, fontWeight: 800, color: '#1B5E20' }}>${totalPrice.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Últimas mediciones</h2>
              <button
                onClick={() => navigate(`/history/${id}`)}
                style={{ border: 'none', background: 'transparent', color: '#1B5E20', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Ver histórico
              </button>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }} className="no-scrollbar">
              {measurements.map((measurement, index) => {
                const isOptimal = measurement.status === 'Óptimo';
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: 130,
                      borderRadius: 14,
                      background: 'white',
                      padding: 14,
                      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: isOptimal ? '#10B981' : '#F59E0B', marginBottom: 10 }} />
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: isOptimal ? '#047857' : '#B45309' }}>{measurement.humidity}%</p>
                    <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6B7280' }}>{measurement.date}</p>
                    <p style={{ margin: '4px 0 10px', fontSize: 12, color: '#6B7280' }}>{measurement.time}</p>
                    <span
                      style={{
                        display: 'inline-flex',
                        borderRadius: 8,
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        background: isOptimal ? '#ECFDF5' : '#FFFBEB',
                        color: isOptimal ? '#047857' : '#B45309',
                      }}
                    >
                      {measurement.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ borderRadius: 16, background: 'white', padding: 20, boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: '#111827' }}>{vendor.rating}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map(index => (
                      <Star key={index} size={16} color={index <= Math.round(vendor.rating) ? '#FBBF24' : '#D1D5DB'} />
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
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 560, padding: '16px 20px', background: 'white', borderTop: '1px solid #E5E7EB', boxSizing: 'border-box', zIndex: 50 }}>
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
