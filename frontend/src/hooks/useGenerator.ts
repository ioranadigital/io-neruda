import { useState, useCallback } from 'react';
import { useGenerator as useGeneratorContext } from '../context/GeneratorContext';
import { GenerateRequest, GeneratedContent } from '../types/generator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4006/api/generators';

export function useGenerateContent() {
  const { setLoading, setError, addGeneratedContent } = useGeneratorContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = useCallback(
    async (request: GenerateRequest) => {
      setIsGenerating(true);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Generation failed');
        }

        const data = await response.json();

        // Add each generated content to context
        if (data.generatedContents) {
          Object.values(data.generatedContents).forEach((content: any) => {
            addGeneratedContent(content);
          });
        }

        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setIsGenerating(false);
        setLoading(false);
      }
    },
    [setLoading, setError, addGeneratedContent]
  );

  return { generateContent, isGenerating };
}

export function useGetGeneratedContent() {
  const { setLoading, setError } = useGeneratorContext();
  const [content, setContent] = useState<GeneratedContent[]>([]);

  const getGeneratedContent = useCallback(
    async (contentId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/generated/${contentId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch generated content');
        }

        const data = await response.json();
        setContent(data);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return { getGeneratedContent, content, setContent };
}

export function useUpdateGeneratedContent() {
  const { setLoading, setError } = useGeneratorContext();

  const updateContent = useCallback(
    async (contentId: string, updates: Partial<GeneratedContent>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/generated/${contentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error('Failed to update content');
        }

        return await response.json();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return { updateContent };
}
