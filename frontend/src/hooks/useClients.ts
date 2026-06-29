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

// Save client to Supabase - all fields mapped
async function saveClientToSupabase(client: Client): Promise<void> {
  try {
    const clientData = {
      // Identity
      id: client.id,
      name: client.name,
      slug: client.slug,
      description: client.description || null,
      long_description: client.long_description || null,
      business_type: client.business_type || null,
      website_url: client.website_url || null,
      country: client.country || null,
      phone: client.phone || null,
      email: client.email || null,
      // Audience
      target_audience: client.target_audience || null,
      buyer_personas: client.buyer_personas || null,
      buyer_personas_list: client.buyer_personas_list || [],
      avg_age: client.avg_age || null,
      income_level: client.income_level || null,
      target_industries: client.target_industries || [],
      problems_solved: client.problems_solved || [],
      unique_proposition: client.unique_proposition || null,
      success_case: client.success_case || null,
      // Brand
      brand_name: client.brand_name || null,
      tagline: client.tagline || null,
      logo_url: client.logo_url || null,
      color_primary: client.color_primary || null,
      color_secondary: client.color_secondary || null,
      color_palette: client.color_palette || [],
      typography: client.typography || null,
      brand_voice: client.brand_voice || null,
      default_tone: client.default_tone || 'professional',
      brand_story: client.brand_story || null,
      brand_values: client.brand_values || [],
      // Content
      keywords_niche: client.keywords_niche || [],
      keywords_longtail: client.keywords_longtail || [],
      keywords_producto: client.keywords_producto || [],
      keywords_hierarchical: client.keywords_hierarchical || {},
      content_pillars: client.content_pillars || [],
      forbidden_keywords: client.forbidden_keywords || [],
      publication_frequency: client.publication_frequency || null,
      supported_languages: client.supported_languages || [],
      meta_description_template: client.meta_description_template || null,
      avg_word_count: client.avg_word_count || null,
      tone_varies_by_channel: client.tone_varies_by_channel || false,
      // Competition
      competitor_urls: client.competitor_urls || [],
      competitive_advantages: client.competitive_advantages || [],
      differentiators: client.differentiators || [],
      market_positioning: client.market_positioning || null,
      monitor_competitors: client.monitor_competitors !== undefined ? client.monitor_competitors : true,
      // Channels
      channel_blog: client.channel_blog || false,
      channel_email: client.channel_email || false,
      channel_linkedin: client.channel_linkedin || false,
      channel_instagram: client.channel_instagram || false,
      channel_twitter: client.channel_twitter || false,
      channel_tiktok: client.channel_tiktok || false,
      channel_youtube: client.channel_youtube || false,
      newsletter_enabled: client.newsletter_enabled || false,
      newsletter_subscribers: client.newsletter_subscribers || null,
      social_media_handles: client.social_media_handles || {},
      preferred_formats: client.preferred_formats || [],
      // References
      reference_sites: client.reference_sites || [],
      competitor_study_urls: client.competitor_study_urls || [],
      successful_content_urls: client.successful_content_urls || [],
      resources_urls: client.resources_urls || [],
      internal_docs_url: client.internal_docs_url || null,
      // Integration
      crm_platform: client.crm_platform || null,
      analytics_tool: client.analytics_tool || null,
      email_platform: client.email_platform || null,
      integrations: client.integrations || [],
      tech_stack: client.tech_stack || null,
      linkedin_connected: client.linkedin_connected || false,
      linkedin_profile_id: client.linkedin_profile_id || null,
      wordpress_connected: client.wordpress_connected || false,
      wordpress_url: client.wordpress_url || null,
      wordpress_username: client.wordpress_username || null,
      publishing_integrations: client.publishing_integrations || [],
      // Metrics
      main_objective: client.main_objective || null,
      main_kpi: client.main_kpi || null,
      conversion_goal: client.conversion_goal || null,
      monthly_budget: client.monthly_budget || null,
      team_size: client.team_size || null,
      project_timeline: client.project_timeline || null,
      // Management
      internal_notes: client.internal_notes || null,
      client_status: client.client_status || 'active',
      start_date: client.start_date || null,
      next_review: client.next_review || null,
      primary_contact_name: client.primary_contact_name || null,
      primary_contact_email: client.primary_contact_email || null,
      account_manager_id: client.account_manager_id || null,
      // System
      is_active: client.is_active !== undefined ? client.is_active : true,
      created_at: client.created_at,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('io_neruda_clients')
      .upsert(clientData, { onConflict: 'id' });

    if (error) {
      console.error('❌ Error saving client to Supabase:', error.message);
    } else {
      console.log('✅ Client saved to Supabase:', client.name);
    }
  } catch (err) {
    console.error('❌ Exception in saveClientToSupabase:', err);
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

  // Fetch all active clients from Supabase
  const getClients = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      console.log('📡 Fetching clients from Supabase...');
      const { data, error } = await supabase
        .from('io_neruda_clients')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.warn('⚠️ Supabase error, falling back to localStorage:', error.message);
        const fallback = getStoredClients().filter(c => c.is_active);
        setClients(fallback);
        return fallback;
      }

      const activeClients = (data as Client[]) || [];
      console.log('✅ Fetched', activeClients.length, 'active clients from Supabase');
      setClients(activeClients);
      return activeClients;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch clients';
      console.error('❌ Error fetching clients:', message);
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

        // Save to Supabase (source of truth)
        await saveClientToSupabase(newClient);

        // Also cache in localStorage as fallback
        const updatedClients = [...storedClients, newClient];
        saveClientsToStorage(updatedClients);
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
