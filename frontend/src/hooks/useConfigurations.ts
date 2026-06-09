import { useState, useCallback } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { Configuration } from '../types/generator';

const mockConfigurations: Configuration[] = [];

export function useCreateConfiguration() {
  const { setLoading, setError, addConfiguration } = useGenerator();
  const [isCreating, setIsCreating] = useState(false);

  const createConfig = useCallback(
    async (config: Omit<Configuration, 'id' | 'created_at' | 'updated_at'>) => {
      setIsCreating(true);
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const newConfig: Configuration = {
          ...config,
          id: `config_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        mockConfigurations.push(newConfig);
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const data = mockConfigurations;
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
