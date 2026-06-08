'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '../../types/client';
import { Lightbulb, RefreshCw, RotateCcw } from 'lucide-react';

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
  const proposition = client.unique_proposition || '';
  const primaryKeyword = keywords[0];
  const secondaryKeywords = keywords.slice(1);

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
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [insights, setInsights] = useState<InsightSuggestion[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedClient && mounted) {
      const clientKeywords = selectedClient.keywords_niche || [];
      setCustomKeywords(clientKeywords);
      const newInsights = generateInsights(clientKeywords, selectedClient);
      setInsights(newInsights);
      setSelectedInsightId(null);
    }
  }, [selectedClient, mounted]);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !customKeywords.includes(keywordInput.trim())) {
      const updatedKeywords = [...customKeywords, keywordInput.trim()];
      setCustomKeywords(updatedKeywords);
      setKeywordInput('');
      const newInsights = generateInsights(updatedKeywords, selectedClient);
      setInsights(newInsights);
      setSelectedInsightId(null);
    }
  };

  const handleRemoveKeyword = (idx: number) => {
    const updatedKeywords = customKeywords.filter((_, i) => i !== idx);
    setCustomKeywords(updatedKeywords);
    const newInsights = generateInsights(updatedKeywords, selectedClient);
    setInsights(newInsights);
    setSelectedInsightId(null);
  };

  const handleResetKeywords = () => {
    const clientKeywords = selectedClient?.keywords_niche || [];
    setCustomKeywords(clientKeywords);
    const newInsights = generateInsights(clientKeywords, selectedClient);
    setInsights(newInsights);
    setSelectedInsightId(null);
  };

  const handleSelectInsight = (insight: InsightSuggestion) => {
    setSelectedInsightId(insight.id);
    onInsightSelect?.(insight);
  };

  if (!mounted) return null;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} style={{ color: '#18bdc1' }} />
        <h3 className="text-lg font-bold text-gray-800">Plan Generator Inteligente</h3>
      </div>

      {/* Cambiar Keywords */}
      {selectedClient && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-800">🔄 Cambiar Keywords para Nuevas Propuestas</label>
            <button
              onClick={handleResetKeywords}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Restaurar keywords originales del cliente"
            >
              <RotateCcw size={12} /> Restaurar
            </button>
          </div>

          {/* Keywords Display */}
          <div className="flex flex-wrap gap-2">
            {customKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm"
              >
                <span className="text-gray-800">{kw}</span>
                <button
                  onClick={() => handleRemoveKeyword(idx)}
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
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              placeholder="Ingresa una keyword y presiona Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw size={14} /> Regenerar
            </button>
          </div>
          <p className="text-xs text-gray-600">💡 Cambia los keywords para ver 5 nuevas propuestas de contenido</p>
        </div>
      )}

      {/* 5 Insights Sugeridos */}
      {selectedClient && insights.length > 0 && (
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-semibold text-gray-800">💡 5 Insights Sugeridos</label>
          <div className="grid grid-cols-1 gap-2">
            {insights.map((insight) => (
              <button
                key={insight.id}
                onClick={() => handleSelectInsight(insight)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedInsightId === insight.id
                    ? 'border-blue-500 bg-blue-50'
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

      {/* Origen del Insight */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Origen del Insight</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'direct_idea' as const, label: '💡 Idea Directa', desc: 'Idea del cliente' },
            { value: 'keyword_seo' as const, label: '🔍 Keyword SEO', desc: 'Research SEO' },
            { value: 'obsidian_drive' as const, label: '📚 Base de Conocimiento', desc: 'Investigación propia' },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => onInsightOriginChange(value)}
              className={`p-3 rounded-lg border-2 transition text-center ${
                insightOrigin === value
                  ? 'border-blue-500 bg-blue-50'
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
                ? 'border-blue-500 bg-blue-50 text-blue-700'
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        )}
      </div>
    </div>
  );
}
