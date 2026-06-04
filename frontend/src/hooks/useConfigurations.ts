import { useState, useCallback } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { Configuration } from '../types/generator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4006/api/generators';

export function useCreateConfiguration() {
  const { setLoading, setError, addConfiguration } = useGenerator();
  const [isCreating, setIsCreating] = useState(false);

  const createConfig = useCallback(
    async (config: Omit<Configuration, 'id' | 'created_at' | 'updated_at'>) => {
      setIsCreating(true);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create configuration');
        }

        const newConfig = await response.json();
        addConfiguration(newConfig);
        return newConfig;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setIsCreating(false);
        setLoading(false);
      }
    },
    [setLoading, setError, addConfiguration]
  );

  return { createConfig, isCreating };
}

export function useGetConfigurations() {
  const { setLoading, setError, setConfigurations } = useGenerator();
  const [configs, setLocalConfigs] = useState<Configuration[]>([]);

  const getConfigs = useCallback(
    async (projectId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/config/${projectId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch configurations');
        }

        const data = await response.json();
        setLocalConfigs(data);
        setConfigurations(data);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setConfigurations]
  );

  return { getConfigs, configs };
}
