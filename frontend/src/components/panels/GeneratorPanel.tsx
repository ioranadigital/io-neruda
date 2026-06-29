'use client';

import React, { useState, useCallback } from 'react';
import { Client } from '../../types/client';
import { useRouter } from 'next/navigation';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import { useClaudeGeneration } from '@/src/hooks/useClaudeGeneration';
import { usePlannerInjection } from '@/src/hooks/usePlannerInjection';
import { useTemplateInjection } from '@/src/hooks/useTemplateInjection';
import { GenerationResponse, GenerationStep } from '@/src/types/aiGeneration';
import PlanGeneratorInteligente, { InsightOrigin } from './PlanGeneratorInteligente';
import type { ContentIntent } from '../selectors/ContentDefinition';
import BlogLengthSelector, { BlogLength } from '../selectors/BlogLengthSelector';
import LanguageSelector, { Language } from '../selectors/LanguageSelector';
import PreviewPanel from './PreviewPanel';
import ClientBriefingHeader from './ClientBriefingHeader';
import ContentGenerationStep from './ContentGenerationStep';
import PreviewGenerationData from './PreviewGenerationData';
import OperationsCenter from './OperationsCenter';
import { showToast } from '../shared/Toast';
import { renderPrompt, getPromptTemplate } from '@/src/services/promptRenderer';
import { buildPromptData, validatePromptData } from '@/src/utils/promptDataBuilder';
import { X, Check, AlertCircle, Sparkles } from 'lucide-react';
// Wizard components
import WizardClientHeader from '../wizards/WizardClientHeader';
import ProgressBar from '../wizards/ProgressBar';
import NavigationFooter from '../wizards/NavigationFooter';
import PasoPersonalidad, { isPasoPersonalidadValid } from '../wizards/PasoPersonalidad';
import PasoPalabrasClaves from '../wizards/PasoPalabrasClaves';
import PasoPropuestas from '../wizards/PasoPropuestas';
import PasoSEOGEO from '../wizards/PasoSEOGEO';
import PasoFormatos from '../wizards/PasoFormatos';
import PasoIncubacion from '../wizards/PasoIncubacion';
import PasoClienteWelcome from '../wizards/PasoClienteWelcome';
import ClientBriefingPanel from './ClientBriefingPanel';

const STEP_LABELS = [
  'Cliente',              // PASO 0
  'Formatos',             // PASO 1
  'Personalidad',         // PASO 2
  'Propuestas',           // PASO 3
  'Keywords',             // PASO 4
  'Incubación',           // PASO 5
  'SEO/GEO',              // PASO 6
  'Previsualizar',        // PASO 7
  'Resultado',            // PASO 8 (Final)
];

export default function GeneratorPanel() {
  const router = useRouter();
  const { clients, selectedClient, setError, error, selectClient: contextSelectClient, addContentResult, addCustomKeywordToClient } = useGenerator();
  const { createConfig } = useCreateConfiguration();
  const { generateContent, isGenerating } = useGenerateContent();
  const { generateContent: generateAIContent, isGenerating: isAIGenerating, step: aiStep, qualityScore, error: aiError } = useClaudeGeneration();
  const { injectionData, isFromPlanner, applyInjection } = usePlannerInjection();
  const { injectionData: templateData, isFromTemplate, applyInjection: applyTemplateInjection } = useTemplateInjection();

  // Wrapper to ensure latest client version is selected
  const selectClient = useCallback((clientToSelect: Client | null) => {
    if (!clientToSelect) {
      contextSelectClient(null);
      return;
    }
    const latestClient = clients.find(c => c.id === clientToSelect.id) || clientToSelect;
    contextSelectClient(latestClient);
  }, [clients, contextSelectClient]);

  // Wizard state (0-8: 9 pasos totales)
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(0);
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [showGenerationStep, setShowGenerationStep] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GenerationResponse | null>(null);
  const [variacionIndex, setVariacionIndex] = useState(0);
  const [contentVersions, setContentVersions] = useState<Array<{ id: string; content: string; timestamp: number }>>([]);

  const [formData, setFormData] = useState<{
    name: string;
    selectedProposal: string | null;
    keywordsNiche: string[];
    keywordsLongtail: string[];
    tone: Configuration['tone'];
    enabledFormats: EnabledFormats;
    insightOrigin: InsightOrigin;
    contentIntent: ContentIntent;
    localGeoEnabled: boolean;
    localGeoValue: string;
    blogLength: BlogLength;
    language: Language;
    // PASO 2: Strategy
    targetAudience: string;
    selectedContentIntent: string | null;
    selectedSubIntencion: string | null;
    selectedMainTone: string | null;
    selectedTone: string | null;
    selectedSubtone: string | null;
    selectedNarrativeAngle: string | null;
    // PASO 4: Semantic Definition
    h1Title: string;
    h2Title: string;
    urlSlug: string;
    internalLink1: string;
    internalLink2: string;
    semanticElements: Set<string>;
    // PASO 3: Propuestas (Subcategorías)
    subcategoriaPropuesta: string | null;
    // PASO 5: Incubación
    propuestaElegida: string | null;
    // PASO 6: SEO/GEO (inyectados desde incubación)
    seoH1: string;
    seoH2: string;
    seoSlug: string;
    metaTitle: string;
    metaDescription: string;
    isLocalSEO: boolean;
    geoRegion: string;
    geoCiudad: string;
    seoFieldsVerified: string; // JSON string de objeto con estados de verificación
    // PASO 4: Keywords (Estructura mejorada)
    keywordsSeleccionadas: string[];
    // PASO 7: Format Output
    selectedFormats: { [key: string]: { selected: boolean; subType?: string } };
    subSelectorValues: { [key: string]: string };
  }>({
    name: '',
    selectedProposal: null,
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
    language: 'es',
    // PASO 2
    targetAudience: '',
    selectedContentIntent: null,
    selectedSubIntencion: null,
    selectedMainTone: null,
    selectedTone: null,
    selectedSubtone: null,
    selectedNarrativeAngle: null,
    // PASO 4
    h1Title: '',
    h2Title: '',
    urlSlug: '',
    internalLink1: '',
    internalLink2: '',
    semanticElements: new Set(),
    // PASO 5: Incubación
    propuestaElegida: null,
    subcategoriaPropuesta: null,
    // PASO 6: SEO/GEO
    seoH1: '',
    seoH2: '',
    seoSlug: '',
    metaTitle: '',
    metaDescription: '',
    isLocalSEO: false,
    geoRegion: '',
    geoCiudad: '',
    seoFieldsVerified: JSON.stringify({
      metaTitle: false,
      metaDescription: false,
      h1: false,
      h2: false,
      slug: false,
      links: false,
      localSeo: false,
    }),
    // PASO 4: Keywords
    keywordsSeleccionadas: [],
    // PASO 7: Format Output
    selectedFormats: {},
    subSelectorValues: {},
  });


  // ===== HELPERS PARA KEYWORDS (PASO 4) - DESPUÉS DE FORMDATA =====

  // 1. FILTRO POR FORMATO DE SALIDA
  const getFormatType = () => {
    const selectedFormats = formData.selectedFormats || {};
    const selectedKeys = Object.keys(selectedFormats).filter((k: any) => selectedFormats[k]?.selected);

    const hasWebSeo = selectedKeys.some(k => k === 'blog' || k === 'landing');
    const hasSocial = selectedKeys.some(k => k.startsWith('social_'));
    const hasMessaging = selectedKeys.some(k => k === 'email' || k === 'whatsapp');

    if (hasWebSeo) return 'web_seo';
    if (hasSocial && !hasWebSeo && !hasMessaging) return 'social_only';
    if (hasMessaging && !hasWebSeo && !hasSocial) return 'messaging_only';
    return null;
  };

  const formatType = getFormatType();
  const isKeywordsRequired = formatType === 'web_seo';
  const isKeywordsOptional = formatType === 'social_only';
  const isKeywordsBypassed = formatType === 'messaging_only';

  // 2. OBTENER INTENCIÓN SELECCIONADA
  const selectedIntention = formData.selectedContentIntent;

  // 3. RESTRICCIONES POR INTENCIÓN
  const getDisabledKeywordsByIntention = (): string[] => {
    const disabled: string[] = [];

    if (selectedIntention === 'educational') {
      disabled.push('third_party_brand', 'long_tail_transactional');
    }
    if (selectedIntention === 'transactional') {
      disabled.push('problem_symptom');
    }

    return disabled;
  };

  // 4. RESTRICCIONES MUTUAS
  const getDisabledKeywordsByMutualConflicts = (): string[] => {
    const selected = formData.keywordsSeleccionadas || [];
    const disabled: string[] = [];
    const maxKeywords = 4;

    if (selected.length >= maxKeywords) {
      return ['*all_unselected*'];
    }

    const level1Keywords = ['brand_keyword', 'third_party_brand', 'niche_sector'];
    const selectedLevel1 = selected.filter(k => level1Keywords.includes(k));
    if (selectedLevel1.length >= 1) {
      disabled.push(...level1Keywords.filter(k => !selected.includes(k)));
    }

    if (selected.includes('brand_keyword')) {
      disabled.push('third_party_brand');
    }
    if (selected.includes('third_party_brand')) {
      disabled.push('brand_keyword');
    }
    if (selected.some(k => k.startsWith('long_tail'))) {
      disabled.push('niche_sector');
    }
    if (selected.includes('niche_sector')) {
      disabled.push(...['long_tail_informational', 'long_tail_commercial', 'long_tail_transactional']);
    }
    if (selected.includes('problem_symptom')) {
      disabled.push('comparison_keywords', 'list_keywords', 'review_keywords');
    }

    return disabled;
  };

  // 5. COMBINAR TODAS LAS RESTRICCIONES
  const getAllDisabledKeywords = (): string[] => {
    const intentionDisabled = getDisabledKeywordsByIntention();
    const mutualDisabled = getDisabledKeywordsByMutualConflicts();
    return [...new Set([...intentionDisabled, ...mutualDisabled])];
  };

  // ===== VALIDACIONES ESTRICTAS DEL ÁRBOL DE KEYWORDS =====

  // Función para determinar si un keyword está deshabilitado
  const isKeywordItemDisabled = (itemId: string, levelId: string): boolean => {
    const selected = formData.keywordsSeleccionadas || [];
    const maxKeywords = 4;

    // REGLA 1: LÍMITE GLOBAL - Si hay 4 seleccionadas, deshabilita los no seleccionados
    if (selected.length >= maxKeywords && !selected.includes(itemId)) {
      return true;
    }

    // REGLA 2: RESTRICCIÓN DE CORE (NIVEL 1)
    if (levelId === 'level-1-entity') {
      const level1Items = ['entity-core', 'branded-kw', 'third-party-brand', 'niche-head'];
      const selectedLevel1 = selected.filter(id => level1Items.includes(id));

      // Si hay una seleccionada del Nivel 1 y esta no es, deshabilita
      if (selectedLevel1.length > 0 && !selected.includes(itemId) && level1Items.includes(itemId)) {
        return true;
      }
    }

    // REGLA 3A: INCOMPATIBILIDAD MARCA vs MARCA DE TERCEROS
    if (itemId === 'branded-kw' && selected.includes('third-party-brand')) {
      return true;
    }
    if (itemId === 'third-party-brand' && selected.includes('branded-kw')) {
      return true;
    }

    // REGLA 3B: LONG-TAIL BLOQUEA NICHE/HEAD TERMS
    const hasLongTail = selected.some(id => id.startsWith('long-tail'));
    if (itemId === 'niche-head' && hasLongTail) {
      return true;
    }

    // REGLA 3C: PROBLEMA/SÍNTOMA BLOQUEA NIVEL 4 (Comparativas, Listas, Reviews)
    if (selected.includes('problem-symptom') &&
        ['comparison', 'lists', 'reviews'].includes(itemId)) {
      return true;
    }

    // Restricciones por intención
    if (getDisabledKeywordsByIntention().includes(itemId)) {
      return true;
    }

    return false;
  };

  // Función para obtener mensaje de razón de deshabilitación
  const getDisabledReasonForItem = (itemId: string, levelId: string): string => {
    const selected = formData.keywordsSeleccionadas || [];
    const maxKeywords = 4;

    if (selected.length >= maxKeywords && !selected.includes(itemId)) {
      return `Límite máximo alcanzado (${maxKeywords}/${maxKeywords})`;
    }

    if (levelId === 'level-1-entity') {
      const level1Items = ['entity-core', 'branded-kw', 'third-party-brand', 'niche-head'];
      const selectedLevel1 = selected.filter(id => level1Items.includes(id));
      if (selectedLevel1.length > 0 && !selected.includes(itemId) && level1Items.includes(itemId)) {
        return 'Solo se permite una keyword del Nivel 1 (Core)';
      }
    }

    if (itemId === 'branded-kw' && selected.includes('third-party-brand')) {
      return 'Incompatible con Keywords de Marca de Terceros';
    }
    if (itemId === 'third-party-brand' && selected.includes('branded-kw')) {
      return 'Incompatible con Keywords de Marca Propia';
    }

    const hasLongTail = selected.some(id => id.startsWith('long-tail'));
    if (itemId === 'niche-head' && hasLongTail) {
      return 'Incompatible con Long-Tail Keywords seleccionadas';
    }

    if (selected.includes('problem-symptom') &&
        ['comparison', 'lists', 'reviews'].includes(itemId)) {
      return 'Bloqueado: Keywords de Problema ya seleccionada';
    }

    return '';
  };

  // Auto-advance to PASO 1 when client is selected
  React.useEffect(() => {
    if (selectedClient && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [selectedClient]);

  // Handle planner injection: Apply injected data and jump to target step (default 6)
  React.useEffect(() => {
    if (isFromPlanner && injectionData && selectedClient) {
      const injectedFormData = applyInjection(formData);
      setFormData(injectedFormData);
      // Set primary keyword for preview step
      if (injectionData.keywordsSeleccionadas?.length > 0) {
        setSelectedKeyword(injectionData.keywordsSeleccionadas[0]);
      }
      const target = (injectionData.targetStep ?? 6) as 0|1|2|3|4|5|6|7|8;
      setCurrentStep(target);
      const stepLabel = target === 7 ? 'PASO 7: Previsualizar' : 'PASO 6: SEO/GEO';
      showToast.success(`✨ Plan CSV inyectado. Directo a ${stepLabel}`);
    }
  }, [isFromPlanner, selectedClient]);

  // Handle template injection: Apply injected template data
  React.useEffect(() => {
    if (isFromTemplate && templateData && selectedClient) {
      // Apply injected template data to formData
      const injectedFormData = applyTemplateInjection(formData);
      setFormData(injectedFormData);

      // Stay in PASO 0 so user can confirm client selection
      setCurrentStep(0);

      // Show success notification
      showToast.success('🏭 Plantilla inyectada. Selecciona un cliente para continuar');
    }
  }, [isFromTemplate, selectedClient]);

  // Validación por paso
  const getStepValidation = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!selectedClient; // PASO 0: Cliente seleccionado
      case 1:
        return Object.values(formData.selectedFormats || {}).some((f: any) => f.selected); // PASO 1: Formatos
      case 2:
        // PASO 2: Personalidad - Todos los campos obligatorios
        return isPasoPersonalidadValid({
          targetAudience: formData.targetAudience,
          selectedContentIntent: formData.selectedContentIntent,
          selectedSubIntencion: formData.selectedSubIntencion,
          selectedMainTone: formData.selectedMainTone,
          selectedSubtone: formData.selectedSubtone,
          selectedNarrativeAngle: formData.selectedNarrativeAngle,
        });
      case 3:
        // PASO 3: Propuestas - requiere propuesta Y subcategoría
        return !!formData.selectedProposal && !!formData.subcategoriaPropuesta;
      case 4:
        return selectedKeyword.length > 0; // PASO 4: Keywords
      case 5:
        return !!formData.propuestaElegida; // PASO 5: Incubación - requiere seleccionar propuesta
      case 6: {
        // PASO 6: Valida que TODOS los campos SEO estén verificados
        const isLocalSEOValid = !formData.isLocalSEO || (formData.geoRegion && formData.geoCiudad);
        const baseValid = !!formData.seoH1 && !!formData.metaDescription && isLocalSEOValid;

        if (!baseValid) return false;

        try {
          const verified = JSON.parse(formData.seoFieldsVerified);
          const allFieldsVerified = Object.values(verified).every((v: any) => v === true);
          return allFieldsVerified;
        } catch {
          return false;
        }
      }
      case 7:
        return true; // PASO 7: Previsualizar siempre disponible
      case 8:
        return !!generatedContent; // PASO 8: Resultado final
      default:
        return false;
    }
  };

  const canProceedToNext = getStepValidation(currentStep);

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
      showToast.success('Contenido generado exitosamente');
      // Navegar al Resultado después de generar
      setCurrentStep(8);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error generating content';
      setError(message);
      showToast.error(`${message}`);
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
      showToast.success('Contenido regenerado');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error regenerating';
      setError(message);
      showToast.error(`${message}`);
    }
  };

  const handleRegenerateWithModifier = async (modifier: string): Promise<GenerationResponse> => {
    if (!selectedClient || !selectedKeyword) {
      throw new Error('Datos del cliente o keyword faltantes');
    }

    try {
      const promptData = buildPromptData(formData, selectedClient, selectedKeyword);
      const template = getPromptTemplate();
      const renderedPrompt = renderPrompt(template, promptData);

      // Map common regeneration modifiers to detailed instructions
      const modifierInstructions: Record<string, string> = {
        complete_rewrite: 'Reescribe completamente el contenido con un enfoque completamente diferente. Mantén el tema pero cambia la estructura, ejemplos y perspectiva.',
        deeper_technical: 'Amplía significativamente el contenido con análisis técnico profundo, datos especializados y explicaciones avanzadas.',
        seasonal_focus: 'Adapta el contenido para la temporada actual, añadiendo referencias estacionales relevantes y ajustes contextuales.',
        keyword_density: 'Aumenta la densidad de palabras clave principales en todo el contenido mientras mantienes la fluidez y legibilidad natural.',
      };

      const instruction = modifierInstructions[modifier] || modifier;
      const enhancedPrompt = `${renderedPrompt}\n\nINSTRUCCIÓN DE REGENERACIÓN: ${instruction}`;

      const result = await generateAIContent(enhancedPrompt);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error regenerating content';
      throw new Error(message);
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
      `Contenido guardado como ${type === 'draft' ? 'Borrador' : 'Versión'}`
    );

    // Redirigir a /contenidos/ después de guardar
    setTimeout(() => {
      router.push('/contenidos');
    }, 1500);
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

      selectedFormats.forEach((format, index) => {
        addContentResult({
          id: generatedContent?.metadata.id || `result_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 15)}`,
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

      showToast.success('Ecosistema de contenido generado exitosamente');

      setFormData({
        name: '',
        selectedProposal: null,
        subcategoriaPropuesta: null,
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
        language: 'es',
        targetAudience: '',
        selectedContentIntent: null,
        selectedSubIntencion: null,
        selectedMainTone: null,
        selectedTone: null,
        selectedSubtone: null,
        selectedNarrativeAngle: null,
        h1Title: '',
        h2Title: '',
        urlSlug: '',
        internalLink1: '',
        internalLink2: '',
        semanticElements: new Set(),
        propuestaElegida: null,
        seoH1: '',
        seoH2: '',
        seoSlug: '',
        metaTitle: '',
        metaDescription: '',
        isLocalSEO: false,
        geoRegion: '',
        geoCiudad: '',
        seoFieldsVerified: JSON.stringify({
          metaTitle: false,
          metaDescription: false,
          h1: false,
          h2: false,
          slug: false,
          links: false,
          localSeo: false,
        }),
        keywordsSeleccionadas: [],
        selectedFormats: {},
        subSelectorValues: {},
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error generating content';
      setError(message);
      showToast.error(`${message}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#f4fbf7' }}>
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Generador</h1>
              <p className="text-sm text-slate-600 mt-1">Crea contenido optimizado para tus clientes paso a paso</p>
            </div>
          </div>
          {(currentStep > 0 || selectedClient) && (
            <div className="flex-shrink-0">
              <WizardClientHeader
                selectedClient={selectedClient}
                clients={clients}
                onSelectClient={selectClient}
              />
            </div>
          )}
        </div>
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className="w-full shrink-0 px-4 pt-4 pb-2" style={{ backgroundColor: '#f4fbf7' }}>
        <div className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 shadow-sm">
          <ProgressBar currentStep={currentStep} totalSteps={9} stepLabels={STEP_LABELS} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pt-2 pb-0">
          <div
            className="p-4 rounded-lg w-full"
            style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b', border: '1px solid' }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Main Content - Pasos Dinámicos (con margen superior para sticky header) */}
      <div className="flex-1 overflow-y-auto w-full pt-2">
        {/* PASO 0: Cliente Welcome - Full Height */}
        {currentStep === 0 && !selectedClient && (
          <PasoClienteWelcome clients={clients} onSelectClient={selectClient} />
        )}

        {/* Resto de pasos */}
        {currentStep !== 0 && (
          <div className="w-full px-4 py-4">
            {/* PASO 1: Formatos */}
            {currentStep === 1 && (
            <PasoFormatos
              selectedClient={selectedClient}
              formData={{
                selectedFormats: formData.selectedFormats,
                language: formData.language,
              }}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          )}

          {/* PASO 2: Personalidad */}
          {currentStep === 2 && (
            <PasoPersonalidad
              selectedClient={selectedClient}
              formData={{
                targetAudience: formData.targetAudience,
                selectedContentIntent: formData.selectedContentIntent,
                selectedSubIntencion: formData.selectedSubIntencion,
                selectedMainTone: formData.selectedMainTone,
                selectedTone: formData.selectedTone,
                selectedSubtone: formData.selectedSubtone,
                selectedNarrativeAngle: formData.selectedNarrativeAngle,
              }}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          )}

          {/* PASO 3: Propuestas */}
          {currentStep === 3 && (
            <PasoPropuestas
              selectedClient={selectedClient}
              formData={{ name: formData.name, selectedProposal: formData.selectedProposal, subcategoriaPropuesta: formData.subcategoriaPropuesta }}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          )}

          {/* PASO 4: Keywords */}
          {currentStep === 4 && (
            <PasoPalabrasClaves
              selectedClient={selectedClient}
              selectedKeywords={formData.keywordsSeleccionadas}
              onKeywordChange={(keywords) => {
                setFormData({ ...formData, keywordsSeleccionadas: keywords });
                if (keywords.length > 0 && !selectedKeyword) {
                  setSelectedKeyword(keywords[0]);
                }
              }}
              // Configuración inteligente según formatos
              formatType={formatType}
              isKeywordsRequired={isKeywordsRequired}
              isKeywordsOptional={isKeywordsOptional}
              isKeywordsBypassed={isKeywordsBypassed}
              // Restricciones por intención
              selectedIntention={selectedIntention}
              disabledByIntention={getDisabledKeywordsByIntention()}
              // Restricciones mutuas
              allDisabledKeywords={getAllDisabledKeywords()}
              maxKeywordsAllowed={4}
            />
          )}

          {/* PASO 5: Incubación */}
          {currentStep === 5 && (
            <PasoIncubacion
              selectedClient={selectedClient}
              formData={{
                propuestaElegida: formData.propuestaElegida,
                seoH1: formData.seoH1,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
              }}
              onChange={(data) => setFormData({ ...formData, ...data })}
              variacionIndex={variacionIndex}
              onVariacionChange={setVariacionIndex}
            />
          )}

          {/* PASO 6: SEO/GEO */}
          {currentStep === 6 && (
            <PasoSEOGEO
              selectedClient={selectedClient}
              propuestaElegida={formData.propuestaElegida}
              formData={{
                seoH1: formData.seoH1,
                seoH2: formData.seoH2,
                seoSlug: formData.seoSlug,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                internalLink1: formData.internalLink1,
                internalLink2: formData.internalLink2,
                isLocalSEO: formData.isLocalSEO,
                geoRegion: formData.geoRegion,
                geoCiudad: formData.geoCiudad,
              }}
              onChange={(data) => setFormData({ ...formData, ...data })}
            />
          )}

          {/* PASO 7: Previsualizar Prompt */}
          {currentStep === 7 && (
            <div className="w-full h-full flex flex-col">
              <PreviewGenerationData
                selectedClient={selectedClient}
                selectedKeyword={selectedKeyword}
                formData={formData}
                isGenerating={isAIGenerating}
                step={aiStep}
                onConfirm={async () => {
                  setShowGenerationStep(true);
                  await handleStartAIGeneration();
                }}
                onCancel={() => setCurrentStep(6)}
              />
            </div>
          )}


          {/* PASO 8: Centro de Operaciones */}
          {currentStep === 8 && generatedContent && (
            <div className="w-full h-full flex flex-col">
              <OperationsCenter
                generatedContent={generatedContent}
                selectedClient={selectedClient?.name || null}
                selectedClientId={selectedClient?.id || null}
                selectedKeyword={selectedKeyword}
                selectedFormats={formData.selectedFormats}
                targetAudience={formData.targetAudience}
                selectedContentIntent={formData.selectedContentIntent ?? undefined}
                keywordsNiche={formData.keywordsNiche}
                onSaveVersion={(content) => {
                  // Agregar a contentVersions si lo necesitas
                  const newVersion = {
                    id: `version-${Date.now()}`,
                    content,
                    timestamp: Date.now(),
                  };
                  setContentVersions([...contentVersions, newVersion]);
                }}
                onContentUpdate={(newContent) => {
                  setGeneratedContent(newContent);
                }}
                onRegenerateWithModifier={handleRegenerateWithModifier}
                onCreateNewArticle={() => {
                  // Volver al PASO 0 para crear otro artículo
                  setCurrentStep(0);
                  setGeneratedContent(null);
                }}
                onFinalize={() => {
                  // Reset the wizard
                  setCurrentStep(0);
                  setFormData({
                    name: '',
                    selectedProposal: null,
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
                    language: 'es',
                    targetAudience: '',
                    selectedContentIntent: null,
                    selectedSubIntencion: null,
                    selectedMainTone: null,
                    selectedTone: null,
                    selectedSubtone: null,
                    selectedNarrativeAngle: null,
                    h1Title: '',
                    h2Title: '',
                    urlSlug: '',
                    internalLink1: '',
                    internalLink2: '',
                    semanticElements: new Set(),
                    subcategoriaPropuesta: null,
                    propuestaElegida: null,
                    seoH1: '',
                    seoH2: '',
                    seoSlug: '',
                    metaTitle: '',
                    metaDescription: '',
                    isLocalSEO: false,
                    geoRegion: '',
                    geoCiudad: '',
                    seoFieldsVerified: JSON.stringify({
                      metaTitle: false,
                      metaDescription: false,
                      h1: false,
                      h2: false,
                      slug: false,
                      links: false,
                      localSeo: false,
                    }),
                    keywordsSeleccionadas: [],
                    selectedFormats: {},
                    subSelectorValues: {},
                  });
                  setGeneratedContent(null);
                  setShowGenerationStep(false);
                  showToast.success('Proceso completado. Puedes crear un nuevo contenido.');
                }}
              />
            </div>
          )}
          </div>
        )}
      </div>

      {/* Navigation Footer - No show in PASO 7, 8, 9 */}
      {currentStep !== 7 && currentStep !== 8 && (
        <NavigationFooter
          currentStep={currentStep}
          totalSteps={9}
          onPrevious={() => setCurrentStep((Math.max(0, currentStep - 1)) as any)}
          onNext={() => setCurrentStep((Math.min(7, currentStep + 1)) as any)}
          isNextDisabled={!canProceedToNext}
          isPreviousDisabled={currentStep === 0}
          nextLabel="Siguiente"
          previousLabel="Anterior"
        />
      )}

      {/* Paso 7: Solo Anterior - Sin Siguiente */}
      {currentStep === 7 && (
        <div className="w-full px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={() => setCurrentStep(6)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            ← Anterior
          </button>
          <div className="flex-1 flex items-center justify-center text-sm text-gray-600">
            Paso 7 de 9
          </div>
        </div>
      )}
    </div>
  );
}
