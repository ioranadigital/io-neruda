import { useState, useCallback } from 'react';

export interface PublishingOptions {
  contentId: string;
  clientId: string;
  platforms: ('linkedin' | 'wordpress')[];
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
}

export interface PublishingResult {
  platform: 'linkedin' | 'wordpress';
  success: boolean;
  url?: string;
  error?: string;
  timestamp: string;
}

export interface PublishingState {
  isLoading: boolean;
  error: string | null;
  results: PublishingResult[];
  progress: number; // 0-100
}

export function usePublishing() {
  const [state, setState] = useState<PublishingState>({
    isLoading: false,
    error: null,
    results: [],
    progress: 0,
  });

  const publishToLinkedIn = useCallback(
    async (options: PublishingOptions) => {
      try {
        const response = await fetch('/api/publishing/linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: options.clientId,
            contentId: options.contentId,
            title: options.title,
            content: options.content,
            excerpt: options.excerpt,
            tags: options.tags,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error publicando en LinkedIn: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          platform: 'linkedin' as const,
          success: true,
          url: data.url,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          platform: 'linkedin' as const,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          timestamp: new Date().toISOString(),
        };
      }
    },
    []
  );

  const publishToWordPress = useCallback(
    async (options: PublishingOptions) => {
      try {
        const response = await fetch('/api/publishing/wordpress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: options.clientId,
            contentId: options.contentId,
            title: options.title,
            content: options.content,
            excerpt: options.excerpt,
            tags: options.tags,
            category: options.category,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error publicando en WordPress: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          platform: 'wordpress' as const,
          success: true,
          url: data.url,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          platform: 'wordpress' as const,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          timestamp: new Date().toISOString(),
        };
      }
    },
    []
  );

  const publish = useCallback(
    async (options: PublishingOptions) => {
      setState({
        isLoading: true,
        error: null,
        results: [],
        progress: 0,
      });

      try {
        const results: PublishingResult[] = [];
        const totalPlatforms = options.platforms.length;

        for (let i = 0; i < options.platforms.length; i++) {
          const platform = options.platforms[i];
          let result: PublishingResult;

          if (platform === 'linkedin') {
            result = await publishToLinkedIn(options);
          } else {
            result = await publishToWordPress(options);
          }

          results.push(result);
          const progress = Math.round(((i + 1) / totalPlatforms) * 100);

          setState(prev => ({
            ...prev,
            results,
            progress,
          }));
        }

        // Verificar si hubo errores
        const hasErrors = results.some(r => !r.success);
        if (hasErrors) {
          const errorMessages = results
            .filter(r => !r.success && r.error)
            .map(r => `${r.platform}: ${r.error}`)
            .join('; ');

          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessages,
            results,
            progress: 100,
          }));
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            results,
            progress: 100,
          }));
        }

        return results;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al publicar';
        setState({
          isLoading: false,
          error: errorMessage,
          results: [],
          progress: 0,
        });
        throw error;
      }
    },
    [publishToLinkedIn, publishToWordPress]
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      results: [],
      progress: 0,
    });
  }, []);

  return {
    ...state,
    publish,
    publishToLinkedIn,
    publishToWordPress,
    reset,
  };
}
