import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart3, User, Shield, CheckCircle } from 'lucide-react';
import { useApp } from '../App';

export function CertificationScreen() {
  const navigate = useNavigate();
  const { setShowComingSoon, setCurrentFlow, setCurrentStep } = useApp();
  const [displayHumidity, setDisplayHumidity] = useState(0);

  const certificationData = {
    active: true,
    humidity: 17,
    lastMeasured: '11 May 2026, 09:41',
    species: 'Eucaliptus',
    daysRemaining: 6,
    totalDays: 7,
  };

  // Set flow on mount
  useEffect(() => {
    setCurrentFlow([
      'Abrir pestaña Certificación',
      'Consultar estado actual',
      'Ver humedad certificada: ' + certificationData.humidity + '%',
      'Revisar vigencia: ' + certificationData.daysRemaining + ' días',
      'Ver preview del perfil',
      'Revisar historial de mediciones'
    ]);
    setCurrentStep(1);
  }, [setCurrentFlow, setCurrentStep, certificationData.humidity, certificationData.daysRemaining]);

  // Animate humidity counter from 0 to actual value
  useEffect(() => {
    const targetHumidity = certificationData.humidity;
    const duration = 1500; // 1.5 seconds
    const steps = 30;
    const increment = targetHumidity / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetHumidity) {
        setDisplayHumidity(targetHumidity);
        clearInterval(timer);
      } else {
        setDisplayHumidity(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [certificationData.humidity]);

  const measurements = [
    { date: '11 May 2026', time: '09:41', humidity: 17, species: 'Eucaliptus', verified: true },
    { date: '10 May 2026', time: '14:22', humidity: 17, species: 'Eucaliptus', verified: true },
    { date: '07 May 2026', time: '10:15', humidity: 18, species: 'Eucaliptus', verified: true },
    { date: '04 May 2026', time: '16:30', humidity: 19, species: 'Eucaliptus', verified: true },
  ];

  const showWarning = certificationData.daysRemaining < 2;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-[#F9FBE7]">
      {/* Status Bar */}
      <div className="bg-[#1B5E20] text-white px-4 py-2 flex justify-between items-center text-xs flex-shrink-0">
        <span>9:41</span>
        <span className="font-bold">LumeApp</span>
      </div>

      {/* Top Bar */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex-shrink-0">
        <h1 className="font-bold text-lg">Estado de Certificación</h1>
        <p className="text-[#A5D6A7] text-xs">NCh 2965 · Leñas Boyeco</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Warning Banner */}
        {showWarning && (
          <div className="mx-4 mt-4 bg-[#FFF8E1] border-l-4 border-[#FF8F00] rounded-lg p-4">
            <p className="font-bold text-[#FF8F00] mb-1">⚠️ Tu certificación vence pronto</p>
            <p className="text-sm text-gray-700">
              Mide regularmente para mantener la insignia verde activa
            </p>
          </div>
        )}

        {/* Current Status Card */}
        <div className="p-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-bold text-[#1B5E20]">Certificación actual</h2>
              <span className="bg-[#2E7D32] text-white text-xs px-3 py-1 rounded-full animate-pulse">
                ✓ Activa
              </span>
            </div>

            {/* Humidity Display */}
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-[#2E7D32] mb-1 transition-all">
                {displayHumidity}%
              </div>
              <p className="text-sm text-gray-600">humedad actual</p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Especie:</span>
                <span className="font-medium">{certificationData.species}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última medición:</span>
                <span className="font-medium">{certificationData.lastMeasured}</span>
              </div>
            </div>

            {/* Validity Progress */}
            <div className="bg-[#E8F5E9] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#1B5E20]">Vigencia restante</span>
                <span className="text-lg font-bold text-[#2E7D32]">
                  {certificationData.daysRemaining} días
                </span>
              </div>
              <div className="bg-white rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2E7D32] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(certificationData.daysRemaining / certificationData.totalDays) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Válida hasta el {new Date(Date.now() + certificationData.daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL')}
              </p>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="px-4 pb-4">
          <h3 className="font-bold text-[#1B5E20] mb-3">Cómo te ven los compradores</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-[#E8F5E9]">
            <div className="bg-[#E8F5E9] rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#1B5E20]">Leñas Boyeco</h4>
                <span className="bg-[#2E7D32] text-white text-xs px-2 py-1 rounded-full">
                  ✓ Seca
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Eucaliptus · 15 metros disponibles</p>
              <div className="mb-2">
                <span className="text-gray-700 text-sm">Humedad: </span>
                <span className="text-[#2E7D32] font-bold text-lg">17%</span>
              </div>
              <div className="bg-white rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-[#2E7D32] h-full rounded-full" style={{ width: '17%' }}></div>
              </div>
              <p className="text-xs text-gray-500">Medido hace 2 min · NCh 2965</p>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="px-4 pb-4">
          <h3 className="font-bold text-[#1B5E20] mb-3">Historial de mediciones</h3>
          <div className="space-y-2">
            {measurements.map((measurement, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium">{measurement.date}</div>
                      <div className="text-xs text-gray-500">{measurement.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#2E7D32]">{measurement.humidity}%</div>
                      <div className="text-xs text-gray-600">{measurement.species}</div>
                    </div>
                  </div>
                </div>
                {measurement.verified && <CheckCircle size={16} className="text-[#2E7D32]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-16"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <Home size={24} />
          <span className="text-xs">Inicio</span>
        </button>
        <button
          onClick={() => setShowComingSoon(true)}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <BarChart3 size={24} />
          <span className="text-xs">Stats</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-[#2E7D32]"
        >
          <Shield size={24} />
          <span className="text-xs">Certificación</span>
        </button>
        <button
          onClick={() => navigate('/profile/vendor')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <User size={24} />
          <span className="text-xs">Perfil</span>
        </button>
      </div>
    </div>
  );
}
