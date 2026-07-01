import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Eye, EyeOff, Lock, Mail, Phone, ShoppingBag, Store, User } from 'lucide-react';
import { analyticsService } from '../../services/analytics';

const LOGO_URL = "https://i.imgur.com/Bxwa7aX.png";

type AuthRole = 'buyer' | 'vendor';
type AuthView = 'role' | 'login' | 'register' | 'verify';
const DEMO_USERS_STORAGE_KEY = 'lume_demo_users';
const DEMO_IDENTITY_STORAGE_KEY = 'lume_demo_identity';

interface DemoUser {
  username: string;
  password: string;
  contact: string;
  role: AuthRole;
  createdAt: string;
}

export function Onboarding() {
  const navigate = useNavigate();
  const { setUserType, setCurrentFlow, setCurrentStep } = useApp();
  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(null);
  const [currentView, setCurrentView] = useState<AuthView>('role');
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerContact, setRegisterContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [formError, setFormError] = useState('');
  
  const completeAccess = (role: AuthRole, demoUserId?: string) => {
    analyticsService.trackFlowStep('user_type_selected', 1, 5);
    const resolvedIdentity = demoUserId ?? `demo_${role}`;
    analyticsService.setUser(resolvedIdentity, { user_type: role });
    window.localStorage.setItem(DEMO_IDENTITY_STORAGE_KEY, resolvedIdentity);

    setUserType(role);
    setCurrentFlow(
      role === 'buyer'
        ? ['Seleccionar "Soy comprador"', 'Iniciar sesión o crear cuenta', 'Verificar acceso', 'Ver mapa de vendedores', 'Comprar leña certificada']
        : ['Seleccionar "Soy vendedor"', 'Iniciar sesión o crear cuenta', 'Verificar acceso', 'Ver dashboard', 'Gestionar certificación activa']
    );
    setCurrentStep(1);
    navigate(role === 'buyer' ? '/map' : '/dashboard');
  };

  const persistDemoUser = (user: DemoUser) => {
    const rawUsers = window.localStorage.getItem(DEMO_USERS_STORAGE_KEY);
    const parsedUsers = rawUsers ? JSON.parse(rawUsers) as DemoUser[] : [];
    parsedUsers.push(user);
    window.localStorage.setItem(DEMO_USERS_STORAGE_KEY, JSON.stringify(parsedUsers));
  };

  const handleRoleSelect = (role: AuthRole) => {
    setSelectedRole(role);
    setFormError('');
    setCurrentView('login');
  };

  const handleLogin = () => {
    const normalizedIdentifier = loginIdentifier.trim().toLowerCase();
    const rawUsers = window.localStorage.getItem(DEMO_USERS_STORAGE_KEY);
    const parsedUsers = rawUsers ? JSON.parse(rawUsers) as DemoUser[] : [];
    const matchedUser = parsedUsers.find((user) => {
      const normalizedUsername = user.username.trim().toLowerCase();
      const normalizedContact = user.contact.trim().toLowerCase();
      return normalizedUsername === normalizedIdentifier || normalizedContact === normalizedIdentifier;
    });
    const role: AuthRole =
      normalizedIdentifier === 'camila@lumeapp.cl'
        ? 'vendor'
        : matchedUser?.role ?? selectedRole ?? 'buyer';
    const identity =
      normalizedIdentifier === 'camila@lumeapp.cl'
        ? 'vendedor_camila'
        : matchedUser
          ? `demo_${matchedUser.role}_${matchedUser.username.trim().toLowerCase().replace(/\s+/g, '_')}`
          : (normalizedIdentifier || `demo_${role}_${Date.now()}`);
    setFormError('');
    completeAccess(role, identity);
  };

  const handleRegister = () => {
    if (!registerUsername.trim() || !registerPassword.trim() || !registerContact.trim()) {
      setFormError('Completa todos los campos para enviar el código de verificación');
      return;
    }
    setFormError('');
    setVerificationCode('');
    setCurrentView('verify');
  };

  const handleVerification = () => {
    if (!/^\d{6}$/.test(verificationCode.trim())) {
      setFormError('Ingresa cualquier código numérico de 6 dígitos para continuar.');
      return;
    }

    const role: AuthRole = selectedRole ?? 'buyer';
    const demoCode = verificationCode.trim();
    persistDemoUser({
      username: registerUsername.trim() || `demo_user_${Date.now()}`,
      password: registerPassword.trim() || 'demo1234',
      contact: registerContact.trim() || `demo_${Date.now()}@lumeapp.local`,
      role,
      createdAt: new Date().toISOString(),
    });

    setFormError('');
    completeAccess(role, `demo_${demoCode}_${Date.now()}`);
  };

  const renderAuthHeader = () => (
    <div className="mb-6 text-center">
      <h2 className="text-xl font-bold text-slate-900">
        {currentView === 'login' && 'Iniciar sesión'}
        {currentView === 'register' && 'Crear cuenta'}
        {currentView === 'verify' && 'Confirmar identidad'}
      </h2>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
        {selectedRole === 'buyer' ? 'Acceso comprador' : 'Acceso vendedor'}
      </p>
    </div>
  );

  const roleLabel = selectedRole === 'buyer' ? 'Comprador' : 'Vendedor';

  const goBackToRoleSelection = () => {
    setCurrentView('role');
    setSelectedRole(null);
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-green-950 md:h-screen md:flex md:flex-row md:bg-transparent">
      <div className="hidden md:flex md:w-[45%] bg-emerald-700 items-center justify-center p-10">
        <div className="text-center text-white">
          <div
            style={{
              width: '176px',
              height: '176px',
              borderRadius: '40px',
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.28)',
              margin: '0 auto 24px',
            }}
          >
            <img src={LOGO_URL} alt="LumeApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-wide">LumeApp</h1>
          <p className="mt-4 text-base font-semibold tracking-wide text-white">
            Certificación inteligente para compra y venta segura de leña.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 md:w-[55%] md:bg-slate-50 md:px-10">
      <div className="mx-auto w-full max-w-md px-6 md:px-0">
        <div className="mx-auto flex w-full flex-col rounded-2xl bg-white p-8 shadow-xl md:p-10">
          {currentView === 'role' && (
            <>
              <div className="mb-6 flex flex-col items-center text-center">
                <div
                  className="md:hidden"
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.18)',
                    marginBottom: '16px',
                  }}
                >
                  <img src={LOGO_URL} alt="LumeApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-wide text-slate-900 md:text-2xl">
                  <span className="md:hidden">LumeApp</span>
                  <span className="hidden md:inline">BIENVENIDO / ACCESO SEGURO</span>
                </h1>
                <p className="mt-2 text-sm font-semibold tracking-[0.08em] text-slate-800">
                  <span className="md:hidden uppercase tracking-[0.2em]">Acceso seguro</span>
                  <span className="hidden md:inline">Elige tu perfil para continuar en LumeApp</span>
                </p>
              </div>

              <p className="mb-4 text-center text-base font-semibold text-slate-900">Selecciona cómo quieres acceder</p>
              <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect('buyer')}
                className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all hover:bg-slate-50 md:p-6 md:shadow-md md:hover:shadow-lg active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <ShoppingBag size={38} strokeWidth={1.5} className="flex-shrink-0 text-emerald-700" />
                  <div className="text-left">
                    <div className="text-lg font-bold">Soy Comprador</div>
                    <div className="mt-1 text-sm font-medium text-slate-700">Comprar leña seca certificada y comparar vendedores.</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('vendor')}
                className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-all hover:bg-slate-50 md:p-6 md:shadow-md md:hover:shadow-lg active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <Store size={38} strokeWidth={1.5} className="flex-shrink-0 text-emerald-700" />
                  <div className="text-left">
                    <div className="text-lg font-bold">Soy Vendedor</div>
                    <div className="mt-1 text-sm font-medium text-slate-700">Certificar, publicar y vender lotes de leña con respaldo.</div>
                  </div>
                </div>
              </button>
              </div>
            </>
          )}

          {currentView !== 'role' && (
            <>
              <div className="mb-8 flex flex-col items-center">
                <div
                  className="md:hidden"
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.18)',
                    marginBottom: '16px',
                  }}
                >
                  <img src={LOGO_URL} alt="LumeApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-wide text-green-900">LumeApp</h1>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-800">Acceso seguro</p>
              </div>

              {renderAuthHeader()}

            {currentView === 'login' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Nombre de usuario o correo
                  <div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3">
                    <User size={16} className="text-slate-500" />
                    <input
                      value={loginIdentifier}
                      onChange={(event) => {
                        setLoginIdentifier(event.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none"
                      placeholder="usuario o correo"
                    />
                  </div>
                </label>

                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Contraseña
                  <div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3">
                    <Lock size={16} className="text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(event) => {
                        setLoginPassword(event.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none"
                      placeholder="********"
                    />
                    <button type="button" onClick={() => setShowPassword(value => !value)} className="text-slate-500">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

                <button
                  onClick={handleLogin}
                  className="w-full rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20]"
                >
                  Iniciar Sesión
                </button>

                <button type="button" className="text-sm font-medium text-[#2E7D32] underline">
                  ¿Olvidaste tu contraseña?
                </button>

                <p className="text-center text-sm text-slate-600">
                  ¿Eres nuevo en LumeApp?{' '}
                  <button type="button" onClick={() => { setCurrentView('register'); setFormError(''); }} className="font-semibold text-[#1B5E20] underline">
                    Crea tu usuario aquí
                  </button>
                </p>
              </div>
            )}

            {currentView === 'register' && (
              <div className="space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Nombre de usuario
                  <div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3">
                    <User size={16} className="text-slate-500" />
                    <input
                      value={registerUsername}
                      onChange={(event) => {
                        setRegisterUsername(event.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none"
                      placeholder={`usuario_${roleLabel.toLowerCase()}`}
                    />
                  </div>
                </label>

                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Contraseña
                  <div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3">
                    <Lock size={16} className="text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(event) => {
                        setRegisterPassword(event.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none"
                      placeholder="Tu contraseña segura"
                    />
                    <button type="button" onClick={() => setShowPassword(value => !value)} className="text-slate-500">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Correo electrónico o Número de teléfono
                  <div className="mt-2 flex items-center rounded-xl border border-slate-300 px-3">
                    {registerContact.includes('@') ? <Mail size={16} className="text-slate-500" /> : <Phone size={16} className="text-slate-500" />}
                    <input
                      value={registerContact}
                      onChange={(event) => {
                        setRegisterContact(event.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none"
                      placeholder="correo@dominio.cl o +56912345678"
                    />
                  </div>
                </label>

                {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

                <button
                  onClick={handleRegister}
                  className="w-full rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20]"
                >
                  Enviar código de verificación
                </button>

                <p className="text-center text-sm text-slate-600">
                  <button type="button" onClick={() => { setCurrentView('login'); setFormError(''); }} className="font-semibold text-[#1B5E20] underline">
                    Ya tengo una cuenta, iniciar sesión
                  </button>
                </p>
              </div>
            )}

            {currentView === 'verify' && (
              <div className="space-y-4">
                <p className="rounded-xl bg-[#E8F5E9] px-4 py-3 text-sm text-[#1B5E20]">
                  Hemos enviado un código de 6 dígitos al correo/teléfono ingresado.
                </p>
                <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Código de verificación
                  <input
                    value={verificationCode}
                    onChange={(event) => {
                      setVerificationCode(event.target.value.replace(/[^\d]/g, '').slice(0, 6));
                      if (formError) setFormError('');
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-center text-lg font-semibold tracking-[0.35em] text-slate-900 outline-none transition focus:border-[#0D47A1]"
                    placeholder="123456"
                    inputMode="numeric"
                    maxLength={6}
                  />
                </label>

                {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

                <button
                  onClick={handleVerification}
                  className="w-full rounded-xl bg-[#2E7D32] py-3 text-sm font-bold text-white transition hover:bg-[#1B5E20]"
                >
                  Verificar y Activar Cuenta
                </button>

                <p className="text-center text-sm text-slate-600">
                  <button type="button" onClick={() => { setCurrentView('register'); setFormError(''); }} className="font-semibold text-[#1B5E20] underline">
                    Editar datos de registro
                  </button>
                </p>
              </div>
            )}

            <div className="mt-5 border-t border-slate-200 pt-4 text-center">
              <button
                type="button"
                onClick={goBackToRoleSelection}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-[#1B5E20]"
              >
                Cambiar rol
              </button>
            </div>
            </>
          )}

          <p className="mt-8 text-center text-xs text-slate-500">
            Certificación bajo Norma NCh 2965 · Dispositivo IoT
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
