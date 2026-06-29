export type ContentFormat = 'blog' | 'instagram' | 'linkedin' | 'email' | 'whatsapp' | 'newsletter' | 'pdf';
export type ContentType =
  | 'guia_completa'
  | 'tips_trucos'
  | 'comparativa'
  | 'tendencias'
  | 'caso_estudio'
  | 'tutorial'
  | 'solucion_rapida'
  | 'informe_temporada'
  | 'errores_comunes'
  | 'antes_despues';

export interface EditorialPiece {
  id: string;
  week: number;
  format: ContentFormat;
  contentType: ContentType;
  subtitle: string;
  title: string;
  recommendedKeyword: string;
  metaTitle: string;
  metaDescription: string;
  status: 'idea' | 'draft' | 'review' | 'published';
  icon: string;
}

export interface MonthlyPlan {
  clientId: string;
  clientName: string;
  pieces: EditorialPiece[];
  generatedAt: string;
}

export interface FormDataInjection {
  selectedFormats: Record<string, boolean>;
  keywordsSeleccionadas: string[];
  propuestaElegida: {
    titulo: string;
    metaTitle: string;
    metaDescription: string;
  };
  contentType: ContentType;
  subtitle: string;
  // Extended CSV planner fields (optional — backward compatible)
  targetStep?: number;
  geoCiudad?: string;
  geoRegion?: string;
  isLocalSEO?: boolean;
  seoSlug?: string;
  internalLink1?: string;
  marcasAutoridadGEO?: string;
  angulosEnfoque?: string;
  ctasYOptins?: { primario: string; secundario: string; optin: string };
}

// Raw CSV row shape used by PlannerTestView
export interface PlannerCSVRow {
  id: string;
  Estacionalidad: string;
  Mes: string;
  Fecha_Publicacion: string;
  Silo: string;
  Subtema: string;
  URL_Slug: string;
  Padre_Interlinking: string;
  Formato_Distribucion: string;
  Plantilla_ID: string;
  Contexto_Local_Regional: string;
  Angulo_Enfoque_Sugerido: string;
  Keyword_Principal: string;
  Vol_Busquedas: number;
  Marcas_Autoridad: string;
  Intencion_Funnel: string;
  Email_OptIn: string;
  CTA_Primario: string;
  CTA_Secundario: string;
  Estado_Publicado: boolean;
  Estado_Planner: string;
}

// Extended planner item with rolling-window deadline tracking
export interface PlannerItem extends PlannerCSVRow {
  deadline_date: string;          // "YYYY-MM-DD" — calculated or set manually
  origen: 'automatizacion' | 'manual';
}

// Mock client configuration for quarterly planner
export interface MockClientConfig {
  name: string;
  posts_por_semana: number;
  dias_publicacion: string[];
}
