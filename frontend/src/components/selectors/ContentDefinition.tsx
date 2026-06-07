'use client';

import React from 'react';
import { Lightbulb, Key, Book, MapPin } from 'lucide-react';

export type InsightOrigin = 'direct_idea' | 'keyword_seo' | 'obsidian_drive';
export type ContentIntent = 'educational' | 'transactional' | 'social_proof' | 'thought_leadership';

interface ContentDefinitionProps {
  insightOrigin: InsightOrigin;
  contentIntent: ContentIntent;
  localGeoEnabled: boolean;
  localGeoValue: string;
  onInsightOriginChange: (origin: InsightOrigin) => void;
  onContentIntentChange: (intent: ContentIntent) => void;
  onLocalGeoToggle: (enabled: boolean) => void;
  onLocalGeoValueChange: (value: string) => void;
}

export default function ContentDefinition({
  insightOrigin,
  contentIntent,
  localGeoEnabled,
  localGeoValue,
  onInsightOriginChange,
  onContentIntentChange,
  onLocalGeoToggle,
  onLocalGeoValueChange,
}: ContentDefinitionProps) {
  return (
    <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-4">📝 Definición del Contenido Puntual</h3>

      {/* Insight Origin Tabs */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Origen del Insight</p>
        <div className="flex gap-2">
          <button
            onClick={() => onInsightOriginChange('direct_idea')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
              insightOrigin === 'direct_idea'
                ? 'text-black border-b-2'
                : 'text-gray-600 border-b-2 border-transparent hover:text-gray-800'
            }`}
            style={insightOrigin === 'direct_idea' ? { backgroundColor: '#7BF1A8', borderColor: '#7BF1A8', color: 'black' } : {}}
          >
            <Lightbulb size={14} />
            Idea Directa
          </button>
          <button
            onClick={() => onInsightOriginChange('keyword_seo')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
              insightOrigin === 'keyword_seo'
                ? 'text-black border-b-2'
                : 'text-gray-600 border-b-2 border-transparent hover:text-gray-800'
            }`}
            style={insightOrigin === 'keyword_seo' ? { backgroundColor: '#7BF1A8', borderColor: '#7BF1A8', color: 'black' } : {}}
          >
            <Key size={14} />
            Keyword SEO
          </button>
          <button
            onClick={() => onInsightOriginChange('obsidian_drive')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1 ${
              insightOrigin === 'obsidian_drive'
                ? 'text-black border-b-2'
                : 'text-gray-600 border-b-2 border-transparent hover:text-gray-800'
            }`}
            style={insightOrigin === 'obsidian_drive' ? { backgroundColor: '#7BF1A8', borderColor: '#7BF1A8', color: 'black' } : {}}
          >
            <Book size={14} />
            Obsidian / Drive
          </button>
        </div>
      </div>

      {/* Content Intent Selector */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Intención de Contenido</p>
        <select
          value={contentIntent}
          onChange={(e) => onContentIntentChange(e.target.value as ContentIntent)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
        >
          <option value="educational">📚 Educativo / Informativo</option>
          <option value="transactional">🛍️ Transaccional / Venta</option>
          <option value="social_proof">⭐ Caso de Éxito / Prueba Social</option>
          <option value="thought_leadership">🎓 Opinión / Liderazgo Intelectual</option>
        </select>
      </div>

      {/* Local Geo Toggle */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: '#7BF1A8' }} />
            <p className="text-xs font-semibold text-gray-600">Enfoque Geográfico Local (SEO Local)</p>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localGeoEnabled}
              onChange={(e) => onLocalGeoToggle(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </label>
        </div>

        {localGeoEnabled && (
          <input
            type="text"
            value={localGeoValue}
            onChange={(e) => onLocalGeoValueChange(e.target.value)}
            placeholder="ej: Guadalajara, Alcalá, Corredor del Henares"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        )}
      </div>
    </div>
  );
}
