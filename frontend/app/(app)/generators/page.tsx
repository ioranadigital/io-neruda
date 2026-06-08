'use client';

import React from 'react';
import GeneratorPanel from '@/src/components/panels/GeneratorPanel';
import { useGenerator } from '@/src/context/GeneratorContext';

export default function GeneratorsPage() {
  const { isLoading } = useGenerator();

  return (
    <>
      {isLoading && (
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-zinc-400 mt-2">Cargando...</p>
        </div>
      )}

      <GeneratorPanel />
    </>
  );
}
