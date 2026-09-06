'use client';

import React, { useState } from 'react';
import { CensusFormData } from '@/lib/types';
import { StepPersonalData } from './StepPersonalData';
import { StepLocation } from './StepLocation';
import { StepConfirmation } from './StepConfirmation';
import { ThankYouCard } from './ThankYouCard';
import { ChevronLeft, User, MapPin, CheckCircle2 } from 'lucide-react';

interface CensusFormProps {
  onResetToHero?: () => void;
}

const initialFormData: CensusFormData = {
  nombreCompleto: '',
  dni: '',
  edad: '',
  telefono: '',
  correo: '',
  tipoPersona: 'Miembro',
  direccion: '',
  referencia: '',
  distrito: '',
  provincia: '',
  departamento: '',
  latitud: -12.046374,
  longitud: -77.042793,
  consentimiento: false,
};

const STEPS = [
  { num: 1, label: 'Datos Personales', icon: User },
  { num: 2, label: 'Ubicación',        icon: MapPin },
  { num: 3, label: 'Confirmar',        icon: CheckCircle2 },
];

export const CensusForm: React.FC<CensusFormProps> = ({ onResetToHero }) => {
  const [step, setStep]         = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<CensusFormData>(initialFormData);
  const [submitResult, setSubmitResult] = useState<{
    uuid: string; fechaRegistro: string; nombreCompleto: string;
  } | null>(null);

  const updateFormData = (fields: Partial<CensusFormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const handleReset = () => {
    setFormData(initialFormData);
    setSubmitResult(null);
    setStep(1);
    if (onResetToHero) onResetToHero();
  };

  /* ── Stepper progress bar ─────────────────────────────── */
  const StepperBar = () => (
    <div className="mb-4 sm:mb-6 glass-card rounded-2xl p-3 sm:p-4 border border-slate-800/80">
      {/* Step pills row */}
      <div className="flex items-center justify-between">
        {STEPS.map(({ num, label, icon: Icon }, idx) => {
          const done    = step > num;
          const active  = step === num;
          const future  = step < num;
          return (
            <React.Fragment key={num}>
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all
                    ${active  ? 'bg-gradient-to-br from-brand-500 to-amber-500 text-white shadow-lg shadow-brand-500/30 scale-105 sm:scale-110'  : ''}
                    ${done    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : ''}
                    ${future  ? 'bg-slate-800/80 text-slate-500' : ''}
                  `}
                >
                  {done ? '✓' : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
                <span className={`hidden sm:block text-[11px] font-semibold leading-none text-center
                  ${active ? 'text-white' : done ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {label}
                </span>
              </div>

              {/* Connector line (not after last) */}
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 sm:mx-4 rounded-full transition-all
                  ${step > num ? 'bg-emerald-500/60' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile step label */}
      <div className="sm:hidden mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Paso {step} de 3</span>
        <span className="text-amber-400 font-semibold tracking-wide">
          {STEPS[step - 1]?.label ?? ''}
        </span>
      </div>
    </div>
  );

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className="w-full max-w-2xl mx-auto px-0">

      {/* Back to landing link (steps 1-3) */}
      {step < 4 && (
        <button
          onClick={onResetToHero}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white mb-3 sm:mb-4 transition group py-1"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver al inicio
        </button>
      )}

      {/* Stepper header */}
      {step < 4 && <StepperBar />}

      {/* Step panels */}
      {step < 4 && (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 border border-slate-700/60 shadow-2xl">
          {step === 1 && (
            <StepPersonalData
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setStep(2)}
              onBack={onResetToHero}
            />
          )}
          {step === 2 && (
            <StepLocation
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepConfirmation
              formData={formData}
              updateFormData={updateFormData}
              onSubmitSuccess={(res) => {
                setSubmitResult({
                  uuid: res.uuid,
                  fechaRegistro: res.fechaRegistro,
                  nombreCompleto: formData.nombreCompleto,
                });
                setStep(4);
              }}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      )}

      {/* Thank-you screen */}
      {step === 4 && submitResult && (
        <ThankYouCard data={submitResult} onReset={handleReset} />
      )}
    </div>
  );
};
