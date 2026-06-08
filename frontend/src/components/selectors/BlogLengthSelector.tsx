'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

export type BlogLength = 'short' | 'standard' | 'pillar';

interface BlogLengthSelectorProps {
  value: BlogLength;
  onChange: (length: BlogLength) => void;
}

const webColors = {
  primary: '#7BF1A8',
  primaryDark: '#333333',
  greenLight: '#f0fdf7',
  greenLighter: '#f8fffc',
};

const BLOG_LENGTHS = {
  short: {
    title: 'Post Corto / Actualización',
    range: '500 - 800 palabras',
    description: 'Ideal para noticias, actualizaciones y contenido rápido',
  },
  standard: {
    title: 'Post Estándar / Atacando Keyword',
    range: '1000 - 1200 palabras',
    description: 'Perfecto para posicionarse en palabras clave específicas',
  },
  pillar: {
    title: 'Guía Definitiva / Contenido Pilar',
    range: '1500 - 2500 palabras',
    description: 'Incluye FAQs, tablas y cobertura completa del tema',
  },
};

export default function BlogLengthSelector({ value, onChange }: BlogLengthSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}>
      {/* Header - Same style as ContentDefinition */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition hover:bg-gray-50"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex items-center gap-4">
          <div style={{ color: webColors.primary }}>
            <FileText size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">Extensión del Blog Post</h3>
            <p className="text-sm text-gray-600">Configuración de longitud y estructura</p>
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
        <div className="px-8 py-4 border-t-2 space-y-4 animate-in fade-in-50 duration-300" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
          <div className="space-y-3">
            {Object.entries(BLOG_LENGTHS).map(([key, info]) => (
              <label
                key={key}
                className={`flex items-start p-4 bg-white rounded-lg border-2 cursor-pointer transition`}
                style={{
                  borderColor: value === key ? webColors.primary : '#e5e7eb',
                  backgroundColor: value === key ? webColors.greenLighter : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="blog-length"
                  value={key}
                  checked={value === key}
                  onChange={() => onChange(key as BlogLength)}
                  className="mt-1 w-4 h-4"
                  style={{ accentColor: webColors.primary }}
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-800">{info.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{info.range}</p>
                  <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
