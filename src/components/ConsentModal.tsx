'use client';

import React, { useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 sm:top-5 right-3.5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3 sm:mb-4 pr-8">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-md border border-slate-700/60 shrink-0 flex items-center justify-center">
            <img src="/logo.jpg" alt="Logo IDP" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">Consentimiento Informativo</h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Tratamiento de Datos Pastorales - Iglesia de Dios de la Profecía Aeropuerto</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed custom-scrollbar">
          <p>
            Al completar este formulario y presionar enviar, declaras haber sido informado(a) y autorizas de forma voluntaria a la <strong className="text-white">Iglesia de Dios de la Profecía Aeropuerto</strong> a recopilar y procesar la información personal e información geográfica proporcionada.
          </p>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">
              1. Finalidad Exclusiva
            </h4>
            <p className="text-xs text-slate-300">
              Los datos recolectados (Nombre, DNI, Edad, Teléfono, Correo, Dirección y Ubicación GPS) se utilizarán <strong className="text-white font-semibold">exclusivamente para fines pastorales</strong>, incluyendo la planificación geográfica, organización y apertura de células de crecimiento espiritual en tu sector.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">
              2. Confidencialidad
            </h4>
            <p className="text-xs text-slate-300">
              Tus datos no serán vendidos, cedidos, ni compartidos con terceros ajenos a la estructura pastoral de la iglesia. Quedarán almacenados de manera segura en el sistema oficial.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">
              3. Geolocalización
            </h4>
            <p className="text-xs text-slate-300">
              La latitud y longitud registradas permitirán generar un mapa geográfico para ubicar los sectores con mayor número de familias y planificar células cercanas a tu domicilio.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 sm:pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition shadow-lg shadow-brand-500/20 text-center"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
