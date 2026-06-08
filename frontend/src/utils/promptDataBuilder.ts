import { PromptRenderData } from '@/src/types/aiGeneration';
import { Client } from '@/src/types/client';

export interface GeneratorFormData {
  name?: string;
  keywordsNiche?: string[];
  keywordsLongtail?: string[];
  tone?: string;
  enabledFormats?: any;
  insightOrigin?: string;
  contentIntent?: string;
  localGeoEnabled?: boolean;
  localGeoValue?: string;
  blogLength?: string;
  targetAudience?: string;
  selectedContentIntent?: string | null;
  selectedMainTone?: string | null;
  selectedTone?: string | null;
  h1Title?: string;
  h2Title?: string;
  urlSlug?: string;
  internalLink1?: string;
  internalLink2?: string;
  semanticElements?: Set<string>;
  selectedFormats?: any;
  subSelectorValues?: any;
  painPoint?: string;
  readerGoal?: string;
  knowledgeLevel?: string;
  psychographics?: string;
  contentFormat?: string;
  secondaryKeywords?: string[];
  estimatedLength?: number;
  seasonalContext?: string;
  toneDescription?: string;
  phrasePatterns?: string[];
  vocabularyUse?: string[];
  vocabularyAvoid?: string[];
  forbiddenKeywords?: string[];
  referenceContent?: string;
  h2_1?: string;
  h2_2?: string;
  h2_3?: string;
  cta?: string;
  clichesToAvoid?: string[];
}

export function buildPromptData(
  formData: GeneratorFormData,
  selectedClient: Client | null,
  selectedKeyword: string | null
): PromptRenderData {
  if (!selectedClient) {
    throw new Error('Client is required');
  }

  const selectedPersona = selectedClient.buyer_personas_list?.[0] || {
    name: 'Default Persona',
    description: 'A typical user of our service',
  };

  // Get tone from formData
  const tone = formData.selectedTone || formData.selectedMainTone || formData.tone || 'professional';

  return {
    // Client context
    clientName: selectedClient.name,
    clientUsp: selectedClient.unique_proposition || 'We provide value to our customers',
    brandVoice: tone,
    brandValues: selectedClient.brand_values || ['quality', 'innovation'],
    industry: selectedClient.business_type || 'Technology',
    marketPositioning: selectedClient.market_positioning || 'Market leader in our space',
    competitorDifferentiation: selectedClient.differentiators?.[0] || 'We stand out through quality and service',

    // Audience context
    buyerPersona: selectedPersona.name,
    painPoint: formData.painPoint || selectedPersona.description,
    readerGoal: formData.readerGoal || 'Achieve their business objectives',
    knowledgeLevel: (formData.knowledgeLevel as 'beginner' | 'intermediate' | 'expert') || 'intermediate',
    psychographics: formData.psychographics || 'Values efficiency and results',

    // Content context
    contentIntent: (formData.selectedContentIntent as 'educational' | 'transactional' | 'social_proof' | 'thought_leadership') || 'educational',
    contentFormat: (formData.contentFormat as 'blog' | 'email' | 'social_linkedin' | 'social_instagram' | 'whatsapp' | 'pdf') || 'blog',
    primaryKeyword: selectedKeyword || 'business solution',
    secondaryKeywords: formData.secondaryKeywords || [],
    estimatedLength: formData.estimatedLength || 1500,
    seasonalContext: formData.seasonalContext || 'No seasonal context',

    // Style guide
    toneDescription: formData.toneDescription || `Write in a ${tone} tone that resonates with the target audience`,
    phrasePatterns: formData.phrasePatterns || [
      'Use clear, direct language',
      'Focus on benefits over features',
      'Include social proof',
    ],
    vocabularyUse: formData.vocabularyUse || [
      'Industry-standard terms',
      'Action verbs',
      'Power words',
    ],
    vocabularyAvoid: formData.vocabularyAvoid || [
      'Jargon',
      'Passive voice',
      'Clichés',
    ],
    forbiddenKeywords: selectedClient.forbidden_keywords || [],
    referenceContent: formData.referenceContent || 'Similar successful content in the industry',

    // Output structure
    section1Title: formData.h2_1 || formData.h2Title || 'Introduction and Context',
    section2Title: formData.h2_2 || 'Main Points and Analysis',
    section3Title: formData.h2_3 || 'Recommendations and Action',
    specificCta: formData.cta || 'Get started today',

    // Additional
    clichesToAvoid: formData.clichesToAvoid || ['game-changer', 'leverage', 'synergy'],
  };
}

export function validatePromptData(data: PromptRenderData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.clientName?.trim()) errors.push('Client name is required');
  if (!data.buyerPersona?.trim()) errors.push('Buyer persona is required');
  if (!data.painPoint?.trim()) errors.push('Pain point is required');
  if (!data.primaryKeyword?.trim()) errors.push('Primary keyword is required');
  if (!data.contentIntent) errors.push('Content intent is required');
  if (!data.contentFormat) errors.push('Content format is required');

  return {
    valid: errors.length === 0,
    errors,
  };
}
