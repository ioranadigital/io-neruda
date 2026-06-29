'use client';

import React, { useState } from 'react';
import { Lightbulb, Key, Book, MapPin, ChevronDown, ChevronUp, Lightbulb as LightbulbIcon } from 'lucide-react';

export type InsightOrigin = 'direct_idea' | 'keyword_seo' | 'obsidian_drive';
export type ContentIntent = 'educational' | 'transactional' | 'social_proof' | 'thought_leadership';

interface ContentDefinitionProps {
  insightOrigin: InsightOrigin;
  localGeoEnabled: boolean;
  localGeoValue: string;
  onInsightOriginChange: (origin: InsightOrigin) => void;
  onLocalGeoToggle: (enabled: boolean) => void;
  onLocalGeoValueChange: (value: string) => void;
}

const webColors = {
  primary: '#7BF1A8',
  primaryDark: '#333333',
  greenLight: '#f0fdf7',
  greenLighter: '#f8fffc',
};

export default function ContentDefinition({
  insightOrigin,
  localGeoEnabled,
  localGeoValue,
  onInsightOriginChange,
  onLocalGeoToggle,
  onLocalGeoValueChange,
}: ContentDefinitionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}>
      {/* Header - Similar to TechnicalAuditAccordion */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition hover:bg-gray-50"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex items-center gap-4">
          <div style={{ color: webColors.primary }}>
            <LightbulbIcon size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">Definición del Contenido Puntual</h3>
            <p className="text-sm text-gray-600">Origen del insight y enfoque geográfico</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} style={{ color: webColors.primary }} />
        ) : (
          <ChevronDown size={20} style={{ color: webColors.primary }} />
        )}
      </button>

      {/* Content - Expandable */}
      {isExpanded && (
        <div className="px-8 py-4 border-t-2 space-y-4" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>

      {/* Insight Origin Tabs */}
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-gray-600 mb-3">Origen del Insight</p>
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

      {/* Local Geo Toggle - Block */}
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: webColors.primary }} />
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
            className="w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none transition"
            style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}
          />
        )}
      </div>
        </div>
      )}
    </div>
  );
}
