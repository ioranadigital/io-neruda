import { useState, useCallback } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { Client, ClientCreateInput, ClientUpdateInput } from '../types/client';
import { MOCK_CLIENTS } from '../data/mockClients';

let mockClientsStorage = [...MOCK_CLIENTS];

export function useClients() {
  const { setClients, addClient, selectClient, setError, setLoading } = useGenerator();
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all active clients (mock data)
  const getClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const activeClients = mockClientsStorage.filter(c => c.is_active);
      setClients(activeClients);
      return activeClients;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch clients';
      setError(message);
      throw err;
    } finally {
      setIsFetching(false);
    }
  }, [setClients, setError]);

  // Create new client (mock)
  const createNewClient = useCallback(
    async (input: ClientCreateInput) => {
      setIsCreating(true);
      setError(null);

      try {
        if (!input.name || !input.slug) {
          throw new Error('Name and slug are required');
        }

        const exists = mockClientsStorage.some(c => c.slug === input.slug);
        if (exists) {
          throw new Error(`Slug "${input.slug}" already exists`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        const newClient: Client = {
          id: `client_${Date.now()}`,
          name: input.name,
          slug: input.slug,
          description: input.description || '',
          is_active: true,
          keywords_niche: input.keywords_niche || [],
          keywords_longtail: input.keywords_longtail || [],
          channel_blog: input.channel_blog || false,
          channel_email: input.channel_email || false,
          channel_linkedin: input.channel_linkedin || false,
          channel_instagram: input.channel_instagram || false,
          color_primary: input.color_primary || '#6045E2',
          color_secondary: input.color_secondary || '#8280FD',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        mockClientsStorage.push(newClient);
        addClient(newClient);
        return newClient;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create client';
        setError(message);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [addClient, setError]
  );

  // Select client (mock)
  const selectClientById = useCallback(
    async (clientId: string) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        const client = mockClientsStorage.find(c => c.id === clientId);

        if (!client) {
          throw new Error('Client not found');
        }

        selectClient(client);
        return client;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to select client';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectClient, setError, setLoading]
  );

  // Update client (mock)
  const updateClientBrandMemory = useCallback(
    async (clientId: string, updates: Partial<ClientUpdateInput>) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const clientIndex = mockClientsStorage.findIndex(c => c.id === clientId);
        if (clientIndex === -1) {
          throw new Error('Client not found');
        }

        const updated: Client = {
          ...mockClientsStorage[clientIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };

        mockClientsStorage[clientIndex] = updated;
        selectClient(updated);
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update client';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectClient, setError, setLoading]
  );

  // Deactivate client (mock)
  const deactivateClient = useCallback(
    async (clientId: string) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const clientIndex = mockClientsStorage.findIndex(c => c.id === clientId);
        if (clientIndex === -1) {
          throw new Error('Client not found');
        }

        mockClientsStorage[clientIndex].is_active = false;
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to deactivate client';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return {
    getClients,
    createNewClient,
    selectClientById,
    updateClientBrandMemory,
    deactivateClient,
    isFetching,
    isCreating,
  };
}
