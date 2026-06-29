'use client';

import { QualityMetrics } from '@/src/types/aiGeneration';

interface QualityScoreCardProps {
  qualityMetrics: QualityMetrics;
}

export function QualityScoreCard({ qualityMetrics }: QualityScoreCardProps) {
  const { overallScore, passesQualityThreshold, componentScores } = qualityMetrics;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metrics = [
    { label: 'Alineación con Buyer Persona', value: componentScores.buyerPersonaAlignment },
    { label: 'Intención de Contenido', value: componentScores.contentIntentMatch },
    { label: 'Consistencia de Voz', value: componentScores.brandVoiceConsistency },
    { label: 'Integración de Keywords', value: componentScores.keywordIntegration },
    { label: 'Optimización de Formato', value: componentScores.formatOptimization },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Puntuación de Calidad</h3>
          <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}
            <span className="text-sm font-normal">/100</span>
          </div>
        </div>

        <div className="relative h-3 bg-slate-300 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(overallScore)} transition-all duration-300`}
            style={{ width: `${overallScore}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-600">
          {passesQualityThreshold ? (
            <span className="text-green-600 font-medium">✓ Cumple estándares (≥80)</span>
          ) : (
            <span className="text-amber-600 font-medium">⚠ Por debajo del estándar mínimo</span>
          )}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Desglose de Componentes:</h4>
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-700">{metric.label}</span>
              <span className={`text-sm font-semibold ${getScoreColor(metric.value)}`}>
                {metric.value}%
              </span>
            </div>
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(metric.value)} transition-all`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {qualityMetrics.recommendations && qualityMetrics.recommendations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Recomendaciones:</h4>
          <ul className="space-y-2">
            {qualityMetrics.recommendations.slice(0, 3).map((rec, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-amber-500 font-bold mt-0.5">•</span>
                <span>{rec.suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
