import { useEffect, useState } from 'react';
import { FormDataInjection } from '@/src/types/planner';

export function usePlannerInjection() {
  const [injectionData, setInjectionData] = useState<FormDataInjection | null>(null);
  const [isFromPlanner, setIsFromPlanner] = useState(false);

  useEffect(() => {
    // Check if there's injected data from the planner
    const stored = sessionStorage.getItem('planner-injection');
    const source = sessionStorage.getItem('planner-source');

    if (stored && source === 'true') {
      try {
        const data = JSON.parse(stored) as FormDataInjection;
        setInjectionData(data);
        setIsFromPlanner(true);

        // Clean up immediately after reading
        sessionStorage.removeItem('planner-injection');
        sessionStorage.removeItem('planner-source');
      } catch (err) {
        console.error('Failed to parse planner injection data:', err);
      }
    }
  }, []);

  const applyInjection = (currentFormData: any): any => {
    if (!injectionData) return currentFormData;

    return {
      ...currentFormData,
      selectedFormats: injectionData.selectedFormats,
      keywordsSeleccionadas: injectionData.keywordsSeleccionadas,
      propuestaElegida: injectionData.propuestaElegida,
      selectedProposal: injectionData.propuestaElegida.titulo,
      contentType: injectionData.contentType,
      subcategoriaPropuesta: injectionData.subtitle,
      // Extended CSV fields (optional — ignored if not present)
      ...(injectionData.geoCiudad   && { geoCiudad: injectionData.geoCiudad, isLocalSEO: true }),
      ...(injectionData.geoRegion   && { geoRegion: injectionData.geoRegion }),
      ...(injectionData.seoSlug     && { seoSlug: injectionData.seoSlug }),
      ...(injectionData.internalLink1 && { internalLink1: injectionData.internalLink1 }),
    };
  };

  const clearInjection = () => {
    setInjectionData(null);
    setIsFromPlanner(false);
  };

  return {
    injectionData,
    isFromPlanner,
    applyInjection,
    clearInjection,
  };
}
