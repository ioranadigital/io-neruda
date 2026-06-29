import { useState, useEffect } from 'react';
import { Integration, IntegrationConfig } from '../types/integrations';

const STORAGE_KEY = 'io-neruda-integrations';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Publica contenido directamente en tu sitio WordPress',
      icon: '📝',
      status: 'disconnected',
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Load integrations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setIntegrations(parsed);
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save integrations to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
      } catch (error) {
        console.error('Error saving integrations:', error);
      }
    }
  }, [integrations, isLoading]);

  const updateIntegration = (id: string, config: IntegrationConfig, status: 'connected' | 'disconnected') => {
    setIntegrations(
      integrations.map(i =>
        i.id === id
          ? {
              ...i,
              status,
              config,
              lastSync: new Date().toISOString(),
            }
          : i
      )
    );
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(
      integrations.map(i =>
        i.id === id
          ? { ...i, status: 'disconnected', config: undefined }
          : i
      )
    );
  };

  const getIntegration = (id: string) => {
    return integrations.find(i => i.id === id);
  };

  return {
    integrations,
    isLoading,
    updateIntegration,
    disconnectIntegration,
    getIntegration,
  };
}
