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

  // Encontrar plantilla elegida (desde Paso 1 o cambios en Paso 4)
  const selectedTemplate = useMemo(() => {
    // Primero checkear cambios en Paso 4 (formData.templateId)
    const templateIdFromForm = (formData as any).templateId;
    if (templateIdFromForm) {
      return MASTER_TEMPLATES.find(t => t.id === templateIdFromForm);
    }
    // Luego checkear inyección original de Paso 1
    if (!templateInjection?.templateId) return null;
    return MASTER_TEMPLATES.find(t => t.id === templateInjection.templateId);
  }, [templateInjection, formData]);

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
      {/* Banner prominente si viene de plantilla */}
      {selectedTemplate && (
        <div
          className="flex items-start gap-3 px-6 py-4 rounded-xl border-2 shadow-sm"
          style={{
            backgroundColor: selectedTemplate.colorBadge + '15',
            borderColor: selectedTemplate.colorBadge,
          }}
        >
          <CheckCircle size={20} style={{ color: selectedTemplate.colorBadge, flexShrink: 0 }} className="mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">
              ✓ Plantilla elegida
            </p>
            <p className="text-sm mt-1 font-semibold" style={{ color: selectedTemplate.colorBadge }}>
              {selectedTemplate.nombre}
            </p>
            <p className="text-xs mt-2 text-slate-600">
              Esta estructura guiará tu contenido. Puedes <strong>cambiar de idea</strong> seleccionando otra plantilla abajo.
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {templatesByPropuesta.map((template) => {
                    const isSelected = selectedTemplate?.id === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleUseTemplate(template)}
                        title={`${template.nombre}\n${template.descripcion}`}
                        className="relative text-left p-2 rounded-lg border-2 transition-all hover:shadow-md group"
                        style={{
                          borderColor: isSelected ? template.colorBadge : template.colorBadge + '30',
                          backgroundColor: isSelected ? template.colorBadge + '30' : template.colorBadge + '08',
                          fontWeight: isSelected ? '600' : 'normal',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = template.colorBadge;
                          }
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${template.colorBadge}30`;
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = template.colorBadge + '30';
                          }
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                      >
                        {/* Checkmark si está seleccionada - más visible */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 z-10">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: template.colorBadge }}>
                              <CheckCircle size={16} className="text-white" />
                            </div>
                          </div>
                        )}

                        {/* Nombre compacto */}
                        <h4 className={`font-bold text-xs leading-tight pr-4 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                          {template.nombre}
                        </h4>

                        {/* Subcategoría pequeña */}
                        <p className={`text-[10px] mt-1 leading-tight ${isSelected ? 'text-slate-600 font-semibold' : 'text-slate-500'}`}>
                          {template.subcategoria}
                        </p>

                        {/* Tooltip en hover (descripción) */}
                        <div className="invisible group-hover:visible absolute left-0 bottom-full mb-2 bg-slate-900 text-white text-xs p-2 rounded max-w-xs z-50 pointer-events-none">
                          {template.descripcion}
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
