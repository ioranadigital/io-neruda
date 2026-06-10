'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Download, Database, Zap, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { showToast } from '../shared/Toast';
import { GenerationResponse } from '@/src/types/aiGeneration';
import ContentTabs from './ContentTabs';
import RegenerationMenu from './RegenerationMenu';

interface OperationsCenterProps {
  generatedContent: GenerationResponse | null;
  selectedClient: string | null;
  selectedKeyword: string | null;
  selectedClientId?: string | null;
  selectedFormats?: any;
  targetAudience?: string;
  selectedContentIntent?: string;
  keywordsNiche?: string[];
  onSaveVersion?: (content: string) => void;
  onFinalize?: () => void;
  onCreateNewArticle?: () => void;
  onRegenerateWithModifier?: (modifier: string) => Promise<GenerationResponse>;
  onContentUpdate?: (content: GenerationResponse) => void;
}

export default function OperationsCenter({
  generatedContent,
  selectedClient,
  selectedKeyword,
  selectedClientId,
  selectedFormats,
  targetAudience,
  selectedContentIntent,
  keywordsNiche,
  onSaveVersion,
  onFinalize,
  onCreateNewArticle,
  onRegenerateWithModifier,
  onContentUpdate,
}: OperationsCenterProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenerationMenu, setShowRegenerationMenu] = useState(false);
  const [backupContent, setBackupContent] = useState<GenerationResponse | null>(null);
  const [regeneratingContent, setRegeneratingContent] = useState<GenerationResponse | null>(null);

  // Construir el contenido para las acciones de descarga
  const mainContent = React.useMemo((): string => {
    if (!generatedContent) return '';
    try {
      const { metadata, content } = generatedContent;
      let result = `# ${metadata.title}\n\n`;
      result += `${content.intro.hook}\n\n`;
      result += `${content.intro.context}\n\n`;
      result += `${content.intro.promise}\n\n`;

      content.sections.forEach((section) => {
        result += `## ${section.h2}\n\n`;
        result += `${section.content}\n\n`;
        result += `**Key Takeaway:** ${section.keyTakeaway}\n\n`;
      });

      result += `## Conclusión\n\n${content.conclusion}\n\n`;
      result += `${content.cta}\n\n`;

      return result;
    } catch (e) {
      console.error('Error constructing main content:', e);
      return '';
    }
  }, [generatedContent]);

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mainContent);
      showToast.success('Contenido copiado al portapapeles');
    } catch (err) {
      showToast.error('Error al copiar al portapapeles');
    }
  }, [mainContent]);

  const handleDownloadMarkdown = useCallback(() => {
    const filename = `contenido-${selectedClient?.toLowerCase().replace(/\s+/g, '-')}-${selectedKeyword?.toLowerCase().replace(/\s+/g, '-')}.md`;
    const blob = new Blob([mainContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast.success('Contenido descargado como Markdown');
  }, [mainContent, selectedClient, selectedKeyword]);

  const handleDownloadHTML = useCallback(() => {
    const filename = `contenido-${selectedClient?.toLowerCase().replace(/\s+/g, '-')}-${selectedKeyword?.toLowerCase().replace(/\s+/g, '-')}.html`;
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${selectedKeyword || 'Contenido Generado'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #1f2937; }
    pre { background: #f3f4f6; padding: 12px; border-radius: 6px; overflow-x: auto; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
  </style>
</head>
<body>
  <div class="content">
    ${mainContent.replace(/\n/g, '<br>')}
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast.success('Contenido descargado como HTML');
  }, [mainContent, selectedClient, selectedKeyword]);

  const handleSaveVersion = useCallback(async () => {
    setIsSaving(true);
    try {
      // Guardar en localStorage como versión
      const versions = JSON.parse(localStorage.getItem('io-neruda-content-versions') || '[]');
      const newVersion = {
        id: `version-${Date.now()}`,
        content: mainContent,
        clientId: selectedClient,
        keyword: selectedKeyword,
        timestamp: new Date().toISOString(),
      };
      versions.unshift(newVersion);
      localStorage.setItem('io-neruda-content-versions', JSON.stringify(versions.slice(0, 20))); // Limitar a 20 versiones

      onSaveVersion?.(mainContent);
      showToast.success('Versión guardada exitosamente');
    } catch (err) {
      showToast.error('Error al guardar versión');
    } finally {
      setIsSaving(false);
    }
  }, [mainContent, selectedClient, selectedKeyword, onSaveVersion]);

  const handleSaveToDatabase = useCallback(async () => {
    setIsSaving(true);
    try {
      if (!generatedContent) {
        showToast.error('No hay contenido para guardar');
        setIsSaving(false);
        return;
      }

      const selectedFormat = selectedFormats
        ? (Object.keys(selectedFormats).find(
            (k) => selectedFormats[k].selected
          ) as any)
        : 'blog';

      // Generar ID realmente único
      const generateUniqueId = (): string => {
        // Usar crypto.randomUUID si está disponible (más confiable)
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          return crypto.randomUUID();
        }
        // Fallback: timestamp de alta precisión + múltiples fuentes de aleatoriedad
        const timestamp = Date.now().toString(36);
        const random1 = Math.random().toString(36).substring(2, 15);
        const random2 = Math.random().toString(36).substring(2, 15);
        const random3 = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${random1}${random2}${random3}`;
      };
      const uniqueId = generateUniqueId();

      const contentResult = {
        id: uniqueId,
        clientId: selectedClientId || selectedClient,
        clientName: selectedClient,
        postTitle: generatedContent.metadata.title,
        outputFormat: selectedFormat || 'blog',
        keywordsUsed: [selectedKeyword, ...(keywordsNiche || [])],
        generatedDate: new Date().toISOString(),
        targetAudience: targetAudience || '',
        contentIntent: selectedContentIntent || 'No especificado',
        status: 'draft' as const,
        body: mainContent, // Guardar el contenido completo en HTML
      };

      const existingResults = JSON.parse(localStorage.getItem('io-neruda-content-results') || '[]');
      existingResults.unshift(contentResult);
      localStorage.setItem('io-neruda-content-results', JSON.stringify(existingResults));

      showToast.success('Contenido guardado como Borrador');
    } catch (err) {
      showToast.error('Error al guardar en base de datos');
    } finally {
      setIsSaving(false);
    }
  }, [generatedContent, selectedClient, selectedClientId, selectedKeyword, selectedFormats, targetAudience, selectedContentIntent, keywordsNiche]);

  const handleSyncWithPlanner = useCallback(async () => {
    try {
      // Aquí iría la integración con el planificador
      showToast.warning('Funcionalidad de sincronización próximamente');
    } catch (err) {
      showToast.error('Error al sincronizar con planificador');
    }
  }, []);

  const handleRegenerateWithModifier = useCallback(
    async (modifier: string) => {
      if (!generatedContent || !onRegenerateWithModifier) {
        showToast.error('No hay contenido para regenerar');
        return;
      }

      // Guardar backup
      setBackupContent(generatedContent);
      setIsRegenerating(true);
      setShowRegenerationMenu(false);

      try {
        const result = await onRegenerateWithModifier(modifier);
        setRegeneratingContent(result);
        onContentUpdate?.(result);
        showToast.success(`Contenido regenerado: ${modifier}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error regenerando contenido';
        showToast.error(message);
        // El backup está disponible para deshacer
      } finally {
        setIsRegenerating(false);
      }
    },
    [generatedContent, onRegenerateWithModifier, onContentUpdate]
  );

  const handleUndoRegeneration = useCallback(() => {
    if (backupContent) {
      setRegeneratingContent(null);
      setBackupContent(null);
      onContentUpdate?.(backupContent);
      showToast.success('Cambios revertidos al contenido anterior');
    }
  }, [backupContent, onContentUpdate]);

  if (!generatedContent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-gray-500 text-lg">No hay contenido generado</p>
        </div>
      </div>
    );
  }

  const displayContent = regeneratingContent || generatedContent;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Columna Izquierda: Contenido con Pestañas */}
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden relative">
        {isRegenerating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-40 rounded-lg">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium text-slate-700">Regenerando contenido...</p>
            </div>
          </div>
        )}
        <ContentTabs
          generatedContent={displayContent}
          selectedKeyword={selectedKeyword}
          selectedClient={selectedClient}
          keywordsNiche={keywordsNiche || []}
          contentIntent={selectedContentIntent}
        />
      </div>

      {/* Columna Derecha: Centro de Operaciones */}
      <div className="w-full lg:w-80 flex flex-col gap-3 relative">
        <h3 className="text-lg font-bold text-slate-900">Acciones</h3>

        {/* Botón: Guardar en Contenidos */}
        <button
          onClick={handleSaveToDatabase}
          disabled={isSaving || isRegenerating}
          className="flex items-center gap-3 w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-lg transition font-medium text-purple-700 disabled:opacity-50"
          title="Guardar contenido en contenidos"
        >
          <Database size={20} />
          <span>{isSaving ? 'Guardando...' : 'Guardar en Contenidos'}</span>
        </button>

        {/* Botón: Descargar */}
        <button
          onClick={handleDownloadMarkdown}
          disabled={isRegenerating}
          className="flex items-center gap-3 w-full px-4 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded-lg transition font-medium text-orange-700 disabled:opacity-50"
          title="Descargar contenido"
        >
          <Download size={20} />
          <span>Descargar Contenido</span>
        </button>

        {/* Botón: Regenerar con Menú */}
        <div className="relative">
          <button
            onClick={() => setShowRegenerationMenu(!showRegenerationMenu)}
            disabled={isRegenerating}
            className={`flex items-center gap-3 w-full px-4 py-3 border rounded-lg transition font-medium ${
              showRegenerationMenu
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-slate-600 hover:bg-slate-700 border-slate-600 text-white'
            } disabled:opacity-50`}
            title="Regenerar contenido con opciones"
          >
            <RefreshCw size={20} className={isRegenerating ? 'animate-spin' : ''} />
            <span>Regenerar</span>
          </button>

          {/* Menú de Regeneración */}
          <RegenerationMenu
            isOpen={showRegenerationMenu}
            isGenerating={isRegenerating}
            onSelectOption={handleRegenerateWithModifier}
            onClose={() => setShowRegenerationMenu(false)}
          />
        </div>

        {/* Botón: Deshacer (si hay backup) */}
        {backupContent && (
          <button
            onClick={handleUndoRegeneration}
            disabled={isRegenerating}
            className="flex items-center gap-3 w-full px-4 py-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 rounded-lg transition font-medium text-yellow-700 disabled:opacity-50"
            title="Revertir a la versión anterior"
          >
            <RotateCcw size={20} />
            <span>Deshacer Cambios</span>
          </button>
        )}

        {/* Botón: Crear Más Artículos */}
        <button
          onClick={onCreateNewArticle}
          disabled={isRegenerating}
          className="flex items-center gap-3 w-full px-4 py-3 bg-green-600 hover:bg-green-700 border border-green-600 rounded-lg transition font-medium text-white disabled:opacity-50"
          title="Crear más artículos desde el principio"
        >
          <Zap size={20} />
          <span>Crear Más Artículos</span>
        </button>
      </div>
    </div>
  );
}
