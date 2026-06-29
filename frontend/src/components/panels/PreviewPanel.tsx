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
    insightOrigin?: string;
    contentIntent?: string;
    localGeoEnabled?: boolean;
    localGeoValue?: string;
    blogLength?: string;
    // PASO 2: Strategy
    targetAudience?: string;
    selectedContentIntent?: string | null;
    selectedMainTone?: string | null;
    selectedTone?: string | null;
    // PASO 4: Semantic Definition
    h1Title?: string;
    h2Title?: string;
    urlSlug?: string;
    internalLink1?: string;
    internalLink2?: string;
    semanticElements?: Set<string>;
    // PASO 5: Format Output
    selectedFormats?: { [key: string]: { selected: boolean; subType?: string } };
    subSelectorValues?: { [key: string]: string };
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
    // PASO 1: Keywords
    keywords: {
      niche: formData.keywordsNiche,
      longtail: formData.keywordsLongtail,
    },
    // PASO 2: Strategy
    strategy: {
      targetAudience: formData.targetAudience || 'No especificado',
      contentIntent: formData.selectedContentIntent || 'No especificado',
      mainTone: formData.selectedMainTone || 'No especificado',
      selectedTone: formData.selectedTone || 'No especificado',
    },
    // PASO 4: Semantic Definition
    semanticDefinition: {
      h1Title: formData.h1Title || 'No especificado',
      h2Title: formData.h2Title || 'No especificado',
      urlSlug: formData.urlSlug || 'No especificado',
      internalLinks: {
        link1: formData.internalLink1 || 'No especificado',
        link2: formData.internalLink2 || 'No especificado',
      },
      semanticElements: formData.semanticElements ? Array.from(formData.semanticElements) : [],
    },
    // PASO 5: Format Output
    formatOutput: {
      selectedFormats: formData.selectedFormats
        ? Object.entries(formData.selectedFormats)
            .filter(([, format]) => format.selected)
            .map(([key, format]) => ({
              format: key,
              subType: format.subType || 'default',
            }))
        : [],
      subSelectorValues: formData.subSelectorValues || {},
    },
    // PASO 6: Configuration
    configuration: {
      client: selectedClient?.name || 'Sin cliente',
      configName: formData.name || 'Sin nombre',
      tone: formData.tone,
      blogLength: formData.blogLength || 'standard',
      insightOrigin: formData.insightOrigin || 'direct_idea',
      localGeo: {
        enabled: formData.localGeoEnabled || false,
        value: formData.localGeoValue || 'No especificado',
      },
    },
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

## Parámetros Estratégicos
${formData.insightOrigin ? `- **Origen del Insight:** ${formData.insightOrigin}` : ''}
${formData.contentIntent ? `- **Intención:** ${formData.contentIntent}` : ''}
${formData.localGeoEnabled && formData.localGeoValue ? `- **SEO Local:** ${formData.localGeoValue}` : formData.localGeoEnabled ? '- **SEO Local:** Habilitado (sin ubicación)' : ''}

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

  const isReady = selectedClient;
  // Count from new selectedFormats system (PASO 5)
  const selectedFormatsCount = formData.selectedFormats
    ? Object.values(formData.selectedFormats).filter((f) => f.selected).length
    : 0;

  // Fallback to old enabledFormats system for backward compatibility
  const enabledFormatsCount = selectedFormatsCount > 0
    ? selectedFormatsCount
    : Object.values(formData.enabledFormats).filter((v) => v).length;

  const isMultiFormat = enabledFormatsCount > 1;

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
              disabled={!isReady || isGenerating || enabledFormatsCount === 0}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-black rounded-lg transition disabled:opacity-50 font-medium"
              style={{ backgroundColor: isReady && !isGenerating && enabledFormatsCount > 0 ? '#7BF1A8' : '#d4f8e8' }}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  {isMultiFormat ? 'Generando ecosistema...' : 'Generando...'}
                </>
              ) : (
                <>
                  <Download size={16} />
                  {isMultiFormat ? 'Generar Ecosistema' : 'Generar Contenido'}
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
