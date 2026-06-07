'use client';

import React from 'react';

export type BlogLength = 'short' | 'standard' | 'pillar';

interface BlogLengthSelectorProps {
  value: BlogLength;
  onChange: (length: BlogLength) => void;
}

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
  return (
    <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm animate-in fade-in-50 duration-300">
      <p className="text-sm font-bold text-gray-800 mb-3">📏 Extensión del Blog Post</p>

      <div className="space-y-2">
        {Object.entries(BLOG_LENGTHS).map(([key, info]) => (
          <label
            key={key}
            className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition ${
              value === key
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={value === key ? { borderColor: '#7BF1A8', backgroundColor: '#f0fdf5' } : {}}
          >
            <input
              type="radio"
              name="blog-length"
              value={key}
              checked={value === key}
              onChange={() => onChange(key as BlogLength)}
              className="mt-1 w-4 h-4"
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
  );
}
