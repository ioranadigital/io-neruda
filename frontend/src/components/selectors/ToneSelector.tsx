'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: string;
  onChange: (tone: string) => void;
}

const TONES_DATA = {
  professional: {
    name: 'Professional',
    icon: '🏢',
    description: 'Páginas corporativas, comunicados de marca, servicios de alto valor',
    subtones: {
      corporate: {
        name: 'Corporate / Executive',
        icon: '🏢',
        description: 'Lenguaje formal, estructuras complejas, autoridad institucional',
        keywords: 'Tono corporativo, ejecutivo, institucional, alta dirección',
      },
      authoritative: {
        name: 'Authoritative / Academic',
        icon: '🎓',
        description: 'Rigor absoluto, basado en datos, normativas vigentes',
        keywords: 'Tono académico, analítico, imperativo, basado en datos',
      },
      commercial: {
        name: 'Commercial / Sales-driven',
        icon: '💼',
        description: 'Persuasión y beneficios (B2B/B2C), enfoque en ROI',
        keywords: 'Tono persuasivo comercial, B2B, propuesta de valor',
      },
    },
  },
  friendly: {
    name: 'Friendly',
    icon: '🤝',
    description: 'Artículos de blog, newsletters, redes sociales, guías iniciales',
    subtones: {
      casual: {
        name: 'Casual / Conversational',
        icon: '☕',
        description: 'Frases cortas, "tú" directo, como un amigo experto',
        keywords: 'Tono conversacional, cercano, lenguaje de calle, tú a tú',
      },
      enthusiastic: {
        name: 'Enthusiastic / Inspirational',
        icon: '🚀',
        description: 'Enérgico, motivador, adjetivos potentes',
        keywords: 'Tono enérgico, inspirador, motivacional, apasionado',
      },
      empathetic: {
        name: 'Empathetic / Supportive',
        icon: '🧘',
        description: 'Centrado en los problemas del usuario, validante y reconfortante',
        keywords: 'Tono empático, comprensivo, de soporte, tranquilizador',
      },
    },
  },
  technical: {
    name: 'Technical',
    icon: '🛠️',
    description: 'Fichas de producto, manuales, FAQs técnicas, comparativas',
    subtones: {
      instructional: {
        name: 'Instructional / Direct',
        icon: '🔬',
        description: 'Listas ultra-claras, imperativos directos, terminología especializada',
        keywords: 'Tono instructivo, manual técnico, paso a paso, algorítmico',
      },
      analytical: {
        name: 'Analytical / Spec-focused',
        icon: '📐',
        description: 'Especificaciones, materiales, rendimiento (BTUs, kW), dimensiones',
        keywords: 'Tono de especificación técnica, orientado a datos de ingeniería',
      },
      diagnostic: {
        name: 'Expert Diagnostic',
        icon: '🕵️',
        description: 'Consultor técnico analizando causas y soluciones de fallos',
        keywords: 'Tono de diagnóstico, auditoría técnica, causa-efecto',
      },
    },
  },
  custom: {
    name: 'Custom / Hybrid',
    icon: '🎛️',
    description: 'Tonos personalizados cruzando múltiples estilos',
    subtones: {
      expert_craftsman: {
        name: 'El Maestro Parrillero',
        icon: '🪵',
        description: 'Explica especificaciones técnicas con lenguaje accesible',
        keywords: 'Friendly Casual + Technical Spec-focused',
      },
      local_consultant: {
        name: 'Consultor Local',
        icon: '📍',
        description: 'Introduce contexto climático/regional de forma natural',
        keywords: 'Professional Commercial + Friendly Empathetic + Geolocalizado',
      },
      direct_minimal: {
        name: 'Directo al Grano',
        icon: '⚡',
        description: 'Sin rodeos, frases cortas, directas y de alta conversión',
        keywords: 'Minimalista, sin palabras vacías, descripciones potentes',
      },
    },
  },
};

export default function ToneSelector({ selectedTone, onChange }: ToneSelectorProps) {
  const [expandedTone, setExpandedTone] = useState<string | null>(
    selectedTone && !selectedTone.includes('_') ? selectedTone : null
  );

  const isSubtoneSelected = selectedTone.includes('_');

  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-3">🎤 Tono de Contenido</label>

      <div className="space-y-2">
        {Object.entries(TONES_DATA).map(([toneKey, toneInfo]) => (
          <div key={toneKey} className="border-2 border-gray-200 rounded-lg overflow-hidden">
            {/* Main Tone Button */}
            <button
              onClick={() => setExpandedTone(expandedTone === toneKey ? null : toneKey)}
              className={`w-full flex items-start justify-between p-3 text-left transition ${
                selectedTone === toneKey
                  ? 'bg-blue-50 border-b-2 border-blue-500'
                  : 'hover:bg-gray-50 border-b border-gray-200'
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {toneInfo.icon} {toneInfo.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">{toneInfo.description}</p>
              </div>
              <input
                type="radio"
                name="main-tone"
                checked={selectedTone === toneKey}
                onChange={() => {
                  onChange(toneKey);
                  setExpandedTone(toneKey);
                }}
                className="mt-1 w-5 h-5 ml-2"
                onClick={(e) => e.stopPropagation()}
              />
            </button>

            {/* Subtones (Expandable) */}
            {expandedTone === toneKey && (
              <div className="bg-gray-50 border-t border-gray-200 p-2 space-y-2">
                {Object.entries(toneInfo.subtones).map(([subtoneKey, subtoneInfo]) => {
                  const fullKey = `${toneKey}_${subtoneKey}`;
                  return (
                    <label
                      key={subtoneKey}
                      className={`flex items-start p-3 rounded-lg cursor-pointer transition ${
                        selectedTone === fullKey
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border-2 border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subtone"
                        value={fullKey}
                        checked={selectedTone === fullKey}
                        onChange={() => onChange(fullKey)}
                        className="mt-1 w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {subtoneInfo.icon} {subtoneInfo.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{subtoneInfo.description}</p>
                        <p className="text-xs text-blue-700 mt-2 font-mono bg-blue-50 p-2 rounded">
                          💬 {subtoneInfo.keywords}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Tone Display */}
      {selectedTone && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border-2 border-blue-200">
          <p className="text-xs font-semibold text-blue-900">Tono seleccionado:</p>
          <p className="text-sm text-blue-800 mt-1">
            {isSubtoneSelected
              ? TONES_DATA[selectedTone.split('_')[0] as keyof typeof TONES_DATA]
                  ?.subtones[selectedTone.split('_')[1] as any]?.name
              : TONES_DATA[selectedTone as keyof typeof TONES_DATA]?.name}
          </p>
        </div>
      )}
    </div>
  );
}
