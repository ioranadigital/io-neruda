'use client';

import React, { useMemo } from 'react';
import { Client } from '@/src/types/client';
import { Template, TemplateInjection } from '@/src/types/templates';
import { MASTER_TEMPLATES } from '@/src/data/templates';
import StepContainer from './StepContainer';
import { BookOpen, BarChart3, Lightbulb, TrendingUp, Wrench, Zap, PenTool, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { SUBCATEGORIAS_POR_PROPUESTA } from '@/src/data/incubacionPropuestas';

interface PasoPropuestasProps {
  selectedClient: Client | null;
  formData: {
    name: string;
    selectedProposal: string | null;
    subcategoriaPropuesta: string | null;
  };
  onChange: (data: { name?: string; selectedProposal?: string | null; subcategoriaPropuesta?: string | null; templateId?: string; templateName?: string }) => void;
  templateInjection?: TemplateInjection | null;
}

const CONTENT_PROPOSALS = [
  {
    id: 'guide',
    title: 'Guía Completa',
    description: 'Un artículo profundo que cubre todos los aspectos del tema',
    icon: BookOpen,
  },
  {
    id: 'comparison',
    title: 'Comparativa',
    description: 'Análisis detallado entre opciones alternativas',
    icon: BarChart3,
  },
  {
    id: 'tips',
    title: 'Tips & Trucos',
    description: 'Lista de consejos prácticos e inmediatamente aplicables',
    icon: Lightbulb,
  },
  {
    id: 'case_study',
    title: 'Caso de Estudio',
    description: 'Análisis real de cómo se logró un resultado',
    icon: TrendingUp,
  },
  {
    id: 'tutorial',
    title: 'Tutorial Paso a Paso',
    description: 'Instrucciones detalladas para lograr algo específico',
    icon: Wrench,
  },
  {
    id: 'trends',
    title: 'Tendencias & Futuro',
    description: 'Análisis de tendencias emergentes y predicciones',
    icon: Zap,
  },
];

export default function PasoPropuestas({
  selectedClient,
  formData,
  onChange,
  templateInjection,
}: PasoPropuestasProps) {
  const propuestaLabels: Record<string, string> = {
    'guide': 'Guía Completa',
    'comparison': 'Comparativa',
    'tips': 'Tips & Trucos',
    'case_study': 'Caso de Estudio',
    'tutorial': 'Tutorial Paso a Paso',
    'trends': 'Tendencias & Futuro',
  };

  // Encontrar plantilla elegida en Paso 1 (DEBE estar antes de cualquier condicional)
  const selectedTemplate = useMemo(() => {
    if (!templateInjection?.templateId) return null;
    return MASTER_TEMPLATES.find(t => t.id === templateInjection.templateId);
  }, [templateInjection]);

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  // Manejar cambio de plantilla
  const handleUseTemplate = (template: Template) => {
    onChange({
      selectedProposal: template.targetPropuesta,
      subcategoriaPropuesta: template.subcategoria,
      templateId: template.id,
      templateName: template.nombre,
    });
  };

  return (
    <div className="w-full space-y-6 px-4 py-6">
      {/* Banner si viene de plantilla */}
      {selectedTemplate && (
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#f0fdff',
            borderColor: '#06b6d4',
          }}
        >
          <CheckCircle size={18} style={{ color: '#0891b2', flexShrink: 0 }} className="mt-0.5" />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0e7490' }}>
              Plantilla seleccionada
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#0c6b7d' }}>
              Usarás la estructura de <strong>{selectedTemplate.nombre}</strong>
            </p>
            <p className="text-xs mt-1 text-slate-600">
              ¿Quieres cambiarla? Selecciona otra plantilla a continuación.
            </p>
          </div>
        </div>
      )}

      {/* Plantillas agrupadas por propuesta */}
      <div className="space-y-6">
        {(['guide', 'comparison', 'tips', 'case_study', 'tutorial', 'trends'] as const).map(
          (propuestaType) => {
            const templatesByPropuesta = MASTER_TEMPLATES.filter(
              (t) => t.targetPropuesta === propuestaType
            );
            if (templatesByPropuesta.length === 0) return null;

            return (
              <div key={propuestaType} className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 pl-1 border-l-4" style={{ borderColor: '#4aa87a' }}>
                  {propuestaLabels[propuestaType]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesByPropuesta.map((template) => {
                    const isSelected = selectedTemplate?.id === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleUseTemplate(template)}
                        className="text-left p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        style={{
                          borderColor: isSelected ? template.colorBadge : template.colorBadge + '40',
                          backgroundColor: isSelected ? template.colorBadge + '15' : template.colorBadge + '08',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            template.colorBadge + '80';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${template.colorBadge}20`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            isSelected ? template.colorBadge : template.colorBadge + '40';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-xs font-semibold mb-1" style={{ color: template.colorBadge }}>
                              🏷️ {template.categoria}
                            </p>
                            <h3 className="font-bold text-sm text-slate-900">{template.nombre}</h3>
                          </div>
                          {isSelected && (
                            <div className="ml-2 flex-shrink-0">
                              <CheckCircle size={20} style={{ color: template.colorBadge }} />
                            </div>
                          )}
                        </div>

                        {/* Subcategoría */}
                        <p className="text-xs text-slate-500 mb-2">→ {template.subcategoria}</p>

                        {/* Description */}
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{template.descripcion}</p>

                        {/* Footer - CTA */}
                        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: template.colorBadge }}>
                          <Sparkles size={13} />
                          {isSelected ? 'Seleccionada' : 'Usar este molde'}
                          <ArrowRight size={12} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Info */}
      <div className="bg-slate-50 rounded p-3">
        <p className="text-xs text-slate-600">
          💡 <strong>Tip:</strong> Selecciona una plantilla para usar su estructura de contenido.
        </p>
      </div>
    </div>
  );
}
