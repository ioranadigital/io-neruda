import { useState, useCallback } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { EmailTemplate } from '../types/generator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4006/api/generators';

export function useEmailTemplates() {
  const { setLoading, setError, setEmailTemplates } = useGenerator();
  const [templates, setLocalTemplates] = useState<{ system: EmailTemplate[]; project: EmailTemplate[] }>({
    system: [],
    project: [],
  });
  const [isLoading, setIsLoadingLocal] = useState(false);

  const getTemplates = useCallback(
    async (projectId?: string) => {
      setIsLoadingLocal(true);
      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_BASE}/email-templates`);
        if (projectId) {
          url.searchParams.append('projectId', projectId);
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        setLocalTemplates(data);
        setEmailTemplates([...data.system, ...data.project]);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setIsLoadingLocal(false);
        setLoading(false);
      }
    },
    [setLoading, setError, setEmailTemplates]
  );

  return { getTemplates, templates, isLoading };
}

export function useCreateEmailTemplate() {
  const { setLoading, setError } = useGenerator();

  const createTemplate = useCallback(
    async (template: Omit<EmailTemplate, 'id' | 'created_at'>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/email-templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(template),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create template');
        }

        return await response.json();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return { createTemplate };
}
