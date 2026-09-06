'use client';

import React, { useState } from 'react';
import {
  CheckCircle2, User, MapPin, ShieldCheck, AlertCircle,
  Loader2, ExternalLink, Info,
} from 'lucide-react';
import { CensusFormData } from '@/lib/types';
import { ConsentModal } from './ConsentModal';

interface StepConfirmationProps {
  formData: CensusFormData;
  updateFormData: (fields: Partial<CensusFormData>) => void;
  onSubmitSuccess: (data: { uuid: string; fechaRegistro: string }) => void;
  onBack: () => void;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  formData,
  updateFormData,
  onSubmitSuccess,
  onBack,
}) => {
  const [submitting,      setSubmitting]      = useState(false);
  const [errorMessage,    setErrorMessage]    = useState<string | null>(null);
  const [showConsent,     setShowConsent]     = useState(false);
  const [consentError,    setConsentError]    = useState(false);

  const mapsUrl = `https://www.google.com/maps?q=${formData.latitud},${formData.longitud}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setConsentError(false);

    if (!formData.consentimiento) { setConsentError(true); return; }

    setSubmitting(true);
    try {
      const res  = await fetch('/api/census', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Error al guardar los datos en Google Sheets');
        return;
      }
      onSubmitSuccess(data.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error de conexión. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Small helper to render labelled field ── */
  const Field = ({ label, value, className = '' }: { label: string; value?: string | number; className?: string }) =>
    value ? (
      <div className={className}>
        <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">{label}</span>
        <span className="font-semibold text-white text-xs sm:text-sm break-words">{value}</span>
      </div>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="border-b border-slate-800 pb-3 sm:pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Confirmación y Envío</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Por favor revisa que tus datos sean correctos antes de enviarlos.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white">No se pudo completar el registro</h4>
            <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Summary card */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3.5 sm:p-5 space-y-4 sm:space-y-5">
        {/* Personal data */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-2.5">
            <User className="w-3.5 h-3.5" /> Datos Personales
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            <div className="col-span-2 sm:col-span-3">
              <Field label="Nombre Completo" value={formData.nombreCompleto} />
            </div>
            <Field label="DNI"            value={formData.dni} />
            <Field label="Edad"           value={`${formData.edad} años`} />
            <div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">Tipo</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {formData.tipoPersona}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Field label="Teléfono"  value={formData.telefono} />
            </div>
            <div className="col-span-2">
              <Field label="Correo"    value={formData.correo} />
            </div>
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* Location */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-2.5">
            <MapPin className="w-3.5 h-3.5" /> Ubicación
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            <div className="col-span-2 sm:col-span-3">
              <Field label="Dirección" value={formData.direccion} />
            </div>
            {formData.referencia && (
              <div className="col-span-2 sm:col-span-3">
                <Field label="Referencia" value={formData.referencia} />
              </div>
            )}
            <Field label="Distrito"     value={formData.distrito} />
            <Field label="Provincia"    value={formData.provincia} />
            <div className="col-span-2 sm:col-span-1">
              <Field label="Departamento" value={formData.departamento} />
            </div>
            <div className="col-span-2 sm:col-span-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 mt-1">
              <span className="text-xs text-slate-300 font-mono truncate">
                📍 {Number(formData.latitud).toFixed(5)}, {Number(formData.longitud).toFixed(5)}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold whitespace-nowrap self-end xs:self-auto"
              >
                <span>Ver en Google Maps</span> <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Consent checkbox */}
      <div className={`p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border ${consentError ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-slate-800'}`}>
        <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.consentimiento}
            onChange={(e) => {
              updateFormData({ consentimiento: e.target.checked });
              if (e.target.checked) setConsentError(false);
            }}
            className="mt-0.5 w-5 h-5 rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-brand-400 focus:ring-offset-slate-900 shrink-0 cursor-pointer"
          />
          <span className="text-xs sm:text-xs text-slate-300 leading-relaxed flex-1">
            Acepto el uso de mis datos exclusivamente para fines pastorales y la planificación de células de{' '}
            <strong className="text-white">IDP Aeropuerto</strong>.{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowConsent(true);
              }}
              className="text-amber-400 underline font-semibold hover:text-amber-300 inline-flex items-center gap-0.5 ml-1"
            >
              Leer términos <Info className="w-3 h-3" />
            </button>
          </span>
        </label>
        {consentError && (
          <p className="text-xs text-rose-400 mt-2 flex items-center gap-1 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Debes aceptar el consentimiento para continuar con el registro.</span>
          </p>
        )}
      </div>

      <ConsentModal isOpen={showConsent} onClose={() => setShowConsent(false)} />

      {/* Navigation */}
      <div className="pt-2 sm:pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition disabled:opacity-50 text-center"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto sm:ml-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 text-center active:scale-[0.98]"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando registro…</>
          ) : (
            <><ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> Confirmar y Enviar</>
          )}
        </button>
      </div>
    </form>
  );
};
