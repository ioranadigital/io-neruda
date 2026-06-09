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
    targetAudience: string;
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

  // Condiciones para habilitar cada paso
  const step1Complete = !!formData.targetAudience;
  const step2Complete = step1Complete && formData.selectedContentIntent && formData.selectedSubIntencion;
  const step3Complete = step2Complete && formData.selectedMainTone && formData.selectedSubtone;

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
        {/* PASO 1: Público Objetivo - SIEMPRE ACTIVO (AZUL) */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Público Objetivo</h3>
            </div>
            {formData.targetAudience ? (
              <span className="text-xl font-bold text-blue-600">✓</span>
            ) : (
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">PASO 1</span>
            )}
          </div>
          {!formData.targetAudience && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-red-600">Falta seleccionar</span>
            </div>
          )}

          {selectedClient?.target_audience && (
            <div className="mb-4 pb-4 border-b border-blue-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Del cliente</p>
              <p className="text-xs text-slate-900 font-medium">{selectedClient.target_audience}</p>
            </div>
          )}

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
                        ? 'bg-blue-100 border-blue-400'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold transition ${
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
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Seleccionado</p>
                  <p className="text-xs font-semibold text-blue-700">✓ {formData.targetAudience}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500">El cliente no tiene buyer personas configurados</p>
            </div>
          )}
        </div>

        {/* PASO 2: Intención del Funnel - Habilitado solo si PASO 1 completo */}
        <div className={`rounded-xl border p-6 transition col-span-1 ${
          step1Complete
            ? step2Complete
              ? 'bg-green-50 border-green-200 hover:shadow-lg'
              : 'bg-slate-50 border-slate-200 hover:shadow-lg'
            : 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                step1Complete ? 'bg-green-100' : 'bg-slate-200'
              }`}>
                <Lightbulb size={24} className={step1Complete ? 'text-green-600' : 'text-slate-500'} />
              </div>
              <h3 className={`text-lg font-semibold ${step1Complete ? 'text-slate-900' : 'text-slate-500'}`}>Intención del Funnel</h3>
            </div>
            {step2Complete ? (
              <span className="text-xl font-bold text-green-600">✓</span>
            ) : (
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                step1Complete
                  ? 'text-green-600 bg-green-100'
                  : 'text-slate-500 bg-slate-200'
              }`}>PASO 2</span>
            )}
          </div>
          {step1Complete && (!formData.selectedContentIntent || !formData.selectedSubIntencion) && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-red-600">Falta completar</span>
            </div>
          )}
          {!step1Complete && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">Completa el Paso 1 primero</span>
            </div>
          )}

          {selectedClient?.content_pillars && selectedClient.content_pillars.length > 0 && step1Complete && (
            <div className="mb-4 pb-4 border-b border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Pilares del cliente</p>
              <div className="space-y-1">
                {selectedClient.content_pillars.slice(0, 2).map((pillar, idx) => (
                  <p key={idx} className="text-xs text-slate-900 font-medium">• {pillar}</p>
                ))}
              </div>
            </div>
          )}

          {step1Complete && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Elige Intención</p>
              {INTENCIONES_CONTEXTO.map((macroIntent) => {
                const isExpanded = formData.selectedContentIntent === macroIntent.id;
                return (
                  <div key={macroIntent.id}>
                    <button
                      onClick={() => {
                        onChange({
                          selectedContentIntent: macroIntent.id,
                          selectedSubIntencion: null
                        });
                      }}
                      className={`w-full text-left rounded-lg p-3 transition border-2 ${
                        isExpanded
                          ? 'bg-green-50 border-green-400'
                          : 'bg-white border-slate-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {macroIntent.iconLucide && iconMap[macroIntent.iconLucide] &&
                          React.createElement(iconMap[macroIntent.iconLucide], { className: 'w-5 h-5' })
                        }
                        <span className={`text-sm font-semibold transition ${
                          isExpanded ? 'text-green-700' : 'text-slate-900'
                        }`}>{macroIntent.nombre}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 pl-3 space-y-2">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Selecciona sub-intención:</p>
                        {macroIntent.subIntenciones.map((subIntent) => (
                          <button
                            key={subIntent.id}
                            onClick={() => onChange({ selectedSubIntencion: subIntent.id })}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              formData.selectedSubIntencion === subIntent.id
                                ? 'bg-green-100 border-green-400'
                                : 'bg-slate-50 border-slate-200 hover:border-green-300'
                            }`}
                          >
                            <p className={`text-xs font-semibold transition ${
                              formData.selectedSubIntencion === subIntent.id ? 'text-green-700' : 'text-slate-900'
                            }`}>{subIntent.nombre}</p>
                            <p className="text-slate-500 text-[11px] mt-1">{subIntent.descripcion}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PASO 3: Tono y Subtono - Habilitado solo si PASO 2 completo */}
        <div className={`rounded-xl border p-6 transition col-span-1 ${
          step2Complete
            ? step3Complete
              ? 'bg-purple-50 border-purple-200 hover:shadow-lg'
              : 'bg-slate-50 border-slate-200 hover:shadow-lg'
            : 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                step2Complete ? 'bg-purple-100' : 'bg-slate-200'
              }`}>
                <Volume2 size={24} className={step2Complete ? 'text-purple-600' : 'text-slate-500'} />
              </div>
              <h3 className={`text-lg font-semibold ${step2Complete ? 'text-slate-900' : 'text-slate-500'}`}>Tono y Subtono</h3>
            </div>
            {step3Complete ? (
              <span className="text-xl font-bold text-purple-600">✓</span>
            ) : (
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                step2Complete
                  ? 'text-purple-600 bg-purple-100'
                  : 'text-slate-500 bg-slate-200'
              }`}>PASO 3</span>
            )}
          </div>
          {step2Complete && (!formData.selectedMainTone || !formData.selectedSubtone) && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-red-600">Falta completar</span>
            </div>
          )}
          {!step2Complete && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">Completa el Paso 2 primero</span>
            </div>
          )}

          {selectedClient?.default_tone && step2Complete && (
            <div className="mb-4 pb-4 border-b border-slate-200">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Tono del Cliente</p>
              <p className="text-xs text-slate-900 font-medium capitalize">{selectedClient.default_tone}</p>
            </div>
          )}

          {step2Complete && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Elige Tono</p>
              {TONOS_CONTEXTO.map((macroTono) => {
                const isExpanded = formData.selectedMainTone === macroTono.id;
                return (
                  <div key={macroTono.id}>
                    <button
                      onClick={() => {
                        onChange({
                          selectedMainTone: macroTono.id,
                          selectedTone: macroTono.id,
                          selectedSubtone: null
                        });
                      }}
                      className={`w-full text-left rounded-lg p-3 transition border-2 ${
                        isExpanded
                          ? 'bg-purple-50 border-purple-400'
                          : 'bg-white border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {macroTono.iconLucide && iconMap[macroTono.iconLucide] &&
                          React.createElement(iconMap[macroTono.iconLucide], { className: 'w-5 h-5' })
                        }
                        <span className={`text-sm font-semibold transition ${
                          isExpanded ? 'text-purple-700' : 'text-slate-900'
                        }`}>{macroTono.nombre}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 pl-3 space-y-2">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Selecciona subtono:</p>
                        {macroTono.subtonos.map((subtono) => (
                          <button
                            key={subtono.id}
                            onClick={() => onChange({ selectedSubtone: subtono.id })}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              formData.selectedSubtone === subtono.id
                                ? 'bg-purple-100 border-purple-400'
                                : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                            }`}
                          >
                            <p className={`text-xs font-semibold transition ${
                              formData.selectedSubtone === subtono.id ? 'text-purple-700' : 'text-slate-900'
                            }`}>{subtono.nombre}</p>
                            <p className="text-slate-500 text-[11px] mt-1">{subtono.descripcion}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PASO 4: Ángulo Narrativo - Habilitado solo si PASO 3 completo */}
        <div className={`rounded-xl border p-6 transition col-span-1 ${
          step3Complete
            ? formData.selectedNarrativeAngle
              ? 'bg-slate-900 border-slate-700 hover:shadow-lg'
              : 'bg-slate-50 border-slate-200 hover:shadow-lg'
            : 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                step3Complete
                  ? formData.selectedNarrativeAngle
                    ? 'bg-slate-700'
                    : 'bg-slate-100'
                  : 'bg-slate-200'
              }`}>
                <Clapperboard size={24} className={
                  step3Complete
                    ? formData.selectedNarrativeAngle
                      ? 'text-white'
                      : 'text-slate-600'
                    : 'text-slate-500'
                } />
              </div>
              <h3 className={`text-lg font-semibold ${
                step3Complete
                  ? formData.selectedNarrativeAngle
                    ? 'text-white'
                    : 'text-slate-900'
                  : 'text-slate-500'
              }`}>Ángulo Narrativo</h3>
            </div>
            {formData.selectedNarrativeAngle ? (
              <span className={`text-xl font-bold ${
                formData.selectedNarrativeAngle ? 'text-white' : 'text-slate-600'
              }`}>✓</span>
            ) : (
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                step3Complete
                  ? 'text-slate-600 bg-slate-100'
                  : 'text-slate-500 bg-slate-200'
              }`}>PASO 4</span>
            )}
          </div>
          {step3Complete && !formData.selectedNarrativeAngle && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-red-600">Falta seleccionar</span>
            </div>
          )}
          {!step3Complete && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">Completa el Paso 3 primero</span>
            </div>
          )}
          <p className={`text-xs mb-4 leading-relaxed ${
            step3Complete
              ? formData.selectedNarrativeAngle
                ? 'text-slate-200'
                : 'text-slate-500'
              : 'text-slate-500'
          }`}>Selecciona la perspectiva narrativa que mejor enganche a tu audiencia.</p>

          {step3Complete && (
            <div className="space-y-2">
              <p className={`text-xs uppercase tracking-wide mb-2 font-semibold ${
                formData.selectedNarrativeAngle ? 'text-slate-300' : 'text-slate-500'
              }`}>Elige ángulo</p>
              {NARRATIVE_ANGLES.map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => onChange({ selectedNarrativeAngle: angle.id })}
                  className={`w-full text-left rounded-lg p-2 transition border ${
                    formData.selectedNarrativeAngle === angle.id
                      ? 'bg-slate-700 border-slate-600'
                      : formData.selectedNarrativeAngle
                      ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {angle.iconLucide && iconMap[angle.iconLucide] &&
                      React.createElement(iconMap[angle.iconLucide], { className: `w-4 h-4 ${
                        formData.selectedNarrativeAngle ? 'text-white' : 'text-slate-600'
                      }` })
                    }
                    <span className={`text-xs font-semibold ${
                      formData.selectedNarrativeAngle ? 'text-white' : 'text-slate-900'
                    }`}>{angle.label}</span>
                  </div>
                  <p className={`text-[10px] mt-0.5 ${
                    formData.selectedNarrativeAngle ? 'text-slate-300' : 'text-slate-500'
                  }`}>{angle.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </StepContainer>
  );
}

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
