import { useState, useCallback } from 'react';
import { Client } from '../types/client';
import { Configuration, EnabledFormats } from '../types/generator';

interface ExportData {
  brandProfile: {
    clientId: string;
    clientName: string;
    description: string;
    targetAudience: string;
    defaultTone: string;
    forbiddenKeywords: string[];
    competitorUrls: string[];
    brandColors: {
      primary: string;
      secondary: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  briefing: {
    clientId: string;
    sessionId: string;
    configurationName: string;
    keywords: {
      niche: string[];
      longtail: string[];
    };
    tone: string;
    enabledFormats: EnabledFormats;
    createdAt: string;
  };
}

export function useVaultExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExportData = useCallback(
    (
      client: Client | null,
      formData: {
        name: string;
        keywordsNiche: string[];
        keywordsLongtail: string[];
        tone: Configuration['tone'];
        enabledFormats: EnabledFormats;
      }
    ): ExportData | null => {
      if (!client) return null;

      const now = new Date().toISOString();
      const sessionId = `session_${Date.now()}`;

      return {
        brandProfile: {
          clientId: client.id,
          clientName: client.name,
          description: client.description || '',
          targetAudience: client.target_audience || '',
          defaultTone: client.default_tone,
          forbiddenKeywords: client.forbidden_keywords || [],
          competitorUrls: client.competitor_urls || [],
          brandColors: {
            primary: client.color_primary || '#3B82F6',
            secondary: client.color_secondary || '#10B981',
          },
          createdAt: client.created_at,
          updatedAt: client.updated_at,
        },
        briefing: {
          clientId: client.id,
          sessionId,
          configurationName: formData.name,
          keywords: {
            niche: formData.keywordsNiche,
            longtail: formData.keywordsLongtail,
          },
          tone: formData.tone,
          enabledFormats: formData.enabledFormats,
          createdAt: now,
        },
      };
    },
    []
  );

  const exportToVault = useCallback(
    async (
      client: Client | null,
      formData: {
        name: string;
        keywordsNiche: string[];
        keywordsLongtail: string[];
        tone: Configuration['tone'];
        enabledFormats: EnabledFormats;
      }
    ) => {
      setIsExporting(true);
      setError(null);

      try {
        const exportData = generateExportData(client, formData);
        if (!exportData) {
          throw new Error('No client selected');
        }

        // Call API endpoint to save files
        const response = await fetch('/api/vault/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exportData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to export to vault');
        }

        const result = await response.json();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Export failed';
        setError(message);
        throw err;
      } finally {
        setIsExporting(false);
      }
    },
    [generateExportData]
  );

  const downloadAsJSON = useCallback(
    (
      client: Client | null,
      formData: {
        name: string;
        keywordsNiche: string[];
        keywordsLongtail: string[];
        tone: Configuration['tone'];
        enabledFormats: EnabledFormats;
      },
      dataType: 'brandProfile' | 'briefing'
    ) => {
      const exportData = generateExportData(client, formData);
      if (!exportData) return;

      const data = exportData[dataType];
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [generateExportData]
  );

  return {
    exportToVault,
    downloadAsJSON,
    isExporting,
    error,
    generateExportData,
  };
}
