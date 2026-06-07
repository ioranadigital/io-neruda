'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import FormatSelector from '../selectors/FormatSelector';
import ToneSelector from '../selectors/ToneSelector';
import KeywordInput from '../selectors/KeywordInput';
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
    if (!selectedClient || !formData.name || formData.keywordsNiche.length === 0) {
      setError('Completa: cliente, nombre y al menos 1 keyword');
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
        <div className="px-6 py-4 space-y-4">
          <SEOConfigHeader
            config={seoConfig}
            onChange={handleSEOChange}
          />
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 overflow-hidden px-6 py-6">
          <div className="grid grid-cols-3 gap-6 h-full overflow-y-auto pr-2">
            {/* COLUMN 1 - Configuración Básica */}
            <div className="flex flex-col gap-4">
              {/* Configuration Name */}
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#7BF1A8', color: '#000' }}>1</span>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de configuración
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Blog Posts Professional"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Keywords */}
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <KeywordInput
                  niche={formData.keywordsNiche}
                  longtail={formData.keywordsLongtail}
                  onChange={(niche, longtail) =>
                    setFormData({ ...formData, keywordsNiche: niche, keywordsLongtail: longtail })
                  }
                />
              </div>
            </div>

            {/* COLUMN 2 - Configuración Avanzada */}
            <div className="flex flex-col gap-4">
              {/* Tone */}
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <ToneSelector
                  selectedTone={formData.tone}
                  onChange={(tone) => setFormData({ ...formData, tone })}
                />
              </div>

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
            </div>

            {/* COLUMN 3 - Resumen & Acciones */}
            <div className="flex flex-col gap-4">
              {/* Configuration Summary */}
              {formData.name && (
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">⚙️ Configuración</h3>
                  <p className="text-sm font-medium text-gray-700">{formData.name}</p>
                </div>
              )}

              {/* Keywords Summary */}
              {(formData.keywordsNiche.length > 0 || formData.keywordsLongtail.length > 0) && (
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">🔑 Keywords</h3>
                  {formData.keywordsNiche.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Niche:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.keywordsNiche.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.keywordsLongtail.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Long-tail:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.keywordsLongtail.map((kw, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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

              {/* Preview Button - Fixed at bottom */}
              <button
                onClick={() => setShowPreviewModal(true)}
                className="w-full px-4 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2"
                style={{ backgroundColor: '#7BF1A8', color: '#000' }}
              >
                👁️ Ver Preview & Generar
              </button>
            </div>
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
