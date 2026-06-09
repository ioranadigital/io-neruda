'use client';

import { useMemo } from 'react';
import { Eye, Download, Copy, Sparkles } from 'lucide-react';
import { Client } from '@/src/types/client';
import { renderPrompt, getPromptTemplate } from '@/src/services/promptRenderer';
import { buildPromptData } from '@/src/utils/promptDataBuilder';
import { showToast } from '../shared/Toast';

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
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 md:px-8 py-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <Eye size={28} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">PASO 7: Previsualizar Prompt y Generar</h2>
        </div>
        <p className="text-slate-600 text-sm">Revisa el prompt que será enviado a Claude AI antes de generar el contenido</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 md:px-8 py-6">
        {/* Rendered Prompt - Markdown Style */}
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
      </div>

      {/* Footer con Botones */}
      <div className="flex-shrink-0 px-6 md:px-8 py-6 border-t border-slate-200 bg-white flex justify-end gap-3">
        {/* Botón Descargar */}
        <button
          onClick={handleDownloadMD}
          className="flex items-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition text-sm shadow-sm hover:shadow-md"
          title="Descargar prompt como archivo Markdown"
        >
          <Download size={18} />
          Descargar
        </button>

        {/* Botón Copiar */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(renderedPrompt);
            showToast.success('Prompt copiado al portapapeles');
          }}
          className="flex items-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition text-sm shadow-sm hover:shadow-md"
          title="Copiar prompt al portapapeles"
        >
          <Copy size={18} />
          Copiar
        </button>

        {/* Botón Generar Contenido */}
        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-base shadow-sm hover:shadow-md"
          title="Enviar a Anthropic API para generar contenido"
        >
          <Sparkles size={20} />
          Generar Contenido
        </button>
      </div>
    </div>
  );
}
