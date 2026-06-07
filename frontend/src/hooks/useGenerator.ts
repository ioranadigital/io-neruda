import { useState, useCallback } from 'react';
import { useGenerator as useGeneratorContext } from '../context/GeneratorContext';
import { GenerateRequest, GeneratedContent } from '../types/generator';
import { generateMockContent } from '../data/mockGeneratedContent';

export function useGenerateContent() {
  const { setLoading, setError, addGeneratedContent } = useGeneratorContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = useCallback(
    async (request: GenerateRequest) => {
      setIsGenerating(true);
      setLoading(true);
      setError(null);

      try {
        // Simulate generation delay (2-4 seconds)
        const delay = Math.random() * 2000 + 2000;
        await new Promise(resolve => setTimeout(resolve, delay));

        const generatedContents: Record<string, GeneratedContent> = {};

        // Generate content for each enabled format
        const enabledFormats = request.enabledFormats
          ? Object.entries(request.enabledFormats)
              .filter(([, enabled]) => enabled)
              .map(([format]) => format)
          : ['blog'];

        enabledFormats.forEach(format => {
          const mockContent = generateMockContent(
            request.clientId || 'Unknown Client',
            request.configName || 'New Configuration',
            request.keywordsNiche || ['content'],
            format
          );
          generatedContents[format] = mockContent;
          addGeneratedContent(mockContent);
        });

        return { success: true, generatedContents };
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
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock: return empty array for now
        setContent([]);
        return [];
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

  return { getGeneratedContent, content };
}
