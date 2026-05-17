import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: '¿Cómo sé que la leña está seca?',
    answer: 'Todos los vendedores certificados en LumeApp utilizan un dispositivo IoT que mide la humedad de la leña en tiempo real. La medición se realiza según la Norma NCh 2965, que certifica que la leña con menos de 25% de humedad es apta para uso doméstico.'
  },
  {
    question: '¿Quién mide la humedad?',
    answer: 'El vendedor utiliza un dispositivo de medición certificado que envía los datos directamente a nuestra plataforma. Esto elimina la posibilidad de manipulación manual de los datos y garantiza transparencia.'
  },
  {
    question: '¿Es gratis para el comprador?',
    answer: 'Sí, LumeApp es completamente gratuita para los compradores. No cobramos comisiones ni tarifas por contactar vendedores. Solo pagamos el precio acordado directamente al vendedor.'
  },
  {
    question: '¿Qué significa la insignia verde?',
    answer: 'La insignia verde ✓ Seca indica que el vendedor ha medido su leña en los últimos 7 días y que la humedad está por debajo del 25%, cumpliendo con la Norma NCh 2965 para leña seca.'
  },
  {
    question: '¿Qué pasa si la leña llega húmeda?',
    answer: 'Si compraste leña de un vendedor certificado y llega con más humedad de la indicada, puedes reportarlo en la app. Verificaremos la medición original y tomaremos medidas, incluyendo la posible suspensión del vendedor.'
  },
];

export function FAQScreen() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="h-[820px] flex flex-col bg-[#F9FBE7] overflow-hidden">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">Preguntas Frecuentes</h1>
      </div>

      {/* FAQ List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ WebkitOverflowScrolling: 'touch' }}>
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#E8F5E9] transition-colors"
            >
              <span className="font-medium text-[#1B5E20] text-left pr-2">{faq.question}</span>
              <ChevronDown
                size={20}
                className={`text-[#2E7D32] transition-transform flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-sm text-gray-700 border-t border-gray-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
