'use client';

import { useState } from 'react';
import { GenerationResponse, GenerationStep, ClaudeApiRequest } from '@/src/types/aiGeneration';
import { parseGeneratedContent } from '@/src/services/responseParser';

interface UseClaudeGenerationReturn {
  generateContent: (prompt: string) => Promise<GenerationResponse>;
  isGenerating: boolean;
  step: GenerationStep;
  qualityScore: number | null;
  error: string | null;
  regenerate: (modifiedPrompt: string) => Promise<GenerationResponse>;
  reset: () => void;
}

export function useClaudeGeneration(): UseClaudeGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<GenerationStep>('idle');
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (prompt: string): Promise<GenerationResponse> => {
    setIsGenerating(true);
    setStep('preparing');
    setError(null);

    try {
      setStep('generating');

      const request: ClaudeApiRequest = {
        prompt,
        model: process.env.NEXT_PUBLIC_CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        maxTokens: 4000,
        systemPrompt: `You are an expert content creator. Generate content that is high-quality,
          engaging, and optimized for both search engines and human readers. Always return valid JSON.`,
      };

      const response = await fetch('/api/generators/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      setStep('validating');

      const data = await response.json();
      const parsed = parseGeneratedContent(data.content);

      setQualityScore(parsed.qualityMetrics.overallScore);
      setStep('complete');

      return parsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      setStep('error');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerate = async (modifiedPrompt: string): Promise<GenerationResponse> => {
    setStep('idle');
    setError(null);
    return generateContent(modifiedPrompt);
  };

  const reset = () => {
    setIsGenerating(false);
    setStep('idle');
    setQualityScore(null);
    setError(null);
  };

  return {
    generateContent,
    isGenerating,
    step,
    qualityScore,
    error,
    regenerate,
    reset,
  };
}
