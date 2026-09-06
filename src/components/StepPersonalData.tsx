'use client';

import React, { useState } from 'react';
import { User, CreditCard, Calendar, Phone, Mail, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { CensusFormData } from '@/lib/types';

interface StepPersonalDataProps {
  formData: CensusFormData;
  updateFormData: (fields: Partial<CensusFormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const StepPersonalData: React.FC<StepPersonalDataProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [checkingDni, setCheckingDni] = useState(false);

  const validate = async () => {
    const e: Record<string, string> = {};

    if (!formData.nombreCompleto || formData.nombreCompleto.trim().length < 3)
      e.nombreCompleto = 'Ingresa tu nombre completo (mínimo 3 caracteres)';

    if (!formData.dni || !/^\d{8}$/.test(formData.dni.trim()))
      e.dni = 'El DNI debe contener exactamente 8 números';

    const age = Number(formData.edad);
    if (!formData.edad || isNaN(age) || age < 1 || age > 120)
      e.edad = 'Ingresa una edad válida (1–120)';

    if (!formData.telefono || formData.telefono.trim().length < 6)
      e.telefono = 'Ingresa un número de teléfono válido';

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim()))
      e.correo = 'Ingresa un correo electrónico válido';

    if (!formData.tipoPersona)
      e.tipoPersona = 'Selecciona si eres Miembro o Creyente';

    setErrors(e);
    if (Object.keys(e).length > 0) return false;

    // Duplicate DNI check
    setCheckingDni(true);
    try {
      const res  = await fetch(`/api/check-dni?dni=${formData.dni.trim()}`);
      const data = await res.json();
      if (data.exists) {
        setErrors({ dni: `El DNI ${formData.dni} ya se encuentra registrado en el censo.` });
        return false;
      }
    } catch {
      // If endpoint fails, allow proceeding with submission check
    } finally {
      setCheckingDni(false);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validate()) onNext();
  };

  const inputClass = (field: string) =>
    `w-full pl-10 pr-3.5 py-3 sm:py-3 rounded-xl glass-input ${
      errors[field] ? 'border-rose-500/80 ring-1 ring-rose-500/50' : ''
    }`;

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{errors[field]}</span>
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="border-b border-slate-800 pb-3 sm:pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-400 shrink-0" />
          <span>Datos Personales</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Completa tus datos de identificación y contacto para el registro.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Nombre Completo */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Nombre Completo <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 sm:top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Ej. Juan Carlos Pérez Gómez"
              value={formData.nombreCompleto}
              onChange={(e) => updateFormData({ nombreCompleto: e.target.value })}
              className={inputClass('nombreCompleto')}
              autoComplete="name"
            />
          </div>
          <ErrorMsg field="nombreCompleto" />
        </div>

        {/* DNI */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            DNI <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="12345678"
              value={formData.dni}
              onChange={(e) => updateFormData({ dni: e.target.value.replace(/\D/g, '') })}
              className={inputClass('dni')}
            />
          </div>
          <ErrorMsg field="dni" />
        </div>

        {/* Edad */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Edad <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              placeholder="35"
              value={formData.edad}
              onChange={(e) => updateFormData({ edad: e.target.value })}
              className={inputClass('edad')}
            />
          </div>
          <ErrorMsg field="edad" />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Teléfono / Celular <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="tel"
              inputMode="tel"
              placeholder="987654321"
              value={formData.telefono}
              onChange={(e) => updateFormData({ telefono: e.target.value })}
              className={inputClass('telefono')}
              autoComplete="tel"
            />
          </div>
          <ErrorMsg field="telefono" />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Correo Electrónico <span className="text-amber-400">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="email"
              inputMode="email"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={(e) => updateFormData({ correo: e.target.value })}
              className={inputClass('correo')}
              autoComplete="email"
            />
          </div>
          <ErrorMsg field="correo" />
        </div>

        {/* Tipo de persona */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Tipo de Persona <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {(['Miembro', 'Creyente'] as const).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => updateFormData({ tipoPersona: tipo })}
                className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center ${
                  formData.tipoPersona === tipo
                    ? tipo === 'Miembro'
                      ? 'bg-brand-500/20 border-brand-400 text-white shadow-lg shadow-brand-500/10'
                      : 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {tipo === 'Miembro' ? (
                  <UserCheck className={`w-5 h-5 ${formData.tipoPersona === 'Miembro' ? 'text-amber-400' : ''}`} />
                ) : (
                  <User className={`w-5 h-5 ${formData.tipoPersona === 'Creyente' ? 'text-amber-400' : ''}`} />
                )}
                <span className="font-semibold text-xs sm:text-sm">{tipo}</span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {tipo === 'Miembro' ? 'Bautizado / Regular' : 'Simpatizante / Visita'}
                </span>
              </button>
            ))}
          </div>
          <ErrorMsg field="tipoPersona" />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition text-center"
          >
            ← Anterior
          </button>
        )}

        <button
          type="submit"
          disabled={checkingDni}
          className="w-full sm:w-auto sm:ml-auto px-7 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {checkingDni ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Verificando DNI...</>
          ) : (
            'Siguiente →'
          )}
        </button>
      </div>
    </form>
  );
};
