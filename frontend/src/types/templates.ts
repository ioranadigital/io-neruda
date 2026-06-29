export type TemplateCategory = 'SEO Comercial' | 'SEO Informativo' | 'Conversión Directa' | 'Optimización GEO';
export type TemplatePropuesta = 'comparativa' | 'guia' | 'tutorial' | 'tips' | 'tendencias' | 'caso';

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
}

export interface TemplateInjection {
  tipoPropuesta: TemplatePropuesta;
  subcategoriaPropuesta: string;
  promptEstructuraFijada: string;
}
