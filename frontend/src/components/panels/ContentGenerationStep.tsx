'use client';

import { useState } from 'react';
import { GenerationResponse, GenerationStep } from '@/src/types/aiGeneration';
import { QualityScoreCard } from '@/src/components/generators/QualityScoreCard';
import { ContentPreviewPanel } from '@/src/components/generators/ContentPreviewPanel';

interface ContentGenerationStepProps {
  isGenerating: boolean;
  step: GenerationStep;
  qualityScore: number | null;
  content: GenerationResponse | null;
  error: string | null;
  onRegenerate: () => void;
  onSave: (type: 'draft' | 'version') => void;
  onClose: () => void;
}

const stepLabels: Record<GenerationStep, string> = {
  idle: 'Listo',
  preparing: 'Preparando...',
  generating: 'Generando contenido...',
  validating: 'Validando calidad...',
  complete: 'Completado',
  error: 'Error',
};

const stepDescriptions: Record<GenerationStep, string> = {
  idle: 'Esperando iniciar generación',
  preparing: 'Renderizando prompt con datos del cliente',
  generating: 'Llamando a Claude AI para generar contenido',
  validating: 'Validando estructura y calidad del contenido',
  complete: 'Contenido generado y validado',
  error: 'Ocurrió un error en la generación',
};

export default function ContentGenerationStep({
  isGenerating,
  step,
  qualityScore,
  content,
  error,
  onRegenerate,
  onSave,
  onClose,
}: ContentGenerationStepProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const getStepProgress = (): number => {
    const steps: GenerationStep[] = ['preparing', 'generating', 'validating', 'complete'];
    const index = steps.indexOf(step);
    return index >= 0 ? ((index + 1) / steps.length) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">PASO 7 - Generación de Contenido</h2>
        {step === 'complete' && !isGenerating && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status Section */}
      {(isGenerating || step === 'error') && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            {isGenerating && (
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
            )}
            {step === 'error' && (
              <div className="w-4 h-4 rounded-full bg-red-500" />
            )}
            <div>
              <p className="font-semibold text-slate-900">{stepLabels[step]}</p>
              <p className="text-sm text-slate-600">{stepDescriptions[step]}</p>
            </div>
          </div>

          {isGenerating && (
            <>
              <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${getStepProgress()}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Por favor espera...</p>
            </>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Quality Score */}
      {content && !isGenerating && (
        <div className="mb-6">
          <QualityScoreCard qualityMetrics={content.qualityMetrics} />
        </div>
      )}

      {/* Content Preview */}
      {content && !isGenerating && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vista Previa del Contenido</h3>
          <ContentPreviewPanel content={content} />
        </div>
      )}

      {/* Action Buttons */}
      {content && !isGenerating && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Regenerar
          </button>

          <button
            onClick={() => onSave('draft')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Guardar como Borrador
          </button>

          <button
            onClick={() => onSave('version')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              content.qualityMetrics.passesQualityThreshold
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!content.qualityMetrics.passesQualityThreshold}
            title={
              !content.qualityMetrics.passesQualityThreshold
                ? 'La puntuación debe ser ≥80 para guardar como versión'
                : ''
            }
          >
            Guardar Versión
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition-colors ml-auto"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Error State with Retry */}
      {step === 'error' && !isGenerating && (
        <div className="flex gap-3">
          <button
            onClick={onRegenerate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
