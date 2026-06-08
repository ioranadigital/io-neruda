// Type definitions for Brand Memory & Client Management - COMPREHENSIVE PROFILE

export interface Client {
  // Basic Identity
  id: string;
  name: string;
  slug: string;
  description?: string;
  long_description?: string;
  business_type?: string;
  website_url?: string;
  country?: string;
  phone?: string;
  email?: string;

  // Audience & Market
  target_audience?: string;
  buyer_personas?: string;
  buyer_personas_list?: Array<{ name: string; description: string }>;
  avg_age?: number;
  income_level?: string;
  target_industries?: string[];
  problems_solved?: string[];
  unique_proposition?: string;
  success_case?: string;

  // Brand & Voice
  brand_name?: string;
  tagline?: string;
  logo_url?: string;
  color_primary?: string;
  color_secondary?: string;
  color_palette?: string[];
  typography?: string;
  brand_voice?: string;
  default_tone: 'professional' | 'friendly' | 'technical' | 'custom';
  brand_story?: string;
  brand_values?: string[];

  // Content & SEO
  keywords_niche?: string[];
  keywords_longtail?: string[];
  content_pillars?: string[];
  forbidden_keywords: string[];
  publication_frequency?: string;
  supported_languages?: string[];
  meta_description_template?: string;
  avg_word_count?: number;
  tone_varies_by_channel?: boolean;

  // Keywords Hierarchical Structure
  keywords_hierarchical?: KeywordsHierarchy;

  // Competition & Positioning
  competitor_urls: string[];
  competitive_advantages?: string[];
  differentiators?: string[];
  market_positioning?: string;
  monitor_competitors?: boolean;

  // Channels & Distribution
  channel_blog?: boolean;
  channel_email?: boolean;
  channel_linkedin?: boolean;
  channel_instagram?: boolean;
  channel_twitter?: boolean;
  channel_tiktok?: boolean;
  channel_youtube?: boolean;
  newsletter_enabled?: boolean;
  newsletter_subscribers?: number;
  social_media_handles?: Record<string, string>;
  preferred_formats?: string[];

  // References & Context
  reference_sites?: string[];
  competitor_study_urls?: string[];
  successful_content_urls?: string[];
  resources_urls?: string[];
  internal_docs_url?: string;

  // Integration & Tools
  crm_platform?: string;
  analytics_tool?: string;
  email_platform?: string;
  integrations?: string[];
  tech_stack?: string;

  // Metrics & KPIs
  main_objective?: string;
  main_kpi?: string;
  conversion_goal?: string;
  monthly_budget?: number;
  team_size?: number;
  project_timeline?: string;

  // Management
  internal_notes?: string;
  client_status?: 'active' | 'paused' | 'completed';
  start_date?: string;
  next_review?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  account_manager_id?: string;

  // System
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientCreateInput {
  name: string;
  slug: string;
  description?: string;
  long_description?: string;
  business_type?: string;
  website_url?: string;
  country?: string;
  phone?: string;
  email?: string;
  target_audience?: string;
  buyer_personas?: string;
  avg_age?: number;
  income_level?: string;
  target_industries?: string[];
  problems_solved?: string[];
  unique_proposition?: string;
  success_case?: string;
  brand_name?: string;
  tagline?: string;
  logo_url?: string;
  color_primary?: string;
  color_secondary?: string;
  color_palette?: string[];
  typography?: string;
  brand_voice?: string;
  default_tone?: 'professional' | 'friendly' | 'technical' | 'custom';
  brand_story?: string;
  brand_values?: string[];
  forbidden_keywords?: string[];
  keywords_niche?: string[];
  keywords_longtail?: string[];
  content_pillars?: string[];
  publication_frequency?: string;
  supported_languages?: string[];
  meta_description_template?: string;
  avg_word_count?: number;
  tone_varies_by_channel?: boolean;
  competitor_urls?: string[];
  competitive_advantages?: string[];
  differentiators?: string[];
  market_positioning?: string;
  monitor_competitors?: boolean;
  channel_blog?: boolean;
  channel_email?: boolean;
  channel_linkedin?: boolean;
  channel_instagram?: boolean;
  channel_twitter?: boolean;
  channel_tiktok?: boolean;
  channel_youtube?: boolean;
  newsletter_enabled?: boolean;
  newsletter_subscribers?: number;
  social_media_handles?: Record<string, string>;
  preferred_formats?: string[];
  reference_sites?: string[];
  competitor_study_urls?: string[];
  successful_content_urls?: string[];
  resources_urls?: string[];
  internal_docs_url?: string;
  crm_platform?: string;
  analytics_tool?: string;
  email_platform?: string;
  integrations?: string[];
  tech_stack?: string;
  main_objective?: string;
  main_kpi?: string;
  conversion_goal?: string;
  monthly_budget?: number;
  team_size?: number;
  project_timeline?: string;
  internal_notes?: string;
  client_status?: 'active' | 'paused' | 'completed';
  start_date?: string;
  next_review?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  account_manager_id?: string;
}

export interface ClientUpdateInput extends Partial<ClientCreateInput> {
  id: string;
}

export interface BrandProfile {
  clientId: string;
  clientName: string;
  description: string;
  targetAudience: string;
  defaultTone: 'professional' | 'friendly' | 'technical' | 'custom';
  forbiddenKeywords: string[];
  competitorUrls: string[];
  brandColors: {
    primary: string;
    secondary: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SessionBriefing {
  clientId: string;
  sessionId: string;
  keywords: {
    niche: string[];
    longtail: string[];
  };
  tone: string;
  enabledFormats: {
    blog: boolean;
    email: boolean;
    social_linkedin: boolean;
    social_instagram: boolean;
    whatsapp: boolean;
    pdf: boolean;
  };
  createdAt: string;
}

export interface KeywordsHierarchy {
  // Nivel 1: Keywords de Entidad y Core
  level1_entity_core?: string[];
  level1_branded?: string[];
  level1_brand_third_party?: string[];
  level1_niche_sector?: string[];

  // Nivel 2: Keywords de Segmentación
  level2_local?: string[];
  level2_audience_profile?: string[];

  // Nivel 3: Keywords Informacionales y Editoriales
  level3_educational_howto?: string[];
  level3_problem_symptom?: string[];
  level3_seasonal?: string[];

  // Nivel 4: Keywords de Investigación Comercial
  level4_comparative_vs?: string[];
  level4_lists_roundups?: string[];
  level4_review_opinions?: string[];

  // Nivel 5: Keywords de Larga Cola
  level5_longtail_informational?: string[];
  level5_longtail_transactional?: string[];
}
