import { useEffect, useState } from 'react';
import { TemplateInjection } from '@/src/types/templates';

export function useTemplateInjection() {
  const [injectionData, setInjectionData] = useState<TemplateInjection | null>(null);
  const [isFromTemplate, setIsFromTemplate] = useState(false);

  useEffect(() => {
    // Check if there's injected data from the templates factory
    const stored = sessionStorage.getItem('template-injection');
    const source = sessionStorage.getItem('template-source');

    if (stored && source === 'true') {
      try {
        const data = JSON.parse(stored) as TemplateInjection;
        setInjectionData(data);
        setIsFromTemplate(true);

        // Clean up immediately after reading
        sessionStorage.removeItem('template-injection');
        sessionStorage.removeItem('template-source');
      } catch (err) {
        console.error('Failed to parse template injection data:', err);
      }
    }
  }, []);

  const applyInjection = (currentFormData: any): any => {
    if (!injectionData) return currentFormData;

    return {
      ...currentFormData,
      selectedProposal: injectionData.tipoPropuesta,
      propuestaElegida: injectionData.tipoPropuesta,
      subcategoriaPropuesta: injectionData.subcategoriaPropuesta,
      promptEstructuraFijada: injectionData.promptEstructuraFijada,
    };
  };

  const clearInjection = () => {
    setInjectionData(null);
    setIsFromTemplate(false);
  };

  return {
    injectionData,
    isFromTemplate,
    applyInjection,
    clearInjection,
  };
}
