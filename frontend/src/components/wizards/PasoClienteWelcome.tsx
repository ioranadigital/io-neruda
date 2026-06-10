'use client';

import React from 'react';
import { ArrowRight, Sparkles, Target, Zap, BookOpen } from 'lucide-react';

export default function PasoClienteWelcome() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-white to-slate-50">
      {/* Main Welcome Section */}
      <div className="max-w-2xl text-center space-y-8">
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Sparkles size={40} className="text-white" />
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Bienvenido a IO Neruda
          </h1>
          <p className="text-lg md:text-xl text-slate-600">
            Generador Inteligente de Contenido con IA
          </p>
        </div>

        {/* Separator */}
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-3">
            <Target size={20} className="text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">Estrategia Personalizada</p>
              <p className="text-xs text-slate-600">Adapta tono, intención y enfoque</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-3">
            <Zap size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">Múltiples Formatos</p>
              <p className="text-xs text-slate-600">Blog, Email, Social, PDF y más</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-3">
            <BookOpen size={20} className="text-purple-600 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">Keywords Inteligentes</p>
              <p className="text-xs text-slate-600">6 niveles de optimización SEO</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-3">
            <Sparkles size={20} className="text-pink-600 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className="font-semibold text-slate-900 text-sm">Generación IA</p>
              <p className="text-xs text-slate-600">Contenido de calidad premium</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8 space-y-4">
          <p className="text-slate-900 font-semibold text-lg">
            Para continuar, selecciona un cliente
          </p>
          <p className="text-slate-600 text-sm">
            Elige un cliente de tu lista en la sección superior para comenzar a generar contenido estratégico con IA.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
            <span>Selecciona cliente arriba</span>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 text-left">
          <p className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
            Proceso de 9 Pasos
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">0</div>
              <div><p className="text-sm font-semibold text-slate-900">Cliente</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div><p className="text-sm font-semibold text-slate-900">Formatos</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div><p className="text-sm font-semibold text-slate-900">Personalidad (Tono, Intención, Enfoque)</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div><p className="text-sm font-semibold text-slate-900">Propuestas de Contenido</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
              <div><p className="text-sm font-semibold text-slate-900">Keywords (6 niveles SEO)</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">5</div>
              <div><p className="text-sm font-semibold text-slate-900">Incubación</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">6</div>
              <div><p className="text-sm font-semibold text-slate-900">SEO/GEO (H1, H2, URL)</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">7</div>
              <div><p className="text-sm font-semibold text-slate-900">Previsualizar</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">8</div>
              <div><p className="text-sm font-semibold text-slate-900">Generar con IA</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
