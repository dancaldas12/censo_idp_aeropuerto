'use client';

import React from 'react';
import {
  MapPin, Users, HeartHandshake, ArrowRight, Clock, ShieldCheck, Church,
} from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl glass-card p-6 sm:p-10 border border-slate-700/60">
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-5">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Censo Geográfico Oficial 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Unidos para estar más cerca de ti en{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500">
            IDP Aeropuerto
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
          Queremos conocer dónde viven nuestros miembros y creyentes para planificar y aperturar nuevas{' '}
          <strong>células de crecimiento pastoral</strong> más cercanas a tu hogar.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80"
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
              <div>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-bold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Iniciar Registro de Censo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
            Bendiciendo a la congregación IDP Aeropuerto
          </span>
        </div>
      </div>
    </div>
  );
};
