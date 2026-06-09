'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ToneSelector from '../selectors/ToneSelector';

interface FormatOutputSelectorProps {
  onFormatChange?: (formats: Record<string, any>) => void;
}

const CATEGORIES = [
  {
    id: 'web-seo',
    name: 'WEB & SEO',
    icon: '🌐',
    color: '#3b82f6',
  },
  {
    id: 'social',
    name: 'REDES SOCIALES (META & PROFESIONAL)',
    icon: '📱',
    color: '#ec4899',
  },
  {
    id: 'email',
    name: 'EMAIL & PREMIUM',
    icon: '📧',
    color: '#f59e0b',
  },
  {
    id: 'reputation',
    name: '⭐ REPUTACIÓN & COMUNIDAD (LOCAL & TIKTOK)',
    icon: '⭐',
    color: '#8b5cf6',
  },
];

const FORMATS = {
  'web-seo': [
    {
      id: 'blog',
      name: 'Blog Post',
      icon: '📝',
      description: 'Artículos y posts para el blog',
      hasSub: true,
      subType: 'blog-types',
    },
    {
      id: 'landing',
      name: 'Landing de Servicio',
      icon: '🎯',
      description: '600-900 palabras, frameworks PAS/AIDA, enfoque a conversión',
      hasSub: false,
    },
    {
      id: 'faq-schema',
      name: 'Bloque FAQ + Schema',
      icon: '❓',
      description: '5-7 preguntas + código JSON-LD listo para copiar',
      hasSub: false,
    },
  ],
  social: [
    {
      id: 'linkedin',
      name: 'LinkedIn Post',
      icon: '💼',
      description: '150-250 palabras, ganchos potentes, sin robótica corporativa',
      hasSub: false,
    },
    {
      id: 'instagram',
      name: 'Instagram Post',
      icon: '📸',
      description: '100-150 palabras + esquema de carrusel de 4 láminas',
      hasSub: true,
      subType: 'instagram-carousel',
    },
    {
      id: 'facebook',
      name: 'Facebook Post',
      icon: '👥',
      description: '200-300 palabras, storytelling local y pregunta comunitaria',
      hasSub: false,
    },
    {
      id: 'twitter',
      name: 'Hilo de X (Twitter)',
      icon: '𝕏',
      description: '5-8 tweets en cadena con gancho numérico y CTA',
      hasSub: false,
    },
  ],
  email: [
    {
      id: 'email-sales',
      name: 'Email de Venta / Secuencia',
      icon: '💌',
      description: '250-350 palabras, variables personalizables, Asunto agresivo',
      hasSub: true,
      subType: 'email-personalization',
    },
    {
      id: 'newsletter',
      name: 'Newsletter Editorial',
      icon: '📰',
      description: '600-800 palabras, formato Substack, liderazgo intelectual',
      hasSub: true,
      subType: 'newsletter-structure',
    },
    {
      id: 'pdf-leadmagnet',
      name: 'PDF Report / Lead Magnet',
      icon: '📄',
      description: '2-3 páginas descargables con estructura formal',
      hasSub: true,
      subType: 'pdf-report-types',
    },
  ],
  reputation: [
    {
      id: 'local-seo-reviews',
      name: 'Reseñas Local SEO (GBP)',
      icon: '📍',
      description: 'Respuestas optimizadas con keywords locales para Google Maps o plantillas de petición de reseña con enfoque SEO',
      hasSub: false,
    },
    {
      id: 'tiktok-ugc',
      name: 'TikTok Community & UGC',
      icon: '🎬',
      description: 'Guiones de vídeo estilo UGC basados en reseñas de producto o guiones de respuesta a comentarios/objeciones de usuarios',
      hasSub: false,
    },
  ],
};

const BLOG_TYPES = [
  {
    id: 'blog-post',
    name: 'Blog Post / Artículo SEO',
    range: '1,500 - 3,000 palabras',
    description: 'Artículo completo optimizado para SEO con estructura H2-H3, ejemplos y CTAs',
    icon: '📝',
  },
  {
    id: 'pillar-content',
    name: 'Contenido Pilar',
    range: '1,500 - 2,500 palabras',
    description: 'Contenido maestro que agrupa varios temas relacionados con referencias cruzadas',
    icon: '🏛️',
  },
  {
    id: 'trending-quick',
    name: 'Tendencia Rápida',
    range: '500 - 800 palabras',
    description: 'Artículo rápido sobre tendencias actuales con análisis conciso y ejemplos',
    icon: '⚡',
  },
  {
    id: 'case-study',
    name: 'Caso de Éxito',
    range: '800 - 1,200 palabras',
    description: 'Historia de cliente: Problema → Solución → Resultados con métricas reales',
    icon: '🎯',
  },
];

const INSTAGRAM_CAROUSEL = [
  {
    id: 'carousel-4',
    name: 'Carrusel de 4 Láminas',
    description: 'Estructura visual optimizada para engagement',
    icon: '🎬',
  },
];

const EMAIL_PERSONALIZATION = [
  {
    id: 'email-vars-basic',
    name: 'Variables Básicas',
    description: '{{nombre}}, {{empresa}}, {{producto}}',
    icon: '📝',
  },
  {
    id: 'email-vars-advanced',
    name: 'Variables Avanzadas',
    description: '{{ciudad}}, {{sector}}, {{presupuesto}}, {{fecha_compra}}',
    icon: '🔧',
  },
];

const EMAIL_SUBJECT_TYPES = [
  {
    id: 'subject-urgency',
    name: 'Urgencia / FOMO',
    description: 'Limpiado, ofertas por tiempo limitado',
    icon: '⏰',
  },
  {
    id: 'subject-curiosity',
    name: 'Curiosidad / Intriga',
    description: 'Preguntas, números, datos sorprendentes',
    icon: '❓',
  },
  {
    id: 'subject-benefit',
    name: 'Beneficio Directo',
    description: 'Promesas claras de valor (Ahorro, Crecimiento)',
    icon: '✨',
  },
];

const NEWSLETTER_STRUCTURE = [
  {
    id: 'newsletter-intro-main-close',
    name: 'Intro + Contenido + Conclusión',
    description: 'Estructura clásica: gancho, artículo, llamada a acción',
    icon: '📄',
  },
  {
    id: 'newsletter-curated',
    name: 'Curación Semanal (Top 5)',
    description: '5 artículos seleccionados con comentarios personales',
    icon: '⭐',
  },
  {
    id: 'newsletter-deep-dive',
    name: 'Deep Dive Temático',
    description: 'Análisis profundo de 1-2 temas con secciones numeradas',
    icon: '🔍',
  },
];

const PDF_REPORT_TYPES = [
  {
    id: 'pdf-case-study',
    name: 'Case Study',
    description: 'Problema → Solución → Resultados con métricas reales',
    icon: '📊',
  },
  {
    id: 'pdf-whitepaper',
    name: 'Whitepaper',
    description: 'Investigación formal, datos, bibliografía, conclusiones técnicas',
    icon: '📑',
  },
  {
    id: 'pdf-guide',
    name: 'Guía Práctica',
    description: 'Paso a paso, checklist, ejemplos aplicables',
    icon: '📘',
  },
  {
    id: 'pdf-industry-report',
    name: 'Reporte de Industria',
    description: 'Análisis de tendencias, benchmark, pronósticos',
    icon: '📈',
  },
];

export default function FormatOutputSelector({
  onFormatChange,
}: FormatOutputSelectorProps) {
  const [selectedFormats, setSelectedFormats] = useState<
    Record<string, { selected: boolean; subType?: string; tone?: string }>
  >({});

  const [expandedSubSelectors, setExpandedSubSelectors] = useState<
    Record<string, boolean>
  >({});
  const [subSelectorValues, setSubSelectorValues] = useState<Record<string, string>>({});

  const handleFormatChange = (
    categoryId: string,
    formatId: string,
    checked: boolean,
    subType?: string
  ) => {
    const key = `${categoryId}-${formatId}`;
    const updated = { ...selectedFormats };

    if (checked) {
      updated[key] = { selected: true, subType };
    } else {
      delete updated[key];
    }

    setSelectedFormats(updated);
    onFormatChange?.(updated);

    // Expand sub-selector if format has one
    if (subType && checked) {
      setExpandedSubSelectors((prev) => ({ ...prev, [key]: true }));
    }
  };

  const handleSubSelectorChange = (key: string, value: string) => {
    setSubSelectorValues((prev) => ({ ...prev, [key]: value }));
    setSelectedFormats((prev) => ({
      ...prev,
      [key]: { ...prev[key], subType: value },
    }));
  };

  const handleToneChange = (key: string, tone: string) => {
    setSelectedFormats((prev) => ({
      ...prev,
      [key]: { ...prev[key], tone },
    }));
  };

  const webColors = {
    primary: '#7BF1A8',
    primaryDark: '#333333',
    background: '#f5f5f5',
    greenLight: '#f0fdf7',
    greenLighter: '#f8fffc',
  };

  return (
    <div className="w-full space-y-6">
      {/* Categories Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="space-y-3">
          {/* Category Header */}
          <div
            className="px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.icon} {category.name}
          </div>

          {/* Formats in Category */}
          <div className="space-y-3 ml-2">
            {FORMATS[category.id as keyof typeof FORMATS]?.map((format) => {
              const key = `${category.id}-${format.id}`;
              const isSelected = selectedFormats[key]?.selected || false;
              const hasSub = format.hasSub;

              return (
                <div key={format.id} className="space-y-2">
                  {/* Format Checkbox */}
                  <label className="flex items-start p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:border-gray-300 transition">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleFormatChange(
                          category.id,
                          format.id,
                          e.target.checked,
                          format.subType
                        )
                      }
                      className="w-4 h-4 mt-1 cursor-pointer"
                      style={{ accentColor: webColors.primary }}
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-800">
                        {format.icon} {format.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {format.description}
                      </p>
                    </div>
                  </label>

                  {/* Sub-Selectors */}
                  {isSelected && hasSub && format.subType === 'blog-types' && (
                    <div className="ml-4 space-y-2 overflow-hidden transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700">
                          📏 Selecciona un tipo (solo 1 permitido):
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                          Restringido
                        </span>
                      </div>
                      {BLOG_TYPES.map((blogType) => (
                        <label
                          key={blogType.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            subSelectorValues[key] === blogType.id
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-white border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`blog-${key}`}
                            value={blogType.id}
                            checked={subSelectorValues[key] === blogType.id}
                            onChange={(e) =>
                              handleSubSelectorChange(key, e.target.value)
                            }
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                            style={{ accentColor: webColors.primary }}
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-start justify-between">
                              <p className="text-xs font-bold text-gray-800">
                                {blogType.icon} {blogType.name}
                              </p>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {blogType.range}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {blogType.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Instagram Carousel Selector */}
                  {isSelected && hasSub && format.subType === 'instagram-carousel' && (
                    <div className="ml-4 space-y-2 overflow-hidden transition-all duration-300">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        🎬 Esquema de Carrusel
                      </div>
                      {INSTAGRAM_CAROUSEL.map((carousel) => (
                        <label
                          key={carousel.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            subSelectorValues[key] === carousel.id
                              ? 'bg-pink-50 border-pink-500'
                              : 'bg-white border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`carousel-${key}`}
                            value={carousel.id}
                            checked={subSelectorValues[key] === carousel.id}
                            onChange={(e) =>
                              handleSubSelectorChange(key, e.target.value)
                            }
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                            style={{ accentColor: webColors.primary }}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-xs font-bold text-gray-800">
                              {carousel.icon} {carousel.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {carousel.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Email Personalization Variables */}
                  {isSelected && hasSub && format.subType === 'email-personalization' && (
                    <div className="ml-4 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        📝 Variables de Personalización
                      </div>
                      {EMAIL_PERSONALIZATION.map((var_type) => (
                        <label
                          key={var_type.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            subSelectorValues[key] === var_type.id
                              ? 'bg-yellow-50 border-yellow-500'
                              : 'bg-white border-gray-200 hover:border-yellow-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`email-vars-${key}`}
                            value={var_type.id}
                            checked={subSelectorValues[key] === var_type.id}
                            onChange={(e) => handleSubSelectorChange(key, e.target.value)}
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                            style={{ accentColor: webColors.primary }}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-xs font-bold text-gray-800">{var_type.icon} {var_type.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{var_type.description}</p>
                          </div>
                        </label>
                      ))}
                      <div className="text-xs font-semibold text-gray-700 mt-4 mb-2">
                        ⏰ Tipo de Asunto
                      </div>
                      {EMAIL_SUBJECT_TYPES.map((subject_type) => (
                        <label
                          key={subject_type.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            subSelectorValues[`${key}-subject`] === subject_type.id
                              ? 'bg-yellow-50 border-yellow-500'
                              : 'bg-white border-gray-200 hover:border-yellow-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`email-subject-${key}`}
                            value={subject_type.id}
                            checked={subSelectorValues[`${key}-subject`] === subject_type.id}
                            onChange={(e) => handleSubSelectorChange(`${key}-subject`, e.target.value)}
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                            style={{ accentColor: webColors.primary }}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-xs font-bold text-gray-800">{subject_type.icon} {subject_type.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{subject_type.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Newsletter Structure */}
                  {isSelected && hasSub && format.subType === 'newsletter-structure' && (
                    <div className="ml-4 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        📋 Estructura Substack
                      </div>
                      {NEWSLETTER_STRUCTURE.map((structure) => (
                        <label
                          key={structure.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            subSelectorValues[key] === structure.id
                              ? 'bg-orange-50 border-orange-500'
                              : 'bg-white border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`newsletter-${key}`}
                            value={structure.id}
                            checked={subSelectorValues[key] === structure.id}
                            onChange={(e) => handleSubSelectorChange(key, e.target.value)}
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                            style={{ accentColor: webColors.primary }}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-xs font-bold text-gray-800">{structure.icon} {structure.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{structure.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* PDF Report Type */}
                  {isSelected && hasSub && format.subType === 'pdf-report-types' && (
                    <div className="ml-4 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        📊 Tipo de Reporte
                      </div>
                      {PDF_REPORT_TYPES.map((report_type) => (
                        <label
                          key={report_type.id}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                            subSelectorValues[key] === report_type.id
                              ? 'bg-purple-50 border-purple-500'
                              : 'bg-white border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`pdf-${key}`}
                            value={report_type.id}
                            checked={subSelectorValues[key] === report_type.id}
                            onChange={(e) => handleSubSelectorChange(key, e.target.value)}
                            className="w-4 h-4 mt-0.5 cursor-pointer"
                            style={{ accentColor: webColors.primary }}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-xs font-bold text-gray-800">{report_type.icon} {report_type.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{report_type.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        ))}
      </div>

      {/* Selection Summary */}
      {Object.values(selectedFormats).some((f) => f.selected) && (
        <div
          className="mt-6 p-4 rounded-lg border-2"
          style={{
            backgroundColor: webColors.greenLighter,
            borderColor: webColors.primary,
          }}
        >
          <p className="text-xs font-semibold text-gray-800 mb-3">
            ✨ Formatos Seleccionados:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFormats)
              .filter(([, format]) => format.selected)
              .map(([key, format]) => {
                const [categoryId, formatId] = key.split('-');
                const category = CATEGORIES.find((c) => c.id === categoryId);
                const formatData = FORMATS[categoryId as keyof typeof FORMATS]?.find(
                  (f) => f.id === formatId
                );

                return (
                  <span
                    key={key}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2"
                    style={{ backgroundColor: webColors.primary, color: '#333333' }}
                  >
                    {formatData?.icon} {formatData?.name}
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
