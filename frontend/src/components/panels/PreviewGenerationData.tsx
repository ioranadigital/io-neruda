'use client';

import { useMemo } from 'react';
import { Client } from '@/src/types/client';
import { renderPrompt, getPromptTemplate } from '@/src/services/promptRenderer';
import { buildPromptData } from '@/src/utils/promptDataBuilder';

interface PreviewGenerationDataProps {
  selectedClient: Client | null;
  selectedKeyword: string | null;
  formData: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PreviewGenerationData({
  selectedClient,
  selectedKeyword,
  formData,
  onConfirm,
  onCancel,
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

  const handleDownloadMD = () => {
    const filename = `prompt-${selectedClient?.name?.toLowerCase().replace(/\s+/g, '-')}-${selectedKeyword?.toLowerCase().replace(/\s+/g, '-')}.md`;
    const blob = new Blob([renderedPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">📋 PASO 6: Previsualizar Prompt y Generar</h2>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Rendered Prompt - Markdown Style */}
        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <pre className="text-xs text-slate-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
            {renderedPrompt}
          </pre>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition"
          >
            ← Volver
          </button>
          <button
            onClick={handleDownloadMD}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            ⬇️ Descargar MD
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            ✨ Generar con Claude AI
          </button>
        </div>
      </div>
    </div>
  );
}
