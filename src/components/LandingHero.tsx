'use client';

import React from 'react';
import {
  MapPin, Users, HeartHandshake, ArrowRight, Clock, ShieldCheck,
} from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl glass-card p-5 sm:p-8 md:p-10 border border-slate-700/60 shadow-2xl">
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 sm:w-80 md:w-96 h-60 sm:h-80 md:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Top Header with Logo & Badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-xl shadow-brand-500/20 border border-slate-700/80 shrink-0 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Logo Iglesia IDP Aeropuerto"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Censo Geográfico Oficial 2026</span>
            </div>
            <span className="block text-[11px] text-slate-400 mt-1 font-medium">
              Iglesia de Dios del Perú — IDP Aeropuerto
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight mb-3 sm:mb-4">
          Unidos para estar más cerca de ti en{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500">
            IDP Aeropuerto
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-2xl">
          Queremos conocer dónde viven nuestros miembros y creyentes para planificar y aperturar nuevas{' '}
          <strong className="text-white font-semibold">células de crecimiento pastoral</strong> más cercanas a tu hogar.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            {
              icon: Clock,
              color: 'brand',
              title: 'Rápido y Fácil',
              desc: 'Toma menos de 3 minutos.',
            },
            {
              icon: Users,
              color: 'amber',
              title: 'Propósito Pastoral',
              desc: 'Para la expansión de células.',
            },
            {
              icon: ShieldCheck,
              color: 'emerald',
              title: 'Datos Seguros',
              desc: 'Tratamiento confidencial.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="flex sm:flex-col md:flex-row items-center sm:items-start md:items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 transition hover:border-slate-700/80"
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  color === 'brand'   ? 'bg-brand-500/20 text-brand-400'   :
                  color === 'amber'   ? 'bg-amber-500/20 text-amber-400'   :
                  'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white leading-snug">{title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1">
          <button
            onClick={onStart}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Iniciar Registro de Censo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <span className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 py-1 text-center sm:text-left">
            <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Bendiciendo a la congregación IDP Aeropuerto</span>
          </span>
        </div>
      </div>
    </div>
  );
};
