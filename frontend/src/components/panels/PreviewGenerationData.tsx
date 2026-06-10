'use client';

import { useMemo } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { Client } from '@/src/types/client';
import { renderPrompt, getPromptTemplate } from '@/src/services/promptRenderer';
import { buildPromptData } from '@/src/utils/promptDataBuilder';
import { showToast } from '../shared/Toast';

interface PreviewGenerationDataProps {
  selectedClient: Client | null;
  selectedKeyword: string | null;
  formData: any;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isGenerating?: boolean;
  step?: string;
}

export default function PreviewGenerationData({
  selectedClient,
  selectedKeyword,
  formData,
  onConfirm,
  onCancel,
  isGenerating = false,
  step = 'preparing',
}: PreviewGenerationDataProps) {
  const renderedPrompt = useMemo(() => {
    try {
      const promptData = buildPromptData(formData, selectedClient, selectedKeyword);
      const template = getPromptTemplate();
      return renderPrompt(template, promptData);
    } catch (err) {
      return `Error generando preview: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  }, [formData, selectedClient, selectedKeyword]);

  const getStepProgress = (): number => {
    const steps = ['preparing', 'generating', 'validating', 'complete'];
    const index = steps.indexOf(step);
    return index >= 0 ? ((index + 1) / steps.length) * 100 : 0;
  };

  const getStepLabel = (currentStep: string): string => {
    const labels: Record<string, string> = {
      preparing: 'Preparando...',
      generating: 'Generando contenido...',
      validating: 'Validando calidad...',
      complete: 'Completado',
    };
    return labels[currentStep] || 'Procesando...';
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-5 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <Eye size={28} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">PASO 7: Previsualizar Prompt y Generar</h2>
        </div>
        <p className="text-slate-600 text-sm">Revisa el prompt que será enviado a Claude AI antes de generar el contenido</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-5 py-4">
        {/* Barra de Progreso - Solo si está generando */}
        {isGenerating && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
              <div>
                <p className="font-semibold text-slate-900">{getStepLabel(step)}</p>
                <p className="text-sm text-slate-600">Generando tu contenido con Claude AI...</p>
              </div>
            </div>
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Por favor espera...</p>
          </div>
        )}

        {/* Rendered Prompt - Solo si NO está generando */}
        {!isGenerating && (
          <>
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Contenido del Prompt</h3>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 overflow-x-auto">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
                  {renderedPrompt}
                </pre>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Este prompt será enviado a Claude AI para generar tu contenido. Verifica que todo sea correcto antes de continuar.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer con Botón Centrado y Grande */}
      <div className="flex-shrink-0 px-4 md:px-5 py-4 border-t border-slate-200 bg-white flex justify-center gap-3">
        {/* Botón Generar Contenido - Grande y Centrado */}
        <button
          onClick={onConfirm}
          disabled={isGenerating}
          className="flex items-center gap-3 px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-bold transition text-lg shadow-md hover:shadow-lg"
          title="Generar contenido con Claude AI"
        >
          <Sparkles size={28} />
          {isGenerating ? 'Generando...' : 'Generar Contenido'}
        </button>
      </div>
    </div>
  );
}
