'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Configuration, GeneratedContent, BatchJob, EmailTemplate, GeneratorState, ContentResult } from '../types/generator';
import { Client } from '../types/client';
import { MOCK_CLIENTS } from '../data/mockClients';

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
    generatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
    generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
    generatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
    generatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
    generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
    generatedDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    targetAudience: 'Marketers',
    contentIntent: 'transactional',
    status: 'published' as const,
    tags: ['email', 'marketing', 'conversión'],
  },
];

const initialState: GeneratorState = {
  configurations: [],
  selectedConfig: null,
  generatedContent: [],
  batchJobs: [],
  emailTemplates: [],
  isLoading: false,
  error: null,
  clients: MOCK_CLIENTS,
  currentClientId: MOCK_CLIENTS[0]?.id || null,
  selectedClient: MOCK_CLIENTS[0] || null,
  contentResults: mockContentResults as any,
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
