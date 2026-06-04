'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Configuration, GeneratedContent, BatchJob, EmailTemplate, GeneratorState } from '../types/generator';

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
  | { type: 'SET_EMAIL_TEMPLATES'; payload: EmailTemplate[] };

const initialState: GeneratorState = {
  configurations: [],
  selectedConfig: null,
  generatedContent: [],
  batchJobs: [],
  emailTemplates: [],
  isLoading: false,
  error: null,
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
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(generatorReducer, initialState);

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
