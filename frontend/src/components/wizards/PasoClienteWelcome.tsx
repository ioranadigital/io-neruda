'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Target, Zap, BookOpen, AlertCircle } from 'lucide-react';
import { Client } from '@/src/types/client';

interface PasoClienteWelcomeProps {
  clients: Client[];
  onSelectClient: (client: Client | null) => void;
}

export default function PasoClienteWelcome({ clients, onSelectClient }: PasoClienteWelcomeProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-10">

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

        {/* CTA Section con desplegable */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8 space-y-4">
          <p className="text-slate-900 font-semibold text-lg">
            Para continuar, selecciona un cliente
          </p>
          {clients.length > 0 ? (
            <select
              defaultValue=""
              onChange={(e) => {
                const client = clients.find((c) => c.id === e.target.value);
                onSelectClient(client || null);
              }}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium text-sm"
            >
              <option value="">Selecciona un cliente...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.business_type}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>No hay clientes creados. <Link href="/clients/new" className="underline font-semibold">Crear primer cliente</Link></span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
