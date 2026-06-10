'use client';

import React, { useState } from 'react';
import { ArrowLeft, Zap, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';

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
      <header className="sticky top-0 z-40 bg-white border-b px-6 py-4 mb-6" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: '#18bdc1' }}>📊 Dashboard Estratégico de Activos SEO</h1>

          {/* Client Selector Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium" style={{ color: '#727272' }}>Cliente:</label>
            <select
              value={selectedClient}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer transition"
              style={{ borderColor: '#e0e0e0', color: '#333333' }}
            >
              <option value="TODOS">🌍 Todos los Clientes (Agencia)</option>
              <option value="surfvintage">🏄 Surfvintage</option>
              <option value="esgarden">🌿 Esgarden</option>
            </select>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-6 py-6" style={{ backgroundColor: '#f5f5f5' }}>
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

// ============================================
// VISTA GLOBAL ("TODOS")
// ============================================

interface VistaGlobalProps {
  onSelectClient: (clientId: string) => void;
}

function VistaGlobal({ onSelectClient }: VistaGlobalProps) {
  return (
    <div className="space-y-6">
      {/* A) KPIs AGREGADOS */}
      <div className="grid grid-cols-3 gap-4">
        {/* Producción Global */}
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#727272' }}>Producción Global</p>
          <p className="text-3xl font-bold mb-2" style={{ color: '#333333' }}>14</p>
          <p className="text-xs" style={{ color: '#727272' }}>Artículos Creados</p>
          <p className="text-xs mt-2" style={{ color: '#999999' }}>8 Esgarden / 6 Surfvintage</p>
        </div>

        {/* Salud GEO Media */}
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#727272' }}>Salud GEO Media</p>
          <p className="text-3xl font-bold text-white mb-2">91.5%</p>
          <p className="text-xs" style={{ color: '#727272' }}>Eficiencia promedio de IA</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-teal-400" style={{ width: '91.5%' }}></div>
          </div>
        </div>

        {/* Alertas del Planner */}
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#727272' }}>Alertas del Planner</p>
          <p className="text-3xl font-bold text-amber-400 mb-2">3</p>
          <p className="text-xs" style={{ color: '#727272' }}>En cola para esta semana</p>
          <div className="flex gap-2 mt-3">
            <AlertCircle size={16} className="text-amber-400" />
            <span className="text-xs text-amber-300">Acción recomendada</span>
          </div>
        </div>
      </div>

      {/* B) TABLA COMPARATIVA DE RENDIMIENTO */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#333333' }}>
            <BarChart3 size={20} className="text-white" />
            Rendimiento de Cuentas
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderColor: '#e0e0e0' }} className="border-b">
                <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#727272' }}>Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Foco</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">GEO-Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400">Acción</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#e0e0e0' }} className="divide-y">
              {/* Surfvintage */}
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium" style={{ color: '#333333' }}>🏄 Surfvintage</td>
                <td className="px-6 py-4 text-sm" style={{ color: '#727272' }}>E-commerce 60s-80s</td>
                <td className="px-6 py-4 text-sm" style={{ color: '#555555' }}>6 Posts</td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-amber-300 font-semibold">89%</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-2 py-1 bg-amber-900/30 text-amber-300 rounded text-xs">
                    1 Pendiente
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelectClient('surfvintage')}
                    className="px-3 py-1 text-white text-xs font-medium rounded transition hover:opacity-80"
            style={{ backgroundColor: '#18bdc1' }}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>

              {/* Esgarden */}
              <tr className="hover:bg-gray-200/50 transition">
                <td className="px-6 py-4 text-sm font-medium text-slate-50">🌿 Esgarden</td>
                <td className="px-6 py-4 text-sm" style={{ color: '#727272' }}>Hogar y Jardín Norte</td>
                <td className="px-6 py-4 text-sm" style={{ color: '#555555' }}>8 Posts</td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-green-400 font-semibold">94%</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                    Al día
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelectClient('esgarden')}
                    className="px-3 py-1 text-white text-xs font-medium rounded transition hover:opacity-80"
            style={{ backgroundColor: '#18bdc1' }}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* C) GRÁFICO VISUAL - MIX DE FORMATOS */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-50 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-white" />
          Distribución de Canales Globales
        </h2>

        <div className="space-y-4">
          {/* Blog Posts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#555555' }}>Blog Posts</span>
              <span className="text-sm font-bold text-white">55%</span>
            </div>
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400" style={{ width: '55%' }}></div>
            </div>
          </div>

          {/* LinkedIn/Social */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#555555' }}>LinkedIn/Social</span>
              <span className="text-sm font-bold text-purple-400">25%</span>
            </div>
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-purple-500" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Newsletter / Email */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#555555' }}>Newsletter / Email</span>
              <span className="text-sm font-bold text-cyan-400">20%</span>
            </div>
            <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// VISTA INDIVIDUAL (CLIENTE ACTIVO)
// ============================================

interface VistaIndividualProps {
  client: ClientData;
  onBackToAll: () => void;
}

function VistaIndividual({ client, onBackToAll }: VistaIndividualProps) {
  return (
    <div className="space-y-6">
      {/* A) HEADER DEL CLIENTE */}
      <div className="bg-white border rounded-lg p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#333333' }}>{client.name}</h1>
          <p className="text-sm" style={{ color: '#727272' }}>
            Foco: <span className="font-medium" style={{ color: '#555555' }}>{client.focus}</span> | URL:{' '}
            <span className="font-medium" style={{ color: '#4f46e5' }}>{client.url}</span>
          </p>
        </div>
        <button
          onClick={onBackToAll}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg transition font-medium text-sm hover:bg-gray-100"
          style={{ borderColor: '#e0e0e0', color: '#555555' }}
        >
          <ArrowLeft size={16} />
          Volver a Vista General
        </button>
      </div>

      {/* B + C) DOS COLUMNAS: PLANNER (IZQ) + SEO BRAIN (DER) */}
      <div className="grid grid-cols-2 gap-6">
        {/* COLUMNA IZQUIERDA: WIDGET DEL PLANIFICADOR */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: '#e0e0e0' }}>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#333333' }}>
              <Zap size={20} className="text-amber-400" />
              Planificador ({client.plannedPosts.length} próximas)
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {client.plannedPosts.map((post, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition" style={{ borderColor: '#e0e0e0' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold uppercase" style={{ color: '#727272' }}>{post.week}</p>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      post.format === 'Blog'
                        ? 'bg-blue-900/30 text-blue-300'
                        : post.format === 'Newsletter'
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-purple-900/30 text-purple-300'
                    }`}
                  >
                    {post.format}
                  </span>
                </div>
                <p className="text-sm font-medium mb-3" style={{ color: '#333333' }}>{post.title}</p>
                <button className="flex items-center gap-2 w-full justify-center px-3 py-2 hover:opacity-80 text-white text-xs font-semibold rounded transition" style={{ backgroundColor: '#18bdc1' }}>
                  <Zap size={14} />
                  Redactar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: CEREBRO SEO */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: '#e0e0e0' }}>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#333333' }}>
              <BarChart3 size={20} className="text-white" />
              Cobertura de Keywords
            </h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Level 1 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#555555' }}>{client.keywordLevels.level1.label}</span>
                <span className="text-sm font-bold text-white">{client.keywordLevels.level1.coverage}%</span>
              </div>
              <div className="w-full h-5 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
                  style={{ width: `${client.keywordLevels.level1.coverage}%` }}
                ></div>
              </div>
            </div>

            {/* Level 3 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#555555' }}>{client.keywordLevels.level3.label}</span>
                <span className="text-sm font-bold text-purple-400">{client.keywordLevels.level3.coverage}%</span>
              </div>
              <div className="w-full h-5 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                  style={{ width: `${client.keywordLevels.level3.coverage}%` }}
                ></div>
              </div>
            </div>

            {/* Level 4 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#555555' }}>{client.keywordLevels.level4.label}</span>
                <span className="text-sm font-bold text-cyan-400">{client.keywordLevels.level4.coverage}%</span>
              </div>
              <div className="w-full h-5 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500"
                  style={{ width: `${client.keywordLevels.level4.coverage}%` }}
                ></div>
              </div>
            </div>

            {/* Oportunidades */}
            <div className="border rounded-lg p-4 mt-4" style={{ borderColor: '#e0e0e0', backgroundColor: '#f9f9f9' }}>
              <p className="text-xs font-semibold mb-2 uppercase" style={{ color: '#727272' }}>Oportunidades Recomendadas</p>
              <p className="text-sm" style={{ color: '#555555' }}>
                {client.id === 'surfvintage'
                  ? '5 Keywords Long-tail sin explotar en Nivel 5. Oportunidad: Tablas vintage decorativas.'
                  : '7 Keywords Long-tail sin explotar en Nivel 5. Oportunidad: Plantas exotic y maceteros artesanales.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* D) PIE DE PÁGINA: GEO & COMPLIANCE SCORE */}
      <div className="grid grid-cols-3 gap-4">
        {/* GEO-Score */}
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#727272' }}>GEO-Score Medio</p>
          <p className="text-3xl font-bold mb-2" style={{ color: client.geoScore >= 90 ? '#22c55e' : '#f59e0b' }}>
            {client.geoScore}%
          </p>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e0e0' }}>
            <div
              className={`h-full ${client.geoScore >= 90 ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{ width: `${client.geoScore}%` }}
            ></div>
          </div>
        </div>

        {/* Exclusiones Nivel 6 */}
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#727272' }}>Exclusiones Nivel 6</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>100% Safe</span>
          </div>
          <p className="text-xs mt-3" style={{ color: '#999999' }}>Sin términos prohibidos</p>
        </div>

        {/* Últimos Contenidos */}
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <p className="text-sm font-medium mb-2" style={{ color: '#727272' }}>Últimos Contenidos</p>
          <p className="text-2xl font-bold mb-2" style={{ color: '#333333' }}>{client.postsCreated}</p>
          <p className="text-xs" style={{ color: '#727272' }}>Posts sincronizados en Supabase</p>
        </div>
      </div>
    </div>
  );
}
