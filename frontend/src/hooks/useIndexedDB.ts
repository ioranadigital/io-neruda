'use client';

import { useEffect, useState, useCallback } from 'react';
import { dbManager, STORES, type StoreName } from '@/src/utils/indexeddb';
import { GeneratedContent, BatchJob, Configuration, EmailTemplate } from '@/src/types/generator';

export function useIndexedDB<T>(storeName: StoreName, key?: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await dbManager.init();
        if (key) {
          const item = await dbManager.get<T>(storeName, key);
          setData(item || null);
        } else {
          const items = await dbManager.getAll<T>(storeName);
          setData(items as any);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [storeName, key]);

  const save = useCallback(
    async (item: T & { id: string }) => {
      try {
        await dbManager.init();
        await dbManager.set(storeName, item);
        setData(item);
        return item;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [storeName]
  );

  const remove = useCallback(
    async (removeKey: string) => {
      try {
        await dbManager.init();
        await dbManager.delete(storeName, removeKey);
        if (key === removeKey) {
          setData(null);
        }
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [storeName, key]
  );

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      await dbManager.init();
      if (key) {
        const item = await dbManager.get<T>(storeName, key);
        setData(item || null);
      } else {
        const items = await dbManager.getAll<T>(storeName);
        setData(items as any);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [storeName, key]);

  return { data, isLoading, error, save, remove, refresh };
}

export function useGeneratedContentCache() {
  return useIndexedDB<GeneratedContent>(STORES.generated_content);
}

export function useBatchJobCache() {
  return useIndexedDB<BatchJob>(STORES.batch_jobs);
}

export function useConfigurationCache() {
  return useIndexedDB<Configuration>(STORES.configurations);
}

export function useEmailTemplateCache() {
  return useIndexedDB<EmailTemplate>(STORES.email_templates);
}
