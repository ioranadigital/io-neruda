export type GenerationStep = 'idle' | 'preparing' | 'generating' | 'validating' | 'complete' | 'error';

export interface PromptRenderData {
  clientName: string;
  clientUsp: string;
  brandVoice: string;
  brandValues: string[];
  industry: string;
  marketPositioning: string;
  competitorDifferentiation: string;

  buyerPersona: string;
  painPoint: string;
  readerGoal: string;
  knowledgeLevel: 'beginner' | 'intermediate' | 'expert';
  psychographics: string;

  contentIntent: 'educational' | 'transactional' | 'social_proof' | 'thought_leadership';
  contentFormat: 'blog' | 'email' | 'social_linkedin' | 'social_instagram' | 'whatsapp' | 'pdf';
  primaryKeyword: string;
  secondaryKeywords: string[];
  estimatedLength: number;
  seasonalContext: string;

  toneDescription: string;
  phrasePatterns: string[];
  vocabularyUse: string[];
  vocabularyAvoid: string[];
  forbiddenKeywords: string[];
  referenceContent: string;

  section1Title: string;
  section2Title: string;
  section3Title: string;
  specificCta: string;

  clichesToAvoid: string[];
}

export interface QualityMetrics {
  buyerPersonaAlignment: number;
  contentIntentMatch: number;
  brandVoiceConsistency: number;
  keywordIntegration: number;
  formatOptimization: number;
  overallScore: number;
  passesQualityThreshold: boolean;
  recommendations: Array<{
    area: 'keyword_density' | 'brand_voice' | 'cta_clarity' | 'structure' | 'engagement';
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  componentScores: {
    buyerPersonaAlignment: number;
    contentIntentMatch: number;
    brandVoiceConsistency: number;
    keywordIntegration: number;
    formatOptimization: number;
  };
}

export interface ContentMetadata {
  id: string;
  title: string;
  metaDescription: string;
  h1: string;
  estimatedReadTime: number;
  keywordDensity: number;
}

export interface ContentSection {
  h2: string;
  content: string;
  keyTakeaway: string;
}

export interface ContentIntro {
  hook: string;
  context: string;
  promise: string;
}

export interface SeoData {
  primaryKeywordPlacement: 'intro' | 'h1' | 'first_paragraph';
  keywordsUsed: string[];
  internalLinkSuggestions: string[];
  readabilityScore: number;
}

export interface EngagementData {
  sentimentTone: 'positive' | 'neutral' | 'urgent' | 'inspirational';
  personalityIndex: number;
  trustBuilders: string[];
  emotionalTriggers: string[];
}

export interface GenerationResponse {
  metadata: ContentMetadata;
  content: {
    intro: ContentIntro;
    sections: ContentSection[];
    conclusion: string;
    cta: string;
  };
  seo: SeoData;
  engagement: EngagementData;
  qualityMetrics: QualityMetrics;
}

export interface ClaudeApiRequest {
  prompt: string;
  model: string;
  maxTokens: number;
  systemPrompt: string;
}
