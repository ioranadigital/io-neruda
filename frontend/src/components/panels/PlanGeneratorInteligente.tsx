'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '../../types/client';
import { Lightbulb, RefreshCw, ChevronDown } from 'lucide-react';
import { KEYWORD_STRUCTURE } from '../../data/keywordStructure';

export type InsightOrigin = 'direct_idea' | 'keyword_seo' | 'obsidian_drive';

interface InsightSuggestion {
  id: string;
  title: string;
  description: string;
  suggestedKeywords: string[];
  contentPillars: string[];
}

interface PlanGeneratorInteligenteProps {
  selectedClient: Client | null;
  insightOrigin: InsightOrigin;
  localGeoEnabled: boolean;
  localGeoValue: string;
  onInsightOriginChange: (origin: InsightOrigin) => void;
  onLocalGeoToggle: (enabled: boolean) => void;
  onLocalGeoValueChange: (value: string) => void;
  onInsightSelect?: (insight: InsightSuggestion) => void;
}

const generateInsights = (keywords: string[], client: Client | null): InsightSuggestion[] => {
  if (!client || keywords.length === 0) return [];

  const business = client.business_type || '';
  const audience = client.target_audience || '';
  const pillars = client.content_pillars || [];
  const primaryKeyword = keywords[0];

  return [
    {
      id: '1',
      title: `Guía Completa: ${primaryKeyword} para ${audience}`,
      description: `Educational deep-dive. Todo lo que ${audience} debe saber sobre ${primaryKeyword}.`,
      suggestedKeywords: keywords,
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '2',
      title: `Tendencias ${new Date().getFullYear()} en ${primaryKeyword}`,
      description: `Análisis de tendencias emergentes y futuro de ${primaryKeyword}. Posiciónate como experto.`,
      suggestedKeywords: [...keywords, `tendencias ${primaryKeyword.toLowerCase()}`],
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '3',
      title: `Cómo Elegir ${primaryKeyword}: Comparativa + Guía de Selección`,
      description: `Content comercial. Guía al usuario en decisión de compra/contratación de ${primaryKeyword}.`,
      suggestedKeywords: [...keywords, `mejor ${primaryKeyword.toLowerCase()}`],
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '4',
      title: `${audience}: Casos de Éxito con ${primaryKeyword}`,
      description: `Storytelling + datos. Demuestra valor real de ${primaryKeyword} con métricas concretas.`,
      suggestedKeywords: keywords.slice(0, 2),
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '5',
      title: `Errores Comunes al Usar ${primaryKeyword} (y Cómo Evitarlos)`,
      description: `Educational + Posicionamiento. Identifica pain points comunes en ${primaryKeyword}.`,
      suggestedKeywords: keywords,
      contentPillars: pillars.slice(0, 2),
    },
  ];
};

export default function PlanGeneratorInteligente({
  selectedClient,
  insightOrigin,
  localGeoEnabled,
  localGeoValue,
  onInsightOriginChange,
  onLocalGeoToggle,
  onLocalGeoValueChange,
  onInsightSelect,
}: PlanGeneratorInteligenteProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [insights, setInsights] = useState<InsightSuggestion[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword);
    } else {
      newSelected.add(keyword);
    }
    setSelectedKeywords(newSelected);
    const newInsights = generateInsights(Array.from(newSelected), selectedClient);
    setInsights(newInsights);
    setSelectedInsightId(null);
  };

  const handleAddCustomKeyword = () => {
    if (keywordInput.trim() && !selectedKeywords.has(keywordInput.trim())) {
      const newSelected = new Set(selectedKeywords);
      newSelected.add(keywordInput.trim());
      setSelectedKeywords(newSelected);
      setKeywordInput('');
      const newInsights = generateInsights(Array.from(newSelected), selectedClient);
      setInsights(newInsights);
      setSelectedInsightId(null);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    newSelected.delete(keyword);
    setSelectedKeywords(newSelected);
    const newInsights = generateInsights(Array.from(newSelected), selectedClient);
    setInsights(newInsights);
    setSelectedInsightId(null);
  };

  const handleSelectInsight = (insight: InsightSuggestion) => {
    setSelectedInsightId(insight.id);
    onInsightSelect?.(insight);
  };

  if (!mounted) return null;

  const selectedKeywordsArray = Array.from(selectedKeywords);

  return (
    <div className="w-full space-y-4">
      {/* ACORDEÓN: Plan Generator Inteligente */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        {/* Header del Acordeón */}
        <button
          onClick={() => setExpandedPlan(!expandedPlan)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition border-b border-gray-300"
        >
          <div className="flex items-center gap-3">
            <Lightbulb size={24} style={{ color: '#18bdc1' }} />
            <h3 className="text-lg font-bold text-gray-800">Plan Generator Inteligente</h3>
          </div>
          <ChevronDown
            size={20}
            className={`transition text-gray-600 ${expandedPlan ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Contenido del Acordeón - Grid 2 Columnas */}
        {expandedPlan && (
          <div className="grid grid-cols-2 gap-0">
            {/* Columna 1: Investigación Semántica */}
            <div className="border-r border-gray-200 p-6 space-y-3 bg-white max-h-96 overflow-y-auto">
              <div className="flex items-center gap-2 sticky top-0 bg-white pb-2 border-b border-gray-200">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">1</span>
                <label className="text-sm font-bold text-gray-800">🗝️ Investigación Semántica</label>
              </div>

              {/* Keyword Levels */}
              {selectedClient && (
                <div className="space-y-2">
                  {KEYWORD_STRUCTURE.map((level) => (
                    <div key={level.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{level.icon}</span>
                          <span className="text-xs font-semibold text-gray-800">{level.level}</span>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`transition ${expandedLevel === level.id ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {expandedLevel === level.id && (
                        <div className="px-3 py-2 border-t border-gray-200 bg-white space-y-2">
                          {level.items.map((item) => (
                            <div key={item.id} className="space-y-1">
                              <p className="text-xs font-bold text-gray-800">{item.name}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.keywords.map((kw) => (
                                  <button
                                    key={kw}
                                    onClick={() => handleToggleKeyword(kw)}
                                    className={`px-2 py-1 rounded text-xs transition border ${
                                      selectedKeywords.has(kw)
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    {kw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Columna 2: Refina Manualmente */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 space-y-4 max-h-96 overflow-y-auto">
              {selectedClient && selectedKeywordsArray.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 sticky top-0 bg-gradient-to-r from-amber-50 to-amber-100 pb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold">2</span>
                    <label className="text-sm font-bold text-gray-800">🔄 Refina Manualmente</label>
                  </div>

                  {/* Keywords Display */}
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywordsArray.map((kw) => (
                      <div
                        key={kw}
                        className="flex items-center gap-2 px-3 py-1 bg-white border border-amber-300 rounded-full text-sm"
                      >
                        <span className="text-gray-800">{kw}</span>
                        <button
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Input Nueva Keyword */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomKeyword()}
                      placeholder="Agrega un keyword..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleAddCustomKeyword}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-medium flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Agregar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center min-h-96">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm font-medium">Selecciona keywords</p>
                    <p className="text-gray-300 text-xs mt-1">en la columna izquierda</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PASO 2: 5 Insights Sugeridos */}
      {selectedClient && insights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">2</span>
            <label className="text-sm font-bold text-gray-800">💡 5 Propuestas de Contenido</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {insights.map((insight) => (
              <button
                key={insight.id}
                onClick={() => handleSelectInsight(insight)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedInsightId === insight.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-sm text-gray-800">{insight.title}</p>
                <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASO 3: Origen del Insight + SEO Local */}
      {selectedClient && selectedKeywordsArray.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold">3</span>
            <label className="text-sm font-bold text-gray-800">⚙️ Configuración Final</label>
          </div>

          {/* Origen del Insight */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Origen del Insight</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'direct_idea' as const, label: '💡 Idea Directa', desc: 'Idea del cliente' },
                { value: 'keyword_seo' as const, label: '🔍 Keyword SEO', desc: 'Research SEO' },
                { value: 'obsidian_drive' as const, label: '📚 Base Conocimiento', desc: 'Investigación propia' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => onInsightOriginChange(value)}
                  className={`p-3 rounded-lg border-2 transition text-center ${
                    insightOrigin === value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800">{label}</p>
                  <p className="text-xs text-gray-600 mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Enfoque Geográfico Local */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Enfoque Geográfico Local</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onLocalGeoToggle(!localGeoEnabled)}
                className={`px-4 py-2 rounded-lg border-2 transition font-medium text-sm ${
                  localGeoEnabled
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {localGeoEnabled ? '✓ Aplicar SEO Local' : 'SEO Local (Deshabilitado)'}
              </button>
            </div>
            {localGeoEnabled && (
              <input
                type="text"
                value={localGeoValue}
                onChange={(e) => onLocalGeoValueChange(e.target.value)}
                placeholder="Ej: Madrid, Barcelona, Buenos Aires"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedClient && selectedKeywordsArray.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p className="text-sm">Selecciona al menos un keyword en el paso 1 para ver propuestas de contenido</p>
        </div>
      )}
    </div>
  );
}
