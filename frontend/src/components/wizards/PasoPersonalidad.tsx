'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { Language } from '../selectors/LanguageSelector';
import { Users, Lightbulb, Volume2, Globe, Sparkles, BookOpen, ShoppingCart, Star, Target, Briefcase, Handshake, GraduationCap, Magnet, Zap, TrendingUp, BookMarked, Clapperboard } from 'lucide-react';
import { TONOS_CONTEXTO, INTENCIONES_CONTEXTO } from '@/src/types/generator';
import StepContainer from './StepContainer';

interface PasoPersonalidadProps {
  selectedClient: Client | null;
  formData: {
    targetAudience: string; // Nombre del buyer persona seleccionado
    selectedContentIntent: string | null;
    selectedSubIntencion: string | null;
    selectedMainTone: string | null;
    selectedTone: string | null;
    selectedSubtone: string | null;
    selectedNarrativeAngle: string | null;
  };
  onChange: (data: {
    targetAudience?: string;
    selectedContentIntent?: string | null;
    selectedSubIntencion?: string | null;
    selectedMainTone?: string | null;
    selectedTone?: string | null;
    selectedSubtone?: string | null;
    selectedNarrativeAngle?: string | null
  }) => void;
}

const CONTENT_INTENTS = [
  { id: 'educational', label: '📚 Educacional', desc: 'Enseña y explica' },
  { id: 'transactional', label: '🛒 Transaccional', desc: 'Impulsa compra/acción' },
  { id: 'social_proof', label: '⭐ Prueba Social', desc: 'Casos y testimonios' },
  { id: 'thought_leadership', label: '🎯 Liderazgo', desc: 'Posicionamiento' },
];

const TONES = [
  { id: 'professional', label: '💼 Profesional', desc: 'Formal, experto' },
  { id: 'friendly', label: '😊 Amigable', desc: 'Conversacional' },
  { id: 'technical', label: '⚙️ Técnico', desc: 'Específico, detallado' },
  { id: 'creative', label: '✨ Creativo', desc: 'Original, narrativo' },
];

const NARRATIVE_ANGLES = [
  { id: 'trends', label: 'Tendencias / Newsjacking', desc: 'Aprovecha temas virales', iconLucide: 'TrendingUp' },
  { id: 'tutorial', label: 'Tutorial / Paso a Paso', desc: 'Guía educativa', iconLucide: 'BookOpen' },
  { id: 'contrarian', label: 'Contra-corriente / Hot Take', desc: 'Opinión provocadora', iconLucide: 'Zap' },
  { id: 'direct_product', label: 'Directo a Producto', desc: 'Enfoque transaccional', iconLucide: 'Target' },
  { id: 'storytelling', label: 'Storytelling', desc: 'Narrativa emocional', iconLucide: 'BookMarked' },
];

// Mapeo de iconLucide a componentes
const iconMap: Record<string, any> = {
  BookOpen,
  ShoppingCart,
  Star,
  Target,
  Briefcase,
  Handshake,
  GraduationCap,
  Magnet,
  Zap,
  TrendingUp,
  BookMarked,
  Clapperboard,
};

export default function PasoPersonalidad({
  selectedClient,
  formData,
  onChange,
}: PasoPersonalidadProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  return (
    <StepContainer
      title="Personalidad, Estrategia, Tono y Enfoque"
      icon={Sparkles}
      iconColor="purple"
      columns={1}
      gap="medium"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Público Objetivo - Buyer Persona Selection */}
        <div className={`rounded-xl border p-6 hover:shadow-lg transition ${
          formData.targetAudience
            ? 'bg-white border-blue-200 ring-2 ring-blue-100'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Público Objetivo</h3>
            </div>
            {formData.targetAudience && (
              <span className="text-xl">✓</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">OBLIGATORIO</span>
          </div>

          {/* Información del cliente */}
          {selectedClient?.target_audience && (
            <div className="mb-4 pb-4 border-b border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Del cliente</p>
              <p className="text-sm text-slate-900 font-medium">{selectedClient.target_audience}</p>
            </div>
          )}

          {/* Buyer Personas - Selección Única */}
          {selectedClient?.buyer_personas_list && selectedClient.buyer_personas_list.length > 0 ? (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-3 font-semibold">Selecciona un Buyer Persona</p>
              <div className="space-y-2">
                {selectedClient.buyer_personas_list.map((persona) => (
                  <button
                    key={persona.name}
                    onClick={() => onChange({ targetAudience: persona.name })}
                    className={`w-full text-left rounded-lg p-3 transition border-2 ${
                      formData.targetAudience === persona.name
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-sm font-semibold transition ${
                      formData.targetAudience === persona.name
                        ? 'text-blue-700'
                        : 'text-slate-900'
                    }`}>
                      {persona.name}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{persona.description}</p>
                  </button>
                ))}
              </div>
              {formData.targetAudience && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Seleccionado</p>
                  <p className="text-sm font-semibold text-blue-700">✓ {formData.targetAudience}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500">El cliente no tiene buyer personas configurados</p>
            </div>
          )}
        </div>

        {/* Intención + Sub-intención (Sistema Dual) */}
        <div className={`rounded-xl border p-6 hover:shadow-lg transition col-span-1 ${
          formData.selectedContentIntent && formData.selectedSubIntencion
            ? 'bg-white border-green-200 ring-2 ring-green-100'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Lightbulb size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Intención del Funnel</h3>
            </div>
            {formData.selectedContentIntent && formData.selectedSubIntencion && (
              <span className="text-xl">✓</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">OBLIGATORIO</span>
            {!formData.selectedContentIntent && (
              <span className="text-xs text-red-600">Falta seleccionar intención</span>
            )}
            {formData.selectedContentIntent && !formData.selectedSubIntencion && (
              <span className="text-xs text-red-600">Falta seleccionar sub-intención</span>
            )}
          </div>

          {/* Información del cliente */}
          {selectedClient?.content_pillars && selectedClient.content_pillars.length > 0 && (
            <div className="mb-4 pb-4 border-b border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Pilares del cliente</p>
              <div className="space-y-1">
                {selectedClient.content_pillars.slice(0, 2).map((pillar, idx) => (
                  <p key={idx} className="text-xs text-slate-900 font-medium">• {pillar}</p>
                ))}
              </div>
            </div>
          )}

          {/* Macro Intenciones como Cajetines (Buyer Personas Style) */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Elige Intención</p>
            <div className="space-y-2">
              {INTENCIONES_CONTEXTO.map((macroIntent) => (
                <button
                  key={macroIntent.id}
                  onClick={() => {
                    onChange({
                      selectedContentIntent: macroIntent.id,
                      selectedSubIntencion: null
                    });
                  }}
                  className={`w-full text-left rounded-lg p-2 transition border ${
                    formData.selectedContentIntent === macroIntent.id
                      ? 'bg-green-50 border-green-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {macroIntent.iconLucide && iconMap[macroIntent.iconLucide] &&
                      React.createElement(iconMap[macroIntent.iconLucide], { className: 'w-4 h-4' })
                    }
                    <span className="text-xs font-semibold text-slate-900">{macroIntent.nombre}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-intenciones Expandibles */}
          {formData.selectedContentIntent && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Selecciona Sub-intención / Enfoque del Funnel</p>
              <div className="space-y-2">
                {INTENCIONES_CONTEXTO.find((t) => t.id === formData.selectedContentIntent)?.subIntenciones.map(
                  (subIntent) => (
                    <button
                      key={subIntent.id}
                      onClick={() => onChange({ selectedSubIntencion: subIntent.id })}
                      className={`w-full text-left p-2 rounded-lg border transition text-xs ${
                        formData.selectedSubIntencion === subIntent.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 bg-white hover:border-green-300'
                      }`}
                    >
                      <p className="font-semibold">{subIntent.nombre}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{subIntent.descripcion}</p>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tono Principal + Subtonos (Sistema Dual) */}
        <div className={`rounded-xl border p-6 hover:shadow-lg transition col-span-1 ${
          formData.selectedMainTone && formData.selectedSubtone
            ? 'bg-white border-purple-200 ring-2 ring-purple-100'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Volume2 size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Tono y Subtono</h3>
            </div>
            {formData.selectedMainTone && formData.selectedSubtone && (
              <span className="text-xl">✓</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">OBLIGATORIO</span>
            {!formData.selectedMainTone && (
              <span className="text-xs text-red-600">Falta seleccionar tono</span>
            )}
            {formData.selectedMainTone && !formData.selectedSubtone && (
              <span className="text-xs text-red-600">Falta seleccionar subtono</span>
            )}
          </div>

          {/* Macro Tonos como Cajetines (Buyer Personas Style) */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Elige Tono</p>
            <div className="space-y-2">
              {TONOS_CONTEXTO.map((macroTono) => (
                <button
                  key={macroTono.id}
                  onClick={() => {
                    onChange({
                      selectedMainTone: macroTono.id,
                      selectedTone: macroTono.id,
                      selectedSubtone: null
                    });
                  }}
                  className={`w-full text-left rounded-lg p-2 transition border ${
                    formData.selectedMainTone === macroTono.id
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {macroTono.iconLucide && iconMap[macroTono.iconLucide] &&
                      React.createElement(iconMap[macroTono.iconLucide], { className: 'w-4 h-4' })
                    }
                    <span className="text-xs font-semibold text-slate-900">{macroTono.nombre}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Subtonos Expandibles */}
          {formData.selectedMainTone && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Selecciona Subtono</p>
              <div className="space-y-2">
                {TONOS_CONTEXTO.find((t) => t.id === formData.selectedMainTone)?.subtonos.map(
                  (subtono) => (
                    <button
                      key={subtono.id}
                      onClick={() => onChange({ selectedSubtone: subtono.id })}
                      className={`w-full text-left p-2 rounded-lg border transition text-xs ${
                        formData.selectedSubtone === subtono.id
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-900">{subtono.nombre}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{subtono.descripcion}</p>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ángulo / Enfoque Narrativo */}
        <div className={`rounded-xl border p-6 hover:shadow-lg transition col-span-1 ${
          formData.selectedNarrativeAngle
            ? 'bg-white border-indigo-200 ring-2 ring-indigo-100'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clapperboard size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Ángulo Narrativo</h3>
            </div>
            {formData.selectedNarrativeAngle && (
              <span className="text-xl">✓</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">OBLIGATORIO</span>
            {!formData.selectedNarrativeAngle && (
              <span className="text-xs text-red-600">Falta seleccionar un ángulo</span>
            )}
          </div>

          {/* Ángulos como Cajetines (Buyer Personas Style) */}
          <div className="space-y-2">
            {NARRATIVE_ANGLES.map((angle) => (
              <button
                key={angle.id}
                onClick={() => onChange({ selectedNarrativeAngle: angle.id })}
                className={`w-full text-left rounded-lg p-2 transition border ${
                  formData.selectedNarrativeAngle === angle.id
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {angle.iconLucide && iconMap[angle.iconLucide] &&
                    React.createElement(iconMap[angle.iconLucide], { className: 'w-4 h-4' })
                  }
                  <span className="text-xs font-semibold text-slate-900">{angle.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{angle.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  );
}

// Función de validación exportable para el PASO 2
export const isPasoPersonalidadValid = (formData: {
  targetAudience: string;
  selectedContentIntent: string | null;
  selectedSubIntencion: string | null;
  selectedMainTone: string | null;
  selectedSubtone: string | null;
  selectedNarrativeAngle: string | null;
}): boolean => {
  return !!(
    formData.targetAudience &&
    formData.selectedContentIntent &&
    formData.selectedSubIntencion &&
    formData.selectedMainTone &&
    formData.selectedSubtone &&
    formData.selectedNarrativeAngle
  );
};
