'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Search, AlertCircle, Loader2 } from 'lucide-react';
import { CensusFormData, SearchGeocodeResponse } from '@/lib/types';

const DynamicMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[260px] sm:h-[320px] rounded-2xl bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 text-sm">
      Cargando mapa…
    </div>
  ),
});

interface StepLocationProps {
  formData: CensusFormData;
  updateFormData: (fields: Partial<CensusFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [loadingGps,     setLoadingGps]     = useState(false);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [searchResults,  setSearchResults]  = useState<SearchGeocodeResponse[]>([]);
  const [searching,      setSearching]      = useState(false);
  const [errors,         setErrors]         = useState<Record<string, string>>({});

  const lat = Number(formData.latitud)  || -12.046374;
  const lng = Number(formData.longitud) || -77.042793;

  /* Reverse geocode helper */
  const reverseGeocode = async (la: number, lo: number) => {
    setLoadingGeocode(true);
    try {
      const res  = await fetch(`/api/geocode/reverse?lat=${la}&lng=${lo}`);
      const data = await res.json();
      if (data.success && data.data) {
        updateFormData({
          latitud:     la,
          longitud:    lo,
          direccion:   formData.direccion || data.data.address,
          distrito:    data.data.distrito,
          provincia:   data.data.provincia,
          departamento: data.data.departamento,
        });
      } else {
        updateFormData({ latitud: la, longitud: lo });
      }
    } catch {
      updateFormData({ latitud: la, longitud: lo });
    } finally {
      setLoadingGeocode(false);
    }
  };

  /* GPS */
  const handleGps = () => {
    if (!navigator.geolocation) {
      setErrors({ location: 'Tu navegador no soporta geolocalización.' });
      return;
    }
    setLoadingGps(true);
    setErrors({});
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLoadingGps(false);
        reverseGeocode(coords.latitude, coords.longitude);
      },
      () => {
        setLoadingGps(false);
        setErrors({ location: 'No se pudo obtener el GPS. Busca tu dirección manualmente.' });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  /* Address search autocomplete */
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res  = await fetch(`/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) setSearchResults(data.results);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectResult = (item: SearchGeocodeResponse) => {
    updateFormData({
      latitud:      item.lat,
      longitud:     item.lon,
      direccion:    item.address,
      distrito:     item.distrito,
      provincia:    item.provincia,
      departamento: item.departamento,
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  /* Validate & advance */
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!formData.direccion?.trim())    e2.direccion    = 'Ingresa tu dirección';
    if (!formData.distrito?.trim())     e2.distrito     = 'Ingresa el distrito';
    if (!formData.provincia?.trim())    e2.provincia    = 'Ingresa la provincia';
    if (!formData.departamento?.trim()) e2.departamento = 'Ingresa el departamento';
    setErrors(e2);
    if (Object.keys(e2).length === 0) onNext();
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl glass-input text-sm ${errors[field] ? 'border-rose-500' : ''}`;

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{errors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleNext} className="space-y-5">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
          Ubicación Geográfica
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Usa el GPS o busca tu dirección para marcarla en el mapa.
        </p>
      </div>

      {/* GPS & Search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* GPS button */}
        <button
          type="button"
          onClick={handleGps}
          disabled={loadingGps}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition disabled:opacity-50 whitespace-nowrap"
        >
          {loadingGps
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Navigation className="w-4 h-4 text-amber-300" />}
          <span>{loadingGps ? 'Buscando GPS…' : 'Usar mi ubicación'}</span>
        </button>

        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {searching && <Loader2 className="w-4 h-4 animate-spin text-amber-400 absolute right-3.5 top-3.5" />}
          <input
            type="text"
            placeholder="Buscar dirección o calle…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-30 top-full left-0 right-0 mt-2 bg-slate-900/98 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
              {searchResults.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectResult(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-800 border-b border-slate-800/60 last:border-0 transition"
                >
                  <p className="font-semibold text-white text-xs truncate">{item.address}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.displayName}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {errors.location && (
        <p className="text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />{errors.location}
        </p>
      )}

      {/* Map */}
      <div className="relative">
        {loadingGeocode && (
          <div className="absolute inset-0 z-20 bg-slate-950/60 rounded-2xl flex items-center justify-center text-amber-400 text-xs font-semibold gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Geocodificando…
          </div>
        )}
        <DynamicMap lat={lat} lng={lng} onLocationChange={reverseGeocode} />
      </div>

      {/* Address fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Dirección Completa <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Av. Elmer Faucett 123, Mz. A Lt. 5"
            value={formData.direccion}
            onChange={(e) => updateFormData({ direccion: e.target.value })}
            className={inputClass('direccion')}
          />
          <ErrorMsg field="direccion" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Referencia <span className="text-slate-500 font-normal">(Opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Frente al Parque / Al costado del Colegio"
            value={formData.referencia || ''}
            onChange={(e) => updateFormData({ referencia: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Distrito <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Callao"
            value={formData.distrito}
            onChange={(e) => updateFormData({ distrito: e.target.value })}
            className={inputClass('distrito')}
          />
          <ErrorMsg field="distrito" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Provincia <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Callao"
            value={formData.provincia}
            onChange={(e) => updateFormData({ provincia: e.target.value })}
            className={inputClass('provincia')}
          />
          <ErrorMsg field="provincia" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Departamento <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Callao / Lima"
            value={formData.departamento}
            onChange={(e) => updateFormData({ departamento: e.target.value })}
            className={inputClass('departamento')}
          />
          <ErrorMsg field="departamento" />
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
};
