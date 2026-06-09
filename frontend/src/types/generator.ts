// Type definitions for Content Generation System

import { Client } from './client';

export interface Configuration {
  id: string;
  project_id: string | null;
  name: string;
  description?: string;
  keywords_niche: string[];
  keywords_longtail: string[];
  tone: 'professional' | 'friendly' | 'technical' | 'custom';
  tone_custom_text?: string;
  enabled_formats: EnabledFormats;
  email_template_id?: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnabledFormats {
  blog: boolean;
  email: boolean;
  social_linkedin: boolean;
  social_instagram: boolean;
  whatsapp: boolean;
  pdf: boolean;
}

export interface GeneratedContent {
  id: string;
  project_id?: string;
  content_id: string;
  config_id?: string;
  format: ContentFormat;
  generated_text: string;
  keywords_used: string[];
  tone_applied: string;
  word_count: number;
  keyword_density: number;
  version: number;
  is_alternative: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export type ContentFormat =
  | 'blog'
  | 'email'
  | 'social_linkedin'
  | 'social_instagram'
  | 'whatsapp'
  | 'pdf';

export interface BatchJob {
  id: string;
  project_id: string;
  config_id?: string;
  content_ids: string[];
  total_items: number;
  processed_items: number;
  failed_items: number;
  percentComplete?: number;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  concurrency_limit: number;
  results?: BatchResult[];
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface BatchResult {
  contentId: string;
  status: 'completed' | 'failed' | 'processing';
  generatedIds?: string[];
  error?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  template_body: string;
  is_system: boolean;
  project_id?: string;
  created_at: string;
}

export interface GeneratorState {
  configurations: Configuration[];
  selectedConfig: Configuration | null;
  generatedContent: GeneratedContent[];
  batchJobs: BatchJob[];
  emailTemplates: EmailTemplate[];
  isLoading: boolean;
  error: string | null;
  clients: Client[];
  currentClientId: string | null;
  selectedClient: Client | null;
  contentResults: ContentResult[];
}

export interface GenerateRequest {
  contentId: string;
  configId?: string;
  configName?: string;
  clientId?: string;
  keywordsNiche?: string[];
  keywordsLongtail?: string[];
  tone?: string;
  toneCustomText?: string;
  enabledFormats?: EnabledFormats;

  // Parámetros estratégicos dinámicos
  insightOrigin?: 'direct_idea' | 'keyword_seo' | 'obsidian_drive';
  contentIntent?: 'educational' | 'transactional' | 'social_proof' | 'thought_leadership';
  localGeoEnabled?: boolean;
  localGeoValue?: string;
  blogLength?: string;
}

export interface BatchRequest {
  projectId: string;
  configId?: string;
  contentIds: string[];
  concurrencyLimit: number;
}

export interface ContentResult {
  id: string;
  clientId: string;
  clientName: string;
  postTitle: string;
  outputFormat: ContentFormat;
  keywordsUsed: string[];
  generatedDate: string;
  targetAudience: string;
  contentIntent: string;
  generatedContent?: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
}

// ======================================
// SISTEMA AVANZADO DE TONOS Y SUBTONOS
// ======================================

export interface Subtono {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface MacroTono {
  id: string;
  nombre: string;
  icon: string;
  iconLucide?: string; // nombre del icono de lucide-react
  subtonos: Subtono[];
}

// ======================================
// SISTEMA DE INTENCIONES Y SUB-INTENCIONES
// ======================================

export interface SubIntencion {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface MacroIntencion {
  id: string;
  nombre: string;
  icon: string;
  iconLucide?: string; // nombre del icono de lucide-react
  subIntenciones: SubIntencion[];
}

export const TONOS_CONTEXTO: MacroTono[] = [
  {
    id: 'professional',
    nombre: 'Profesional / Corporativo',
    icon: '💼',
    iconLucide: 'Briefcase',
    subtonos: [
      { id: 'authoritative', nombre: 'Autoritario / Experto', descripcion: 'Posiciona como líder de opinión con datos y asertividad.' },
      { id: 'neutral', nombre: 'Institucional / Neutro', descripcion: 'Formal, plano y objetivo.' },
      { id: 'consultative', nombre: 'Consultivo', descripcion: 'Orientado a asesorar y guiar profesionalmente.' }
    ]
  },
  {
    id: 'friendly',
    nombre: 'Cercano / Coloquial',
    icon: '🤝',
    iconLucide: 'Handshake',
    subtonos: [
      { id: 'casual', nombre: 'Familiar / Vecinal', descripcion: 'Tono de confianza, ideal para negocios locales.' },
      { id: 'enthusiastic', nombre: 'Entusiasta / Enérgico', descripcion: 'Alta energía, ideal para lanzamientos o UGC.' },
      { id: 'empathetic', nombre: 'Empático / Compasivo', descripcion: 'Foco en conectar con los dolores del usuario.' }
    ]
  },
  {
    id: 'technical',
    nombre: 'Técnico / Académico',
    icon: '🎓',
    iconLucide: 'GraduationCap',
    subtonos: [
      { id: 'educational', nombre: 'Divulgativo / Didáctico', descripcion: 'Explica lo complejo de forma ultra-sencilla.' },
      { id: 'analytical', nombre: 'Analítico / Científico', descripcion: 'Basado en métricas, auditorías y datos crudos.' }
    ]
  },
  {
    id: 'persuasive',
    nombre: 'Persuasivo / Comercial',
    icon: '🧲',
    iconLucide: 'Magnet',
    subtonos: [
      { id: 'hard-sell', nombre: 'Directo a Venta', descripcion: 'Foco en urgencia, escasez y conversión rápida.' },
      { id: 'aspirational', nombre: 'Inspiracional / Aspiracional', descripcion: 'Vende el estatus y la transformación.' }
    ]
  },
  {
    id: 'creative',
    nombre: 'Creativo / Informal',
    icon: '⚡',
    iconLucide: 'Zap',
    subtonos: [
      { id: 'nostalgic', nombre: 'Nostálgico / Retro (Surfvintage)', descripcion: 'Apela a la nostalgia de los 60s, 70s y 80s.' },
      { id: 'disruptive', nombre: 'Irreverente / Canalla (Hot Takes)', descripcion: 'Desafiante, rompe mitos con ironía.' },
      { id: 'witty', nombre: 'Divertido / Lúdico', descripcion: 'Ágil, ingenioso y enfocado a retener en RRSS.' }
    ]
  }
];

export const INTENCIONES_CONTEXTO: MacroIntencion[] = [
  {
    id: 'educational',
    nombre: 'Educacional',
    icon: '📚',
    iconLucide: 'BookOpen',
    subIntenciones: [
      { id: 'problem-awareness', nombre: 'Concienciación del Problema', descripcion: 'Ayuda al usuario a identificar que tiene un problema.' },
      { id: 'solution-discovery', nombre: 'Descubrimiento de Solución', descripcion: 'Introduce la solución como respuesta viable.' },
      { id: 'deep-dive', nombre: 'Guía Avanzada / Deep Dive', descripcion: 'Contenido profundo para usuarios avanzados.' }
    ]
  },
  {
    id: 'transactional',
    nombre: 'Transaccional',
    icon: '🛒',
    iconLucide: 'ShoppingCart',
    subIntenciones: [
      { id: 'lead-generation', nombre: 'Captación de Leads', descripcion: 'Genera base de datos con email o datos de contacto.' },
      { id: 'hard-conversion', nombre: 'Venta Directa', descripcion: 'Impulsa a la compra/conversión inmediata.' },
      { id: 'geo-conversion', nombre: 'Captación Local', descripcion: 'Enfocado en conversión geolocalizada (visitas, llamadas).' }
    ]
  },
  {
    id: 'social_proof',
    nombre: 'Prueba Social',
    icon: '⭐',
    iconLucide: 'Star',
    subIntenciones: [
      { id: 'case-study', nombre: 'Caso de Éxito', descripcion: 'Detalla cómo resolviste un problema para un cliente.' },
      { id: 'testimonial-story', nombre: 'Testimonio Ampliado', descripcion: 'Historia emocional de transformación del cliente.' },
      { id: 'before-after', nombre: 'Antes / Después', descripcion: 'Contraste visual/narrativo de resultados.' }
    ]
  },
  {
    id: 'thought_leadership',
    nombre: 'Liderazgo de Opinión',
    icon: '🎯',
    iconLucide: 'Target',
    subIntenciones: [
      { id: 'disruptive-opinion', nombre: 'Opinión Disruptiva', descripcion: 'Desafía convenciones con insights provocadores.' },
      { id: 'market-insight', nombre: 'Tendencias de Mercado', descripcion: 'Análisis de trends y predicciones del sector.' },
      { id: 'company-culture', nombre: 'Cultura y Valores', descripcion: 'Comunica valores, misión y diferenciación de marca.' }
    ]
  }
];
