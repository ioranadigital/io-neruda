'use client';

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SEOConfig {
  h1Title: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  urlSlug: string;
  searchIntent: string;
  funnelStage: string;
  mainTone: string;
  subTone: string;
  wordCount: string;
  headingStructure: string;
  visualElements: {
    lists: boolean;
    tables: boolean;
    alerts: boolean;
  };
  bannedWords: string[];
  styleFilters: {
    noObviousIntro: boolean;
    directStart: boolean;
    noBoldWords: boolean;
  };
}

interface SEOConfigHeaderProps {
  config: SEOConfig;
  onChange: (field: string, value: any) => void;
}

const TONE_SUBTONES: Record<string, string[]> = {
  professional: ['corporate', 'authoritative', 'commercial'],
  friendly: ['casual', 'enthusiastic', 'empathetic'],
  technical: ['instructional', 'analytical', 'diagnostic'],
  custom: ['expert_craftsman', 'local_consultant', 'direct_minimal'],
};

const DEFAULT_BANNED_WORDS = ['En conclusión', 'Es crucial', 'Sumérgete', 'En el mundo actual'];

export default function SEOConfigHeader({ config, onChange }: SEOConfigHeaderProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const addSecondaryKeyword = (keyword: string) => {
    if (keyword.trim() && !config.secondaryKeywords.includes(keyword.trim())) {
      onChange('secondaryKeywords', [...config.secondaryKeywords, keyword.trim()]);
    }
  };

  const removeSecondaryKeyword = (index: number) => {
    onChange('secondaryKeywords', config.secondaryKeywords.filter((_, i) => i !== index));
  };

  const toggleBannedWord = (word: string) => {
    if (config.bannedWords.includes(word)) {
      onChange('bannedWords', config.bannedWords.filter((w) => w !== word));
    } else {
      onChange('bannedWords', [...config.bannedWords, word]);
    }
  };

  return (
    <div className="px-6 py-4 bg-white border-b-2 border-gray-300 shadow-sm">
      <div className="space-y-3">
        {/* BLOQUE 1: Arquitectura SEO On-Page */}
        <div className="border-l-4 border-blue-500 pl-3">
          <button
            onClick={() => toggleSection('seo-on-page')}
            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition"
          >
            <h3 className="font-bold text-gray-800 text-sm">🧱 Arquitectura SEO On-Page</h3>
            <ChevronDown
              size={18}
              className={`transition ${expandedSection === 'seo-on-page' ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSection === 'seo-on-page' && (
            <div className="grid grid-cols-4 gap-3 mt-3 pb-3">
              {/* H1 Title */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">H1 Título</label>
                <input
                  type="text"
                  value={config.h1Title}
                  onChange={(e) => onChange('h1Title', e.target.value)}
                  placeholder="Ej: 5 trucos para encender carbón"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Primary Keyword */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">KW Principal</label>
                <input
                  type="text"
                  value={config.primaryKeyword}
                  onChange={(e) => onChange('primaryKeyword', e.target.value)}
                  placeholder="Ej: barbacoa carbón"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Secondary Keywords */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">KW Secundarias</label>
                <div className="flex gap-1 mb-1">
                  <input
                    type="text"
                    placeholder="Agregar KW"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSecondaryKeyword((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {config.secondaryKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs flex items-center gap-1">
                      {kw}
                      <button onClick={() => removeSecondaryKeyword(i)} className="hover:text-red-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URL Slug */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Slug / URL</label>
                <input
                  type="text"
                  value={config.urlSlug}
                  onChange={(e) => onChange('urlSlug', e.target.value)}
                  placeholder="Ej: trucos-carbon-barbacoa"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* BLOQUE 2: Enfoque Estratégico */}
        <div className="border-l-4 border-green-500 pl-3">
          <button
            onClick={() => toggleSection('estrategia')}
            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition"
          >
            <h3 className="font-bold text-gray-800 text-sm">🎯 Enfoque Estratégico</h3>
            <ChevronDown
              size={18}
              className={`transition ${expandedSection === 'estrategia' ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSection === 'estrategia' && (
            <div className="grid grid-cols-4 gap-3 mt-3 pb-3">
              {/* Search Intent */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Intención Búsqueda</label>
                <select
                  value={config.searchIntent}
                  onChange={(e) => onChange('searchIntent', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="informational">Informacional (Resolver duda)</option>
                  <option value="commercial">Comercial (Comparar)</option>
                  <option value="transactional">Transaccional (Compra)</option>
                  <option value="local">Local</option>
                </select>
              </div>

              {/* Funnel Stage */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Etapa Funnel</label>
                <select
                  value={config.funnelStage}
                  onChange={(e) => onChange('funnelStage', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="tofu">TOFU (Atracción/Problema)</option>
                  <option value="mofu">MOFU (Consideración/Comparativa)</option>
                  <option value="bofu">BOFU (Venta directa)</option>
                </select>
              </div>

              {/* Main Tone */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tono Principal</label>
                <select
                  value={config.mainTone}
                  onChange={(e) => onChange('mainTone', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Sub Tone (Dynamic) */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Sub-tono</label>
                <select
                  value={config.subTone}
                  onChange={(e) => onChange('subTone', e.target.value)}
                  disabled={!config.mainTone}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Seleccionar tono primero...</option>
                  {config.mainTone && TONE_SUBTONES[config.mainTone]?.map((st) => (
                    <option key={st} value={st}>
                      {st.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* BLOQUE 3: Estructura del DOM */}
        <div className="border-l-4 border-orange-500 pl-3">
          <button
            onClick={() => toggleSection('dom')}
            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition"
          >
            <h3 className="font-bold text-gray-800 text-sm">📐 Estructura del DOM</h3>
            <ChevronDown
              size={18}
              className={`transition ${expandedSection === 'dom' ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSection === 'dom' && (
            <div className="space-y-3 mt-3 pb-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Word Count */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Extensión (palabras)</label>
                  <select
                    value={config.wordCount}
                    onChange={(e) => onChange('wordCount', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="500">500 palabras</option>
                    <option value="800">800 palabras</option>
                    <option value="1000">1000 palabras</option>
                    <option value="1500">1500 palabras</option>
                    <option value="2000">2000 palabras</option>
                  </select>
                </div>

                {/* Heading Structure */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Encabezados obligatorios</label>
                  <textarea
                    value={config.headingStructure}
                    onChange={(e) => onChange('headingStructure', e.target.value)}
                    placeholder="H2: Introducción&#10;H3: Puntos clave..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-orange-500"
                    rows={2}
                  />
                </div>
              </div>

              {/* Visual Elements */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Elementos Visuales</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.visualElements.lists}
                      onChange={(e) => onChange('visualElements', { ...config.visualElements, lists: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Listas con viñetas</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.visualElements.tables}
                      onChange={(e) => onChange('visualElements', { ...config.visualElements, tables: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tablas comparativas</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.visualElements.alerts}
                      onChange={(e) => onChange('visualElements', { ...config.visualElements, alerts: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bloques de alerta/destacados</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BLOQUE 4: Filtros Antirrobot */}
        <div className="border-l-4 border-red-500 pl-3">
          <button
            onClick={() => toggleSection('antirobot')}
            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition"
          >
            <h3 className="font-bold text-gray-800 text-sm">🚫 Filtros Antirrobot (Calidad)</h3>
            <ChevronDown
              size={18}
              className={`transition ${expandedSection === 'antirobot' ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSection === 'antirobot' && (
            <div className="space-y-3 mt-3 pb-3">
              {/* Banned Words */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Palabras Prohibidas (Blacklist)</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {DEFAULT_BANNED_WORDS.map((word) => (
                    <button
                      key={word}
                      onClick={() => toggleBannedWord(word)}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        config.bannedWords.includes(word)
                          ? 'bg-red-200 text-red-800 border border-red-400'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Filters */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Filtros de Estilo Obligatorios</label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.styleFilters.noObviousIntro}
                      onChange={(e) => onChange('styleFilters', { ...config.styleFilters, noObviousIntro: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Prohibir intros obvias ("En el mundo actual...")</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.styleFilters.directStart}
                      onChange={(e) => onChange('styleFilters', { ...config.styleFilters, directStart: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ir directo al grano en la primera frase</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.styleFilters.noBoldWords}
                      onChange={(e) => onChange('styleFilters', { ...config.styleFilters, noBoldWords: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">No negritas en palabras sueltas</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
