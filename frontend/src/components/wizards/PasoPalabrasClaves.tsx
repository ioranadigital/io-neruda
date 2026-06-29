'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { ChevronDown, Plus, X, Tags, Building, MapPin, BookOpen, Scale, Crosshair, Ban, AlertCircle, CheckCircle2, Zap, Lightbulb } from 'lucide-react';
import { KEYWORD_STRUCTURE } from '@/src/data/keywordStructure';
import StepContainer from './StepContainer';

interface PasoPalabrasClaveProps {
  selectedClient: Client | null;
  selectedKeywords: string[];
  onKeywordChange: (keywords: string[]) => void;
  formatType?: 'web_seo' | 'social_only' | 'messaging_only' | null;
  isKeywordsRequired?: boolean;
  isKeywordsOptional?: boolean;
  isKeywordsBypassed?: boolean;
  selectedIntention?: string | null;
  disabledByIntention?: string[];
  allDisabledKeywords?: string[];
  maxKeywordsAllowed?: number;
}

// Obtiene todas las keywords del Nivel 6 por defecto
const getDefaultLevel6Keywords = (selectedClient?: Client | null) => {
  // Si el cliente tiene keywords jerárquicas, obtener Nivel 6 del cliente
  if (selectedClient?.keywords_hierarchical) {
    const hierarch = selectedClient.keywords_hierarchical;
    const level6Keywords: string[] = [];

    // Recolectar todas las palabras del Nivel 6 desde las diferentes secciones
    if (hierarch.level6_banned_words) level6Keywords.push(...hierarch.level6_banned_words);
    if (hierarch.level6_banned_tones) level6Keywords.push(...hierarch.level6_banned_tones);
    if (hierarch.level6_competing_keywords) level6Keywords.push(...hierarch.level6_competing_keywords);

    return level6Keywords;
  }

  // Fallback a estructura estática si no hay keywords jerárquicas
  const level6 = KEYWORD_STRUCTURE.find((l) => l.id === 'level-6-exclude');
  if (!level6) return [];
  return level6.items.flatMap((item) => item.keywords);
};

// Mapea IDs de nivel a iconos de lucide-react
const getIconForLevel = (levelId: string) => {
  const iconMap: Record<string, any> = {
    'level-1-entity': Building,
    'level-2-segmentation': MapPin,
    'level-3-informational': BookOpen,
    'level-4-research': Scale,
    'level-5-longtail': Crosshair,
    'level-6-exclude': Ban,
  };
  return iconMap[levelId];
};

export default function PasoPalabrasClaves({
  selectedClient,
  selectedKeywords,
  onKeywordChange,
  formatType = null,
  isKeywordsRequired = false,
  isKeywordsOptional = false,
  isKeywordsBypassed = false,
  selectedIntention = null,
  disabledByIntention = [],
  allDisabledKeywords = [],
  maxKeywordsAllowed = 4,
}: PasoPalabrasClaveProps) {
  const [expandedSection, setExpandedSection] = useState(true);
  const [expandedLevel, setExpandedLevel] = useState<string | null>('level-1-entity');
  const [newKeyword, setNewKeyword] = useState('');

  // ===== USAR KEYWORDS JERÁRQUICAS DEL CLIENTE EN LUGAR DE ESTRUCTURA ESTÁTICA =====
  const getEnrichedKeywordStructure = React.useMemo(() => {
    if (!selectedClient?.keywords_hierarchical) {
      return KEYWORD_STRUCTURE;
    }

    const hierarch = selectedClient.keywords_hierarchical;
    return [
      {
        id: 'level-1-entity',
        icon: '🏗️',
        level: 'Nivel 1: Keywords de Entidad y Core',
        title: 'Fundación del Negocio',
        items: [
          {
            id: 'entity-core',
            name: 'Keywords de Entidad y Core',
            description: 'La base del negocio. Palabras que definen qué es tu empresa y en qué mercado compite.',
            keywords: hierarch.level1_entity_core || [],
          },
          {
            id: 'branded-kw',
            name: 'Keywords de Marca (Branded KW)',
            description: 'Búsquedas que incluyen directamente el nombre de tu empresa. Mayor tasa de conversión.',
            keywords: hierarch.level1_branded || [],
          },
          {
            id: 'third-party-brand',
            name: 'Keywords de Marca de Terceros / Fabricante',
            description: 'Términos de las marcas líderes que distribuyes. Atraen tráfico con alta intención de compra.',
            keywords: hierarch.level1_brand_third_party || [],
          },
          {
            id: 'niche-head',
            name: 'Keywords de Nicho / Sector (Head Terms)',
            description: 'Palabras clave genéricas de una o dos palabras que definen tus categorías maestras.',
            keywords: hierarch.level1_niche_sector || [],
          },
        ],
      },
      {
        id: 'level-2-segmentation',
        icon: '🗺️',
        level: 'Nivel 2: Keywords de Segmentación',
        title: 'Segmentación de Mercado',
        items: [
          {
            id: 'local-kw',
            name: 'Keywords Locales (Geo-targeted KW)',
            description: 'Palabras clave que incluyen una ubicación geográfica. Cruciales para SEO Local.',
            keywords: hierarch.level2_local || [],
          },
          {
            id: 'audience-profile',
            name: 'Keywords de Audiencia / Perfil',
            description: 'Definen el tipo de usuario que consume el producto, segmentando por experiencia o necesidad.',
            keywords: hierarch.level2_audience_profile || [],
          },
        ],
      },
      {
        id: 'level-3-informational',
        icon: '🎓',
        level: 'Nivel 3: Keywords Informacionales y Editoriales',
        title: 'Contenido Educativo',
        items: [
          {
            id: 'educational-howto',
            name: 'Keywords Educacionales / "How-to"',
            description: 'Búsquedas que empiezan por "cómo", "qué", "cuándo" o "por qué". Demuestran autoridad técnica.',
            keywords: hierarch.level3_educational_howto || [],
          },
          {
            id: 'problem-symptom',
            name: 'Keywords de Problema / Síntoma',
            description: 'El usuario detecta que algo va mal pero no sabe qué producto necesita para solucionarlo.',
            keywords: hierarch.level3_problem_symptom || [],
          },
          {
            id: 'seasonal',
            name: 'Keywords Estacionales',
            description: 'Búsquedas que explotan en épocas muy concretas del año. El blog debe anticiparse a ellas.',
            keywords: hierarch.level3_seasonal || [],
          },
        ],
      },
      {
        id: 'level-4-research',
        icon: '⚖️',
        level: 'Nivel 4: Keywords de Investigación Comercial',
        title: 'Investigación Previa a la Compra',
        items: [
          {
            id: 'comparative-vs',
            name: 'Keywords Comparativas ("Vs")',
            description: 'Enfrentan dos tecnologías, marcas o modelos para resolver la duda del comprador.',
            keywords: hierarch.level4_comparative_vs || [],
          },
          {
            id: 'lists-roundups',
            name: 'Keywords de Listas / Recopilatorios',
            description: 'Búsquedas que agrupan los mejores productos bajo un criterio de calidad o precio.',
            keywords: hierarch.level4_lists_roundups || [],
          },
          {
            id: 'review-opinions',
            name: 'Keywords de Review / Opiniones',
            description: 'Análisis profundos de un modelo exacto. Tráfico hiper-cualificado.',
            keywords: hierarch.level4_review_opinions || [],
          },
        ],
      },
      {
        id: 'level-5-longtail',
        icon: '🎯',
        level: 'Nivel 5: Keywords de Larga Cola (Long-Tail KW)',
        title: 'Búsquedas Específicas',
        items: [
          {
            id: 'longtail-informational',
            name: 'Long-Tail Informacional de Nicho',
            description: 'Resuelven una duda extremadamente específica.',
            keywords: hierarch.level5_longtail_informational || [],
          },
          {
            id: 'longtail-transactional',
            name: 'Long-Tail Transaccional Oculta',
            description: 'Búsquedas tan detalladas que revelan que el usuario está listo para comprar ya.',
            keywords: hierarch.level5_longtail_transactional || [],
          },
        ],
      },
      {
        id: 'level-6-exclude',
        icon: '🚫',
        level: 'Nivel 6: Exclusiones y Restricciones [Heredado del Cliente]',
        title: 'Palabras a Evitar',
        items: [
          {
            id: 'banned-words',
            name: 'Palabras Prohibidas',
            description: 'Términos y frases que NO deben aparecer en el contenido. Evita clichés y palabras gastadas.',
            keywords: hierarch.level6_banned_words || [],
          },
          {
            id: 'banned-tones',
            name: 'Tonos Prohibidos',
            description: 'Estilos de escritura que NO encajan con la marca. Evita inconsistencia de voz.',
            keywords: hierarch.level6_banned_tones || [],
          },
          {
            id: 'competing-keywords',
            name: 'Keywords de Competencia a Evitar',
            description: 'Búsquedas donde nuestros competidores dominan. Enfocarse en oportunidades propias.',
            keywords: hierarch.level6_competing_keywords || [],
          },
        ],
      },
    ];
  }, [selectedClient?.keywords_hierarchical, selectedClient?.id]);

  // ===== HELPERS PARA SEPARACIÓN NIVEL 6 =====
  const level6Keywords = React.useMemo(() => getDefaultLevel6Keywords(selectedClient), [selectedClient]);
  const manualKeywords = React.useMemo(() => selectedKeywords.filter((kw) => !level6Keywords.includes(kw)), [selectedKeywords, level6Keywords]);
  const level6SelectedCount = React.useMemo(() => selectedKeywords.filter((kw) => level6Keywords.includes(kw)).length, [selectedKeywords, level6Keywords]);

  // ===== HELPERS PARA RESTRICCIONES (SOLO NIVELES 1-5) =====
  const isKeywordFromLevel = React.useCallback((keyword: string, levelId: string): boolean => {
    if (!keyword || !levelId) return false;
    try {
      for (const level of getEnrichedKeywordStructure) {
        if (level.id === levelId) {
          for (const item of level.items) {
            if (item.keywords && item.keywords.includes(keyword)) return true;
          }
        }
      }
    } catch (e) {
      console.error('Error in isKeywordFromLevel:', e);
    }
    return false;
  }, [getEnrichedKeywordStructure]);

  const getSelectedKeywordsFromLevel = (levelId: string): string[] => {
    return manualKeywords.filter((kw) => isKeywordFromLevel(kw, levelId));
  };

  const isLevel1KeywordSelected = (): boolean => {
    return getSelectedKeywordsFromLevel('level-1-entity').length > 0;
  };

  const hasLongTailSelected = (): boolean => {
    return getSelectedKeywordsFromLevel('level-5-longtail').length > 0;
  };

  const hasProblemaSelected = (): boolean => {
    return manualKeywords.includes('parrilla humo') ||
           manualKeywords.includes('barbacoa no calienta uniforme') ||
           manualKeywords.includes('carbón no enciende') ||
           manualKeywords.includes('óxido en parrilla');
  };

  const hasBrandKeywordSelected = (): boolean => {
    const brandKeywords = ['miempresa barbacoa', 'tienda barbacoas miempresa', 'miempresa parrillas'];
    return manualKeywords.some((kw) => brandKeywords.includes(kw));
  };

  const hasThirdPartySelected = (): boolean => {
    const thirdPartyKeywords = ['Weber barbacoa', 'Kamado Joe', 'Traeger pellets', 'Broil King'];
    return manualKeywords.some((kw) => thirdPartyKeywords.includes(kw));
  };

  // ===== REGLAS DE VALIDACIÓN ESTRICTAS =====
  const isKeywordDisabled = (keywordId: string, levelId: string): boolean => {
    const isLevel6 = levelId === 'level-6-exclude';
    // El Nivel 6 ahora es editable (se puede quitar pero no agregar más)

    // Deshabilita si está en la lista de disabledByIntention
    if (disabledByIntention?.includes(keywordId)) {
      return true;
    }

    // REGLA 1: Límite global de 4 keywords manuales (Niveles 1-5)
    if (manualKeywords.length >= maxKeywordsAllowed && !manualKeywords.includes(keywordId)) {
      return true;
    }

    // REGLA 2: Solo UNA keyword del Nivel 1 permitida
    if (levelId === 'level-1-entity' && isLevel1KeywordSelected() && !manualKeywords.includes(keywordId)) {
      return true;
    }

    // REGLA 3A: Incompatibilidad Brand ↔ Third-party
    if (hasBrandKeywordSelected()) {
      const thirdPartyKeywords = ['Weber barbacoa', 'Kamado Joe', 'Traeger pellets', 'Broil King'];
      if (thirdPartyKeywords.includes(keywordId)) {
        return true;
      }
    }
    if (hasThirdPartySelected()) {
      const brandKeywords = ['miempresa barbacoa', 'tienda barbacoas miempresa', 'miempresa parrillas'];
      if (brandKeywords.includes(keywordId)) {
        return true;
      }
    }

    // REGLA 3B: Long-tail bloquea Nicho
    if (hasLongTailSelected()) {
      const nichoKeywords = ['barbacoas', 'parrillas', 'accesorios jardin', 'elementos patio'];
      if (nichoKeywords.includes(keywordId)) {
        return true;
      }
    }

    // REGLA 3C: Problema bloquea Nivel 4 (Research)
    if (hasProblemaSelected() && levelId === 'level-4-research') {
      return true;
    }

    return false;
  };

  const getDisabledReason = (keywordId: string, levelId: string): string => {
    const isLevel6 = levelId === 'level-6-exclude';
    if (isLevel6) {
      return 'Fijo por cliente (heredado de restricciones corpo)';
    }

    if (disabledByIntention?.includes(keywordId)) {
      const intentionName = selectedIntention === 'educational' ? 'enfoque educacional' : 'enfoque transaccional';
      return `Deshabilitado por ${intentionName}`;
    }

    if (manualKeywords.length >= maxKeywordsAllowed && !manualKeywords.includes(keywordId)) {
      return `Límite máximo alcanzado (${manualKeywords.length}/${maxKeywordsAllowed})`;
    }

    if (levelId === 'level-1-entity' && isLevel1KeywordSelected() && !manualKeywords.includes(keywordId)) {
      return 'Solo se permite una keyword del Nivel 1 (Core)';
    }

    if (hasBrandKeywordSelected()) {
      const thirdPartyKeywords = ['Weber barbacoa', 'Kamado Joe', 'Traeger pellets', 'Broil King'];
      if (thirdPartyKeywords.includes(keywordId)) {
        return 'Incompatible con Keywords de Marca (Branded)';
      }
    }

    if (hasThirdPartySelected()) {
      const brandKeywords = ['miempresa barbacoa', 'tienda barbacoas miempresa', 'miempresa parrillas'];
      if (brandKeywords.includes(keywordId)) {
        return 'Incompatible con Keywords de Marca de Terceros';
      }
    }

    if (hasLongTailSelected()) {
      const nichoKeywords = ['barbacoas', 'parrillas', 'accesorios jardin', 'elementos patio'];
      if (nichoKeywords.includes(keywordId)) {
        return 'Incompatible con Long-Tail Keywords';
      }
    }

    if (hasProblemaSelected() && levelId === 'level-4-research') {
      return 'Bloqueado por Keywords de Problema/Síntoma';
    }

    return '';
  };

  // Oculta niveles según el formato
  const shouldShowLevel = (levelId: string): boolean => {
    if (formatType === 'social_only') {
      // Oculta: Nivel 1, 4, 5
      if (['level-1-entity', 'level-4-research', 'level-5-longtail'].includes(levelId)) {
        return false;
      }
    }
    return true;
  };

  // Mapea cada keyword a su nivel (usando la estructura enriquecida) - ANTES de cualquier if
  const getKeywordLevel = React.useCallback((keyword: string) => {
    if (!keyword) return null;
    try {
      for (const level of getEnrichedKeywordStructure) {
        if (!level.items) continue;
        for (const item of level.items) {
          if (item.keywords && item.keywords.includes(keyword)) {
            return {
              levelId: level.id,
              levelName: level.level,
              levelIcon: level.icon,
            };
          }
        }
      }
    } catch (e) {
      console.error('Error in getKeywordLevel:', e);
    }
    return null;
  }, [getEnrichedKeywordStructure]);

  // Agrupa keywords por nivel
  const keywordsByLevel = React.useMemo(() => {
    try {
      return selectedKeywords.reduce(
        (acc, keyword) => {
          const levelInfo = getKeywordLevel(keyword);
          if (levelInfo) {
            const key = levelInfo.levelId;
            if (!acc[key]) {
              acc[key] = {
                levelId: levelInfo.levelId,
                levelName: levelInfo.levelName,
                levelIcon: levelInfo.levelIcon,
                keywords: [],
              };
            }
            acc[key].keywords.push(keyword);
          }
          return acc;
        },
        {} as Record<
          string,
          {
            levelId: string;
            levelName: string;
            levelIcon: string;
            keywords: string[];
          }
        >
      );
    } catch (e) {
      console.error('Error in keywordsByLevel:', e);
      return {};
    }
  }, [selectedKeywords, getKeywordLevel]);

  // Asegurar que Nivel 6 siempre esté seleccionado por defecto
  React.useEffect(() => {
    const defaultLevel6 = getDefaultLevel6Keywords(selectedClient);
    // Si no hay keywords seleccionadas, inicializar con el Nivel 6
    if (selectedKeywords.length === 0 && defaultLevel6.length > 0) {
      onKeywordChange(defaultLevel6);
    }
  }, [selectedClient?.id]);

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !selectedKeywords.includes(keyword.trim())) {
      // Respeta el límite máximo de SOLO keywords manuales (Niveles 1-5, excluye Nivel 6)
      if (manualKeywords.length < maxKeywordsAllowed) {
        onKeywordChange([...selectedKeywords, keyword.trim()]);
        setNewKeyword('');
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onKeywordChange(selectedKeywords.filter((kw) => kw !== keyword));
  };

  return (
    <StepContainer
      title="Palabras Claves del Contenido"
      icon={Tags}
      iconColor="cyan"
      columns={1}
      gap="medium"
    >
      {/* CONTENEDOR MAESTRO - Bloque Fijo Principal */}
      <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">

        {/* Banner Informativo Según Contexto */}
        {isKeywordsBypassed && (
          <div className="px-4 md:px-8 py-4 border-t border-blue-200 bg-blue-50 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Formato Mensajería Detectado</p>
              <p className="text-xs text-blue-700 mt-1">La selección de keywords es opcional para este formato. Puedes avanzar directamente al siguiente paso.</p>
            </div>
          </div>
        )}

        {isKeywordsOptional && formatType === 'social_only' && (
          <div className="px-4 md:px-8 py-4 border-t border-amber-200 bg-amber-50 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-semibold text-amber-900">Formato de Redes Detectado</p>
              </div>
              <p className="text-xs text-amber-700 mt-1">Selección de Keywords simplificada y opcional. Algunos niveles están ocultos para optimizar el copy en redes.</p>
            </div>
          </div>
        )}

        {/* Contenido Fijo */}
        <div className="px-4 md:px-8 py-3 border-t border-slate-200 bg-white">

            {/* REJILLA DE DOBLE COLUMNA SIMÉTRICA */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* COLUMNA IZQUIERDA - Panel de Selección (50%) */}
              <div>
                {/* Acordeones Independientes Apilados */}
                <div className="flex flex-col space-y-3 w-full">
                  {getEnrichedKeywordStructure.map(
                    (level) => (
                      <div
                        key={level.id}
                        className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition"
                      >
                        {/* Header del Acordeón */}
                        <button
                          onClick={() =>
                            setExpandedLevel(
                              expandedLevel === level.id ? null : level.id
                            )
                          }
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            {(() => {
                              const Icon = getIconForLevel(level.id);
                              const colorMap: Record<string, string> = {
                                'level-1-entity': 'text-blue-600',
                                'level-2-segmentation': 'text-green-600',
                                'level-3-informational': 'text-purple-600',
                                'level-4-research': 'text-orange-600',
                                'level-5-longtail': 'text-cyan-600',
                                'level-6-exclude': 'text-red-600',
                              };
                              const color = colorMap[level.id] || 'text-slate-600';
                              return Icon ? <Icon size={20} className={color} /> : <span className="text-xl">{level.icon}</span>;
                            })()}
                            <p className="font-semibold text-slate-900 text-sm">
                              {level.level}
                            </p>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`transition text-slate-500 ${
                              expandedLevel === level.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Contenido del Acordeón */}
                        {expandedLevel === level.id && (
                          <div className="px-4 py-4 border-t border-slate-200 bg-slate-50 space-y-3">
                            {level.items.map((item) => {
                              const isProductKeyword = item.id === 'producto-categoria';
                              return (
                              <div
                                key={item.id}
                                className={`rounded-lg border p-3 ${
                                  isProductKeyword
                                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <p className={`text-xs font-bold uppercase tracking-wide ${
                                    isProductKeyword ? 'text-blue-700' : 'text-slate-700'
                                  }`}>
                                    {item.name}
                                  </p>
                                  {isProductKeyword && (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-200 text-blue-700">
                                      Dinámico
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <div className="flex items-center gap-1 text-xs text-slate-600 mb-2 italic">
                                    <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                    <span>{item.description}</span>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {item.keywords.map((kw) => {
                                    const isSelected = selectedKeywords.includes(kw);
                                    const isDisabled = isKeywordDisabled(kw, level.id);
                                    const disabledReason = getDisabledReason(kw, level.id);
                                    const isLevel6 = level.id === 'level-6-exclude';

                                    return (
                                      <div key={kw} className="relative group">
                                        <button
                                          disabled={isDisabled}
                                          onClick={() => {
                                            if (isSelected) {
                                              handleRemoveKeyword(kw);
                                            } else if (!isDisabled) {
                                              handleAddKeyword(kw);
                                            }
                                          }}
                                          title={disabledReason}
                                          className={`px-2 py-1 rounded-full text-xs font-medium transition border ${
                                            isSelected
                                              ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-300 cursor-pointer'
                                              : isDisabled
                                              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-40'
                                              : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400 cursor-pointer'
                                          }`}
                                        >
                                          <span className="flex items-center gap-1">
                                            {kw}
                                            {isLevel6 && isSelected && <span className="text-green-700 font-bold">×</span>}
                                          </span>
                                        </button>
                                        {/* Tooltip en hover para razón de deshabilitación */}
                                        {isDisabled && disabledReason && (
                                          <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10 shadow-lg">
                                            {disabledReason}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                            })}

                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA - Panel de Control Lateral (30-35%) */}
              <div className="w-full flex flex-col space-y-4 lg:sticky lg:top-6">
                {/* Bloque Superior - Lectura (Grid 2 Columnas) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Columna Izquierda - Seleccionadas Manuales */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Seleccionadas (Manuales)
                    </p>
                    <div className="text-2xl font-bold text-blue-600">
                      {manualKeywords.length}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Niveles 1-5</p>
                  </div>

                  {/* Columna Derecha - Restricciones Nivel 6 */}
                  <div className="bg-white rounded-lg border border-red-200 p-4">
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
                      + Restricciones (Nivel 6)
                    </p>
                    <div className="text-2xl font-bold text-red-600">
                      {level6SelectedCount}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Filtros obligatorios del cliente</p>
                  </div>
                </div>

                {/* Zona Intermedia - Badges por Nivel */}
                {selectedKeywords.length > 0 && (
                  <div className="space-y-3">
                    {Object.values(keywordsByLevel)
                      .sort((a, b) => {
                        const levelOrder = [
                          'level-1-entity',
                          'level-2-segmentation',
                          'level-3-informational',
                          'level-4-research',
                          'level-5-longtail',
                          'level-6-exclude',
                        ];
                        return levelOrder.indexOf(a.levelId) - levelOrder.indexOf(b.levelId);
                      })
                      .map((levelGroup) => {
                        const isLevel6 = levelGroup.levelId === 'level-6-exclude';
                        return (
                          <div
                            key={levelGroup.levelId}
                            className={`w-full border p-4 rounded-xl ${
                              isLevel6
                                ? 'bg-white border-red-200'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <h4 className={`text-xs font-semibold mb-3 uppercase tracking-wider ${
                              isLevel6 ? 'text-red-700' : 'text-slate-700'
                            }`}>
                              {levelGroup.levelIcon} {levelGroup.levelName}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {levelGroup.keywords.map((kw) => (
                                <div
                                  key={kw}
                                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition bg-green-50 text-green-700 border-green-200 hover:border-green-300"
                                >
                                  {kw}
                                  <button
                                    onClick={() => handleRemoveKeyword(kw)}
                                    className="transition p-0.5 hover:text-green-900"
                                    title={isLevel6 ? 'Heredado del cliente - click para remover' : 'Remover keyword'}
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Zona Inferior - Inserción */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                    Agregar Personalizado
                  </p>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleAddKeyword(newKeyword);
                      }}
                      placeholder="Escribe keyword..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={() => handleAddKeyword(newKeyword)}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium text-sm"
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </StepContainer>
  );
}
