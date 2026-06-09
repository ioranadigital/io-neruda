'use client';

import React from 'react';
import { Client } from '@/src/types/client';
import StepContainer from './StepContainer';
import { BookOpen, BarChart3, Lightbulb, TrendingUp, Wrench, Zap, PenTool } from 'lucide-react';
import { SUBCATEGORIAS_POR_PROPUESTA } from '@/src/data/incubacionPropuestas';

interface PasoPropuestasProps {
  selectedClient: Client | null;
  formData: {
    name: string;
    selectedProposal: string | null;
    subcategoriaPropuesta: string | null;
  };
  onChange: (data: { name?: string; selectedProposal?: string | null; subcategoriaPropuesta?: string | null }) => void;
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
}: PasoPropuestasProps) {
  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  return (
    <StepContainer
      title="Propuestas de Contenido"
      icon={PenTool}
      iconColor="green"
      columns={1}
      gap="medium"
    >
      {/* Grid de 6 Columnas con Tarjetas */}
      <div className="grid grid-cols-6 gap-4 w-full">
        {CONTENT_PROPOSALS.map((proposal) => {
          const Icon = proposal.icon;
          const isSelected = formData.selectedProposal === proposal.id;
          const subcategorias = SUBCATEGORIAS_POR_PROPUESTA[proposal.id] || [];

          return (
            <div key={proposal.id} className="flex flex-col">
              {/* Tarjeta Individual de Propuesta */}
              <div
                className={`rounded-xl border p-4 transition-all duration-300 text-left flex flex-col h-full relative ${
                  isSelected
                    ? 'border-green-400 bg-green-50 ring-2 ring-green-200 shadow-md'
                    : 'border-slate-200 bg-white hover:bg-green-50 hover:border-green-300 hover:shadow-md cursor-pointer'
                }`}
              >
                {/* Contenedor clickeable para la propuesta */}
                <button
                  onClick={() => onChange({ selectedProposal: proposal.id, subcategoriaPropuesta: null })}
                  className="flex flex-col flex-1 text-left w-full"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 flex-shrink-0 ${
                    isSelected ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    <Icon size={20} className={isSelected ? 'text-green-600' : 'text-slate-600'} />
                  </div>

                  {/* Título */}
                  <h4 className={`font-semibold text-sm mb-1 transition ${
                    isSelected ? 'text-green-700' : 'text-slate-900'
                  }`}>
                    {proposal.title}
                  </h4>

                  {/* Descripción */}
                  <p className="text-xs text-slate-600 leading-tight flex-1">
                    {proposal.description}
                  </p>
                </button>

                {/* Check Arriba a la Derecha */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xl font-bold text-green-600">✓</span>
                  </div>
                )}

                {/* Subcategorías Dentro de la Tarjeta - Siempre Visibles */}
                {subcategorias.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Subcategoría:</p>
                    {subcategorias.map((subcategoria) => (
                      <button
                        key={subcategoria.id}
                        onClick={() => onChange({ selectedProposal: proposal.id, subcategoriaPropuesta: subcategoria.id })}
                        className={`w-full text-left p-2 rounded-lg border-2 transition ${
                          formData.subcategoriaPropuesta === subcategoria.id && isSelected
                            ? 'bg-green-100 border-green-400'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className={`text-xs font-semibold transition ${
                          formData.subcategoriaPropuesta === subcategoria.id && isSelected ? 'text-green-700' : 'text-slate-900'
                        }`}>{subcategoria.nombre}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">{subcategoria.descripcion}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </StepContainer>
  );
}
