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
}
