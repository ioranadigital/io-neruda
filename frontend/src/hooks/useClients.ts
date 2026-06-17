import { useState, useCallback, useEffect } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { Client, ClientCreateInput, ClientUpdateInput } from '../types/client';
import { supabase } from '../lib/supabase';

const CLIENTS_STORAGE_KEY = 'io-neruda-clients';

// Get clients from localStorage
function getStoredClients(): Client[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save clients to localStorage
function saveClientsToStorage(clients: Client[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

// Save client to Supabase - only persist the fields that exist in the table
async function saveClientToSupabase(client: Client): Promise<void> {
  try {
    console.log('🔄 Saving to Supabase table: io_neruda_clients');
    console.log('Client ID:', client.id);
    console.log('Client Name:', client.name);

    // Map only the fields that exist in the Supabase table
    const clientData = {
      id: client.id,
      name: client.name,
      slug: client.slug,
      description: client.description || null,
      target_audience: client.target_audience || null,
      default_tone: client.default_tone || 'professional',
      forbidden_keywords: (client.forbidden_keywords && client.forbidden_keywords.length > 0)
        ? client.forbidden_keywords
        : null,
      competitor_urls: (client.competitor_urls && client.competitor_urls.length > 0)
        ? client.competitor_urls
        : null,
      logo_url: client.logo_url || null,
      color_primary: client.color_primary || null,
      color_secondary: client.color_secondary || null,
      buyer_personas_list: (client.buyer_personas_list && client.buyer_personas_list.length > 0)
        ? client.buyer_personas_list
        : null,
      is_active: client.is_active !== undefined ? client.is_active : true,
      created_at: client.created_at,
      updated_at: new Date().toISOString(),
    };

    console.log('📤 Sending request to Supabase...');
    console.log('Data being sent:', JSON.stringify(clientData, null, 2));

    const { data, error } = await supabase
      .from('io_neruda_clients')
      .upsert(clientData, { onConflict: 'id' });

    console.log('Response received. Data:', data, 'Error:', error);

    if (error) {
      console.error('❌ Error saving client to Supabase:');
      console.error('  Error object:', error);
      console.error('  Message:', error?.message);
      console.error('  Code:', error?.code);
      console.error('  Details:', error?.details);
      console.error('  Hint:', error?.hint);
      console.error('  Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Client saved to io_neruda_clients:', client.name);
      console.log('Response data:', data);
    }
  } catch (err) {
    console.error('❌ Exception in saveClientToSupabase:');
    console.error('Exception:', err);
    if (err instanceof Error) {
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
    }
  }
}

// Load clients from Supabase
async function loadClientsFromSupabase(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('io_neruda_clients')
      .select('*');

    if (error) {
      console.error('Error loading clients from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase load error:', err);
    return [];
  }
}

export function useClients() {
  const { setClients, addClient, selectClient, updateClient, setError, setLoading } = useGenerator();
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all active clients from localStorage
  const getClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const activeClients = getStoredClients().filter(c => c.is_active);
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

  // Create new client
  const createNewClient = useCallback(
    async (input: ClientCreateInput) => {
      setIsCreating(true);
      setError(null);

      try {
        if (!input.name || !input.slug) {
          throw new Error('Name and slug are required');
        }

        const storedClients = getStoredClients();
        const exists = storedClients.some(c => c.slug === input.slug);
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
          default_tone: input.default_tone || 'professional',
          forbidden_keywords: input.forbidden_keywords || [],
          competitor_urls: input.competitor_urls || [],
          keywords_niche: input.keywords_niche || [],
          keywords_longtail: input.keywords_longtail || [],
          channel_blog: input.channel_blog || false,
          channel_email: input.channel_email || false,
          channel_linkedin: input.channel_linkedin || false,
          channel_instagram: input.channel_instagram || false,
          color_primary: input.color_primary || '#7BF1A8',
          color_secondary: input.color_secondary || '#8280FD',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Save to localStorage
        const updatedClients = [...storedClients, newClient];
        saveClientsToStorage(updatedClients);

        // Update context with all clients
        setClients(updatedClients);
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

  // Select client
  const selectClientById = useCallback(
    async (clientId: string) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        const storedClients = getStoredClients();
        const client = storedClients.find(c => c.id === clientId);

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

  // Update client
  const updateClientBrandMemory = useCallback(
    async (clientId: string, updates: Partial<ClientUpdateInput>) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const storedClients = getStoredClients();
        const clientIndex = storedClients.findIndex(c => c.id === clientId);
        if (clientIndex === -1) {
          throw new Error('Client not found');
        }

        const updated: Client = {
          ...storedClients[clientIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };

        storedClients[clientIndex] = updated;
        saveClientsToStorage(storedClients);

        // Save to Supabase
        await saveClientToSupabase(updated);

        // Update context state
        updateClient(updated);
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

  // Deactivate client
  const deactivateClient = useCallback(
    async (clientId: string) => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const storedClients = getStoredClients();
        const clientIndex = storedClients.findIndex(c => c.id === clientId);
        if (clientIndex === -1) {
          throw new Error('Client not found');
        }

        storedClients[clientIndex].is_active = false;
        saveClientsToStorage(storedClients);
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
