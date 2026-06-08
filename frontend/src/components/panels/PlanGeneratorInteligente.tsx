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

interface FormatSelection {
  selected: boolean;
  subType?: string;
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
  onAddCustomKeyword?: (clientId: string, keyword: string) => void;
  onFormDataChange?: (data: {
    keywordsNiche: string[];
    keywordsLongtail: string[];
    targetAudience: string;
    selectedContentIntent: string | null;
    selectedMainTone: string | null;
    selectedTone: string | null;
    h1Title: string;
    h2Title: string;
    urlSlug: string;
    internalLink1: string;
    internalLink2: string;
    semanticElements: Set<string>;
    selectedFormats: { [key: string]: { selected: boolean; subType?: string } };
    subSelectorValues: { [key: string]: string };
  }) => void;
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
  onAddCustomKeyword,
  onFormDataChange,
}: PlanGeneratorInteligenteProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [insights, setInsights] = useState<InsightSuggestion[]>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState(true);
  const [expandedProposals, setExpandedProposals] = useState(true);
  const [expandedStrategy, setExpandedStrategy] = useState(true);
  const [selectedContentIntent, setSelectedContentIntent] = useState<string | null>(null);
  const [selectedMainTone, setSelectedMainTone] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [targetAudience, setTargetAudience] = useState('');
  const [expandedSemantic, setExpandedSemantic] = useState(true);
  const [h1Title, setH1Title] = useState('');
  const [h2Title, setH2Title] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [internalLink1, setInternalLink1] = useState('');
  const [internalLink2, setInternalLink2] = useState('');
  const [semanticElements, setSemanticElements] = useState<Set<string>>(new Set());
  const [expandedFormatOutput, setExpandedFormatOutput] = useState(true);
  const [selectedFormats, setSelectedFormats] = useState<{ [key: string]: FormatSelection }>({});
  const [subSelectorValues, setSubSelectorValues] = useState<{ [key: string]: string }>({});
  const [showSaveKeywordModal, setShowSaveKeywordModal] = useState(false);
  const [pendingKeyword, setPendingKeyword] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('level-1-entity');
  const [selectedSubLevel, setSelectedSubLevel] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (h1Title.trim()) {
      const slug = generateSlug(h1Title);
      setUrlSlug(`/${slug}/`);
    }
  }, [h1Title]);

  useEffect(() => {
    if (onFormDataChange && mounted) {
      const selectedKeywordsArray = Array.from(selectedKeywords);
      onFormDataChange({
        keywordsNiche: selectedKeywordsArray,
        keywordsLongtail: [],
        targetAudience,
        selectedContentIntent,
        selectedMainTone,
        selectedTone,
        h1Title,
        h2Title,
        urlSlug,
        internalLink1,
        internalLink2,
        semanticElements,
        selectedFormats,
        subSelectorValues,
      });
    }
  }, [
    selectedKeywords,
    targetAudience,
    selectedContentIntent,
    selectedMainTone,
    selectedTone,
    h1Title,
    h2Title,
    urlSlug,
    internalLink1,
    internalLink2,
    semanticElements,
    selectedFormats,
    subSelectorValues,
    mounted,
  ]);

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

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSelectProposal = (insightId: string) => {
    setSelectedInsightId(insightId);
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      // Auto-fill H1 Title with proposal title (slug will auto-generate via useEffect)
      setH1Title(insight.title);

      // Auto-fill H2 Title with first content pillar
      if (insight.contentPillars.length > 0) {
        setH2Title(insight.contentPillars[0]);
      }

      // Auto-generate internal links from content pillars
      if (insight.contentPillars.length > 1) {
        const link1Slug = generateSlug(insight.contentPillars[1]);
        setInternalLink1(`/blog/${link1Slug}/`);
      }

      if (insight.contentPillars.length > 2) {
        const link2Slug = generateSlug(insight.contentPillars[2]);
        setInternalLink2(`/blog/${link2Slug}/`);
      } else {
        setInternalLink2(`/tienda/accesorios/`);
      }
    }
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
    handleSelectProposal(insight.id);
    onInsightSelect?.(insight);
  };

  const getKeywordsByLevel = () => {
    const groupedByLevel: { [key: string]: { level: string; keywords: string[] } } = {};

    selectedKeywords.forEach((keyword) => {
      for (const level of KEYWORD_STRUCTURE) {
        for (const item of level.items) {
          if (item.keywords.includes(keyword)) {
            if (!groupedByLevel[level.id]) {
              groupedByLevel[level.id] = { level: level.level, keywords: [] };
            }
            groupedByLevel[level.id].keywords.push(keyword);
            return;
          }
        }
      }
      // Si no se encuentra en ningún nivel, es un keyword agregado en esta sesión
      if (!groupedByLevel['aggregated']) {
        groupedByLevel['aggregated'] = { level: 'Agregado en esta sesión', keywords: [] };
      }
      groupedByLevel['aggregated'].keywords.push(keyword);
    });

    return groupedByLevel;
  };

  if (!mounted) return null;

  const selectedKeywordsArray = Array.from(selectedKeywords);
  const keywordsByLevel = getKeywordsByLevel();

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
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Plan Generator Inteligente</h3>
              {selectedClient && <p className="text-xs text-gray-600 mt-0.5">Cliente: {selectedClient.name}</p>}
            </div>
          </div>
          <ChevronDown
            size={20}
            className={`transition text-gray-600 ${expandedPlan ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Contenido del Acordeón - Grid 3 Columnas (2:1 ratio) */}
        {expandedPlan && (
          <div className="grid grid-cols-3 gap-0">
            {/* Columna 1-2: Investigación Semántica (2/3 del ancho) */}
            <div className="col-span-2 p-6 space-y-3 bg-white">
              <div className="flex items-center gap-2 sticky top-0 bg-white pb-2 border-b border-gray-200">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">1</span>
                <label className="text-sm font-bold text-gray-800">🗝️ Investigación Semántica</label>
              </div>

              {/* Keyword Levels - Excluir Nivel 5 */}
              {selectedClient && (
                <div className="space-y-2">
                  {KEYWORD_STRUCTURE.filter(level => level.id !== 'level-5-longtail').map((level) => (
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
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2">
                            {level.items.map((item) => (
                              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-2.5 space-y-1.5">
                                <p className="text-xs font-bold text-gray-800 line-clamp-2">{item.name}</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.keywords.map((kw) => (
                                    <button
                                      key={kw}
                                      onClick={() => handleToggleKeyword(kw)}
                                      className={`px-2 py-0.5 rounded text-xs transition border ${
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
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Columna 3: Refina Manualmente (1/3 del ancho) */}
            <div className="border-l-2 border-gray-300 p-4 bg-gradient-to-br from-amber-50 to-amber-100 space-y-3 flex flex-col">
              {/* Refina Title - Always Visible */}
              <div className="flex items-center gap-1 sticky top-0 bg-gradient-to-r from-amber-50 to-amber-100 pb-2 border-b border-amber-200 flex-shrink-0">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex-shrink-0">2</span>
                <label className="text-xs font-bold text-gray-800">Refina</label>
              </div>

              {/* Keywords Grouped by Level */}
              {selectedClient && selectedKeywordsArray.length > 0 && (
                <div className="space-y-2">
                  {Object.entries(keywordsByLevel).filter(([levelId]) => levelId !== 'level-5-longtail' && levelId !== 'aggregated').map(([levelId, { level, keywords }]) => (
                    <div key={levelId} className="bg-white rounded-lg border border-amber-200 p-2 space-y-1">
                      <p className="text-xs font-bold text-gray-800">{level}</p>
                      <div className="flex flex-wrap gap-1">
                        {keywords.map((kw) => (
                          <div
                            key={kw}
                            className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-xs"
                          >
                            <span className="text-gray-800 line-clamp-1">{kw}</span>
                            <button
                              onClick={() => handleRemoveKeyword(kw)}
                              className="text-red-500 hover:text-red-700 font-bold flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregado en esta sesión */}
              {keywordsByLevel['aggregated'] && keywordsByLevel['aggregated'].keywords.length > 0 && (
                <div className="bg-white rounded-lg border border-purple-200 p-2 space-y-1">
                  <p className="text-xs font-bold text-purple-800">Agregado en esta sesión</p>
                  <div className="flex flex-wrap gap-1">
                    {keywordsByLevel['aggregated'].keywords.map((kw) => (
                      <div
                        key={kw}
                        className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-300 rounded text-xs"
                      >
                        <span className="text-gray-800 line-clamp-1">{kw}</span>
                        <button
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-red-500 hover:text-red-700 font-bold flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedClient && selectedKeywordsArray.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-gray-400 text-xs font-medium">Sin keywords seleccionadas</p>
                </div>
              )}

              {/* Input Nueva Keyword - Always Visible */}
              <div className="flex gap-1 flex-col pt-2 border-t border-amber-200">
                <label className="text-xs font-semibold text-gray-800">➕ Agregar Keyword Personalizado</label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && keywordInput.trim()) {
                      setPendingKeyword(keywordInput.trim());
                      setShowSaveKeywordModal(true);
                    }
                  }}
                  placeholder="Escribe una keyword personalizada..."
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => {
                    if (keywordInput.trim()) {
                      setPendingKeyword(keywordInput.trim());
                      setShowSaveKeywordModal(true);
                    }
                  }}
                  className="px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition text-xs font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASO 2: Estrategia, Tono y Enfoque - Acordeón */}
      {selectedClient && selectedKeywordsArray.length > 0 && (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* Header del Acordeón */}
          <button
            onClick={() => setExpandedStrategy(!expandedStrategy)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition border-b border-gray-300"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold">2</span>
              <h3 className="text-lg font-bold text-gray-800">Estrategia, Tono y Enfoque (Personalidad)</h3>
            </div>
            <ChevronDown
              size={20}
              className={`transition text-gray-600 ${expandedStrategy ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Contenido del Acordeón */}
          {expandedStrategy && (
            <div className="p-6 bg-white space-y-4">
              {/* 1. Público Objetivo */}
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  👥 Público Objetivo
                </label>
                {selectedClient?.buyer_personas_list && selectedClient.buyer_personas_list.filter(bp => bp).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClient.buyer_personas_list.map((persona, index) => (
                      persona && (
                        <button
                          key={index}
                          onClick={() => setTargetAudience(persona)}
                          className={`text-left p-3 rounded-lg border-2 transition ${
                            targetAudience === persona
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 bg-white hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                              targetAudience === persona
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300'
                            }`} />
                            <p className="font-semibold text-sm text-gray-800">{persona}</p>
                          </div>
                        </button>
                      )
                    ))}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Define el público objetivo"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">💡 Tip: Configura Buyer Personas en la ficha del cliente para seleccionar de opciones predefinidas</p>
                  </>
                )}
              </div>

              {/* 2. Intención de Contenidos */}
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2">📍 Intención de Contenidos</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'educational', label: 'Educativo', desc: 'Informativo' },
                    { value: 'transactional', label: 'Transaccional', desc: 'Venta' },
                    { value: 'social_proof', label: 'Prueba Social', desc: 'Caso de Éxito' },
                    { value: 'thought_leadership', label: 'Liderazgo', desc: 'Opinión' },
                  ].map(({ value, label, desc }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedContentIntent(value)}
                      className={`text-left p-3 rounded-lg border-2 transition ${
                        selectedContentIntent === value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                          selectedContentIntent === value
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`} />
                        <div>
                          <p className="font-semibold text-xs text-gray-800">{label}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Tono de Contenido */}
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-3">🎤 Tono de Contenido</label>

                {/* Grid 2 columnas: Tonos principales (izq) + Sub-selecciones (der) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Columna Izquierda: Tonos Principales */}
                  <div className="space-y-2">
                    {[
                      { value: 'professional', icon: '🏢', label: 'Professional', desc: 'Corporativo, formal, autoridad institucional' },
                      { value: 'friendly', icon: '🤝', label: 'Friendly', desc: 'Blog, newsletters, redes sociales' },
                      { value: 'technical', icon: '🛠️', label: 'Technical', desc: 'Fichas técnicas, manuales, FAQs' },
                      { value: 'hybrid', icon: '🎛️', label: 'Custom / Hybrid', desc: 'Tonos personalizados cruzados' },
                    ].map(({ value, icon, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setSelectedMainTone(value)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition ${
                          selectedMainTone === value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                            [selectedTone?.split('-')[0]].includes(value)
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300'
                          }`} />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-800">{icon} {label}</p>
                            <p className="text-xs text-gray-600 mt-1">{desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Columna Derecha: Sub-selecciones */}
                  <div className="space-y-2">
                    {selectedMainTone === 'professional' && (
                      <>
                        {[
                          { value: 'professional-corporate', icon: '🏢', label: 'Corporate / Executive', desc: 'Lenguaje formal, estructuras complejas, autoridad institucional', tags: ['Tono corporativo', 'ejecutivo', 'institucional', 'alta dirección'] },
                          { value: 'professional-authoritative', icon: '🎓', label: 'Authoritative / Academic', desc: 'Rigor absoluto, basado en datos, normativas vigentes', tags: ['Tono académico', 'analítico', 'imperativo', 'basado en datos'] },
                          { value: 'professional-commercial', icon: '💼', label: 'Commercial / Sales-driven', desc: 'Persuasión y beneficios (B2B/B2C), enfoque en ROI', tags: ['Tono persuasivo', 'comercial', 'B2B', 'propuesta de valor'] },
                        ].map(({ value, icon, label, desc, tags }) => (
                          <button
                            key={value}
                            onClick={() => setSelectedTone(value)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              selectedTone === value
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                                selectedTone === value
                                  ? 'border-indigo-500 bg-indigo-500'
                                  : 'border-gray-300'
                              }`} />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{icon} {label}</p>
                                <p className="text-xs text-gray-600 mt-1">{desc}</p>
                                {tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {tags.map((tag, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                        💬 {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {selectedMainTone === 'friendly' && (
                      <>
                        {[
                          { value: 'friendly-casual', icon: '🤝', label: 'Casual & Approachable', desc: 'Tono conversacional, accesible y cercano', tags: ['Tono amigable', 'conversacional', 'accesible'] },
                          { value: 'friendly-inspirational', icon: '✨', label: 'Inspirational & Motivating', desc: 'Energizante, positivo, empoderante', tags: ['Tono inspirador', 'motivador', 'positivo'] },
                          { value: 'friendly-educational', icon: '📚', label: 'Educational & Helpful', desc: 'Educativo pero accesible, guía paso a paso', tags: ['Tono educativo', 'ayuda', 'guía práctica'] },
                        ].map(({ value, icon, label, desc, tags }) => (
                          <button
                            key={value}
                            onClick={() => setSelectedTone(value)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              selectedTone === value
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                                selectedTone === value
                                  ? 'border-indigo-500 bg-indigo-500'
                                  : 'border-gray-300'
                              }`} />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{icon} {label}</p>
                                <p className="text-xs text-gray-600 mt-1">{desc}</p>
                                {tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {tags.map((tag, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                        💬 {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {selectedMainTone === 'technical' && (
                      <>
                        {[
                          { value: 'technical-detailed', icon: '🛠️', label: 'Detailed & Precise', desc: 'Especificaciones exactas, terminología técnica', tags: ['Tono preciso', 'especificaciones', 'técnico'] },
                          { value: 'technical-developer', icon: '💻', label: 'Developer-Focused', desc: 'Para desarrolladores, código y APIs', tags: ['Tono developer', 'código', 'APIs'] },
                          { value: 'technical-explanatory', icon: '📖', label: 'Explanatory & Clear', desc: 'Técnico pero explicado de forma clara', tags: ['Tono explicativo', 'claridad', 'detallado'] },
                        ].map(({ value, icon, label, desc, tags }) => (
                          <button
                            key={value}
                            onClick={() => setSelectedTone(value)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              selectedTone === value
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                                selectedTone === value
                                  ? 'border-indigo-500 bg-indigo-500'
                                  : 'border-gray-300'
                              }`} />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{icon} {label}</p>
                                <p className="text-xs text-gray-600 mt-1">{desc}</p>
                                {tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {tags.map((tag, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                        💬 {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {selectedMainTone === 'hybrid' && (
                      <>
                        {[
                          { value: 'hybrid-balanced', icon: '⚖️', label: 'Balanced Mix', desc: 'Combinación equilibrada de profesional y amigable', tags: ['Tono balanceado', 'profesional+amigable'] },
                          { value: 'hybrid-technical-friendly', icon: '🔧', label: 'Technical + Friendly', desc: 'Técnico pero accesible para no expertos', tags: ['Tono técnico-amigable', 'accesible'] },
                          { value: 'hybrid-custom', icon: '✏️', label: 'Custom Blend', desc: 'Define tu propia combinación única', tags: ['Tono personalizado', 'único'] },
                        ].map(({ value, icon, label, desc, tags }) => (
                          <button
                            key={value}
                            onClick={() => setSelectedTone(value)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              selectedTone === value
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                                selectedTone === value
                                  ? 'border-indigo-500 bg-indigo-500'
                                  : 'border-gray-300'
                              }`} />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{icon} {label}</p>
                                <p className="text-xs text-gray-600 mt-1">{desc}</p>
                                {tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {tags.map((tag, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                        💬 {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {!selectedMainTone && (
                      <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 text-center text-gray-500 text-sm">
                        Selecciona un tono principal para ver sub-opciones
                      </div>
                    )}
                  </div>
                </div>

                {/* Display block para tono seleccionado */}
                {selectedTone && (
                  <div className="mt-4 p-3 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <p className="text-xs font-semibold text-gray-600">Tono seleccionado:</p>
                    <p className="text-sm font-bold text-indigo-700 mt-1">
                      {selectedTone === 'professional-corporate' && 'Professional > Corporate / Executive'}
                      {selectedTone === 'professional-authoritative' && 'Professional > Authoritative / Academic'}
                      {selectedTone === 'professional-commercial' && 'Professional > Commercial / Sales-driven'}
                      {selectedTone === 'friendly-casual' && 'Friendly > Casual & Approachable'}
                      {selectedTone === 'friendly-inspirational' && 'Friendly > Inspirational & Motivating'}
                      {selectedTone === 'friendly-educational' && 'Friendly > Educational & Helpful'}
                      {selectedTone === 'technical-detailed' && 'Technical > Detailed & Precise'}
                      {selectedTone === 'technical-developer' && 'Technical > Developer-Focused'}
                      {selectedTone === 'technical-explanatory' && 'Technical > Explanatory & Clear'}
                      {selectedTone === 'hybrid-balanced' && 'Custom / Hybrid > Balanced Mix'}
                      {selectedTone === 'hybrid-technical-friendly' && 'Custom / Hybrid > Technical + Friendly'}
                      {selectedTone === 'hybrid-custom' && 'Custom / Hybrid > Custom Blend'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PASO 3: 5 Insights Sugeridos - Acordeón */}
      {selectedClient && insights.length > 0 && (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* Header del Acordeón */}
          <button
            onClick={() => setExpandedProposals(!expandedProposals)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition border-b border-gray-300"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">3</span>
              <h3 className="text-lg font-bold text-gray-800">💡 5 Propuestas de Contenido</h3>
            </div>
            <ChevronDown
              size={20}
              className={`transition text-gray-600 ${expandedProposals ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Contenido del Acordeón - Grid 2 Columnas */}
          {expandedProposals && (
            <div className="grid grid-cols-2 gap-0">
              {/* Columna 1: Lista de Propuestas (1/2 del ancho) */}
              <div className="p-4 space-y-2 bg-white border-r border-gray-300">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <label className="text-xs font-bold text-gray-800">Propuestas Disponibles</label>
                </div>
                <div className="space-y-2">
                  {insights.map((insight) => (
                    <button
                      key={insight.id}
                      onClick={() => handleSelectInsight(insight)}
                      className={`w-full text-left p-2.5 rounded-lg border-2 transition text-sm ${
                        selectedInsightId === insight.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-xs text-gray-800 line-clamp-2">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{insight.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Columna 2: Detalle Seleccionado (1/2 del ancho) */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
                {selectedInsightId ? (
                  <div className="space-y-3">
                    {insights.find(i => i.id === selectedInsightId) && (
                      <>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Título</p>
                          <p className="text-sm font-bold text-gray-800">{insights.find(i => i.id === selectedInsightId)?.title}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Descripción</p>
                          <p className="text-xs text-gray-700">{insights.find(i => i.id === selectedInsightId)?.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Keywords Sugeridas</p>
                          <div className="flex flex-wrap gap-1">
                            {insights.find(i => i.id === selectedInsightId)?.suggestedKeywords.slice(0, 4).map((kw) => (
                              <span key={kw} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <p className="text-gray-400 text-xs font-medium">Selecciona una propuesta</p>
                      <p className="text-gray-300 text-xs mt-1">para ver los detalles</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PASO 4: Definición y Mapeo Semántico */}
      {selectedClient && selectedKeywordsArray.length > 0 && insights.length > 0 && (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* Header del Acordeón */}
          <button
            onClick={() => setExpandedSemantic(!expandedSemantic)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition border-b border-gray-300"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">4</span>
              <h3 className="text-lg font-bold text-gray-800">📊 Definición y Mapeo Semántico</h3>
            </div>
            <ChevronDown
              size={20}
              className={`transition text-gray-600 ${expandedSemantic ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Contenido del Acordeón */}
          {expandedSemantic && (
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-gray-600 mb-4">Define la estructura y metadatos del contenido. Los campos pueden ser rellenados automáticamente por la IA basado en PASO 3.</p>

              {/* Grid 2 columnas para campos */}
              <div className="grid grid-cols-2 gap-4">
                {/* Título H1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Título H1</label>
                  <input
                    type="text"
                    value={h1Title}
                    onChange={(e) => setH1Title(e.target.value)}
                    placeholder="Ej: 5 trucos para encender carbón"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Título H2 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Título H2</label>
                  <input
                    type="text"
                    value={h2Title}
                    onChange={(e) => setH2Title(e.target.value)}
                    placeholder="Ej: Preparación inicial"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Slug de la URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Slug de la URL</label>
                  <input
                    type="text"
                    value={urlSlug}
                    onChange={(e) => setUrlSlug(e.target.value)}
                    placeholder="Ej: /barbacoas-jardin-terraza/"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Enlace Interno 1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Enlace Interno 1</label>
                  <input
                    type="text"
                    value={internalLink1}
                    onChange={(e) => setInternalLink1(e.target.value)}
                    placeholder="Ej: /blog/como-elegir-barbacoa/"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Enlace Interno 2 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Enlace Interno 2</label>
                  <input
                    type="text"
                    value={internalLink2}
                    onChange={(e) => setInternalLink2(e.target.value)}
                    placeholder="Ej: /tienda/accesorios-barbacoa/"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Elementos Semánticos */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Elementos Semánticos</label>
                <div className="space-y-2">
                  {[
                    { value: 'ul-li', label: '📋 Listas con viñetas', code: '(<ul>, <li>)' },
                    { value: 'table', label: '📊 Tablas comparativas', code: '(<table>)' },
                    { value: 'blockquote', label: '💬 Bloques de cita / notas', code: '(<blockquote>)' },
                  ].map(({ value, label, code }) => (
                    <label key={value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={semanticElements.has(value)}
                        onChange={(e) => {
                          const newElements = new Set(semanticElements);
                          if (e.target.checked) {
                            newElements.add(value);
                          } else {
                            newElements.delete(value);
                          }
                          setSemanticElements(newElements);
                        }}
                        className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer accent-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-600">{code}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sugerencias basadas en propuesta seleccionada */}
              {selectedInsightId && insights.find(i => i.id === selectedInsightId) && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">💡 Sugerencias basadas en la propuesta:</p>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p><strong>Propuesta:</strong> {insights.find(i => i.id === selectedInsightId)?.title}</p>
                    <p><strong>Descripción:</strong> {insights.find(i => i.id === selectedInsightId)?.description}</p>
                    <p><strong>Keywords sugeridos:</strong> {insights.find(i => i.id === selectedInsightId)?.suggestedKeywords.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PASO 5: Formato de Salida de Contenido */}
      {selectedClient && selectedKeywordsArray.length > 0 && insights.length > 0 && (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          {/* Header del Acordeón */}
          <button
            onClick={() => setExpandedFormatOutput(!expandedFormatOutput)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition border-b border-gray-300"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">5</span>
              <h3 className="text-lg font-bold text-gray-800">📝 Formato de Salida de Contenido</h3>
            </div>
            <ChevronDown
              size={20}
              className={`transition text-gray-600 ${expandedFormatOutput ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Contenido del Acordeón */}
          {expandedFormatOutput && (
            <div className="px-6 py-4 space-y-6">
              <p className="text-sm text-gray-600">Selecciona los formatos en los que deseas generar el contenido. Elige entre 4 categorías principales:</p>

              {/* 4 Categorías de Formatos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CATEGORÍA 1: WEB & SEO */}
                <div className="space-y-3 p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                  <div className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-blue-500">
                    🌐 WEB & SEO
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'blog', name: 'Blog Post', icon: '📝', desc: 'Artículos y posts para el blog', hasSub: true },
                      { id: 'landing', name: 'Landing de Servicio', icon: '🎯', desc: '600-900 palabras, frameworks PAS/AIDA' },
                      { id: 'faq-schema', name: 'Bloque FAQ + Schema', icon: '❓', desc: '5-7 preguntas + código JSON-LD' },
                    ].map((format) => {
                      const key = `web-seo-${format.id}`;
                      const isSelected = selectedFormats[key]?.selected || false;
                      return (
                        <div key={format.id}>
                          <label className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                setSelectedFormats({
                                  ...selectedFormats,
                                  [key]: { ...selectedFormats[key], selected: e.target.checked }
                                });
                              }}
                              className="w-4 h-4 mt-0.5 cursor-pointer accent-blue-500"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-800">{format.icon} {format.name}</p>
                              <p className="text-xs text-gray-600">{format.desc}</p>
                            </div>
                          </label>
                          {/* Blog Type Sub-selector */}
                          {isSelected && format.hasSub && (
                            <div className="ml-6 mt-2 space-y-1 text-xs">
                              {[
                                { id: 'short', name: 'Post Corto / Actualización', range: '500-800 palabras', icon: '⚡' },
                                { id: 'standard', name: 'Post Estándar', range: '1000-1200 palabras', icon: '🎯' },
                                { id: 'ultimate', name: 'Guía Definitiva / Pilar', range: '1500-2500 palabras', icon: '🏆' },
                              ].map((type) => (
                                <label key={type.id} className="flex items-center gap-2 p-1 rounded hover:bg-white cursor-pointer border border-blue-200">
                                  <input
                                    type="radio"
                                    name={key}
                                    value={type.id}
                                    checked={subSelectorValues[key] === type.id}
                                    onChange={(e) => setSubSelectorValues({ ...subSelectorValues, [key]: e.target.value })}
                                    className="w-3 h-3 cursor-pointer"
                                    style={{ accentColor: '#3b82f6' }}
                                  />
                                  <span className="text-gray-700 font-medium">{type.icon} {type.name}</span>
                                  <span className="text-gray-500">({type.range})</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORÍA 2: REDES SOCIALES */}
                <div className="space-y-3 p-4 rounded-lg bg-pink-50 border-2 border-pink-200">
                  <div className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-pink-500">
                    📱 REDES SOCIALES
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'linkedin', name: 'LinkedIn Post', icon: '💼', desc: '150-250 palabras, ganchos potentes' },
                      { id: 'instagram', name: 'Instagram Post', icon: '📸', desc: '100-150 palabras + carrusel', hasSub: true },
                      { id: 'facebook', name: 'Facebook Post', icon: '👥', desc: '200-300 palabras, storytelling' },
                      { id: 'twitter', name: 'Hilo X (Twitter)', icon: '𝕏', desc: '5-8 tweets con gancho numérico' },
                    ].map((format) => {
                      const key = `social-${format.id}`;
                      const isSelected = selectedFormats[key]?.selected || false;
                      return (
                        <div key={format.id}>
                          <label className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                setSelectedFormats({
                                  ...selectedFormats,
                                  [key]: { ...selectedFormats[key], selected: e.target.checked }
                                });
                              }}
                              className="w-4 h-4 mt-0.5 cursor-pointer accent-pink-500"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-800">{format.icon} {format.name}</p>
                              <p className="text-xs text-gray-600">{format.desc}</p>
                            </div>
                          </label>
                          {/* Instagram Carousel Sub-selector */}
                          {isSelected && format.hasSub && (
                            <div className="ml-6 mt-2 space-y-1 text-xs">
                              <label className="flex items-center gap-2 p-1 rounded hover:bg-white cursor-pointer border border-pink-200">
                                <input
                                  type="radio"
                                  name={key}
                                  value="carousel-4"
                                  checked={subSelectorValues[key] === 'carousel-4'}
                                  onChange={(e) => setSubSelectorValues({ ...subSelectorValues, [key]: e.target.value })}
                                  className="w-3 h-3 cursor-pointer"
                                  style={{ accentColor: '#ec4899' }}
                                />
                                <span className="text-gray-700 font-medium">🎬 Carrusel de 4 Láminas</span>
                                <span className="text-gray-500">(Optimizado para engagement)</span>
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORÍA 3: EMAIL & PREMIUM */}
                <div className="space-y-3 p-4 rounded-lg bg-amber-50 border-2 border-amber-200">
                  <div className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-amber-500">
                    📧 EMAIL & PREMIUM
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'email-sales', name: 'Email de Venta', icon: '💌', desc: '250-350 palabras, variables', hasSub: true },
                      { id: 'newsletter', name: 'Newsletter Editorial', icon: '📰', desc: '600-800 palabras, Substack', hasSub: true },
                      { id: 'pdf-leadmagnet', name: 'PDF Report', icon: '📄', desc: '2-3 páginas descargables', hasSub: true },
                    ].map((format) => {
                      const key = `email-${format.id}`;
                      const isSelected = selectedFormats[key]?.selected || false;
                      return (
                        <div key={format.id}>
                          <label className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                setSelectedFormats({
                                  ...selectedFormats,
                                  [key]: { ...selectedFormats[key], selected: e.target.checked }
                                });
                              }}
                              className="w-4 h-4 mt-0.5 cursor-pointer accent-amber-500"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-800">{format.icon} {format.name}</p>
                              <p className="text-xs text-gray-600">{format.desc}</p>
                            </div>
                          </label>
                          {/* Email Sales Sub-selector */}
                          {isSelected && format.id === 'email-sales' && (
                            <div className="ml-6 mt-2 space-y-1 text-xs">
                              {[
                                { id: 'email-vars-basic', name: 'Variables Básicas', desc: '{{nombre}}, {{empresa}}, {{producto}}', icon: '📝' },
                                { id: 'email-vars-advanced', name: 'Variables Avanzadas', desc: '{{ciudad}}, {{sector}}, {{presupuesto}}', icon: '🔧' },
                              ].map((type) => (
                                <label key={type.id} className="flex items-center gap-2 p-1 rounded hover:bg-white cursor-pointer border border-amber-200">
                                  <input
                                    type="radio"
                                    name={key}
                                    value={type.id}
                                    checked={subSelectorValues[key] === type.id}
                                    onChange={(e) => setSubSelectorValues({ ...subSelectorValues, [key]: e.target.value })}
                                    className="w-3 h-3 cursor-pointer"
                                    style={{ accentColor: '#f59e0b' }}
                                  />
                                  <span className="text-gray-700 font-medium">{type.icon} {type.name}</span>
                                  <span className="text-gray-500 text-xs">({type.desc})</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {/* Newsletter Sub-selector */}
                          {isSelected && format.id === 'newsletter' && (
                            <div className="ml-6 mt-2 space-y-1 text-xs">
                              {[
                                { id: 'newsletter-intro-main-close', name: 'Intro + Contenido + Conclusión', icon: '📄' },
                                { id: 'newsletter-curated', name: 'Curación Semanal (Top 5)', icon: '⭐' },
                                { id: 'newsletter-deep-dive', name: 'Deep Dive Temático', icon: '🔍' },
                              ].map((type) => (
                                <label key={type.id} className="flex items-center gap-2 p-1 rounded hover:bg-white cursor-pointer border border-amber-200">
                                  <input
                                    type="radio"
                                    name={key}
                                    value={type.id}
                                    checked={subSelectorValues[key] === type.id}
                                    onChange={(e) => setSubSelectorValues({ ...subSelectorValues, [key]: e.target.value })}
                                    className="w-3 h-3 cursor-pointer"
                                    style={{ accentColor: '#f59e0b' }}
                                  />
                                  <span className="text-gray-700 font-medium">{type.icon} {type.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {/* PDF Report Sub-selector */}
                          {isSelected && format.id === 'pdf-leadmagnet' && (
                            <div className="ml-6 mt-2 space-y-1 text-xs">
                              {[
                                { id: 'pdf-case-study', name: 'Case Study', desc: 'Problema → Solución → Resultados', icon: '📊' },
                                { id: 'pdf-whitepaper', name: 'Whitepaper', desc: 'Investigación formal, datos', icon: '📑' },
                                { id: 'pdf-guide', name: 'Guía Práctica', desc: 'Paso a paso, checklist', icon: '📘' },
                                { id: 'pdf-industry-report', name: 'Reporte de Industria', desc: 'Análisis de tendencias', icon: '📈' },
                              ].map((type) => (
                                <label key={type.id} className="flex items-center gap-2 p-1 rounded hover:bg-white cursor-pointer border border-amber-200">
                                  <input
                                    type="radio"
                                    name={key}
                                    value={type.id}
                                    checked={subSelectorValues[key] === type.id}
                                    onChange={(e) => setSubSelectorValues({ ...subSelectorValues, [key]: e.target.value })}
                                    className="w-3 h-3 cursor-pointer"
                                    style={{ accentColor: '#f59e0b' }}
                                  />
                                  <span className="text-gray-700 font-medium">{type.icon} {type.name}</span>
                                  <span className="text-gray-500 text-xs">({type.desc})</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORÍA 4: REPUTACIÓN & COMUNIDAD */}
                <div className="space-y-3 p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
                  <div className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-purple-500">
                    ⭐ REPUTACIÓN & COMUNIDAD
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: 'local-seo-reviews', name: 'Reseñas Local SEO', icon: '📍', desc: 'Optimizadas con keywords locales' },
                      { id: 'tiktok-ugc', name: 'TikTok & UGC', icon: '🎬', desc: 'Guiones de video estilo UGC' },
                    ].map((format) => (
                      <label key={format.id} className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFormats[`reputation-${format.id}`]?.selected || false}
                          onChange={(e) => {
                            const key = `reputation-${format.id}`;
                            setSelectedFormats({
                              ...selectedFormats,
                              [key]: { ...selectedFormats[key], selected: e.target.checked }
                            });
                          }}
                          className="w-4 h-4 mt-0.5 cursor-pointer accent-purple-500"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-800">{format.icon} {format.name}</p>
                          <p className="text-xs text-gray-600">{format.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen de Formatos Seleccionados */}
              {Object.values(selectedFormats).some((f) => f.selected) && (
                <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                  <p className="text-xs font-semibold text-green-900 mb-2">✨ Formatos Seleccionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedFormats)
                      .filter(([, format]) => format.selected)
                      .map(([key]) => {
                        const [, , formatId] = key.split('-');
                        const formats: Record<string, any> = {
                          'web-seo': { blog: '📝 Blog Post', landing: '🎯 Landing', 'faq-schema': '❓ FAQ + Schema' },
                          social: { linkedin: '💼 LinkedIn', instagram: '📸 Instagram', facebook: '👥 Facebook', twitter: '𝕏 Twitter' },
                          email: { 'email-sales': '💌 Email Venta', newsletter: '📰 Newsletter', 'pdf-leadmagnet': '📄 PDF' },
                          reputation: { 'local-seo-reviews': '📍 Local SEO', 'tiktok-ugc': '🎬 TikTok' },
                        };
                        const [category] = key.split('-');
                        const label = formats[category]?.[formatId] || formatId;
                        return (
                          <span key={key} className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-green-300 text-green-700">
                            {label}
                          </span>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PASO 6: Origen del Insight + SEO Local */}
      {selectedClient && selectedKeywordsArray.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold">6</span>
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

      {/* Modal: Guardar Keyword en Cliente */}
      {showSaveKeywordModal && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSaveKeywordModal(false)} />

          {/* Modal */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-4 w-96">
            <h3 className="text-base font-bold text-gray-800 mb-1">Agregar Keyword</h3>
            <p className="text-xs text-gray-600 mb-3">
              <span className="font-semibold text-amber-700">"{pendingKeyword}"</span>
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-700 font-medium">Clasificación:</p>

              {/* Selector de Nivel */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    const levelObj = KEYWORD_STRUCTURE.find(l => l.id === e.target.value);
                    if (levelObj && levelObj.items.length > 0) {
                      setSelectedSubLevel(levelObj.items[0].id);
                    }
                  }}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-amber-500"
                >
                  {KEYWORD_STRUCTURE.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Sub-nivel */}
              {KEYWORD_STRUCTURE.find(l => l.id === selectedLevel) && (
                <select
                  value={selectedSubLevel}
                  onChange={(e) => setSelectedSubLevel(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-amber-500"
                >
                  {KEYWORD_STRUCTURE.find(l => l.id === selectedLevel)?.items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const newSelected = new Set(selectedKeywords);
                  newSelected.add(pendingKeyword);
                  setSelectedKeywords(newSelected);
                  setKeywordInput('');
                  setPendingKeyword('');
                  setShowSaveKeywordModal(false);
                  const newInsights = generateInsights(Array.from(newSelected), selectedClient);
                  setInsights(newInsights);
                  setSelectedInsightId(null);
                }}
                className="w-full px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded hover:bg-blue-100 transition text-xs font-medium"
              >
                Solo sesión
              </button>

              <button
                onClick={() => {
                  const newSelected = new Set(selectedKeywords);
                  newSelected.add(pendingKeyword);
                  setSelectedKeywords(newSelected);
                  setKeywordInput('');

                  if (selectedClient && onAddCustomKeyword) {
                    onAddCustomKeyword(selectedClient.id, pendingKeyword);
                  }

                  setPendingKeyword('');
                  setShowSaveKeywordModal(false);
                  const newInsights = generateInsights(Array.from(newSelected), selectedClient);
                  setInsights(newInsights);
                  setSelectedInsightId(null);
                }}
                className="w-full px-3 py-2 bg-green-50 text-green-700 border border-green-300 rounded hover:bg-green-100 transition text-xs font-medium"
              >
                💾 Guardar en cliente
              </button>

              <button
                onClick={() => {
                  setPendingKeyword('');
                  setShowSaveKeywordModal(false);
                }}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition text-xs font-medium"
              >
                Cancelar
              </button>
            </div>
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
