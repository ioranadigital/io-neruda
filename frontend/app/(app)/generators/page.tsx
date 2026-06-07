'use client';

import React from 'react';
import GeneratorPanel from '@/src/components/panels/GeneratorPanel';
import { useGenerator } from '@/src/context/GeneratorContext';

export default function GeneratorsPage() {
  const { isLoading } = useGenerator();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Generador de Contenido</h1>
        <p className="text-zinc-400">Crea contenido profesional en pocos clics ⚡</p>
      </div>

      {isLoading && (
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-zinc-400 mt-2">Cargando...</p>
        </div>
      )}

      <GeneratorPanel />

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl mb-2">✨</div>
          <h3 className="font-semibold text-white mb-1">Multi-Formato</h3>
          <p className="text-zinc-400 text-sm">Blog, Email, Social, PDF y más</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-white mb-1">Generación Rápida</h3>
          <p className="text-zinc-400 text-sm">Resultados en segundos</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🎨</div>
          <h3 className="font-semibold text-white mb-1">Personalizable</h3>
          <p className="text-zinc-400 text-sm">Keywords, tono y formatos</p>
        </div>
      </div>

      <div className="text-center mt-12 text-zinc-500 text-sm">
        <p>Powered by Advanced AI • Secure • Reliable</p>
        <p className="mt-1">v2.0 - Content Generation System</p>
      </div>
    </>
  );
}
