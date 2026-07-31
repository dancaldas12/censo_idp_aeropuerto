'use client';

import React, { useState, useRef } from 'react';
import { LandingHero } from '@/components/LandingHero';
import { CensusForm } from '@/components/CensusForm';

type AppView = 'landing' | 'form';

export default function HomePage() {
  const [view, setView] = useState<AppView>('landing');
  const formRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setView('form');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleBackToHero = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-4">
      {view === 'landing' && (
        <LandingHero onStart={handleStart} />
      )}

      {view === 'form' && (
        <div ref={formRef} className="scroll-mt-20">
          <CensusForm onResetToHero={handleBackToHero} />
        </div>
      )}
    </div>
  );
}
