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
      subType: 'tone-selector',
    },
    {
      id: 'newsletter',
      name: 'Newsletter Editorial',
      icon: '📰',
      description: '600-800 palabras, formato Substack, liderazgo intelectual',
      hasSub: true,
      subType: 'tone-selector',
    },
    {
      id: 'pdf-leadmagnet',
      name: 'PDF Report / Lead Magnet',
      icon: '📄',
      description: '2-3 páginas descargables con estructura formal',
      hasSub: true,
      subType: 'tone-selector',
    },
  ],
};

const BLOG_TYPES = [
  {
    id: 'short',
    name: 'Post Corto / Actualización',
    range: '500 - 800 palabras',
    description: 'Directo, máximo 3 H2',
    icon: '⚡',
  },
  {
    id: 'standard',
    name: 'Post Estándar',
    range: '1000 - 1200 palabras',
    description: 'Optimizado para Topic Clusters',
    icon: '🎯',
  },
  {
    id: 'ultimate',
    name: 'Guía Definitiva / Contenido Pilar',
    range: '1500 - 2500 palabras',
    description: 'FAQs jerarquizadas y tablas comparativas',
    icon: '🏆',
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
      {/* Categories */}
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
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        📏 Tipo de Blog Post
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

                  {/* Tone Selector */}
                  {isSelected && hasSub && format.subType === 'tone-selector' && (
                    <div className="ml-4 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
                      <ToneSelector
                        selectedTone={
                          selectedFormats[key]?.tone || 'professional'
                        }
                        onChange={(tone) => handleToneChange(key, tone)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

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
