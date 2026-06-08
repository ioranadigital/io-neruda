'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import ContentDefinition, { InsightOrigin, ContentIntent } from '../selectors/ContentDefinition';
import BlogLengthSelector, { BlogLength } from '../selectors/BlogLengthSelector';
import PreviewPanel from './PreviewPanel';
import ClientBriefingHeader from './ClientBriefingHeader';
import TechnicalAuditAccordion from './TechnicalAuditAccordion';
import { TECHNICAL_AUDIT_DATA } from '../../data/technicalAudit';
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

        {/* Main Content - All blocks aligned with consistent spacing */}
        <div className="flex-1 overflow-hidden px-6 py-6 flex flex-col gap-6">
          {/* Client Briefing Header */}
          <ClientBriefingHeader
            selectedClient={selectedClient}
            clients={clients}
            onSelectClient={selectClient}
          />

          {/* Content Definition */}
          <ContentDefinition
            insightOrigin={formData.insightOrigin}
            localGeoEnabled={formData.localGeoEnabled}
            localGeoValue={formData.localGeoValue}
            onInsightOriginChange={(origin) => setFormData({ ...formData, insightOrigin: origin })}
            onLocalGeoToggle={(enabled) => setFormData({ ...formData, localGeoEnabled: enabled })}
            onLocalGeoValueChange={(value) => setFormData({ ...formData, localGeoValue: value })}
          />

          {/* Blog Length Selector (Conditional) */}
          {formData.enabledFormats.blog && (
            <BlogLengthSelector
              value={formData.blogLength}
              onChange={(length) => setFormData({ ...formData, blogLength: length })}
            />
          )}

          {/* Scroll Area for Audit Section */}
          <div className="flex-1 overflow-y-auto">
            <TechnicalAuditAccordion
              categories={TECHNICAL_AUDIT_DATA}
              contentIntent={formData.contentIntent}
              onContentIntentChange={(intent) => setFormData({ ...formData, contentIntent: intent })}
              localGeoValue={formData.localGeoValue}
            />
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

      {/* Final Button - Preview & Generate */}
      <div className="px-6 pb-6">
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
  );
}
