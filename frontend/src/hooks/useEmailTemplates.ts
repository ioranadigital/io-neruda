import { useState, useCallback } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { EmailTemplate } from '../types/generator';

const MOCK_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Platform',
    body: 'Hello {{name}}, Welcome to our platform!',
    variables: ['name'],
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Monthly Newsletter',
    subject: 'Your Monthly Newsletter',
    body: 'Here are this month\'s updates...',
    variables: [],
    is_system: true,
    created_at: new Date().toISOString(),
  },
];

let mockTemplates = [...MOCK_TEMPLATES];

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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const systemTemplates = mockTemplates.filter(t => t.is_system);
        const projectTemplates = mockTemplates.filter(t => !t.is_system);

        const data = { system: systemTemplates, project: projectTemplates };
        setLocalTemplates(data);
        setEmailTemplates([...systemTemplates, ...projectTemplates]);
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const newTemplate: EmailTemplate = {
          ...template,
          id: `template_${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        mockTemplates.push(newTemplate);
        return newTemplate;
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
