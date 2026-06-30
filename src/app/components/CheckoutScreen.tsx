import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle, CreditCard, Loader2, ShieldCheck, Smartphone } from 'lucide-react';

type CheckoutStep = 'method' | 'transbank' | 'processing' | 'success';

interface CheckoutNavigationState {
  vendorName?: string;
  woodType?: string;
  meters?: number;
  quantity?: number;
  unitPrice?: number;
  total?: number;
  totalPrice?: number;
}

const formatCLP = (value: number) => `$${value.toLocaleString('es-CL')}`;

export function CheckoutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = (location.state as CheckoutNavigationState | null) ?? null;
  const [step, setStep] = useState<CheckoutStep>('method');
  const [rut, setRut] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const vendorName = checkoutState?.vendorName ?? 'Leñas Boyeco';
  const woodType = checkoutState?.woodType ?? 'Eucaliptus';
  const meters = checkoutState?.quantity ?? checkoutState?.meters ?? 3;
  const unitPrice = checkoutState?.unitPrice ?? 15000;
  const total = checkoutState?.totalPrice ?? checkoutState?.total ?? unitPrice * meters;

  useEffect(() => {
    if (step !== 'processing') return;
    const timer = window.setTimeout(() => {
      setStep('success');
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [step]);

  const isExpiryValid = (value: string) => {
    const trimmedValue = value.trim();
    const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(trimmedValue);
    if (!expiryMatch) return false;
    const month = Number(expiryMatch[1]);
    return month >= 1 && month <= 12;
  };

  const handlePaymentSubmit = () => {
    const normalizedCardNumber = cardNumber.replace(/[^\d]/g, '');
    const normalizedCvv = cvv.trim();
    const isRutValid = rut.trim().length > 0;
    const isCardValid = /^\d{16}$/.test(normalizedCardNumber);
    const isCvvValid = /^\d{3,4}$/.test(normalizedCvv);
    const isFormValid = isRutValid && isCardValid && isExpiryValid(expiry) && isCvvValid;

    if (!isFormValid) {
      setPaymentError('Por favor, ingresa un número de tarjeta válido de 16 dígitos y completa todos los campos');
      return;
    }

    setPaymentError('');
    setStep('processing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#F5F7F4] p-4 sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[430px] items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="w-full overflow-hidden rounded-[32px] bg-white shadow-[0_35px_90px_rgba(13,71,161,0.22)]">
          <div className="bg-[#0D47A1] px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <button
                onClick={() => (step === 'method' ? navigate(-1) : step === 'success' ? navigate('/map') : setStep('method'))}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">Pasarela segura</p>
                <p className="font-bold">Flow Checkout</p>
              </div>
              <ShieldCheck size={20} className="text-[#BBDEFB]" />
            </div>
          </div>

          <div className="p-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Resumen de compra</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{vendorName}</p>
              <p className="text-sm text-slate-600">{meters} m³ de {woodType}</p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-xs text-slate-500">Total a pagar</span>
                <span className="text-2xl font-bold text-[#0D47A1]">{formatCLP(total)}</span>
              </div>
            </div>

            {step === 'method' && (
              <div className="mt-5 space-y-3">
                <h2 className="text-lg font-bold text-slate-900">Selecciona tu método de pago</h2>
                <button
                  onClick={() => setStep('transbank')}
                  className="w-full rounded-2xl border-2 border-[#0D47A1] bg-[#E3F2FD] p-4 text-left transition hover:bg-[#d5e9ff]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard size={22} className="text-[#0D47A1]" />
                      <div>
                        <p className="font-semibold text-slate-900">Webpay Plus</p>
                        <p className="text-xs text-slate-600">Redcompra / Crédito</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#0D47A1]">Continuar</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-700">MACH</p>
                      <p className="text-xs text-slate-500">Próximamente en LumeApp</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full rounded-2xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar y regresar
                </button>
              </div>
            )}

            {step === 'transbank' && (
              <div className="mt-5 rounded-2xl border border-[#C8E6C9] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Transbank</p>
                    <h2 className="font-bold text-[#1B5E20]">Webpay Plus</h2>
                  </div>
                  <Building2 size={18} className="text-slate-500" />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    RUT del Tarjetahabiente
                    <input
                      value={rut}
                      onChange={(event) => {
                        setRut(event.target.value);
                        if (paymentError) setPaymentError('');
                      }}
                      required
                      placeholder="12.345.678-9"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0D47A1]"
                    />
                  </label>

                  <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                    Número de Tarjeta
                    <input
                      value={cardNumber}
                      onChange={(event) => {
                        setCardNumber(event.target.value);
                        if (paymentError) setPaymentError('');
                      }}
                      required
                      placeholder="1234 5678 1234 5678"
                      inputMode="numeric"
                      maxLength={19}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0D47A1]"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      Vencimiento
                      <input
                        value={expiry}
                        onChange={(event) => {
                          setExpiry(event.target.value);
                          if (paymentError) setPaymentError('');
                        }}
                        required
                        placeholder="MM/AA"
                        inputMode="numeric"
                        maxLength={5}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0D47A1]"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      CVV
                      <input
                        value={cvv}
                        onChange={(event) => {
                          setCvv(event.target.value);
                          if (paymentError) setPaymentError('');
                        }}
                        required
                        placeholder="123"
                        inputMode="numeric"
                        maxLength={4}
                        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#0D47A1]"
                      />
                    </label>
                  </div>
                </div>

                {paymentError && (
                  <p className="mt-4 text-sm font-medium text-red-600">
                    {paymentError}
                  </p>
                )}

                <button
                  onClick={handlePaymentSubmit}
                  className="mt-5 w-full rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20]"
                >
                  Pagar de forma Segura · {formatCLP(total)}
                </button>
              </div>
            )}

            {step === 'processing' && (
              <div className="mt-5 rounded-2xl border border-[#BBDEFB] bg-[#E3F2FD] p-5 text-center">
                <Loader2 size={40} className="mx-auto mb-4 animate-spin text-[#0D47A1]" />
                <h2 className="text-lg font-bold text-[#0D47A1]">Procesando Transacción</h2>
                <p className="mt-3 text-sm text-slate-700">
                  Procesando Transacción. Conectando con los servidores seguros de Transbank y tu banco emisor.
                  Por favor, no cierres ni recargues esta pestaña.
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Pago en curso · {formatCLP(total)}
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="mt-5 rounded-2xl border border-[#C8E6C9] bg-[#F1F8E9] p-6 text-center">
                <CheckCircle size={64} className="mx-auto mb-4 text-[#2E7D32]" />
                <h2 className="text-2xl font-bold text-[#1B5E20]">¡Pago Aprobado Exitosamente!</h2>
                <p className="mt-3 text-sm text-slate-700">
                  Tu pedido de leña ha sido procesado de forma segura a través de Flow.
                </p>

                <div className="mt-5 rounded-xl border border-[#A5D6A7] bg-white p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Resumen del pedido</p>
                  <p className="mt-2 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Vendedor:</span> {vendorName}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Cantidad:</span> {meters} m³
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Total pagado:</span> {formatCLP(total)}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/map')}
                  className="mt-6 mx-auto w-full max-w-[260px] rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20]"
                >
                  Volver al Inicio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
