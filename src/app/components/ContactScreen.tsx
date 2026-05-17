import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, MapPin } from 'lucide-react';
import { useApp } from '../App';
import { vendors } from '../data/vendors';

export function ContactScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setShowComingSoon, setCurrentStep } = useApp();
  const vendor = vendors.find(v => v.id === Number(id));

  if (!vendor) return (
    <div style={{height:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <p>Vendedor no encontrado</p>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );

  const meters = 3;
  const total = vendor.price * meters;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-[#F9FBE7]">
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span><span className="font-bold">LumeApp</span>
      </div>
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10"><ArrowLeft size={20} /></button>
        <h1 className="font-bold">Contactar vendedor</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Avatar + name */}
        <div className="text-center py-4">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-3 ${vendor.certified ? 'bg-[#2E7D32]' : 'bg-[#FF6F00]'}`}>
            {vendor.initials}
          </div>
          <h2 className="font-bold text-lg text-gray-900">{vendor.name}</h2>
          {vendor.certified
            ? <span className="inline-block mt-1 bg-[#E8F5E9] text-[#1B5E20] text-xs px-3 py-1 rounded-full font-medium">✓ Vendedor certificado</span>
            : <span className="inline-block mt-1 bg-[#FFF3E0] text-[#E65100] text-xs px-3 py-1 rounded-full font-medium">⚠ Sin certificación activa</span>}
        </div>

        {/* Order summary */}
        <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl p-4 mb-4">
          <p className="text-xs text-[#2E7D32] font-bold mb-3 uppercase tracking-wide">Resumen del pedido</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Especie</span><span className="font-medium">{vendor.species}</span></div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Humedad</span>
              <span className={`font-medium ${vendor.certified ? 'text-[#2E7D32]' : 'text-[#FF6F00]'}`}>
                {vendor.certified ? `${vendor.humidity}% ✓ Seca` : 'No verificada'}
              </span>
            </div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Cantidad</span><span className="font-medium">{meters} metros</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Precio/m³</span><span className="font-medium">${vendor.price.toLocaleString('es-CL')}</span></div>
            <div className="flex justify-between border-t border-[#A5D6A7] pt-2 mt-1">
              <span className="font-bold text-gray-800">Total estimado</span>
              <span className="font-bold text-[#1B5E20] text-lg">${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="space-y-3">
          <button
            onClick={() => { setCurrentStep(5); setShowComingSoon(true); }}
            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base shadow-sm"
          >
            <MessageCircle size={20} /> Abrir WhatsApp
          </button>
          <button
            onClick={() => setShowComingSoon(true)}
            className="w-full border-2 border-[#2E7D32] text-[#2E7D32] py-3.5 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Phone size={18} /> Llamar al vendedor
          </button>
          <button
            onClick={() => navigate(`/seller/${id}`)}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm"
          >
            <MapPin size={16} /> Ver perfil completo
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">Dato verificado por dispositivo, no por el vendedor.</p>
      </div>
    </div>
  );
}
