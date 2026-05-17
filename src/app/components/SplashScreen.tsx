import { useEffect, useState } from 'react';

const LOGO_URL = "https://i.imgur.com/Bxwa7aX.png";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    const t3 = setTimeout(() => onFinish(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      className="h-[820px] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0d3d11 0%, #1B5E20 50%, #2E7D32 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Glow rings */}
      <div className="relative flex items-center justify-center">
        <div
          style={{
            position: 'absolute',
            width: '220px', height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(46,125,50,0.35) 0%, transparent 70%)',
            transform: phase === 'show' ? 'scale(1.4)' : 'scale(0.8)',
            transition: 'transform 1.2s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '160px', height: '160px',
            borderRadius: '50%',
            background: 'rgba(165,214,167,0.15)',
            transform: phase === 'show' ? 'scale(1.6)' : 'scale(1)',
            opacity: phase === 'show' ? 0 : 1,
            transition: 'transform 1.5s ease, opacity 1.5s ease',
          }}
        />

        {/* Logo */}
        <div
          style={{
            width: '140px', height: '140px',
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(165,214,167,0.4), 0 8px 32px rgba(0,0,0,0.4)',
            transform: phase === 'enter' ? 'scale(0.4)' : phase === 'show' ? 'scale(1)' : 'scale(1.05)',
            opacity: phase === 'enter' ? 0 : 1,
            transition: 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
          }}
        >
          <img src={LOGO_URL} alt="LumeApp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* App name */}
      <div
        style={{
          marginTop: '36px',
          opacity: phase === 'show' ? 1 : 0,
          transform: phase === 'show' ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 800, letterSpacing: '2px', margin: 0 }}>
          LumeApp
        </h1>
        <p style={{ color: '#A5D6A7', fontSize: '11px', letterSpacing: '3px', marginTop: '6px', textTransform: 'uppercase', margin: '6px 0 0 0' }}>
          Leña seca certificada
        </p>
      </div>

      {/* Location */}
      <p
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '11px',
          marginTop: '48px',
          letterSpacing: '1px',
          opacity: phase === 'show' ? 1 : 0,
          transition: 'opacity 0.6s ease 0.6s',
        }}
      >
        Temuco · Padre Las Casas
      </p>
    </div>
  );
}
