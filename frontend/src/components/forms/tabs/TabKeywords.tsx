'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { Plus, X } from 'lucide-react';

interface KeywordSectionProps {
  section: {
    key: string;
    name: string;
    description: string;
    example: string;
  };
  keywords: string[];
  isExpanded: boolean;
  onToggle: (key: string) => void;
  onAdd: (key: string, keyword: string) => void;
  onRemove: (key: string, index: number) => void;
}

function KeywordSection({
  section,
  keywords,
  isExpanded,
  onToggle,
  onAdd,
  onRemove,
}: KeywordSectionProps) {
  const [inputValue, setInputValue] = useState('');

  return (
    <div key={section.key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => onToggle(section.key)}
        className="w-full px-4 py-3 flex items-start justify-between hover:bg-gray-50 transition"
      >
        <div className="text-left">
          <p className="font-semibold text-gray-800">{section.name}</p>
          <p className="text-xs text-gray-600 mt-1">{section.description}</p>
        </div>
        <span className="text-xs font-medium text-blue-600 ml-2 flex-shrink-0">
          {keywords.length} keywords
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 space-y-3">
          <div className="text-xs text-gray-600 p-2 bg-white rounded border border-gray-200">
            <p className="font-semibold mb-1">📌 Ejemplo:</p>
            <p>{section.example}</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAdd(section.key, inputValue);
                  setInputValue('');
                }
              }}
              placeholder="Escribir y presionar Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                onAdd(section.key, inputValue);
                setInputValue('');
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              <Plus size={16} />
            </button>
          </div>

          {keywords.length > 0 && (
            <div className="space-y-2">
              {keywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                >
                  <span className="text-sm text-gray-800">{kw}</span>
                  <button
                    onClick={() => onRemove(section.key, idx)}
                    className="p-1 hover:bg-red-100 rounded transition"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {keywords.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-2">Sin keywords aún</p>
          )}
        </div>
      )}
    </div>
  );
}

interface TabKeywordsProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

const KEYWORD_LEVELS = [
  {
    level: 1,
    title: '🏗️ Nivel 1: Keywords de Entidad y Core',
    sections: [
      {
        key: 'level1_entity_core',
        name: 'Keywords de Entidad y Core',
        description: 'La base del negocio. Palabras que definen qué es tu empresa y en qué mercado compite.',
        example: 'Esgarden (si es tienda), Barbacoas, Piscinas',
      },
      {
        key: 'level1_branded',
        name: 'Keywords de Marca (Branded KW)',
        description: 'Búsquedas que incluyen directamente el nombre de tu empresa. Mayor tasa de conversión.',
        example: 'Esgarden, Esgarden Guadalajara, Tienda Esgarden',
      },
      {
        key: 'level1_brand_third_party',
        name: 'Keywords de Marca de Terceros / Fabricante',
        description: 'Términos de las marcas líderes que distribuyes. Atraen tráfico con alta intención de compra.',
        example: 'Weber, Moretti Design, NetSpa',
      },
      {
        key: 'level1_niche_sector',
        name: 'Keywords de Nicho / Sector (Head Terms)',
        description: 'Palabras clave genéricas de una o dos palabras que definen tus categorías maestras.',
        example: 'Barbacoas, Piscinas, Estufas de pellets',
      },
    ],
  },
  {
    level: 2,
    title: '🗺️ Nivel 2: Keywords de Segmentación',
    sections: [
      {
        key: 'level2_local',
        name: 'Keywords Locales (Geo-targeted KW)',
        description: 'Palabras clave que incluyen una ubicación geográfica. Cruciales para SEO Local.',
        example: 'Tienda de barbacoas en Guadalajara, Comprar estufas en Alcalá de Henares',
      },
      {
        key: 'level2_audience_profile',
        name: 'Keywords de Audiencia / Perfil',
        description: 'Definen el tipo de usuario que consume el producto, segmentando por experiencia o necesidad.',
        example: 'Barbacoas portátiles para campistas, Piscinas desmontables para patios pequeños',
      },
    ],
  },
  {
    level: 3,
    title: '🎓 Nivel 3: Keywords Informacionales y Editoriales',
    sections: [
      {
        key: 'level3_educational_howto',
        name: 'Keywords Educacionales / "How-to"',
        description: 'Búsquedas que empiezan por "cómo", "qué", "cuándo" o "por qué". Demuestran autoridad técnica.',
        example: 'Cómo encender una barbacoa de carbón rápido, Cómo limpiar el filtro de la piscina',
      },
      {
        key: 'level3_problem_symptom',
        name: 'Keywords de Problema / Síntoma',
        description: 'El usuario detecta que algo va mal pero no sabe qué producto necesita para solucionarlo.',
        example: 'Por qué el agua de mi piscina está verde, Mi estufa de pellets saca mucho humo',
      },
      {
        key: 'level3_seasonal',
        name: 'Keywords Estacionales',
        description: 'Búsquedas que explotan en épocas muy concretas del año. El blog debe anticiparse a ellas.',
        example: 'Puesta a punto de piscinas en primavera, Mantenimiento de estufas antes del invierno',
      },
    ],
  },
  {
    level: 4,
    title: '⚖️ Nivel 4: Keywords de Investigación Comercial',
    sections: [
      {
        key: 'level4_comparative_vs',
        name: 'Keywords Comparativas ("Vs")',
        description: 'Enfrentan dos tecnologías, marcas o modelos para resolver la duda del comprador.',
        example: 'Barbacoa de gas vs carbón, Weber Compact Kettle de 47 cm vs 57 cm',
      },
      {
        key: 'level4_lists_roundups',
        name: 'Keywords de Listas / Recopilatorios',
        description: 'Búsquedas que agrupan los mejores productos bajo un criterio de calidad o precio.',
        example: 'Las 5 mejores barbacoas de gas para terrazas, Mejores estufas de pellets calidad precio',
      },
      {
        key: 'level4_review_opinions',
        name: 'Keywords de Review / Opiniones',
        description: 'Análisis profundos de un modelo exacto. Tráfico hiper-cualificado.',
        example: 'Análisis técnico Weber Spirit E-425, Opiniones estufa Elegance Moretti',
      },
    ],
  },
  {
    level: 5,
    title: '🎯 Nivel 5: Keywords de Larga Cola (Long-Tail KW)',
    sections: [
      {
        key: 'level5_longtail_informational',
        name: 'Long-Tail Informacional de Nicho',
        description: 'Resuelven una duda extremadamente específica.',
        example: 'Cuánto tiempo tardan en quemarse las briquetas de carbón Weber',
      },
      {
        key: 'level5_longtail_transactional',
        name: 'Long-Tail Transaccional Oculta',
        description: 'Búsquedas tan detalladas que revelan que el usuario está listo para comprar ya.',
        example: 'Dónde comprar recambios de parrilla para Weber Compact Kettle 47 cm',
      },
    ],
  },
  {
    level: 6,
    title: '🚫 Nivel 6: Exclusiones y Restricciones',
    sections: [
      {
        key: 'level6_banned_words',
        name: 'Palabras Prohibidas',
        description: 'Términos y frases que NO deben aparecer en el contenido. Evita clichés y palabras gastadas.',
        example: 'En conclusión, Es crucial, Sumérgete, imprescindible, revolucionario',
      },
      {
        key: 'level6_banned_tones',
        name: 'Tonos Prohibidos',
        description: 'Estilos de escritura que NO encajan con la marca. Evita inconsistencia de voz.',
        example: 'clickbait, sensacionalista, spam, robótico, demasiado técnico',
      },
      {
        key: 'level6_competing_keywords',
        name: 'Keywords de Competencia a Evitar',
        description: 'Búsquedas donde nuestros competidores dominan. Enfocarse en oportunidades propias.',
        example: 'Amazon barbacoa, Leroy Merlin parrilla, Carrefour accesorios',
      },
    ],
  },
];

export default function TabKeywords({ formData, onChange }: TabKeywordsProps) {
  const keywordsHierarchy = formData.keywords_hierarchical || {};
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addKeyword = (key: string, keyword: string) => {
    if (!keyword.trim()) return;
    const current = (keywordsHierarchy[key as keyof typeof keywordsHierarchy] || []) as string[];
    const updated = [...current, keyword];
    onChange('keywords_hierarchical', {
      ...keywordsHierarchy,
      [key]: updated,
    });
  };

  const removeKeyword = (key: string, index: number) => {
    const current = (keywordsHierarchy[key as keyof typeof keywordsHierarchy] || []) as string[];
    const updated = current.filter((_, i) => i !== index);
    onChange('keywords_hierarchical', {
      ...keywordsHierarchy,
      [key]: updated,
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-6">
        Estructura jerárquica de keywords para organizar tu estrategia SEO. Cada nivel representa un tipo diferente de búsqueda.
      </p>

      {KEYWORD_LEVELS.map((levelGroup) => (
        <div key={`level-${levelGroup.level}`} className="border-l-4 border-blue-400 pl-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{levelGroup.title}</h3>

          <div className="space-y-4">
            {levelGroup.sections.map((section) => {
              const isExpanded = expandedSections[section.key];
              const keywords = (keywordsHierarchy[section.key as keyof typeof keywordsHierarchy] || []) as string[];

              return (
                <KeywordSection
                  key={section.key}
                  section={section}
                  keywords={keywords}
                  isExpanded={isExpanded}
                  onToggle={toggleSection}
                  onAdd={addKeyword}
                  onRemove={removeKeyword}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
