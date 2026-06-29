-- Create clients table in Supabase
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  business_type TEXT,
  website_url TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,

  -- Audience & Market
  target_audience TEXT,
  buyer_personas TEXT,
  buyer_personas_list JSONB,
  avg_age INTEGER,
  income_level TEXT,
  target_industries TEXT[],
  problems_solved TEXT[],
  unique_proposition TEXT,
  success_case TEXT,

  -- Brand & Voice
  brand_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  color_palette TEXT[],
  typography TEXT,
  brand_voice TEXT,
  brand_story TEXT,
  brand_values TEXT[],
  default_tone TEXT DEFAULT 'professional',

  -- Content & SEO
  keywords_niche TEXT[],
  keywords_longtail TEXT[],
  keywords_producto TEXT[],
  content_pillars TEXT[],
  forbidden_keywords TEXT[],
  publication_frequency TEXT,
  supported_languages TEXT[],
  meta_description_template TEXT,
  avg_word_count INTEGER,
  tone_varies_by_channel BOOLEAN,

  -- Keywords Hierarchical Structure
  keywords_hierarchical JSONB,

  -- Competition & Positioning
  competitor_urls TEXT[],
  competitive_advantages TEXT[],
  differentiators TEXT[],
  market_positioning TEXT,
  monitor_competitors BOOLEAN,

  -- Channels & Distribution
  channel_blog BOOLEAN DEFAULT FALSE,
  channel_email BOOLEAN DEFAULT FALSE,
  channel_linkedin BOOLEAN DEFAULT FALSE,
  channel_instagram BOOLEAN DEFAULT FALSE,
  channel_twitter BOOLEAN DEFAULT FALSE,
  channel_tiktok BOOLEAN DEFAULT FALSE,
  channel_youtube BOOLEAN DEFAULT FALSE,
  newsletter_enabled BOOLEAN DEFAULT FALSE,
  newsletter_subscribers INTEGER,
  social_media_handles JSONB,
  preferred_formats TEXT[],

  -- References & Context
  reference_sites TEXT[],
  competitor_study_urls TEXT[],
  successful_content_urls TEXT[],
  resources_urls TEXT[],
  internal_docs_url TEXT,

  -- Integration & Tools
  crm_platform TEXT,
  analytics_tool TEXT,
  email_platform TEXT,
  integrations TEXT[],
  tech_stack TEXT,

  -- Publishing Integrations
  linkedin_connected BOOLEAN DEFAULT FALSE,
  linkedin_profile_id TEXT,
  wordpress_connected BOOLEAN DEFAULT FALSE,
  wordpress_url TEXT,
  wordpress_username TEXT,
  publishing_integrations JSONB,

  -- Metrics & KPIs
  main_objective TEXT,
  main_kpi TEXT,
  conversion_goal TEXT,
  monthly_budget DECIMAL,
  team_size INTEGER,
  project_timeline TEXT,

  -- Management
  internal_notes TEXT,
  client_status TEXT DEFAULT 'active',
  start_date TIMESTAMP,
  next_review TIMESTAMP,
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  account_manager_id TEXT,

  -- System
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read and write
CREATE POLICY "Enable all access" ON clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index on slug for faster lookups
CREATE INDEX idx_clients_slug ON clients(slug);
CREATE INDEX idx_clients_is_active ON clients(is_active);

COMMIT;
