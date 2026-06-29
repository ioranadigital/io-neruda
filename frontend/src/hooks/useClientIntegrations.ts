import { useState, useEffect } from 'react';
import { ClientIntegrations, ClientSocialIntegration } from '../types/integrations';

const STORAGE_KEY = 'client-integrations';

type IntegrationTool = 'wordpress' | 'linkedin' | 'instagram' | 'tiktok' | 'facebook' | 'x' | 'googlemybusiness';

export function useClientIntegrations() {
  const [clientIntegrations, setClientIntegrations] = useState<Map<string, ClientIntegrations>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Load integrations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setClientIntegrations(new Map(parsed));
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(clientIntegrations.entries())));
      } catch (error) {
        console.error('Error saving integrations:', error);
      }
    }
  }, [clientIntegrations, isLoading]);

  const getClientIntegrations = (clientId: string): ClientIntegrations => {
    if (!clientIntegrations.has(clientId)) {
      return {
        clientId,
        clientName: '',
        wordpress: { isConnected: false },
        linkedin: { isConnected: false },
        instagram: { isConnected: false },
        tiktok: { isConnected: false },
        facebook: { isConnected: false },
        x: { isConnected: false },
        googlemybusiness: { isConnected: false },
      };
    }
    return clientIntegrations.get(clientId)!;
  };

  const isToolConnected = (clientId: string, tool: IntegrationTool): boolean => {
    const integration = getClientIntegrations(clientId);
    const toolIntegration = (integration as any)[tool];
    return toolIntegration?.isConnected ?? false;
  };

  const getToolConfig = (clientId: string, tool: IntegrationTool) => {
    const integration = getClientIntegrations(clientId);
    const toolIntegration = (integration as any)[tool];
    if (toolIntegration?.isConnected) {
      return toolIntegration;
    }
    return null;
  };

  const updateToolIntegration = (clientId: string, tool: IntegrationTool, config: ClientSocialIntegration | any) => {
    const newIntegrations = new Map(clientIntegrations);
    const integration = getClientIntegrations(clientId);

    (integration as any)[tool] = config;

    newIntegrations.set(clientId, integration);
    setClientIntegrations(newIntegrations);
  };

  const disconnectTool = (clientId: string, tool: IntegrationTool) => {
    updateToolIntegration(clientId, tool, { isConnected: false });
  };

  const getConnectedTools = (clientId: string): IntegrationTool[] => {
    const integration = getClientIntegrations(clientId);
    const tools: IntegrationTool[] = ['wordpress', 'linkedin', 'instagram', 'tiktok', 'facebook', 'x', 'googlemybusiness'];
    return tools.filter(tool => isToolConnected(clientId, tool));
  };

  return {
    clientIntegrations,
    isLoading,
    getClientIntegrations,
    isToolConnected,
    getToolConfig,
    updateToolIntegration,
    disconnectTool,
    getConnectedTools,
  };
}
