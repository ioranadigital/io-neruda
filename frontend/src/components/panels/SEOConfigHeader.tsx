'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

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

const DEFAULT_BANNED_WORDS = ['En conclusión', 'Es crucial', 'Sumérgete'];

export default function SEOConfigHeader({ config, onChange }: SEOConfigHeaderProps) {
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
    <div className="flex flex-col gap-4">
      {/* BLOQUE 1: Arquitectura SEO On-Page */}
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#7BF1A8', color: '#000' }}>2</span>
          <h3 className="font-bold text-gray-800 text-sm">🧱 Arquitectura SEO On-Page</h3>
        </div>

        <div className="space-y-2">
          {/* H1 Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600">H1 Título</label>
            <input
              type="text"
              value={config.h1Title}
              onChange={(e) => onChange('h1Title', e.target.value)}
              placeholder="Ej: 5 trucos para encender carbón"
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Primary Keyword */}
          <div>
            <label className="text-xs font-semibold text-gray-600">KW Principal</label>
            <input
              type="text"
              value={config.primaryKeyword}
              onChange={(e) => onChange('primaryKeyword', e.target.value)}
              placeholder="Ej: barbacoa carbón"
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Secondary Keywords */}
          <div>
            <label className="text-xs font-semibold text-gray-600">KW Secundarias</label>
            <input
              type="text"
              placeholder="Agregar KW"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSecondaryKeyword((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {config.secondaryKeywords.slice(0, 2).map((kw, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs flex items-center gap-1">
                  {kw}
                  <button onClick={() => removeSecondaryKeyword(i)} className="hover:text-red-600">
                    <X size={10} />
                  </button>
                </span>
              ))}
              {config.secondaryKeywords.length > 2 && (
                <span className="text-xs text-gray-500">+{config.secondaryKeywords.length - 2}</span>
              )}
            </div>
          </div>

          {/* URL Slug */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Slug / URL</label>
            <input
              type="text"
              value={config.urlSlug}
              onChange={(e) => onChange('urlSlug', e.target.value)}
              placeholder="Ej: trucos-carbon-barbacoa"
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE 2: Enfoque Estratégico */}
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#7BF1A8', color: '#000' }}>3</span>
          <h3 className="font-bold text-gray-800 text-sm">🎯 Enfoque Estratégico</h3>
        </div>

        <div className="space-y-2">
          {/* Search Intent */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Intención Búsqueda</label>
            <select
              value={config.searchIntent}
              onChange={(e) => onChange('searchIntent', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar...</option>
              <option value="informational">Informacional</option>
              <option value="commercial">Comercial</option>
              <option value="transactional">Transaccional</option>
              <option value="local">Local</option>
            </select>
          </div>

          {/* Funnel Stage */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Etapa Funnel</label>
            <select
              value={config.funnelStage}
              onChange={(e) => onChange('funnelStage', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar...</option>
              <option value="tofu">TOFU</option>
              <option value="mofu">MOFU</option>
              <option value="bofu">BOFU</option>
            </select>
          </div>

          {/* Main Tone */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Tono Principal</label>
            <select
              value={config.mainTone}
              onChange={(e) => onChange('mainTone', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar...</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Sub Tone */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Sub-tono</label>
            <select
              value={config.subTone}
              onChange={(e) => onChange('subTone', e.target.value)}
              disabled={!config.mainTone}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar tono...</option>
              {config.mainTone && TONE_SUBTONES[config.mainTone]?.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: Estructura del DOM */}
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#7BF1A8', color: '#000' }}>4</span>
          <h3 className="font-bold text-gray-800 text-sm">📐 Estructura del DOM</h3>
        </div>

        <div className="space-y-2">
          {/* Word Count */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Extensión (palabras)</label>
            <select
              value={config.wordCount}
              onChange={(e) => onChange('wordCount', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seleccionar...</option>
              <option value="500">500</option>
              <option value="800">800</option>
              <option value="1000">1000</option>
              <option value="1500">1500</option>
              <option value="2000">2000</option>
            </select>
          </div>

          {/* Heading Structure */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Encabezados</label>
            <textarea
              value={config.headingStructure}
              onChange={(e) => onChange('headingStructure', e.target.value)}
              placeholder="H2, H3..."
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-orange-500"
              rows={1}
            />
          </div>

          {/* Visual Elements */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block">Elementos Visuales</label>
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={config.visualElements.lists}
                onChange={(e) => onChange('visualElements', { ...config.visualElements, lists: e.target.checked })}
                className="w-3 h-3"
              />
              <span className="ml-1 text-gray-700">Listas</span>
            </label>
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={config.visualElements.tables}
                onChange={(e) => onChange('visualElements', { ...config.visualElements, tables: e.target.checked })}
                className="w-3 h-3"
              />
              <span className="ml-1 text-gray-700">Tablas</span>
            </label>
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={config.visualElements.alerts}
                onChange={(e) => onChange('visualElements', { ...config.visualElements, alerts: e.target.checked })}
                className="w-3 h-3"
              />
              <span className="ml-1 text-gray-700">Alertas</span>
            </label>
          </div>
        </div>
      </div>

      {/* BLOQUE 4: Filtros Antirrobot */}
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#7BF1A8', color: '#000' }}>5</span>
          <h3 className="font-bold text-gray-800 text-sm">🚫 Filtros Antirrobot</h3>
        </div>

        <div className="space-y-2">
          {/* Banned Words */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Palabras Prohibidas</label>
            <div className="flex flex-col gap-1">
              {DEFAULT_BANNED_WORDS.map((word) => (
                <button
                  key={word}
                  onClick={() => toggleBannedWord(word)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition text-left ${
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
            <label className="text-xs font-semibold text-gray-600 block mb-1">Filtros Estilo</label>
            <div className="space-y-1">
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={config.styleFilters.noObviousIntro}
                  onChange={(e) => onChange('styleFilters', { ...config.styleFilters, noObviousIntro: e.target.checked })}
                  className="w-3 h-3"
                />
                <span className="ml-1 text-gray-700">Sin intros obvias</span>
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={config.styleFilters.directStart}
                  onChange={(e) => onChange('styleFilters', { ...config.styleFilters, directStart: e.target.checked })}
                  className="w-3 h-3"
                />
                <span className="ml-1 text-gray-700">Directo al grano</span>
              </label>
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={config.styleFilters.noBoldWords}
                  onChange={(e) => onChange('styleFilters', { ...config.styleFilters, noBoldWords: e.target.checked })}
                  className="w-3 h-3"
                />
                <span className="ml-1 text-gray-700">Sin bold suelto</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
