'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Configuration, GeneratedContent, BatchJob, EmailTemplate, GeneratorState } from '../types/generator';
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
  | { type: 'UPDATE_CLIENT'; payload: Client };

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
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(generatorReducer, initialState);

  // Load mock clients on mount
  useEffect(() => {
    dispatch({ type: 'SET_CLIENTS', payload: MOCK_CLIENTS });
    // Auto-select first client
    if (MOCK_CLIENTS.length > 0) {
      dispatch({ type: 'SELECT_CLIENT', payload: MOCK_CLIENTS[0] });
    }
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

  const selectClient = useCallback((client: Client | null) => {
    dispatch({ type: 'SELECT_CLIENT', payload: client });
  }, []);

  const updateClient = useCallback((client: Client) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: client });
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
