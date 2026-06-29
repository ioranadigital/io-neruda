import { GenerationResponse, QualityMetrics } from '@/src/types/aiGeneration';

export function parseGeneratedContent(responseText: string): GenerationResponse {
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];
  const parsed = JSON.parse(jsonStr);

  return validateGenerationResponse(parsed);
}

export function validateGenerationResponse(data: unknown): GenerationResponse {
  const response = data as any;

  if (!response.metadata?.title || !response.content?.intro) {
    throw new Error('Invalid response structure: missing required fields');
  }

  return {
    metadata: {
      id: response.metadata.id || generateId(),
      title: response.metadata.title,
      metaDescription: response.metadata.metaDescription || '',
      h1: response.metadata.h1 || response.metadata.title,
      estimatedReadTime: response.metadata.estimatedReadTime || 5,
      keywordDensity: response.metadata.keywordDensity || 0,
    },
    content: {
      intro: {
        hook: response.content.intro.hook || '',
        context: response.content.intro.context || '',
        promise: response.content.intro.promise || '',
      },
      sections: (response.content.sections || []).map((s: any) => ({
        h2: s.h2 || '',
        content: s.content || '',
        keyTakeaway: s.keyTakeaway || '',
      })),
      conclusion: response.content.conclusion || '',
      cta: response.content.cta || '',
    },
    seo: {
      primaryKeywordPlacement: response.seo?.primaryKeywordPlacement || 'intro',
      keywordsUsed: response.seo?.keywordsUsed || [],
      internalLinkSuggestions: response.seo?.internalLinkSuggestions || [],
      readabilityScore: response.seo?.readabilityScore || 0,
    },
    engagement: {
      sentimentTone: response.engagement?.sentimentTone || 'positive',
      personalityIndex: response.engagement?.personalityIndex || 50,
      trustBuilders: response.engagement?.trustBuilders || [],
      emotionalTriggers: response.engagement?.emotionalTriggers || [],
    },
    qualityMetrics: calculateQualityMetrics(response.qualityMetrics),
  };
}

export function calculateQualityMetrics(metrics: any): QualityMetrics {
  const buyerPersonaAlignment = metrics?.componentScores?.buyerPersonaAlignment || 75;
  const contentIntentMatch = metrics?.componentScores?.contentIntentMatch || 75;
  const brandVoiceConsistency = metrics?.componentScores?.brandVoiceConsistency || 75;
  const keywordIntegration = metrics?.componentScores?.keywordIntegration || 75;
  const formatOptimization = metrics?.componentScores?.formatOptimization || 75;

  const overallScore =
    buyerPersonaAlignment * 0.4 +
    contentIntentMatch * 0.25 +
    brandVoiceConsistency * 0.2 +
    keywordIntegration * 0.1 +
    formatOptimization * 0.05;

  return {
    buyerPersonaAlignment,
    contentIntentMatch,
    brandVoiceConsistency,
    keywordIntegration,
    formatOptimization,
    overallScore: Math.round(overallScore),
    passesQualityThreshold: Math.round(overallScore) >= 80,
    recommendations: metrics?.recommendations || [],
    componentScores: {
      buyerPersonaAlignment,
      contentIntentMatch,
      brandVoiceConsistency,
      keywordIntegration,
      formatOptimization,
    },
  };
}

export function generateId(): string {
  // Usar crypto.randomUUID si está disponible, sino usar fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: combinar Date.now, Math.random y secuencia de timestamp
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}${randomPart2}`;
}
