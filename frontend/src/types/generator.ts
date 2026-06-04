// Type definitions for Content Generation System

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
}

export interface GenerateRequest {
  contentId: string;
  configId?: string;
  keywordsNiche?: string[];
  keywordsLongtail?: string[];
  tone?: string;
  toneCustomText?: string;
  enabledFormats?: EnabledFormats;
}

export interface BatchRequest {
  projectId: string;
  configId?: string;
  contentIds: string[];
  concurrencyLimit: number;
}
