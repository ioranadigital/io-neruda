'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import FormatSelector from '../selectors/FormatSelector';
import ToneSelector from '../selectors/ToneSelector';
import ContentDefinition, { InsightOrigin, ContentIntent } from '../selectors/ContentDefinition';
import BlogLengthSelector, { BlogLength } from '../selectors/BlogLengthSelector';
import PreviewPanel from './PreviewPanel';
import ClientBriefingHeader from './ClientBriefingHeader';
import SEOConfigHeader from './SEOConfigHeader';
import { showToast } from '../shared/Toast';
import { X } from 'lucide-react';

export default function GeneratorPanel() {
  const { clients, selectedClient, setError, error, selectClient } = useGenerator();
  const { createConfig } = useCreateConfiguration();
  const { generateContent, isGenerating } = useGenerateContent();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    keywordsNiche: string[];
    keywordsLongtail: string[];
    tone: Configuration['tone'];
    enabledFormats: EnabledFormats;
    insightOrigin: InsightOrigin;
    contentIntent: ContentIntent;
    localGeoEnabled: boolean;
    localGeoValue: string;
    blogLength: BlogLength;
  }>({
    name: '',
    keywordsNiche: [],
    keywordsLongtail: [],
    tone: 'professional',
    enabledFormats: {
      blog: false,
      email: false,
      social_linkedin: false,
      social_instagram: false,
      whatsapp: false,
      pdf: false,
    },
    insightOrigin: 'direct_idea',
    contentIntent: 'educational',
    localGeoEnabled: false,
    localGeoValue: '',
    blogLength: 'standard',
  });

  const [seoConfig, setSeoConfig] = useState({
    h1Title: '',
    primaryKeyword: '',
    secondaryKeywords: [] as string[],
    urlSlug: '',
    searchIntent: '',
    funnelStage: '',
    mainTone: '',
    subTone: '',
    wordCount: '',
    headingStructure: '',
    visualElements: { lists: false, tables: false, alerts: false },
    bannedWords: ['En conclusión', 'Es crucial', 'Sumérgete'],
    styleFilters: { noObviousIntro: true, directStart: true, noBoldWords: true },
  });

  const handleSEOChange = (field: string, value: any) => {
    setSeoConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedClient) {
      setError('Selecciona un cliente para continuar');
      return;
    }

    const enabledFormatsCount = Object.values(formData.enabledFormats).filter(Boolean).length;
    if (enabledFormatsCount === 0) {
      setError('Selecciona al menos un formato de contenido');
      return;
    }

    try {
      await generateContent({
        contentId: `content_${Date.now()}`,
        configName: formData.name,
        clientId: selectedClient.id,
        keywordsNiche: formData.keywordsNiche,
        keywordsLongtail: formData.keywordsLongtail,
        tone: formData.tone,
        enabledFormats: formData.enabledFormats,
        insightOrigin: formData.insightOrigin,
        contentIntent: formData.contentIntent,
        localGeoEnabled: formData.localGeoEnabled,
        localGeoValue: formData.localGeoValue,
        blogLength: formData.blogLength,
      });

      showToast.success('✅ Ecosistema de contenido generado exitosamente');

      setTimeout(() => setShowPreviewModal(false), 500);

      setFormData({
        name: '',
        keywordsNiche: [],
        keywordsLongtail: [],
        tone: 'professional',
        enabledFormats: {
          blog: false,
          email: false,
          social_linkedin: false,
          social_instagram: false,
          whatsapp: false,
          pdf: false,
        },
        insightOrigin: 'direct_idea',
        contentIntent: 'educational',
        localGeoEnabled: false,
        localGeoValue: '',
        blogLength: 'standard',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error generating content';
      setError(message);
      showToast.error(`❌ ${message}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#f5f5f5' }}>
      <div className="flex-1 w-full flex flex-col overflow-hidden">
        {/* Error Message */}
        {error && (
          <div className="px-6 pt-6 pb-0">
            <div className="p-4 rounded-lg w-full" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', border: '1px solid' }}>
              {error}
            </div>
          </div>
        )}

        {/* Client Briefing Header */}
        <div className="px-4 py-3">
          <ClientBriefingHeader
            selectedClient={selectedClient}
            clients={clients}
            onSelectClient={selectClient}
          />
        </div>

        {/* Separator */}
        <div className="h-1 mx-4" style={{ backgroundColor: '#f5f5f5' }}></div>

        {/* SEO Configuration Header */}
        <div className="px-4 py-3">
          <SEOConfigHeader
            config={seoConfig}
            onChange={handleSEOChange}
          />
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-hidden px-6 py-6 flex flex-col gap-6">
          {/* ROW 1: 3x Tone Selector */}
          <div className="grid grid-cols-3 gap-6">
            {/* Tone 1 */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-y-auto max-h-[500px]">
              <ToneSelector
                selectedTone={formData.tone}
                onChange={(tone) => setFormData({ ...formData, tone })}
              />
            </div>

            {/* Tone 2 (Duplicado) */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-y-auto max-h-[500px]">
              <ToneSelector
                selectedTone={formData.tone}
                onChange={(tone) => setFormData({ ...formData, tone })}
              />
            </div>

            {/* Tone 3 (Duplicado) */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-y-auto max-h-[500px]">
              <ToneSelector
                selectedTone={formData.tone}
                onChange={(tone) => setFormData({ ...formData, tone })}
              />
            </div>
          </div>

          {/* ROW 2: Other Controls */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1">
            {/* Content Definition */}
            <ContentDefinition
              insightOrigin={formData.insightOrigin}
              contentIntent={formData.contentIntent}
              localGeoEnabled={formData.localGeoEnabled}
              localGeoValue={formData.localGeoValue}
              onInsightOriginChange={(origin) => setFormData({ ...formData, insightOrigin: origin })}
              onContentIntentChange={(intent) => setFormData({ ...formData, contentIntent: intent })}
              onLocalGeoToggle={(enabled) => setFormData({ ...formData, localGeoEnabled: enabled })}
              onLocalGeoValueChange={(value) => setFormData({ ...formData, localGeoValue: value })}
            />

            {/* Formats */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
              <label className="block text-sm font-bold text-gray-800 mb-3">🎯 Formatos de Salida</label>
              <FormatSelector
                selectedFormats={formData.enabledFormats}
                onChange={(formats) => setFormData({ ...formData, enabledFormats: formats })}
              />
            </div>

            {/* Blog Length Selector (Conditional) */}
            {formData.enabledFormats.blog && (
              <BlogLengthSelector
                value={formData.blogLength}
                onChange={(length) => setFormData({ ...formData, blogLength: length })}
              />
            )}

            {/* Formats Summary */}
            {Object.values(formData.enabledFormats).some(v => v) && (
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-2">📤 Formatos Seleccionados</h3>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(formData.enabledFormats)
                    .filter(([, enabled]) => enabled)
                    .map(([format]) => (
                      <span key={format} className="px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: '#7BF1A8', color: '#000' }}>
                        {format.replace('social_', '').toUpperCase()}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ROW 3: Preview Button - Bottom Left (Final Step) */}
          <div className="w-full">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="w-full px-4 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 border-2"
              style={{ backgroundColor: '#7BF1A8', color: '#000', borderColor: '#7BF1A8' }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#000' }}>6</span>
              👁️ Ver Preview & Generar
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal - Slide from Right */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreviewModal(false)} />
          <div className="absolute top-0 right-0 h-full w-1/2 bg-white shadow-2xl overflow-hidden" style={{
            animation: 'slideInFromRight 300ms ease-out'
          }}>
            <style>{`
              @keyframes slideInFromRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition z-10"
            >
              <X size={24} />
            </button>
            <PreviewPanel
              selectedClient={selectedClient}
              formData={formData}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
