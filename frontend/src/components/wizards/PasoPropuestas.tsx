'use client';

import React from 'react';
import { Client } from '@/src/types/client';
import StepContainer from './StepContainer';
import { BookOpen, BarChart3, Lightbulb, TrendingUp, Wrench, Zap, PenTool } from 'lucide-react';

interface PasoPropuestasProps {
  selectedClient: Client | null;
  formData: {
    name: string;
    selectedProposal: string | null;
  };
  onChange: (data: { name?: string; selectedProposal?: string | null }) => void;
}

const CONTENT_PROPOSALS = [
  {
    id: 'guide',
    title: 'Guía Completa',
    description: 'Un artículo profundo que cubre todos los aspectos del tema',
    icon: BookOpen,
    color: 'blue',
  },
  {
    id: 'comparison',
    title: 'Comparativa',
    description: 'Análisis detallado entre opciones alternativas',
    icon: BarChart3,
    color: 'purple',
  },
  {
    id: 'tips',
    title: 'Tips & Trucos',
    description: 'Lista de consejos prácticos e inmediatamente aplicables',
    icon: Lightbulb,
    color: 'yellow',
  },
  {
    id: 'case_study',
    title: 'Caso de Estudio',
    description: 'Análisis real de cómo se logró un resultado',
    icon: TrendingUp,
    color: 'green',
  },
  {
    id: 'tutorial',
    title: 'Tutorial Paso a Paso',
    description: 'Instrucciones detalladas para lograr algo específico',
    icon: Wrench,
    color: 'orange',
  },
  {
    id: 'trends',
    title: 'Tendencias & Futuro',
    description: 'Análisis de tendencias emergentes y predicciones',
    icon: Zap,
    color: 'red',
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
      iconColor="orange"
      columns={1}
      gap="medium"
    >
      <div className="space-y-6">
      {/* Nombre/Título del Contenido */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Nombre del Contenido (Título Tentativo)
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="ej: Guía Completa de SEO para Principiantes..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-2">
          Esto ayudará a la IA a contextualizar el tipo de contenido que necesitas
        </p>
      </div>

      {/* Tipos de Propuestas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm font-bold text-gray-900 mb-4">Tipo de Propuesta de Contenido</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTENT_PROPOSALS.map((proposal) => {
            const Icon = proposal.icon;
            const isSelected = formData.selectedProposal === proposal.id;
            const colorClasses: Record<string, { bg: string; text: string; border: string; hoverBorder: string; selectedBorder: string; selectedBg: string }> = {
              blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hoverBorder: 'hover:border-blue-400', selectedBorder: 'border-blue-500', selectedBg: 'bg-blue-50' },
              purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hoverBorder: 'hover:border-purple-400', selectedBorder: 'border-purple-500', selectedBg: 'bg-purple-50' },
              yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', hoverBorder: 'hover:border-yellow-400', selectedBorder: 'border-yellow-500', selectedBg: 'bg-yellow-50' },
              green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hoverBorder: 'hover:border-green-400', selectedBorder: 'border-green-500', selectedBg: 'bg-green-50' },
              orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hoverBorder: 'hover:border-orange-400', selectedBorder: 'border-orange-500', selectedBg: 'bg-orange-50' },
              red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hoverBorder: 'hover:border-red-400', selectedBorder: 'border-red-500', selectedBg: 'bg-red-50' },
            };
            const colors = colorClasses[proposal.color as keyof typeof colorClasses];
            return (
              <button
                key={proposal.id}
                onClick={() => onChange({ selectedProposal: proposal.id })}
                className={`w-full text-left rounded-lg border-2 p-4 transition cursor-pointer ${
                  isSelected
                    ? `${colors.selectedBorder} ${colors.selectedBg} shadow-md`
                    : `${colors.border} bg-white ${colors.hoverBorder} hover:shadow-md`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${colors.bg} p-2 rounded-lg flex-shrink-0`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{proposal.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{proposal.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Las propuestas de contenido se adaptan automáticamente basadas en tu intención y tono
        </p>
      </div>
      </div>
    </StepContainer>
  );
}
