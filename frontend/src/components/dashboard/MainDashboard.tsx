'use client';

import React, { useState } from 'react';
import { ArrowLeft, Zap, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import ClientSelectorChip from '@/src/components/shared/ClientSelectorChip';

type SelectedClient = 'TODOS' | 'surfvintage' | 'esgarden';

interface ClientData {
  id: string;
  name: string;
  focus: string;
  url: string;
  postsCreated: number;
  geoScore: number;
  status: string;
  plannedPosts: Array<{
    week: string;
    title: string;
    format: 'Blog' | 'Newsletter' | 'Redes';
  }>;
  keywordLevels: {
    level1: { label: string; coverage: number };
    level3: { label: string; coverage: number };
    level4: { label: string; coverage: number };
  };
}

const CLIENTS_DATA: Record<string, ClientData> = {
  surfvintage: {
    id: 'surfvintage',
    name: 'Surfvintage',
    focus: 'E-commerce 60s-80s',
    url: 'surfvintage.com',
    postsCreated: 6,
    geoScore: 89,
    status: '1 Pendiente',
    plannedPosts: [
      { week: 'Semana 1', title: 'Tablas de Surf Vintage: Guía de Compra 2024', format: 'Blog' },
      { week: 'Semana 2', title: 'Newsletter: Tendencias Retro en Verano', format: 'Newsletter' },
      { week: 'Semana 3', title: 'Los Mejores Modelos de los 70s', format: 'Redes' },
    ],
    keywordLevels: {
      level1: { label: 'Core & Branded', coverage: 80 },
      level3: { label: 'Informacionales/How-to', coverage: 45 },
      level4: { label: 'Investigación Comercial', coverage: 20 },
    },
  },
  esgarden: {
    id: 'esgarden',
    name: 'Esgarden',
    focus: 'Hogar y Jardín Norte',
    url: 'esgarden.es',
    postsCreated: 8,
    geoScore: 94,
    status: 'Al día',
    plannedPosts: [
      { week: 'Semana 1', title: 'Plantas de Interior: Guía Completa para Principiantes', format: 'Blog' },
      { week: 'Semana 2', title: 'Riego Inteligente: Tecnología en el Jardín', format: 'Blog' },
      { week: 'Semana 3', title: 'Especial Verano: Flores Resistentes al Calor', format: 'Redes' },
    ],
    keywordLevels: {
      level1: { label: 'Core & Branded', coverage: 85 },
      level3: { label: 'Informacionales/How-to', coverage: 60 },
      level4: { label: 'Investigación Comercial', coverage: 35 },
    },
  },
};

export default function MainDashboard() {
  const [selectedClient, setSelectedClient] = useState<SelectedClient>('TODOS');

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId as SelectedClient);
  };

  const handleBackToAll = () => {
    setSelectedClient('TODOS');
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 -mx-8 -mt-8 px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Análisis estratégico de activos SEO por cliente</p>
            </div>
          </div>
          <ClientSelectorChip />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="px-2 py-2">
        {selectedClient === 'TODOS' ? (
          <VistaGlobal onSelectClient={handleClientSelect} />
        ) : (
          <VistaIndividual
            client={CLIENTS_DATA[selectedClient]}
            onBackToAll={handleBackToAll}
          />
        )}
      </main>
    </div>
  );
}

// ─── Vista Global ──────────────────────────────────────────────────────────────

interface VistaGlobalProps {
  onSelectClient: (clientId: string) => void;
}

function VistaGlobal({ onSelectClient }: VistaGlobalProps) {
  return (
    <div className="space-y-6">
      {/* KPIs agregados */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Producción Global</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">14</p>
          <p className="text-xs text-slate-400">Artículos Creados</p>
          <p className="text-xs text-slate-400 mt-1">8 Esgarden / 6 Surfvintage</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Salud GEO Media</p>
          <p className="text-3xl font-bold mb-1" style={{ color: '#4aa87a' }}>91.5%</p>
          <p className="text-xs text-slate-400">Eficiencia promedio de IA</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '91.5%', backgroundColor: '#4aa87a' }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Alertas del Planner</p>
          <p className="text-3xl font-bold text-amber-500 mb-1">3</p>
          <p className="text-xs text-slate-400">En cola para esta semana</p>
          <div className="flex items-center gap-2 mt-3">
            <AlertCircle size={14} className="text-amber-400" />
            <span className="text-xs text-amber-600">Acción recomendada</span>
          </div>
        </div>
      </div>

      {/* Tabla comparativa */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 size={18} style={{ color: '#4aa87a' }} />
            Rendimiento de Cuentas
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#e8f5ee' }} className="border-b border-slate-200">
                {['Cliente', 'Foco', 'Posts', 'GEO-Score', 'Estado', 'Acción'].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: '#6b9e80' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">🏄 Surfvintage</td>
                <td className="px-6 py-4 text-sm text-slate-500">E-commerce 60s-80s</td>
                <td className="px-6 py-4 text-sm text-slate-700">6 Posts</td>
                <td className="px-6 py-4 text-sm font-semibold text-amber-600">89%</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    1 Pendiente
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelectClient('surfvintage')}
                    className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition hover:opacity-80"
                    style={{ backgroundColor: '#4aa87a' }}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">🌿 Esgarden</td>
                <td className="px-6 py-4 text-sm text-slate-500">Hogar y Jardín Norte</td>
                <td className="px-6 py-4 text-sm text-slate-700">8 Posts</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">94%</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Al día
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelectClient('esgarden')}
                    className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition hover:opacity-80"
                    style={{ backgroundColor: '#4aa87a' }}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribución de canales */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <TrendingUp size={18} style={{ color: '#4aa87a' }} />
          Distribución de Canales Globales
        </h2>

        <div className="space-y-4">
          {[
            { label: 'Blog Posts', pct: 55, color: '#4aa87a', textColor: '#4aa87a' },
            { label: 'LinkedIn / Social', pct: 25, color: '#8b5cf6', textColor: '#7c3aed' },
            { label: 'Newsletter / Email', pct: 20, color: '#06b6d4', textColor: '#0891b2' },
          ].map(({ label, pct, color, textColor }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-sm font-bold" style={{ color: textColor }}>{pct}%</span>
              </div>
              <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Vista Individual ──────────────────────────────────────────────────────────

interface VistaIndividualProps {
  client: ClientData;
  onBackToAll: () => void;
}

function formatBadge(format: 'Blog' | 'Newsletter' | 'Redes') {
  const map = {
    Blog: { bg: '#e8f5ee', color: '#4aa87a' },
    Newsletter: { bg: '#eff6ff', color: '#3b82f6' },
    Redes: { bg: '#f5f3ff', color: '#8b5cf6' },
  };
  const { bg, color } = map[format];
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>
      {format}
    </span>
  );
}

function VistaIndividual({ client, onBackToAll }: VistaIndividualProps) {
  return (
    <div className="space-y-6">
      {/* Header del cliente */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{client.name}</h1>
          <p className="text-sm text-slate-500">
            Foco: <span className="font-medium text-slate-700">{client.focus}</span>
            {' · '}
            <span style={{ color: '#4aa87a' }}>{client.url}</span>
          </p>
        </div>
        <button
          onClick={onBackToAll}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg transition font-medium text-sm text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Vista General
        </button>
      </div>

      {/* Dos columnas: Planner + Cobertura KW */}
      <div className="grid grid-cols-2 gap-6">
        {/* Planner */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200" style={{ backgroundColor: '#f4fbf7' }}>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Planificador ({client.plannedPosts.length} próximas)
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {client.plannedPosts.map((post, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{post.week}</p>
                  {formatBadge(post.format)}
                </div>
                <p className="text-sm font-medium text-slate-800 mb-3 leading-snug">{post.title}</p>
                <button
                  className="flex items-center gap-1.5 w-full justify-center px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition hover:opacity-80"
                  style={{ backgroundColor: '#4aa87a' }}
                >
                  <Zap size={12} />
                  Redactar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cobertura de Keywords */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200" style={{ backgroundColor: '#f4fbf7' }}>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 size={16} style={{ color: '#4aa87a' }} />
              Cobertura de Keywords
            </h2>
          </div>

          <div className="p-5 space-y-5">
            {[
              { ...client.keywordLevels.level1, color: '#4aa87a', textColor: '#4aa87a' },
              { ...client.keywordLevels.level3, color: '#8b5cf6', textColor: '#7c3aed' },
              { ...client.keywordLevels.level4, color: '#f59e0b', textColor: '#d97706' },
            ].map(({ label, coverage, color, textColor }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  <span className="text-sm font-bold" style={{ color: textColor }}>{coverage}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${coverage}%`, backgroundColor: color }}></div>
                </div>
              </div>
            ))}

            <div className="border border-slate-200 rounded-lg p-4 mt-2" style={{ backgroundColor: '#f4fbf7' }}>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Oportunidades Recomendadas
              </p>
              <p className="text-sm text-slate-600 leading-snug">
                {client.id === 'surfvintage'
                  ? '5 Keywords Long-tail sin explotar en Nivel 5. Oportunidad: Tablas vintage decorativas.'
                  : '7 Keywords Long-tail sin explotar en Nivel 5. Oportunidad: Plantas exóticas y maceteros artesanales.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">GEO-Score Medio</p>
          <p className="text-3xl font-bold mb-2" style={{ color: client.geoScore >= 90 ? '#4aa87a' : '#f59e0b' }}>
            {client.geoScore}%
          </p>
          <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${client.geoScore}%`,
                backgroundColor: client.geoScore >= 90 ? '#4aa87a' : '#f59e0b',
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Exclusiones Nivel 6</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4aa87a' }}></span>
            <span className="text-sm font-semibold" style={{ color: '#4aa87a' }}>100% Safe</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Sin términos prohibidos detectados</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Últimos Contenidos</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{client.postsCreated}</p>
          <p className="text-xs text-slate-400">Posts sincronizados en Supabase</p>
        </div>
      </div>
    </div>
  );
}
