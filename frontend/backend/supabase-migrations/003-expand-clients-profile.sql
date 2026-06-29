-- Expand io_neruda_clients table with comprehensive client profile fields
-- Migration: 003-expand-clients-profile.sql
-- Date: 2026-06-06

-- ALTER TABLE io_neruda_clients ADD COLUMNS
ALTER TABLE io_neruda_clients
ADD COLUMN IF NOT EXISTS business_type VARCHAR,
ADD COLUMN IF NOT EXISTS website_url VARCHAR,
ADD COLUMN IF NOT EXISTS country VARCHAR,
ADD COLUMN IF NOT EXISTS phone VARCHAR,
ADD COLUMN IF NOT EXISTS email VARCHAR,
ADD COLUMN IF NOT EXISTS buyer_personas TEXT,
ADD COLUMN IF NOT EXISTS avg_age INTEGER,
ADD COLUMN IF NOT EXISTS income_level VARCHAR,
ADD COLUMN IF NOT EXISTS target_industries TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS problems_solved TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS unique_proposition TEXT,
ADD COLUMN IF NOT EXISTS success_case TEXT,
ADD COLUMN IF NOT EXISTS brand_name VARCHAR,
ADD COLUMN IF NOT EXISTS tagline VARCHAR,
ADD COLUMN IF NOT EXISTS color_palette TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS typography VARCHAR,
ADD COLUMN IF NOT EXISTS brand_voice TEXT,
ADD COLUMN IF NOT EXISTS brand_story TEXT,
ADD COLUMN IF NOT EXISTS brand_values TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS content_pillars TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS publication_frequency VARCHAR,
ADD COLUMN IF NOT EXISTS supported_languages TEXT[] DEFAULT '{es,en}',
ADD COLUMN IF NOT EXISTS meta_description_template TEXT,
ADD COLUMN IF NOT EXISTS avg_word_count INTEGER DEFAULT 1500,
ADD COLUMN IF NOT EXISTS tone_varies_by_channel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS competitive_advantages TEXT[],
ADD COLUMN IF NOT EXISTS differentiators TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS market_positioning VARCHAR,
ADD COLUMN IF NOT EXISTS monitor_competitors BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS channel_blog BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS channel_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS channel_linkedin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS channel_instagram BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS channel_twitter BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS channel_tiktok BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS channel_youtube BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_subscribers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS social_media_handles JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_formats TEXT[] DEFAULT '{blog,email}',
ADD COLUMN IF NOT EXISTS reference_sites TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS competitor_study_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS successful_content_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resources_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS internal_docs_url VARCHAR,
ADD COLUMN IF NOT EXISTS crm_platform VARCHAR,
ADD COLUMN IF NOT EXISTS analytics_tool VARCHAR,
ADD COLUMN IF NOT EXISTS email_platform VARCHAR,
ADD COLUMN IF NOT EXISTS integrations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tech_stack TEXT,
ADD COLUMN IF NOT EXISTS main_objective TEXT,
ADD COLUMN IF NOT EXISTS main_kpi VARCHAR,
ADD COLUMN IF NOT EXISTS conversion_goal TEXT,
ADD COLUMN IF NOT EXISTS monthly_budget DECIMAL,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS project_timeline VARCHAR,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS client_status VARCHAR DEFAULT 'active',
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS next_review DATE,
ADD COLUMN IF NOT EXISTS primary_contact_name VARCHAR,
ADD COLUMN IF NOT EXISTS primary_contact_email VARCHAR,
ADD COLUMN IF NOT EXISTS account_manager_id UUID;

-- Create index for client_status
CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_status ON io_neruda_clients(client_status);
CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_start_date ON io_neruda_clients(start_date);

-- Update RLS policy to allow updates to all columns
CREATE POLICY "Enable all operations for authenticated users" ON io_neruda_clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Commit message
-- Expanded io_neruda_clients with comprehensive client profile fields:
-- - Business info (type, website, location, contact)
-- - Audience (personas, demographics, target industries)
-- - Brand (voice, story, values, visual identity)
-- - Content strategy (pillars, keywords, frequency, formats)
-- - Competitive analysis (positioning, advantages, differentiators)
-- - Distribution channels (blog, email, social platforms)
-- - References and integrations (tools, APIs, stack)
-- - Metrics and KPIs (objectives, conversion goals, budget)
-- - Management (status, dates, contacts, account manager)
