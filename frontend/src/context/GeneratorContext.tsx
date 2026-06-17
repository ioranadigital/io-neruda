'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Configuration, GeneratedContent, BatchJob, EmailTemplate, GeneratorState, ContentResult } from '../types/generator';
import { Client } from '../types/client';
import { MOCK_CLIENTS } from '../data/mockClients';
import { supabase } from '../lib/supabase';

type GeneratorAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONFIGURATIONS'; payload: Configuration[] }
  | { type: 'ADD_CONFIGURATION'; payload: Configuration }
  | { type: 'SELECT_CONFIGURATION'; payload: Configuration | null }
  | { type: 'SET_GENERATED_CONTENT'; payload: GeneratedContent[] }
  | { type: 'ADD_GENERATED_CONTENT'; payload: GeneratedContent }
  | { type: 'SET_BATCH_JOBS'; payload: BatchJob[] }
  | { type: 'UPDATE_BATCH_JOB'; payload: BatchJob }
  | { type: 'SET_EMAIL_TEMPLATES'; payload: EmailTemplate[] }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SELECT_CLIENT'; payload: Client | null }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'ADD_CUSTOM_KEYWORD_TO_CLIENT'; payload: { clientId: string; keyword: string } }
  | { type: 'SET_CONTENT_RESULTS'; payload: ContentResult[] }
  | { type: 'ADD_CONTENT_RESULT'; payload: ContentResult };

const mockContentResults = [
  {
    id: 'demo_1',
    clientId: 'client_1',
    clientName: 'Tech Innovations Co',
    postTitle: 'Cómo implementar Machine Learning en tu negocio',
    outputFormat: 'blog' as const,
    keywordsUsed: ['machine learning', 'IA empresarial', 'transformación digital'],
    generatedDate: '2026-06-09T10:00:00.000Z',
    targetAudience: 'CTOs y directores de IT',
    contentIntent: 'educational',
    status: 'published' as const,
    tags: ['tecnología', 'IA', 'empresas'],
  },
  {
    id: 'demo_2',
    clientId: 'client_1',
    clientName: 'Tech Innovations Co',
    postTitle: 'Newsletter: Últimas tendencias en Cloud Computing',
    outputFormat: 'email' as const,
    keywordsUsed: ['cloud computing', 'infraestructura', 'AWS'],
    generatedDate: '2026-06-10T08:00:00.000Z',
    targetAudience: 'Ejecutivos de tecnología',
    contentIntent: 'thought_leadership',
    status: 'draft' as const,
    tags: ['cloud', 'infraestructura'],
  },
  {
    id: 'demo_3',
    clientId: 'client_1',
    clientName: 'Tech Innovations Co',
    postTitle: '10 beneficios de adoptar DevOps',
    outputFormat: 'social_linkedin' as const,
    keywordsUsed: ['DevOps', 'desarrollo ágil', 'CI/CD'],
    generatedDate: '2026-06-08T14:00:00.000Z',
    targetAudience: 'Equipos de desarrollo',
    contentIntent: 'social_proof',
    status: 'published' as const,
    tags: ['DevOps', 'desarrollo'],
  },
  {
    id: 'demo_4',
    clientId: 'client_2',
    clientName: 'Digital Marketing Pro',
    postTitle: 'Estrategia SEO 2024: Guía completa',
    outputFormat: 'blog' as const,
    keywordsUsed: ['SEO 2024', 'posicionamiento', 'Google'],
    generatedDate: '2026-06-06T09:00:00.000Z',
    targetAudience: 'Agencias de marketing',
    contentIntent: 'educational',
    status: 'published' as const,
    tags: ['SEO', 'marketing', 'estrategia'],
  },
  {
    id: 'demo_5',
    clientId: 'client_2',
    clientName: 'Digital Marketing Pro',
    postTitle: 'Instagram Reels: Cómo crear contenido viral',
    outputFormat: 'social_instagram' as const,
    keywordsUsed: ['reels', 'viral content', 'engagement'],
    generatedDate: '2026-06-10T11:00:00.000Z',
    targetAudience: 'Content creators',
    contentIntent: 'transactional',
    status: 'draft' as const,
    tags: ['social media', 'instagram', 'contenido'],
  },
  {
    id: 'demo_6',
    clientId: 'client_2',
    clientName: 'Digital Marketing Pro',
    postTitle: 'Guía de Email Marketing: Conversiones garantizadas',
    outputFormat: 'pdf' as const,
    keywordsUsed: ['email marketing', 'conversión', 'ROI'],
    generatedDate: '2026-06-10T16:00:00.000Z',
    targetAudience: 'Marketers',
    contentIntent: 'transactional',
    status: 'published' as const,
    tags: ['email', 'marketing', 'conversión'],
  },
];

// ===== INICIALIZAR ESTADO CON PERSISTENCIA =====
// Cargar clientes desde localStorage (deprecated - now loading from Supabase)
const loadClientsFromStorage = (): Client[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('io-neruda-clients');
    if (stored) {
      console.log('✅ Loaded clients from localStorage');
      return JSON.parse(stored);
    }
    console.log('📦 No clients in localStorage, using empty array');
    return [];
  } catch (error) {
    console.error('Error loading clients from localStorage:', error);
    return [];
  }
};

// Cargar contentResults desde Supabase (nueva fuente)
const loadContentResultsFromSupabase = async (): Promise<ContentResult[]> => {
  try {
    console.log('📡 Loading content results from Supabase...');
    const { data, error } = await supabase
      .from('io_neruda_generated_contents')
      .select('*');

    if (error) {
      console.warn('⚠️ Error loading from Supabase:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      console.log('✅ Loaded', data.length, 'content results from Supabase');
      // Map Supabase structure to ContentResult structure
      return data.map((item: any) => ({
        id: item.id,
        clientId: item.client_id || '',
        clientName: item.client_name || '',
        postTitle: item.post_title || '',
        outputFormat: item.format || 'blog',
        keywordsUsed: item.keywords_used || [],
        generatedDate: item.created_at || '',
        targetAudience: item.target_audience || '',
        contentIntent: item.content_intent || '',
        status: item.status || 'draft',
        tags: item.tags || [],
      })) as ContentResult[];
    }

    console.log('📦 No content results in Supabase');
    return [];
  } catch (err) {
    console.error('❌ Exception loading content results:', err);
    return [];
  }
};

const initialState: GeneratorState = {
  configurations: [],
  selectedConfig: null,
  generatedContent: [],
  batchJobs: [],
  emailTemplates: [],
  isLoading: false,
  error: null,
  clients: [],
  currentClientId: null,
  selectedClient: null,
  contentResults: [], // Load from Supabase in useEffect
};

function generatorReducer(state: GeneratorState, action: GeneratorAction): GeneratorState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONFIGURATIONS':
      return { ...state, configurations: action.payload };
    case 'ADD_CONFIGURATION':
      return { ...state, configurations: [...state.configurations, action.payload] };
    case 'SELECT_CONFIGURATION':
      return { ...state, selectedConfig: action.payload };
    case 'SET_GENERATED_CONTENT':
      return { ...state, generatedContent: action.payload };
    case 'ADD_GENERATED_CONTENT':
      return { ...state, generatedContent: [...state.generatedContent, action.payload] };
    case 'SET_BATCH_JOBS':
      return { ...state, batchJobs: action.payload };
    case 'UPDATE_BATCH_JOB':
      return {
        ...state,
        batchJobs: state.batchJobs.map(job => (job.id === action.payload.id ? action.payload : job)),
      };
    case 'SET_EMAIL_TEMPLATES':
      return { ...state, emailTemplates: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload),
        selectedClient: state.selectedClient?.id === action.payload ? null : state.selectedClient,
      };
    case 'SELECT_CLIENT':
      return { ...state, selectedClient: action.payload, currentClientId: action.payload?.id || null };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => (c.id === action.payload.id ? action.payload : c)),
        selectedClient: state.selectedClient?.id === action.payload.id ? action.payload : state.selectedClient,
      };
    case 'ADD_CUSTOM_KEYWORD_TO_CLIENT': {
      const { clientId, keyword } = action.payload;
      const updatedClients = state.clients.map(c => {
        if (c.id === clientId) {
          const existingKeywords = c.keywords_niche || [];
          if (!existingKeywords.includes(keyword)) {
            return {
              ...c,
              keywords_niche: [...existingKeywords, keyword],
            };
          }
        }
        return c;
      });
      return {
        ...state,
        clients: updatedClients,
        selectedClient: state.selectedClient?.id === clientId
          ? updatedClients.find(c => c.id === clientId) || state.selectedClient
          : state.selectedClient,
      };
    }
    case 'SET_CONTENT_RESULTS':
      return { ...state, contentResults: action.payload };
    case 'ADD_CONTENT_RESULT':
      return { ...state, contentResults: [action.payload, ...state.contentResults] };
    default:
      return state;
  }
}

interface GeneratorContextType extends GeneratorState {
  dispatch: React.Dispatch<GeneratorAction>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConfigurations: (configs: Configuration[]) => void;
  addConfiguration: (config: Configuration) => void;
  selectConfiguration: (config: Configuration | null) => void;
  setGeneratedContent: (content: GeneratedContent[]) => void;
  addGeneratedContent: (content: GeneratedContent) => void;
  setBatchJobs: (jobs: BatchJob[]) => void;
  updateBatchJob: (job: BatchJob) => void;
  setEmailTemplates: (templates: EmailTemplate[]) => void;
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  selectClient: (client: Client | null) => void;
  updateClient: (client: Client) => void;
  addCustomKeywordToClient: (clientId: string, keyword: string) => void;
  setContentResults: (results: ContentResult[]) => void;
  addContentResult: (result: ContentResult) => void;
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(generatorReducer, initialState);

  // Save clients to localStorage on mount (for persistence)
  useEffect(() => {
    if (typeof window !== 'undefined' && state.clients.length > 0) {
      localStorage.setItem('io-neruda-clients', JSON.stringify(state.clients));
    }
  }, [state.clients]);

  // Save contentResults to localStorage whenever they change (for persistence)
  useEffect(() => {
    if (typeof window !== 'undefined' && state.contentResults.length > 0) {
      localStorage.setItem('io-neruda-content-results', JSON.stringify(state.contentResults));
    }
  }, [state.contentResults]);

  // Load clients and content results from Supabase after hydration (client-only)
  useEffect(() => {
    const loadDataFromSupabase = async () => {
      try {
        // Load clients
        console.log('📡 Loading clients from Supabase...');
        const { data: clientsData, error: clientsError } = await supabase
          .from('io_neruda_clients')
          .select('*');

        if (clientsError) {
          console.warn('⚠️ Error loading clients from Supabase:', clientsError.message);
          const stored = loadClientsFromStorage();
          if (stored.length > 0) {
            dispatch({ type: 'SET_CLIENTS', payload: stored });
          } else {
            dispatch({ type: 'SET_CLIENTS', payload: MOCK_CLIENTS });
          }
        } else if (clientsData && clientsData.length > 0) {
          console.log('✅ Loaded', clientsData.length, 'clients from Supabase');
          dispatch({ type: 'SET_CLIENTS', payload: clientsData as Client[] });
        } else {
          console.log('📦 No clients in Supabase, using MOCK_CLIENTS');
          dispatch({ type: 'SET_CLIENTS', payload: MOCK_CLIENTS });
        }

        // Load content results
        const contentResults = await loadContentResultsFromSupabase();
        dispatch({ type: 'SET_CONTENT_RESULTS', payload: contentResults });
      } catch (err) {
        console.error('❌ Exception loading data:', err);
        dispatch({ type: 'SET_CLIENTS', payload: MOCK_CLIENTS });
        dispatch({ type: 'SET_CONTENT_RESULTS', payload: [] });
      }
    };

    loadDataFromSupabase();
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setConfigurations = useCallback((configs: Configuration[]) => {
    dispatch({ type: 'SET_CONFIGURATIONS', payload: configs });
  }, []);

  const addConfiguration = useCallback((config: Configuration) => {
    dispatch({ type: 'ADD_CONFIGURATION', payload: config });
  }, []);

  const selectConfiguration = useCallback((config: Configuration | null) => {
    dispatch({ type: 'SELECT_CONFIGURATION', payload: config });
  }, []);

  const setGeneratedContent = useCallback((content: GeneratedContent[]) => {
    dispatch({ type: 'SET_GENERATED_CONTENT', payload: content });
  }, []);

  const addGeneratedContent = useCallback((content: GeneratedContent) => {
    dispatch({ type: 'ADD_GENERATED_CONTENT', payload: content });
  }, []);

  const setBatchJobs = useCallback((jobs: BatchJob[]) => {
    dispatch({ type: 'SET_BATCH_JOBS', payload: jobs });
  }, []);

  const updateBatchJob = useCallback((job: BatchJob) => {
    dispatch({ type: 'UPDATE_BATCH_JOB', payload: job });
  }, []);

  const setEmailTemplates = useCallback((templates: EmailTemplate[]) => {
    dispatch({ type: 'SET_EMAIL_TEMPLATES', payload: templates });
  }, []);

  const setClients = useCallback((clients: Client[]) => {
    dispatch({ type: 'SET_CLIENTS', payload: clients });
  }, []);

  const addClient = useCallback((client: Client) => {
    dispatch({ type: 'ADD_CLIENT', payload: client });
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    dispatch({ type: 'DELETE_CLIENT', payload: clientId });
  }, []);

  const selectClient = useCallback((client: Client | null) => {
    dispatch({ type: 'SELECT_CLIENT', payload: client });
  }, []);

  const updateClient = useCallback((client: Client) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: client });
  }, []);

  const addCustomKeywordToClient = useCallback((clientId: string, keyword: string) => {
    dispatch({ type: 'ADD_CUSTOM_KEYWORD_TO_CLIENT', payload: { clientId, keyword } });
  }, []);

  const setContentResults = useCallback((results: ContentResult[]) => {
    dispatch({ type: 'SET_CONTENT_RESULTS', payload: results });
  }, []);

  const addContentResult = useCallback((result: ContentResult) => {
    dispatch({ type: 'ADD_CONTENT_RESULT', payload: result });
  }, []);

  const value: GeneratorContextType = {
    ...state,
    dispatch,
    setLoading,
    setError,
    setConfigurations,
    addConfiguration,
    selectConfiguration,
    setGeneratedContent,
    addGeneratedContent,
    setBatchJobs,
    updateBatchJob,
    setEmailTemplates,
    setClients,
    addClient,
    deleteClient,
    selectClient,
    updateClient,
    addCustomKeywordToClient,
    setContentResults,
    addContentResult,
  };

  return (
    <GeneratorContext.Provider value={value}>
      {children}
    </GeneratorContext.Provider>
  );
}

export function useGenerator() {
  const context = useContext(GeneratorContext);
  if (!context) {
    throw new Error('useGenerator must be used within GeneratorProvider');
  }
  return context;
}
