'use client';

import React, { useState, useEffect } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import { useClients } from '../../hooks/useClients';
import FormatSelector from '../selectors/FormatSelector';
import ToneSelector from '../selectors/ToneSelector';
import KeywordInput from '../selectors/KeywordInput';
import ClientSelector from '../selectors/ClientSelector';
import ContentDefinition, { InsightOrigin, ContentIntent } from '../selectors/ContentDefinition';
import BlogLengthSelector, { BlogLength } from '../selectors/BlogLengthSelector';
import ClientCard from '../shared/ClientCard';
import PreviewPanel from './PreviewPanel';
import { showToast } from '../shared/Toast';

export default function GeneratorPanel() {
  const { clients, selectedClient, setError, isLoading, error } = useGenerator();
  const { createConfig } = useCreateConfiguration();
  const { generateContent, isGenerating } = useGenerateContent();
  const { getClients, selectClientById } = useClients();
  const [clientsLoaded, setClientsLoaded] = useState(false);

  // Load clients on mount
  useEffect(() => {
    if (!clientsLoaded) {
      getClients()
        .then(() => setClientsLoaded(true))
        .catch((err) => {
          console.error('Failed to load clients:', err);
          setClientsLoaded(true);
        });
    }
  }, [clientsLoaded, getClients]);

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
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>Generador de Contenido</h1>
          <p className="text-sm mt-2 mb-6" style={{ color: '#727272' }}>Crea contenido profesional en pocos clics</p>

          {error && (
            <div className="mb-4 p-4 rounded-lg w-full" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', border: '1px solid' }}>
              {error}
            </div>
          )}
        </div>

        {/* Split-Screen Layout */}
        <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">
          {/* LEFT PANEL (40%) */}
          <div className="w-2/5 flex flex-col gap-4 overflow-y-auto pr-2">
            {/* Client Selection */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3">Selecciona cliente</p>
              <ClientSelector
                clients={clients}
                selectedClient={selectedClient}
                onSelectClient={(client: any) => selectClientById(client.id)}
                isLoading={isLoading}
              />
            </div>

            {/* Client Info Card */}
            {selectedClient && (
              <div>
                <ClientCard client={selectedClient} />
              </div>
            )}

            {/* Configuration Name */}
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de configuración
              </label>
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

          {/* RIGHT PANEL (60%) */}
          <div className="w-3/5 flex-1 overflow-hidden">
            <PreviewPanel
              selectedClient={selectedClient}
              formData={formData}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
