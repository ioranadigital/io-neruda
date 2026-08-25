export type TemplateCategory = 'SEO Comercial' | 'SEO Informativo' | 'Conversión Directa' | 'Optimización GEO';
export type TemplatePropuesta = 'comparison' | 'guide' | 'tutorial' | 'tips' | 'trends' | 'case_study';

export interface Template {
  id: string;
  nombre: string;
  categoria: TemplateCategory;
  descripcion: string;
  targetPropuesta: TemplatePropuesta;
  subcategoria: string;
  structurePrompt: string;
  colorBadge: string;
  icon: string;
  visibleInStep1?: boolean;
}

export interface TemplateInjection {
  tipoPropuesta: TemplatePropuesta;
  subcategoriaPropuesta: string;
  promptEstructuraFijada: string;
  templateName?: string;
  templateId?: string;
}
