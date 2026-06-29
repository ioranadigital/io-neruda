'use client';

import { useState, useCallback } from 'react';
import { GeneratedContent, BatchJob } from '@/src/types/generator';
import { dbManager, STORES } from '@/src/utils/indexeddb';
import { useOfflineSync } from './useOfflineSync';
import { showToast } from '@/src/components/shared/Toast';

export function useGeneratorOffline() {
  const { isOnline, queueOperation } = useOfflineSync();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateContent = useCallback(
    async (request: any): Promise<GeneratedContent | null> => {
      setIsLoading(true);
      setError(null);
      try {
        await dbManager.init();

        if (isOnline) {
          // Generate on server
          const response = await fetch('/api/generators/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
          });

          if (!response.ok) {
            throw new Error('Failed to generate content');
          }

          const content: GeneratedContent = await response.json();

          // Cache locally
          await dbManager.set(STORES.generated_content, content);
          showToast.success('Contenido generado exitosamente');
          return content;
        } else {
          // Offline mode: queue for later
          const tempContent: GeneratedContent = {
            id: `offline-${Date.now()}`,
            project_id: request.projectId,
            content_id: request.contentId || '',
            format: 'blog',
            generated_text: request.originalContent || '',
            keywords_used: request.keywords || [],
            tone_applied: request.tones?.[0] || 'professional',
            word_count: 0,
            keyword_density: 0,
            version: 1,
            is_alternative: false,
            status: 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Save locally
          await dbManager.set(STORES.generated_content, tempContent);

          // Queue for sync
          await queueOperation('create', STORES.generated_content, {
            ...tempContent,
            originalContent: request.originalContent,
            formats: request.formats,
            tones: request.tones,
            keywords: request.keywords,
          });

          showToast.success('Contenido guardado localmente. Se sincronizará cuando haya conexión.');
          return tempContent;
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        showToast.error(error.message || 'Error al generar contenido');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, queueOperation]
  );

  const updateGeneratedContent = useCallback(
    async (id: string, updates: Partial<GeneratedContent>): Promise<GeneratedContent | null> => {
      setIsLoading(true);
      setError(null);
      try {
        await dbManager.init();

        // Update locally first
        const existing = await dbManager.get<GeneratedContent>(
          STORES.generated_content,
          id
        );
        if (!existing) {
          throw new Error('Content not found');
        }

        const updated = { ...existing, ...updates, updatedAt: new Date() };
        await dbManager.set(STORES.generated_content, updated);

        if (isOnline && !id.startsWith('offline-')) {
          // Sync to server
          const response = await fetch(`/api/generators/generated/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error('Failed to update content');
          }

          showToast.success('Contenido actualizado');
        } else {
          // Queue for sync
          await queueOperation('update', STORES.generated_content, updated);
          showToast.success('Cambios guardados localmente');
        }

        return updated;
      } catch (err) {
        const error = err as Error;
        setError(error);
        showToast.error(error.message || 'Error al actualizar contenido');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, queueOperation]
  );

  const deleteGeneratedContent = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await dbManager.init();

        // Delete locally
        await dbManager.delete(STORES.generated_content, id);

        if (isOnline && !id.startsWith('offline-')) {
          // Sync deletion to server
          const response = await fetch(`/api/generators/generated/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete content');
          }
        } else {
          // Queue for sync
          await queueOperation('delete', STORES.generated_content, { id });
        }

        showToast.success('Contenido eliminado');
      } catch (err) {
        const error = err as Error;
        setError(error);
        showToast.error(error.message || 'Error al eliminar contenido');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, queueOperation]
  );

  const getCachedContent = useCallback(
    async (projectId: string): Promise<GeneratedContent[]> => {
      try {
        await dbManager.init();
        return await dbManager.getAllByIndex<GeneratedContent>(
          STORES.generated_content,
          'projectId',
          projectId
        );
      } catch (err) {
        console.error('Error getting cached content:', err);
        return [];
      }
    },
    []
  );

  return {
    isOnline,
    isLoading,
    error,
    generateContent,
    updateGeneratedContent,
    deleteGeneratedContent,
    getCachedContent,
  };
}
