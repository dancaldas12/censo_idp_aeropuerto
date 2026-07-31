'use client';

import React from 'react';
import { CheckCircle, ShieldCheck, Home } from 'lucide-react';

interface ThankYouCardProps {
  data: { uuid: string; fechaRegistro: string; nombreCompleto: string };
  onReset: () => void;
}

export const ThankYouCard: React.FC<ThankYouCardProps> = ({ data, onReset }) => {
  const firstName = data.nombreCompleto.split(' ')[0];

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Almacenado en Google Sheets
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          ¡Gracias, {firstName}!
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Tu registro en el censo geográfico de la <strong>Iglesia IDP Aeropuerto</strong> ha sido
          completado exitosamente. Esta información nos ayudará a planificar células pastorales
          cercanas a tu hogar.
        </p>

        {/* Confirmation details */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1.5 max-w-sm mx-auto text-left">
          <p className="flex justify-between gap-4">
            <span>Fecha de Registro:</span>
            <span className="text-slate-200 font-mono">{data.fechaRegistro}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span>Código de Confirmación:</span>
            <span className="text-slate-200 font-mono">{data.uuid.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        {/* Verse */}
        <div className="p-3 sm:p-4 rounded-2xl bg-brand-950/40 border border-brand-800/40 text-brand-200 text-xs italic max-w-md mx-auto">
          "Y todos los días, en el templo y por las casas, no cesaban de enseñar y predicar a Jesucristo."
          <span className="block not-italic font-semibold mt-1 text-amber-400">— Hechos 5:42</span>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
        >
          <Home className="w-4 h-4" />
          Registrar a otro familiar
        </button>
      </div>
    </div>
  );
};
