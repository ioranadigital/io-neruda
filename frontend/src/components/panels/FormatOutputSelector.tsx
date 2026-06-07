'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FormatOutputSelectorProps {
  onFormatChange?: (formats: Record<string, boolean>) => void;
}

const FORMATS = [
  {
    id: 'blog',
    name: 'Blog Post',
    icon: '📝',
    description: 'Artículos y posts para el blog',
    hasSub: true,
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    description: 'Campañas y newsletters por correo',
    hasSub: false,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    icon: '💼',
    description: 'Posts profesionales para LinkedIn',
    hasSub: false,
  },
  {
    id: 'instagram',
    name: 'Instagram Post',
    icon: '📸',
    description: 'Posts y captions para Instagram',
    hasSub: false,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Message',
    icon: '💬',
    description: 'Mensajes para WhatsApp Business',
    hasSub: false,
  },
  {
    id: 'pdf',
    name: 'PDF Report',
    icon: '📄',
    description: 'Reportes y guías en PDF',
    hasSub: false,
  },
];

const BLOG_TYPES = [
  {
    id: 'short',
    name: 'Post Corto / Actualización',
    range: '500 - 800 palabras',
    description: 'Actualizaciones rápidas, noticias del sector',
    icon: '⚡',
  },
  {
    id: 'standard',
    name: 'Post Estándar / Atacando Keyword',
    range: '1000 - 1200 palabras',
    description: 'Contenido optimizado para SEO, enfocado en keywords',
    icon: '🎯',
  },
  {
    id: 'ultimate',
    name: 'Guía Definitiva / Contenido Pilar',
    range: '1500 - 2500 palabras',
    description: 'Guías completas con FAQs, tablas, ejemplos detallados',
    icon: '🏆',
  },
];

export default function FormatOutputSelector({ onFormatChange }: FormatOutputSelectorProps) {
  const [selectedFormats, setSelectedFormats] = useState<Record<string, boolean>>({
    blog: false,
    email: false,
    linkedin: false,
    instagram: false,
    whatsapp: false,
    pdf: false,
  });

  const [selectedBlogType, setSelectedBlogType] = useState<string>('standard');
  const [expandedBlogSelector, setExpandedBlogSelector] = useState(false);

  const handleFormatChange = (formatId: string, checked: boolean) => {
    const updated = { ...selectedFormats, [formatId]: checked };
    setSelectedFormats(updated);
    onFormatChange?.(updated);

    // Expand/collapse blog selector when blog is toggled
    if (formatId === 'blog') {
      setExpandedBlogSelector(checked);
    }
  };

  const webColors = {
    primary: '#7BF1A8',
    primaryDark: '#333333',
    background: '#f5f5f5',
    greenLight: '#f0fdf7',
    greenLighter: '#f8fffc',
  };

  return (
    <div className="w-full space-y-4">
      {/* Format Checkboxes */}
      <div className="space-y-3">
        {FORMATS.map((format) => (
          <div key={format.id} className="space-y-2">
            {/* Format Checkbox */}
            <label className="flex items-start p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:border-gray-300 transition">
              <input
                type="checkbox"
                checked={selectedFormats[format.id]}
                onChange={(e) => handleFormatChange(format.id, e.target.checked)}
                className="w-4 h-4 mt-1 cursor-pointer"
                style={{ accentColor: webColors.primary }}
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-800">
                  {format.icon} {format.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">{format.description}</p>
              </div>
            </label>

            {/* Blog Type Sub-Selector */}
            {format.id === 'blog' && selectedFormats.blog && (
              <div
                className="ml-4 space-y-2 overflow-hidden transition-all duration-300"
                style={{ maxHeight: expandedBlogSelector ? '1000px' : '0px' }}
              >
                <div className="text-xs font-semibold text-gray-700 mb-3 mt-2">
                  📏 Tipo de Blog Post
                </div>

                {BLOG_TYPES.map((blogType) => (
                  <label
                    key={blogType.id}
                    className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                      selectedBlogType === blogType.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="blog-type"
                      value={blogType.id}
                      checked={selectedBlogType === blogType.id}
                      onChange={(e) => setSelectedBlogType(e.target.value)}
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
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {Object.values(selectedFormats).some((v) => v) && (
        <div
          className="mt-4 p-4 rounded-lg border-2"
          style={{
            backgroundColor: webColors.greenLighter,
            borderColor: webColors.primary,
          }}
        >
          <p className="text-xs font-semibold text-gray-800 mb-2">
            ✨ Formatos Seleccionados:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFormats)
              .filter(([, selected]) => selected)
              .map(([formatId]) => {
                const format = FORMATS.find((f) => f.id === formatId);
                const displayName =
                  formatId === 'blog' && selectedBlogType
                    ? `${format?.name} (${
                        BLOG_TYPES.find((b) => b.id === selectedBlogType)?.name
                      })`
                    : format?.name;

                return (
                  <span
                    key={formatId}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: webColors.primary, color: '#333333' }}
                  >
                    {displayName}
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
