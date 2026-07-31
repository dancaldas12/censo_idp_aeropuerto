'use client';

import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Consentimiento Informativo</h3>
            <p className="text-xs text-slate-400">Tratamiento de Datos Pastorales - IDP Aeropuerto</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
          <p>
            Al completar este formulario y presionar enviar, declaras haber sido informado(a) y autorizas de forma voluntaria a la <strong>Iglesia IDP Aeropuerto</strong> a recopilar y procesar la información personal e información geográfica proporcionada.
          </p>

          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-amber-400">
            1. Finalidad Exclusiva
          </h4>
          <p>
            Los datos recolectados (Nombre, DNI, Edad, Teléfono, Correo, Dirección y Ubicación GPS) se utilizarán <strong>exclusivamente para fines pastorales</strong>, incluyendo la planificación geográfica, organización y apertura de células de crecimiento espiritual en tu sector.
          </p>

          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-amber-400">
            2. Confidencialidad
          </h4>
          <p>
            Tus datos no serán vendidos, cedidos, ni compartidos con terceros ajenos a la estructura pastoral de la iglesia. Quedarán almacenados de manera segura.
          </p>

          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-amber-400">
            3. Geolocalización
          </h4>
          <p>
            La latitud y longitud registradas permitirán generar un mapa geográfico para ubicar los sectores con mayor número de familias y planificar células cercanas a tu domicilio.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition shadow-lg shadow-brand-500/20"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
