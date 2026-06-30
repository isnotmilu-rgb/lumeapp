import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, Bot, MessageSquare, Send, ShieldCheck, Upload, Wifi, X } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

const BUYER_QUICK_QUESTIONS = [
  { key: 'buy', label: '🛒 ¿Cómo comprar?' },
  { key: 'near', label: '📍 ¿Cuál está más cerca?' },
  { key: 'cert', label: '🪵 ¿Qué es la certificación?' },
];

const VENDOR_QUICK_QUESTIONS = [
  { key: 'publish', label: '¿Cómo publico mi leña?', icon: Upload },
  { key: 'certify', label: '¿Cómo me certifico?', icon: ShieldCheck },
  { key: 'sales', label: '¿Ver mis ventas?', icon: BarChart3 },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'assistant-welcome',
  role: 'assistant',
  text: '¡Hola! Soy tu Asistente Lume AI 🤖. Te ayudo a comprar leña certificada, comparar vendedores y entender las mediciones.',
};

function buildAssistantReply(input: string, isVendorView: boolean): string {
  const normalized = input.toLowerCase();

  if (isVendorView) {
    if (normalized.includes('public') || normalized.includes('publico') || normalized.includes('lote')) {
      return 'Para publicar tu leña: entra a tu dashboard, conecta el sensor ESP32, valida la lectura y presiona "Certificar y Publicar Lote". Eso actualiza el estado para compradores.';
    }
    if (normalized.includes('certific') || normalized.includes('sensor') || normalized.includes('humedad')) {
      return 'La certificación se activa midiendo humedad con IoT en tiempo real. Si el lote queda bajo 20%, puedes descargar el certificado de calidad LumeApp.';
    }
    if (normalized.includes('venta') || normalized.includes('stats') || normalized.includes('graf')) {
      return 'Puedes revisar tu rendimiento en Stats: historial de mediciones, tendencia de secado y actividad de compradores para tomar mejores decisiones de publicación.';
    }

    return 'Te ayudo a publicar lotes, certificar con sensor IoT y revisar métricas de ventas. Elige una acción rápida y te guío.';
  }

  if (normalized.includes('cerca') || normalized.includes('mapa') || normalized.includes('ubic')) {
    return 'En el mapa puedes ver y filtrar automáticamente las leñerías activas en Temuco. Te recomiendo revisar distancia, stock y humedad para elegir la mejor opción cercana.';
  }

  if (normalized.includes('certific') || normalized.includes('sensor') || normalized.includes('humedad')) {
    return 'La certificación en LumeApp se valida con nuestro sensor IoT en tiempo real. Así confirmamos el porcentaje de humedad del lote antes de publicarlo a compradores.';
  }

  if (normalized.includes('comprar') || normalized.includes('pago') || normalized.includes('checkout')) {
    return 'Para comprar: entra al perfil del vendedor, elige tipo de leña y cantidad, confirma y paga en el checkout simulado. Luego recibirás la confirmación de tu pedido.';
  }

  return 'Puedo ayudarte con compra, cercanía de vendedores, certificación IoT y estado de humedad. Si quieres, te guío paso a paso.';
}

type ChatBotWidgetProps = {
  userType?: 'buyer' | 'vendor' | null;
};

export function ChatBotWidget({ userType }: ChatBotWidgetProps) {
  const isVendorView = userType === 'vendor';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const messageCount = messages.length;
  const quickQuestions = isVendorView ? VENDOR_QUICK_QUESTIONS : BUYER_QUICK_QUESTIONS;

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen) return;
    scrollToBottom();
  }, [isOpen, messageCount, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const pushAssistantReply = (text: string) => {
    setIsTyping(true);
    typingTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: buildAssistantReply(text, isVendorView),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const sendMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text,
      },
    ]);
    setInput('');
    pushAssistantReply(text);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[min(92vw,360px)] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <div className="bg-[#1B5E20] px-4 py-3 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold leading-tight">Asistente Lume AI 🤖</h3>
                <p className="mt-1 text-xs text-[#D7EDDB]">En línea · ¿Cómo puedo ayudarte hoy?</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/90 transition hover:bg-white/15 hover:text-white"
                aria-label="Cerrar asistente"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="h-72 space-y-3 overflow-y-auto bg-[#F8FBF8] px-3 py-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#2E7D32] text-white rounded-br-md'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Wifi size={14} className="animate-pulse" />
                Asistente escribiendo... 💬
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white px-3 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question.key}
                  onClick={() => sendMessage(question.label)}
                  className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {'icon' in question && question.icon ? (
                    <>
                      <question.icon size={12} className="mr-1 inline" />
                      {question.label}
                    </>
                  ) : (
                    question.label
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu mensaje..."
                className="h-10 flex-1 rounded-xl border border-slate-300 px-3 text-sm outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E7D32] text-white transition hover:bg-[#1B5E20] disabled:cursor-not-allowed disabled:bg-[#A5D6A7]"
                aria-label="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex h-14 w-14 items-center justify-center rounded-full bg-[#2E7D32] text-white shadow-xl transition hover:bg-[#1B5E20] ${
          isOpen ? '' : 'animate-bounce'
        }`}
        aria-label="Abrir asistente Lume AI"
      >
        {isOpen ? <X size={22} /> : <Bot size={24} />}
      </button>

      {!isOpen && (
        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1B5E20] shadow">
          <MessageSquare size={12} className="mr-1 inline" />
          Soporte rápido
        </span>
      )}
    </div>
  );
}
