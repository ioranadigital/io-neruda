-- io-neruda Supabase Schema
-- Run this script in Supabase SQL Editor to create the database tables

-- Projects table
CREATE TABLE io_neruda_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  type text DEFAULT 'blog' CHECK (type IN ('blog', 'ecommerce', 'corporate')),
  wordpress_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contents table (insights, plans, ready-to-publish)
CREATE TABLE io_neruda_contents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES io_neruda_projects(id) ON DELETE CASCADE,
  stage text NOT NULL CHECK (stage IN ('insight', 'plan', 'ready')),
  filename text NOT NULL,
  title text,
  body text,
  frontmatter jsonb DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  word_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, filename)
);

-- Exports table
CREATE TABLE io_neruda_exports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id uuid REFERENCES io_neruda_contents(id) ON DELETE CASCADE,
  project_id uuid REFERENCES io_neruda_projects(id) ON DELETE CASCADE,
  target text NOT NULL CHECK (target IN ('markdown', 'whatsapp', 'html', 'json', 'social', 'email')),
  style text,
  output_path text,
  url text,
  created_at timestamptz DEFAULT now()
);

-- Publications table
CREATE TABLE io_neruda_publications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id uuid REFERENCES io_neruda_contents(id) ON DELETE CASCADE,
  project_id uuid REFERENCES io_neruda_projects(id) ON DELETE CASCADE,
  wordpress_url text,
  wordpress_post_id int,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_io_neruda_contents_project_id ON io_neruda_contents(project_id);
CREATE INDEX idx_io_neruda_contents_stage ON io_neruda_contents(stage);
CREATE INDEX idx_io_neruda_exports_content_id ON io_neruda_exports(content_id);
CREATE INDEX idx_io_neruda_publications_content_id ON io_neruda_publications(content_id);

-- Insert surfvintage project as example
INSERT INTO io_neruda_projects (name, display_name, type, wordpress_url, status, config)
VALUES (
  'surfvintage',
  'SurfVintage - Moda Vintage Sustentable',
  'ecommerce',
  'https://surfvintage.com',
  'active',
  '{"tone": {"primary": "casual_expert", "secondary": "friendly"}, "exporters": {"enabled": ["markdown", "whatsapp", "html", "json", "social", "email"]}}'
);
