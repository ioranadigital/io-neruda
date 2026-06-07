'use client';

import React, { useState } from 'react';
import { Client } from '../../types/client';
import { Configuration, EnabledFormats } from '../../types/generator';
import { Copy, Download, Eye, Code, Upload } from 'lucide-react';
import { useVaultExport } from '../../hooks/useVaultExport';
import { showToast } from '../shared/Toast';

interface PreviewPanelProps {
  selectedClient: Client | null;
  formData: {
    name: string;
    keywordsNiche: string[];
    keywordsLongtail: string[];
    tone: Configuration['tone'];
    enabledFormats: EnabledFormats;
  };
  isGenerating?: boolean;
  onGenerate?: () => Promise<void>;
}

type PreviewFormat = 'json' | 'markdown';

export default function PreviewPanel({
  selectedClient,
  formData,
  isGenerating = false,
  onGenerate,
}: PreviewPanelProps) {
  const [previewFormat, setPreviewFormat] = useState<PreviewFormat>('json');
  const [copied, setCopied] = useState(false);
  const { exportToVault, downloadAsJSON, isExporting } = useVaultExport();

  const generationPreview = {
    client: selectedClient?.name || 'Sin cliente',
    configuration: formData.name || 'Sin nombre',
    keywords: {
      niche: formData.keywordsNiche,
      longtail: formData.keywordsLongtail,
    },
    tone: formData.tone,
    formats: Object.entries(formData.enabledFormats)
      .filter(([, enabled]) => enabled)
      .map(([format]) => format),
    timestamp: new Date().toISOString(),
  };

  const jsonPreview = JSON.stringify(generationPreview, null, 2);

  const markdownPreview = `# Briefing de Generación

## Cliente
${selectedClient ? `- **Nombre:** ${selectedClient.name}` : '- **Nombre:** Sin cliente'}
${selectedClient?.description ? `- **Descripción:** ${selectedClient.description}` : ''}

## Configuración
- **Nombre:** ${formData.name || 'Sin nombre'}

## Keywords
### Niche
${formData.keywordsNiche.length > 0 ? formData.keywordsNiche.map((kw) => `- ${kw}`).join('\n') : '- Sin keywords'}

### Long-tail
${formData.keywordsLongtail.length > 0 ? formData.keywordsLongtail.map((kw) => `- ${kw}`).join('\n') : '- Sin keywords'}

## Tono
${formData.tone}

## Formatos
${
  Object.entries(formData.enabledFormats)
    .filter(([, enabled]) => enabled)
    .map(([format]) => `- ${format}`)
    .join('\n') || '- Sin formatos seleccionados'
}

---
Generado: ${new Date().toLocaleString()}
`;

  const copyToClipboard = async () => {
    const text = previewFormat === 'json' ? jsonPreview : markdownPreview;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportToVault = async () => {
    try {
      await exportToVault(selectedClient, formData);
      showToast.success('✅ Exportado a Vault exitosamente');
    } catch (err) {
      showToast.error('❌ Error al exportar a Vault');
    }
  };

  const handleDownloadBrandProfile = () => {
    downloadAsJSON(selectedClient, formData, 'brandProfile');
    showToast.success('✅ Descargando Brand Profile...');
  };

  const handleDownloadBriefing = () => {
    downloadAsJSON(selectedClient, formData, 'briefing');
    showToast.success('✅ Descargando Briefing...');
  };

  const isReady = selectedClient && formData.name && formData.keywordsNiche.length > 0;

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 rounded-lg border-2 border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Preview</h2>

        {/* Format Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewFormat('json')}
            className={`flex items-center gap-1 px-3 py-1 rounded transition text-sm font-medium ${
              previewFormat === 'json'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={previewFormat === 'json' ? { backgroundColor: '#18bdc1' } : {}}
          >
            <Code size={14} />
            JSON
          </button>
          <button
            onClick={() => setPreviewFormat('markdown')}
            className={`flex items-center gap-1 px-3 py-1 rounded transition text-sm font-medium ${
              previewFormat === 'markdown'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={previewFormat === 'markdown' ? { backgroundColor: '#18bdc1' } : {}}
          >
            <Eye size={14} />
            Markdown
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isReady ? (
          <pre className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-200 font-mono whitespace-pre-wrap break-words">
            {previewFormat === 'json' ? jsonPreview : markdownPreview}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-600 font-medium mb-1">Completa el formulario</p>
              <p className="text-sm text-gray-500">
                Necesitas: cliente, nombre, keywords
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white p-4 rounded-b-lg space-y-3">
        {/* Status */}
        {isReady && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded text-center font-medium text-white" style={{ backgroundColor: '#cef5ff', color: '#18bdc1' }}>
              {formData.keywordsNiche.length} Niche
            </div>
            <div className="p-2 rounded text-center font-medium text-white" style={{ backgroundColor: '#b6ebf8', color: '#18bdc1' }}>
              {formData.keywordsLongtail.length} Long-tail
            </div>
            <div className="p-2 rounded text-center font-medium text-white" style={{ backgroundColor: '#8fd6e3', color: '#18bdc1' }}>
              {Object.values(formData.enabledFormats).filter((v) => v).length} Format
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              disabled={!isReady}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 text-sm font-medium"
            >
              <Copy size={16} />
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button
              onClick={onGenerate}
              disabled={!isReady || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white rounded-lg transition disabled:opacity-50 font-medium"
              style={{ backgroundColor: isReady && !isGenerating ? '#18bdc1' : '#70c5d0' }}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Generando...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Generar
                </>
              )}
            </button>
          </div>

          {/* Export Actions */}
          {isReady && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleExportToVault}
                disabled={isExporting}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-1 px-2 py-2 rounded-lg transition disabled:opacity-50 text-xs font-medium text-white"
                style={{ backgroundColor: '#70c5d0' }}
                title="Exportar a Vault (./vault/clients/{id}/)"
              >
                <Upload size={14} />
                {isExporting ? 'Exportando...' : 'Vault'}
              </button>
              <button
                onClick={handleDownloadBrandProfile}
                disabled={isExporting}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-1 px-2 py-2 rounded-lg transition disabled:opacity-50 text-xs font-medium text-white"
                style={{ backgroundColor: '#8fd6e3' }}
                title="Descargar Brand Profile JSON"
              >
                <Download size={14} />
                Profile
              </button>
              <button
                onClick={handleDownloadBriefing}
                disabled={isExporting}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-1 px-2 py-2 rounded-lg transition disabled:opacity-50 text-xs font-medium text-white"
                style={{ backgroundColor: '#b6ebf8' }}
                title="Descargar Briefing JSON"
              >
                <Download size={14} />
                Briefing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
