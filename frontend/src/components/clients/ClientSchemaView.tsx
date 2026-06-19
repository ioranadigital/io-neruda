'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Client, KeywordsHierarchy } from '@/src/types/client';
import { ChevronDown, ChevronRight, X, Info, Layers, MapPin, BookOpen, Scale, Crosshair, Ban } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClientSchemaViewProps {
  formData: Partial<Client>;
  onChange: (field: string, value: unknown) => void;
}

interface FieldDef {
  key: keyof KeywordsHierarchy;
  label: string;
  hint: string;
  placeholder: string;
  example: string;
}

interface LevelDef {
  id: number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  borderColor: string;
  headerBg: string;
  badgeClass: string;
  fields: FieldDef[];
}

// ─── Level definitions ────────────────────────────────────────────────────────

const LEVELS: LevelDef[] = [
  {
    id: 1,
    icon: Layers,
    title: 'Nivel 1: Entidad y Core Semántico',
    subtitle: 'Define QUÉ eres y en qué mercado compites',
    borderColor: '#4aa87a',
    headerBg: '#f0fdf4',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    fields: [
      {
        key: 'level1_entity_core',
        label: 'Core de Negocio',
        hint: 'La esencia de qué vende o hace tu negocio',
        placeholder: 'barbacoas, piscinas, estufas pellets, jardín...',
        example: 'Esgarden, Tienda jardín, Exterior living',
      },
      {
        key: 'level1_branded',
        label: 'Branded Keywords',
        hint: 'Búsquedas que incluyen directamente el nombre de la empresa',
        placeholder: 'nombre empresa, variantes de marca...',
        example: 'Esgarden, Esgarden Guadalajara, Tienda Esgarden online',
      },
      {
        key: 'level1_brand_third_party',
        label: 'Fabricantes / Marcas de Terceros',
        hint: 'Marcas líderes que distribuyes o referencias como autoridad',
        placeholder: 'Weber, Husqvarna, Makita, NetSpa...',
        example: 'Weber, Moretti Design, NetSpa, Stihl, Husqvarna',
      },
      {
        key: 'level1_niche_sector',
        label: 'Head Terms (Nicho / Sector)',
        hint: 'Keywords genéricas de 1–2 palabras de tus categorías maestras',
        placeholder: 'barbacoas, piscinas desmontables, herramientas jardín...',
        example: 'Barbacoas, Piscinas, Estufas de pellets, Herramientas jardín',
      },
    ],
  },
  {
    id: 2,
    icon: MapPin,
    title: 'Nivel 2: Segmentación y Geolocalización',
    subtitle: 'Segmenta por ubicación geográfica y perfil de audiencia',
    borderColor: '#3b82f6',
    headerBg: '#eff6ff',
    badgeClass: 'bg-blue-100 text-blue-700',
    fields: [
      {
        key: 'level2_local',
        label: 'Keywords Locales (Geo-targeted)',
        hint: 'Palabras clave con ubicación geográfica. Cruciales para SEO Local',
        placeholder: 'tienda jardín Guadalajara, barbacoas Alcalá de Henares...',
        example: 'Tienda de barbacoas en Guadalajara, Comprar estufas Alcalá de Henares',
      },
      {
        key: 'level2_audience_profile',
        label: 'Perfil de Audiencia',
        hint: 'Segmentación por tipo de usuario, experiencia o necesidad',
        placeholder: 'barbacoas para familias, piscinas patio pequeño...',
        example: 'Barbacoas portátiles campistas, Piscinas desmontables patios pequeños',
      },
    ],
  },
  {
    id: 3,
    icon: BookOpen,
    title: 'Nivel 3: Informacional y Editorial',
    subtitle: 'Contenidos educativos que demuestran autoridad técnica',
    borderColor: '#f59e0b',
    headerBg: '#fffbeb',
    badgeClass: 'bg-amber-100 text-amber-700',
    fields: [
      {
        key: 'level3_educational_howto',
        label: 'Educacionales / How-to',
        hint: 'Búsquedas que empiezan por "cómo", "qué", "cuándo", "por qué"',
        placeholder: 'cómo encender barbacoa carbón, qué piscina elegir...',
        example: 'Cómo encender barbacoa de carbón rápido, Cómo limpiar filtro piscina',
      },
      {
        key: 'level3_problem_symptom',
        label: 'Problemas / Síntomas',
        hint: 'El usuario detecta un problema sin saber aún qué producto necesita',
        placeholder: 'agua piscina verde, estufa pellets echa humo...',
        example: 'Por qué el agua de mi piscina está verde, Mi estufa de pellets saca humo',
      },
      {
        key: 'level3_seasonal',
        label: 'Keywords Estacionales',
        hint: 'Búsquedas que explotan en épocas muy concretas del año',
        placeholder: 'puesta a punto piscina primavera, mantenimiento estufa invierno...',
        example: 'Puesta a punto piscinas primavera, Mantenimiento estufas antes del invierno',
      },
    ],
  },
  {
    id: 4,
    icon: Scale,
    title: 'Nivel 4: Investigación Comercial',
    subtitle: 'El usuario ya sabe qué quiere y está comparando opciones',
    borderColor: '#8b5cf6',
    headerBg: '#f5f3ff',
    badgeClass: 'bg-violet-100 text-violet-700',
    fields: [
      {
        key: 'level4_comparative_vs',
        label: 'Comparativas (Vs)',
        hint: 'Enfrentan dos tecnologías, marcas o modelos para resolver la duda del comprador',
        placeholder: 'barbacoa gas vs carbón, modelo A vs modelo B...',
        example: 'Barbacoa de gas vs carbón, Weber Compact Kettle 47 cm vs 57 cm',
      },
      {
        key: 'level4_lists_roundups',
        label: 'Listas / Recopilatorios',
        hint: 'Agrupan los mejores productos bajo un criterio de calidad o precio',
        placeholder: 'mejores barbacoas terraza, top estufas pellets calidad precio...',
        example: 'Las 5 mejores barbacoas de gas para terrazas 2026',
      },
      {
        key: 'level4_review_opinions',
        label: 'Reviews / Opiniones de Producto',
        hint: 'Análisis profundos de un modelo exacto. Tráfico hiper-cualificado',
        placeholder: 'análisis Weber Spirit E-425, opiniones estufa Moretti Elegance...',
        example: 'Análisis técnico Weber Spirit E-425, Opiniones estufa Elegance Moretti',
      },
    ],
  },
  {
    id: 5,
    icon: Crosshair,
    title: 'Nivel 5: Larga Cola (Long-Tail)',
    subtitle: 'Consultas muy específicas con alta intención y baja competencia',
    borderColor: '#14b8a6',
    headerBg: '#f0fdfa',
    badgeClass: 'bg-teal-100 text-teal-700',
    fields: [
      {
        key: 'level5_longtail_informational',
        label: 'Long-Tail Informacional de Nicho',
        hint: 'Resuelven una duda extremadamente específica',
        placeholder: 'cuánto tiempo duran briquetas carbón Weber, temperatura ideal pellets...',
        example: 'Cuánto tiempo tardan en quemarse las briquetas de carbón Weber',
      },
      {
        key: 'level5_longtail_transactional',
        label: 'Long-Tail Transaccional Oculta',
        hint: 'Búsquedas tan detalladas que revelan intención de compra inmediata',
        placeholder: 'dónde comprar recambios parrilla Weber 47 cm, precio estufa pellets...',
        example: 'Dónde comprar recambios de parrilla para Weber Compact Kettle 47 cm',
      },
    ],
  },
  {
    id: 6,
    icon: Ban,
    title: 'Nivel 6: Exclusiones y Restricciones',
    subtitle: 'Lo que NUNCA debe aparecer en los contenidos de este cliente',
    borderColor: '#ef4444',
    headerBg: '#fef2f2',
    badgeClass: 'bg-red-100 text-red-600',
    fields: [
      {
        key: 'level6_banned_words',
        label: 'Palabras Prohibidas',
        hint: 'Términos y frases que NO deben aparecer. Evita clichés y palabras gastadas',
        placeholder: 'en conclusión, es crucial, sumérgete, imprescindible, revolucionario...',
        example: 'En conclusión, Es crucial, Sumérgete, imprescindible, revolucionario',
      },
      {
        key: 'level6_banned_tones',
        label: 'Tonos Prohibidos',
        hint: 'Estilos de escritura que NO encajan con la voz de la marca',
        placeholder: 'clickbait, sensacionalista, spam, robótico...',
        example: 'clickbait, sensacionalista, spam, robótico, demasiado técnico',
      },
      {
        key: 'level6_competing_keywords',
        label: 'Keywords de Competencia a Evitar',
        hint: 'Búsquedas donde los competidores dominan — enfoca en oportunidades propias',
        placeholder: 'Amazon barbacoa, Leroy Merlin parrilla, Carrefour accesorios...',
        example: 'Amazon barbacoa, Leroy Merlin parrilla, Carrefour accesorios jardín',
      },
    ],
  },
];

// ─── KeywordField ──────────────────────────────────────────────────────────────

interface KeywordFieldProps {
  fieldDef: FieldDef;
  initialKeywords: string[];
  accentColor: string;
  tagClass: string;
  onUpdate: (key: keyof KeywordsHierarchy, keywords: string[]) => void;
}

function KeywordField({ fieldDef, initialKeywords, accentColor, tagClass, onUpdate }: KeywordFieldProps) {
  const [textValue, setTextValue] = useState(() => initialKeywords.join(', '));
  const [showExample, setShowExample] = useState(false);

  // Sync when parent resets (e.g., after save)
  useEffect(() => {
    setTextValue(initialKeywords.join(', '));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKeywords.join(',')]);

  const parsedTags = textValue
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const handleBlur = useCallback(() => {
    onUpdate(fieldDef.key, parsedTags);
  }, [fieldDef.key, parsedTags, onUpdate]);

  const removeTag = useCallback((idx: number) => {
    const updated = parsedTags.filter((_, i) => i !== idx);
    const newText = updated.join(', ');
    setTextValue(newText);
    onUpdate(fieldDef.key, updated);
  }, [parsedTags, fieldDef.key, onUpdate]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      {/* Field label + hint */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-semibold text-slate-900">{fieldDef.label}</p>
            <button
              type="button"
              onClick={() => setShowExample(prev => !prev)}
              className="text-slate-400 hover:text-slate-600 transition"
              title="Ver ejemplo"
            >
              <Info size={13} />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">{fieldDef.hint}</p>
        </div>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${tagClass}`}>
          {parsedTags.length}
        </span>
      </div>

      {/* Example tooltip */}
      {showExample && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Ej: </span>
          {fieldDef.example}
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={textValue}
        onChange={e => setTextValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={fieldDef.placeholder}
        rows={2}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none transition text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed"
        style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        onFocus={e => { e.currentTarget.style.borderColor = accentColor; }}
        onBlurCapture={e => { e.currentTarget.style.borderColor = ''; handleBlur(); }}
      />

      {/* Tag chips */}
      {parsedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {parsedTags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
              style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}40`, color: accentColor }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="rounded-full hover:opacity-70 transition flex-shrink-0"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Level accordion ──────────────────────────────────────────────────────────

interface LevelAccordionProps {
  level: LevelDef;
  hierarchy: KeywordsHierarchy;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (key: keyof KeywordsHierarchy, keywords: string[]) => void;
}

function LevelAccordion({ level, hierarchy, isOpen, onToggle, onUpdate }: LevelAccordionProps) {
  const totalKeywords = level.fields.reduce((sum, f) => {
    return sum + ((hierarchy[f.key] ?? []) as string[]).length;
  }, 0);

  return (
    <div
      className="rounded-xl border overflow-hidden shadow-sm"
      style={{
        borderTopColor: isOpen ? level.borderColor : '#e2e8f0',
        borderRightColor: isOpen ? level.borderColor : '#e2e8f0',
        borderBottomColor: isOpen ? level.borderColor : '#e2e8f0',
        borderLeftColor: level.borderColor,
        borderLeftWidth: '3px',
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ backgroundColor: isOpen ? level.headerBg : '#ffffff' }}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: level.headerBg, color: level.borderColor }}>
            <level.icon size={16} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-snug">{level.title}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{level.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 ml-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${level.badgeClass}`}>
            {totalKeywords} kw
          </span>
          <span className="text-slate-400">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1" style={{ backgroundColor: level.headerBg }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {level.fields.map(field => (
              <KeywordField
                key={field.key}
                fieldDef={field}
                initialKeywords={(hierarchy[field.key] ?? []) as string[]}
                accentColor={level.borderColor}
                tagClass={level.badgeClass}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClientSchemaView({ formData, onChange }: ClientSchemaViewProps) {
  const [openLevels, setOpenLevels] = useState<Set<number>>(new Set([1]));

  const hierarchy: KeywordsHierarchy = (formData.keywords_hierarchical ?? {}) as KeywordsHierarchy;

  const toggleLevel = useCallback((id: number) => {
    setOpenLevels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleUpdate = useCallback((key: keyof KeywordsHierarchy, keywords: string[]) => {
    onChange('keywords_hierarchical', {
      ...hierarchy,
      [key]: keywords,
    });
  }, [hierarchy, onChange]);

  const totalAllKeywords = LEVELS.reduce((sum, level) =>
    sum + level.fields.reduce((s, f) => s + ((hierarchy[f.key] ?? []) as string[]).length, 0), 0
  );

  const expandAll = () => setOpenLevels(new Set(LEVELS.map(l => l.id)));
  const collapseAll = () => setOpenLevels(new Set());

  return (
    <div className="space-y-1">
      {/* Sub-header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">Modelo de 6 Niveles Semánticos SEO/GEO</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalAllKeywords} keywords registradas en total ·
            Escribe separadas por comas, pulsa fuera para confirmar
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Expandir todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Colapsar
          </button>
        </div>
      </div>

      {/* 6 level accordions */}
      <div className="space-y-2">
        {LEVELS.map(level => (
          <LevelAccordion
            key={level.id}
            level={level}
            hierarchy={hierarchy}
            isOpen={openLevels.has(level.id)}
            onToggle={() => toggleLevel(level.id)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}
