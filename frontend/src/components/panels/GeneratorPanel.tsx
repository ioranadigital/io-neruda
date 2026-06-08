'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import { useClaudeGeneration } from '@/src/hooks/useClaudeGeneration';
import { GenerationResponse, GenerationStep } from '@/src/types/aiGeneration';
import PlanGeneratorInteligente, { InsightOrigin } from './PlanGeneratorInteligente';
import type { ContentIntent } from '../selectors/ContentDefinition';
import BlogLengthSelector, { BlogLength } from '../selectors/BlogLengthSelector';
import PreviewPanel from './PreviewPanel';
import ClientBriefingHeader from './ClientBriefingHeader';
import ContentGenerationStep from './ContentGenerationStep';
import { showToast } from '../shared/Toast';
import { renderPrompt, getPromptTemplate } from '@/src/services/promptRenderer';
import { buildPromptData, validatePromptData } from '@/src/utils/promptDataBuilder';
import { X } from 'lucide-react';

export default function GeneratorPanel() {
  const { clients, selectedClient, setError, error, selectClient, addContentResult, addCustomKeywordToClient } = useGenerator();
  const { createConfig } = useCreateConfiguration();
  const { generateContent, isGenerating } = useGenerateContent();
  const { generateContent: generateAIContent, isGenerating: isAIGenerating, step: aiStep, qualityScore, error: aiError } = useClaudeGeneration();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showGenerationStep, setShowGenerationStep] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GenerationResponse | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');

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
    // PASO 2: Strategy
    targetAudience: string;
    selectedContentIntent: string | null;
    selectedMainTone: string | null;
    selectedTone: string | null;
    // PASO 4: Semantic Definition
    h1Title: string;
    h2Title: string;
    urlSlug: string;
    internalLink1: string;
    internalLink2: string;
    semanticElements: Set<string>;
    // PASO 5: Format Output
    selectedFormats: { [key: string]: { selected: boolean; subType?: string } };
    subSelectorValues: { [key: string]: string };
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
    // PASO 2
    targetAudience: '',
    selectedContentIntent: null,
    selectedMainTone: null,
    selectedTone: null,
    // PASO 4
    h1Title: '',
    h2Title: '',
    urlSlug: '',
    internalLink1: '',
    internalLink2: '',
    semanticElements: new Set(),
    // PASO 5
    selectedFormats: {},
    subSelectorValues: {},
  });


  const handleStartAIGeneration = async () => {
    if (!selectedClient) {
      setError('Selecciona un cliente para continuar');
      return;
    }

    if (!selectedKeyword) {
      setError('Selecciona una keyword para generar contenido');
      return;
    }

    try {
      const promptData = buildPromptData(
        formData,
        selectedClient,
        selectedKeyword
      );

      const validation = validatePromptData(promptData);
      if (!validation.valid) {
        setError(`Campos faltantes: ${validation.errors.join(', ')}`);
        return;
      }

      const template = getPromptTemplate();
      const renderedPrompt = renderPrompt(template, promptData);

      setShowGenerationStep(true);
      const result = await generateAIContent(renderedPrompt);
      setGeneratedContent(result);
      showToast.success('✅ Contenido generado exitosamente');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error generating content';
      setError(message);
      showToast.error(`❌ ${message}`);
    }
  };

  const handleRegenerateContent = async () => {
    if (!selectedClient || !selectedKeyword) return;

    try {
      const promptData = buildPromptData(formData, selectedClient, selectedKeyword);
      const template = getPromptTemplate();
      const renderedPrompt = renderPrompt(template, promptData);

      // Add regeneration context
      const enhancedPrompt = `${renderedPrompt}\n\nNOTA: Este es un intento de regeneración. Mejora los aspectos donde la puntuación anterior fue baja. Mantén la estructura pero aumenta la calidad general.`;

      const result = await generateAIContent(enhancedPrompt);
      setGeneratedContent(result);
      showToast.success('✅ Contenido regenerado');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error regenerating';
      setError(message);
      showToast.error(`❌ ${message}`);
    }
  };

  const handleSaveGeneratedContent = (type: 'draft' | 'version') => {
    if (!generatedContent || !selectedClient) return;

    const selectedFormat = formData.selectedFormats
      ? (Object.keys(formData.selectedFormats).find(
          (k) => formData.selectedFormats[k].selected
        ) as any)
      : 'blog';

    addContentResult({
      id: generatedContent.metadata.id,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      postTitle: generatedContent.metadata.title,
      outputFormat: selectedFormat || 'blog',
      keywordsUsed: [selectedKeyword, ...(formData.keywordsNiche || [])],
      generatedDate: new Date().toISOString(),
      targetAudience: formData.targetAudience || '',
      contentIntent: formData.selectedContentIntent || 'No especificado',
      status: type === 'draft' ? 'draft' : 'published',
    });

    showToast.success(
      `✅ Contenido guardado como ${type === 'draft' ? 'Borrador' : 'Versión'}`
    );
  };

  const handleCloseGeneration = () => {
    setShowGenerationStep(false);
    setGeneratedContent(null);
  };

  const handleGenerate = async () => {
    if (!selectedClient) {
      setError('Selecciona un cliente para continuar');
      return;
    }

    // Check new selectedFormats system first (PASO 5)
    const selectedFormatsCount = formData.selectedFormats
      ? Object.values(formData.selectedFormats).filter((f) => f.selected).length
      : 0;

    // Fallback to old enabledFormats for backward compatibility
    const enabledFormatsCount = selectedFormatsCount > 0
      ? selectedFormatsCount
      : Object.values(formData.enabledFormats).filter(Boolean).length;

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

      // Save content results for each selected format
      const selectedFormats = Object.entries(formData.selectedFormats || {})
        .filter(([, format]) => format.selected)
        .map(([key]) => key as any);

      selectedFormats.forEach(format => {
        addContentResult({
          id: `result_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          clientId: selectedClient.id,
          clientName: selectedClient.name,
          postTitle: formData.name,
          outputFormat: format,
          keywordsUsed: [...formData.keywordsNiche, ...formData.keywordsLongtail],
          generatedDate: new Date().toISOString(),
          targetAudience: formData.targetAudience,
          contentIntent: formData.selectedContentIntent || 'No especificado',
          status: 'draft',
        });
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
        targetAudience: '',
        selectedContentIntent: null,
        selectedMainTone: null,
        selectedTone: null,
        h1Title: '',
        h2Title: '',
        urlSlug: '',
        internalLink1: '',
        internalLink2: '',
        semanticElements: new Set(),
        selectedFormats: {},
        subSelectorValues: {},
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

          {/* Plan Generator Inteligente */}
          <PlanGeneratorInteligente
            selectedClient={selectedClient}
            insightOrigin={formData.insightOrigin}
            localGeoEnabled={formData.localGeoEnabled}
            localGeoValue={formData.localGeoValue}
            onInsightOriginChange={(origin) => setFormData({ ...formData, insightOrigin: origin })}
            onLocalGeoToggle={(enabled) => setFormData({ ...formData, localGeoEnabled: enabled })}
            onLocalGeoValueChange={(value) => setFormData({ ...formData, localGeoValue: value })}
            onAddCustomKeyword={addCustomKeywordToClient}
            onFormDataChange={(data) => {
              setFormData({ ...formData, ...data });
              // Auto-select first keyword if available
              if (data.keywordsNiche && data.keywordsNiche.length > 0) {
                setSelectedKeyword(data.keywordsNiche[0]);
              }
            }}
          />

          {/* Blog Length Selector (Conditional) */}
          {formData.enabledFormats.blog && (
            <BlogLengthSelector
              value={formData.blogLength}
              onChange={(length) => setFormData({ ...formData, blogLength: length })}
            />
          )}

          {/* PASO 7: AI Content Generation */}
          {showGenerationStep && (
            <ContentGenerationStep
              isGenerating={isAIGenerating}
              step={aiStep}
              qualityScore={qualityScore}
              content={generatedContent}
              error={aiError}
              onRegenerate={handleRegenerateContent}
              onSave={handleSaveGeneratedContent}
              onClose={handleCloseGeneration}
            />
          )}
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

      {/* Final Buttons - Preview, Generate & AI Generation */}
      <div className="px-6 pb-6 space-y-3">
        <button
          onClick={() => setShowPreviewModal(true)}
          className="w-full px-4 py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2 border-2"
          style={{ backgroundColor: '#7BF1A8', color: '#000', borderColor: '#7BF1A8' }}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#000' }}>6</span>
          👁️ Ver Preview & Generar
        </button>

        <button
          onClick={handleStartAIGeneration}
          disabled={!selectedClient || !selectedKeyword || isAIGenerating}
          className="w-full px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isAIGenerating ? '#94a3b8' : '#3b82f6',
            color: '#fff',
            borderColor: isAIGenerating ? '#94a3b8' : '#3b82f6',
          }}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-xs" style={{ backgroundColor: '#1e3a8a' }}>7</span>
          {isAIGenerating ? '⏳ Generando con IA...' : '✨ Generar con Claude AI'}
        </button>
      </div>
    </div>
  );
}
