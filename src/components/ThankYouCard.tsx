'use client';

import React from 'react';
import { CheckCircle, ShieldCheck, Home } from 'lucide-react';

interface ThankYouCardProps {
  data: { uuid: string; fechaRegistro: string; nombreCompleto: string };
  onReset: () => void;
}

export const ThankYouCard: React.FC<ThankYouCardProps> = ({ data, onReset }) => {
  const firstName = data.nombreCompleto.split(' ')[0] || 'Hermano(a)';

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 text-center border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4 sm:space-y-5">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-1 shadow-md border border-slate-700/60 shrink-0">
            <img src="/logo.jpg" alt="Logo IDP" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Almacenado con éxito</span>
          </div>
        </div>

        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          ¡Gracias, {firstName}!
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Tu registro en el censo geográfico de la <strong className="text-white">Iglesia IDP Aeropuerto</strong> ha sido
          completado exitosamente. Esta información nos permitirá organizar y aperturar células pastorales
          más cercanas a tu hogar.
        </p>

        {/* Confirmation details */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1.5 max-w-sm mx-auto text-left">
          <p className="flex justify-between items-center gap-3">
            <span>Fecha de Registro:</span>
            <span className="text-slate-200 font-mono font-semibold">{data.fechaRegistro}</span>
          </p>
          <p className="flex justify-between items-center gap-3">
            <span>Código de Confirmación:</span>
            <span className="text-amber-400 font-mono font-bold tracking-wider">{data.uuid.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        {/* Verse */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-950/40 border border-brand-800/40 text-brand-200 text-xs italic max-w-md mx-auto leading-relaxed">
          "Y todos los días, en el templo y por las casas, no cesaban de enseñar y predicar a Jesucristo."
          <span className="block not-italic font-semibold mt-1 text-amber-400">— Hechos 5:42</span>
        </div>

        <div className="pt-2">
          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Registrar a otro familiar o volver</span>
          </button>
        </div>
      </div>
    </div>
  );
};
