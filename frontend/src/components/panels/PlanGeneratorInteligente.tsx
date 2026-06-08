'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '../../types/client';
import { Lightbulb } from 'lucide-react';

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

const generateInsights = (client: Client | null): InsightSuggestion[] => {
  if (!client) return [];

  const business = client.business_type || '';
  const audience = client.target_audience || '';
  const pillars = client.content_pillars || [];
  const keywords = client.keywords_niche || [];
  const proposition = client.unique_proposition || '';

  return [
    {
      id: '1',
      title: `${proposition ? `${proposition}: ` : ''}Guía Completa para ${audience}`,
      description: `Educational deep-dive sobre cómo ${audience} puede maximizar ${business}.`,
      suggestedKeywords: keywords.slice(0, 3),
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '2',
      title: `Tendencias ${new Date().getFullYear()} en ${business}`,
      description: `Análisis de tendencias emergentes. Posiciona como thought leader.`,
      suggestedKeywords: [...keywords.slice(0, 2), `tendencias ${business.toLowerCase()}`],
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '3',
      title: `Cómo Elegir ${business}: Comparativa + Recomendaciones`,
      description: `Content comercial que guía en decisión de compra/contratación.`,
      suggestedKeywords: [...keywords, `mejor ${business.toLowerCase()}`],
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '4',
      title: `${client.success_case || `Caso de Éxito: ${audience} Consiguió Resultados Extraordinarios`}`,
      description: `Storytelling + datos con métricas concretas. Máximo social proof.`,
      suggestedKeywords: keywords.slice(0, 2),
      contentPillars: pillars.slice(0, 2),
    },
    {
      id: '5',
      title: `${audience}: Errores Comunes a Evitar en ${business}`,
      description: `Educational + Posicionamiento. Identifica pain points.`,
      suggestedKeywords: keywords.slice(0, 3),
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
  const [insights, setInsights] = useState<InsightSuggestion[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedClient && mounted) {
      const newInsights = generateInsights(selectedClient);
      setInsights(newInsights);
      setSelectedInsightId(null);
    }
  }, [selectedClient, mounted]);

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
