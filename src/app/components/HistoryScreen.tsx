import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { vendors } from '../data/vendors';

const vendorHistory = {
  1: {
    name: 'Leñas Boyeco',
    measurements: [
      { date: '11 May 2026', time: '09:41', humidity: 17, species: 'Eucaliptus', verified: true, status: 'Vigente' },
      { date: '10 May 2026', time: '14:22', humidity: 17, species: 'Eucaliptus', verified: true, status: 'Vigente' },
      { date: '07 May 2026', time: '10:15', humidity: 18, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '04 May 2026', time: '16:30', humidity: 19, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '01 May 2026', time: '11:45', humidity: 20, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '28 Abr 2026', time: '09:00', humidity: 18, species: 'Eucaliptus', verified: true, status: 'Expirada' },
    ]
  },
  2: {
    name: 'Maderera Verde',
    measurements: [
      { date: '09 May 2026', time: '15:30', humidity: 21, species: 'Roble', verified: true, status: 'Vigente' },
      { date: '06 May 2026', time: '12:00', humidity: 22, species: 'Roble', verified: true, status: 'Expirada' },
      { date: '03 May 2026', time: '10:45', humidity: 23, species: 'Roble', verified: true, status: 'Expirada' },
    ]
  },
  3: {
    name: 'Juan Rojas',
    measurements: [
      { date: '29 Abr 2026', time: '11:00', humidity: 38, species: 'Coigüe', verified: false, status: 'Expirada' },
      { date: '15 Abr 2026', time: '09:30', humidity: 42, species: 'Coigüe', verified: false, status: 'Expirada' },
    ]
  },
  4: {
    name: 'Leñas del Sur',
    measurements: [
      { date: '07 May 2026', time: '08:00', humidity: 19, species: 'Eucaliptus', verified: true, status: 'Vigente' },
      { date: '04 May 2026', time: '14:00', humidity: 20, species: 'Eucaliptus', verified: true, status: 'Expirada' },
      { date: '01 May 2026', time: '10:15', humidity: 22, species: 'Eucaliptus', verified: true, status: 'Expirada' },
    ]
  },
  5: {
    name: 'Comercial Aromo',
    measurements: [
      { date: '10 May 2026', time: '07:45', humidity: 18, species: 'Aromo', verified: true, status: 'Vigente' },
      { date: '08 May 2026', time: '11:30', humidity: 19, species: 'Aromo', verified: true, status: 'Expirada' },
      { date: '05 May 2026', time: '09:00', humidity: 21, species: 'Aromo', verified: true, status: 'Expirada' },
      { date: '02 May 2026', time: '16:00', humidity: 20, species: 'Aromo', verified: true, status: 'Expirada' },
    ]
  },
  6: {
    name: 'Don Pedro Leña',
    measurements: [
      { date: '02 Abr 2026', time: '13:00', humidity: 45, species: 'Roble', verified: false, status: 'Expirada' },
    ]
  },
  7: {
    name: 'Forestal Cautín',
    measurements: [
      { date: '05 May 2026', time: '09:00', humidity: 23, species: 'Roble', verified: true, status: 'Vigente' },
      { date: '02 May 2026', time: '14:30', humidity: 24, species: 'Roble', verified: true, status: 'Expirada' },
      { date: '28 Abr 2026', time: '10:00', humidity: 22, species: 'Roble', verified: true, status: 'Expirada' },
    ]
  }
};

export function HistoryScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idNum = Number(id);
  const vendor = vendors.find(v => v.id === idNum);
  const history = vendorHistory[idNum as keyof typeof vendorHistory];

  if (!vendor) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p>Vendedor no encontrado</p>
      <button onClick={() => navigate(-1)} className="mt-3 px-3 py-2 bg-[#1B5E20] text-white rounded-lg">Volver</button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBE7]">
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
        <div>
          <h1 className="font-bold">Historial completo</h1>
          <p className="text-[#A5D6A7] text-xs">{vendor.name}</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Info Card */}
        <div className="p-4">
        <div className="bg-[#E8F5E9] border-l-4 border-[#2E7D32] rounded-lg p-4 flex gap-3">
          <Info size={20} className="text-[#2E7D32] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[#1B5E20] mb-1">Sobre la Norma NCh 2965</h3>
            <p className="text-sm text-gray-700">
              Esta norma chilena certifica que la leña con menos de 25% de humedad es considerada seca
              y apta para uso doméstico. Las mediciones son realizadas con dispositivos IoT certificados.
            </p>
          </div>
        </div>
      </div>

        {/* History List */}
        <div className="px-4 pb-4">
          <h2 className="font-bold text-[#1B5E20] mb-3">Todas las mediciones</h2>
          <div className="space-y-2">
            {(history?.measurements ?? []).map((measurement, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-4 border ${
                  measurement.status === 'Vigente' ? 'border-[#2E7D32]' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-[#1B5E20]">{measurement.date}</div>
                    <div className="text-xs text-gray-500">{measurement.time}</div>
                  </div>
                  {measurement.status === 'Vigente' ? (
                    <span className="bg-[#2E7D32] text-white text-xs px-2 py-1 rounded-full">
                      Vigente
                    </span>
                  ) : (
                    <span className="bg-gray-300 text-gray-600 text-xs px-2 py-1 rounded-full">
                      Expirada
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-[#2E7D32]">{measurement.humidity}%</span>
                  <span className="text-sm text-gray-600">{measurement.species}</span>
                </div>

                <div className="bg-[#E8F5E9] rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="bg-[#2E7D32] h-full rounded-full transition-all"
                    style={{ width: `${measurement.humidity}%` }}
                  ></div>
                </div>

                {measurement.verified && (
                  <div className="flex items-center gap-2 text-xs text-[#2E7D32]">
                    <CheckCircle size={14} />
                    <span>Certificado por dispositivo IoT</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
