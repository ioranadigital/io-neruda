-- ====================================================================
-- Content Generation System v2.0 - Supabase Migrations
-- Fecha: 2026-06-04
-- ====================================================================

-- ====================================================================
-- 1. TABLE: content_configurations
-- Guardar configuraciones reutilizables de generación
-- ====================================================================
CREATE TABLE IF NOT EXISTS content_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES io_neruda_projects(id) ON DELETE CASCADE,

  name VARCHAR(100) NOT NULL,
  description TEXT,

  -- Keywords
  keywords_niche TEXT[] NOT NULL DEFAULT '{}',
  keywords_longtail TEXT[] DEFAULT '{}',

  -- Tone
  tone VARCHAR(50) NOT NULL DEFAULT 'professional',
  tone_custom_text TEXT,

  -- Enabled Formats
  enabled_formats JSONB NOT NULL DEFAULT '{
    "blog": false,
    "email": false,
    "social_linkedin": false,
    "social_instagram": false,
    "whatsapp": false,
    "pdf": false
  }',

  -- Email Template Selection
  email_template_id UUID REFERENCES email_templates(id),

  -- Metadata
  is_template BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_content_configs_project
ON content_configurations(project_id);

CREATE INDEX IF NOT EXISTS idx_content_configs_is_template
ON content_configurations(is_template);

-- ====================================================================
-- 2. TABLE: generated_contents
-- Guardar contenidos generados en múltiples formatos
-- ====================================================================
CREATE TABLE IF NOT EXISTS generated_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  content_id UUID NOT NULL REFERENCES io_neruda_contents(id) ON DELETE CASCADE,
  config_id UUID REFERENCES content_configurations(id),
  batch_job_id UUID REFERENCES batch_jobs(id),

  -- Contenido generado
  format VARCHAR(50) NOT NULL,
  generated_text TEXT NOT NULL,

  -- Para emails: referencia al template usado
  email_template_id UUID REFERENCES email_templates(id),

  -- Metadata de generación
  keywords_used TEXT[],
  tone_applied VARCHAR(50),
  word_count INTEGER,
  keyword_density FLOAT,

  -- Versioning
  version INTEGER DEFAULT 1,
  is_alternative BOOLEAN DEFAULT FALSE,
  parent_generation_id UUID REFERENCES generated_contents(id),

  -- Status
  status VARCHAR(20) DEFAULT 'draft',

  -- IA tracking
  ai_model VARCHAR(50),
  ai_prompt_hash VARCHAR(64),
  generation_time_ms INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_generated_contents_content
ON generated_contents(content_id);

CREATE INDEX IF NOT EXISTS idx_generated_contents_format
ON generated_contents(format);

CREATE INDEX IF NOT EXISTS idx_generated_contents_status
ON generated_contents(status);

CREATE INDEX IF NOT EXISTS idx_generated_contents_batch
ON generated_contents(batch_job_id);

-- ====================================================================
-- 3. TABLE: email_templates
-- Sistema de Email Templates reutilizables
-- ====================================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id UUID REFERENCES io_neruda_projects(id),

  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,

  -- Estructura del email (MJML o HTML)
  template_type VARCHAR(20) NOT NULL DEFAULT 'mjml',
  template_body TEXT NOT NULL,

  -- Configuración visual
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  font_family VARCHAR(50) DEFAULT 'Inter, sans-serif',

  -- Metadatos
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  preview_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_project
ON email_templates(project_id);

CREATE INDEX IF NOT EXISTS idx_email_templates_category
ON email_templates(category);

CREATE INDEX IF NOT EXISTS idx_email_templates_is_system
ON email_templates(is_system);

-- ====================================================================
-- 4. TABLE: batch_jobs
-- Control de generación en lote
-- ====================================================================
CREATE TABLE IF NOT EXISTS batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES io_neruda_projects(id) ON DELETE CASCADE,

  -- Configuración del batch
  config_id UUID REFERENCES content_configurations(id),
  content_ids UUID[] NOT NULL,

  -- Status del batch
  status VARCHAR(20) DEFAULT 'pending',

  total_items INTEGER NOT NULL,
  processed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,

  -- Resultados por item
  results JSONB DEFAULT '[]',

  -- Control de concurrencia
  concurrency_limit INTEGER DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_batch_jobs_project
ON batch_jobs(project_id);

CREATE INDEX IF NOT EXISTS idx_batch_jobs_status
ON batch_jobs(status);

-- ====================================================================
-- INSERTS: Email Templates del Sistema (Seeds)
-- ====================================================================
INSERT INTO email_templates (name, category, template_type, template_body, is_system) VALUES
(
  'Newsletter Estándar',
  'newsletter',
  'mjml',
  '<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-size="20px" font-weight="bold">{{subject}}</mj-text>
          <mj-divider border-color="#E0E0E0"></mj-divider>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text>{{greeting}}</mj-text>
          <mj-text>{{body_intro}}</mj-text>
          <mj-text>{{body_main}}</mj-text>
          <mj-button href="{{cta_url}}">{{cta_text}}</mj-button>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text font-size="12px" color="#999">{{signature}}</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>',
  TRUE
),
(
  'Email de Bienvenida',
  'welcome',
  'mjml',
  '<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-size="24px" font-weight="bold">¡Bienvenido!</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text>{{body_main}}</mj-text>
          <mj-button href="{{cta_url}}">{{cta_text}}</mj-button>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>',
  TRUE
),
(
  'Email Promocional',
  'promotional',
  'mjml',
  '<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-size="18px" font-weight="bold" color="#FF6B35">{{subject}}</mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text>{{body_main}}</mj-text>
          <mj-button href="{{cta_url}}" background-color="#FF6B35">{{cta_text}}</mj-button>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>',
  TRUE
),
(
  'Resumen Semanal',
  'newsletter',
  'mjml',
  '<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text font-size="20px" font-weight="bold">Resumen Semanal</mj-text>
          <mj-divider border-color="#E0E0E0"></mj-divider>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text>{{body_main}}</mj-text>
          <mj-button href="{{cta_url}}">{{cta_text}}</mj-button>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>',
  TRUE
)
ON CONFLICT DO NOTHING;

-- ====================================================================
-- RLS POLICIES (Row Level Security)
-- ====================================================================

-- Permitir lectura/escritura según project_id
ALTER TABLE content_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Policy: content_configurations (para ahora sin auth, permitir todo)
CREATE POLICY "Allow all operations on content_configurations"
ON content_configurations FOR ALL USING (true) WITH CHECK (true);

-- Policy: generated_contents
CREATE POLICY "Allow all operations on generated_contents"
ON generated_contents FOR ALL USING (true) WITH CHECK (true);

-- Policy: batch_jobs
CREATE POLICY "Allow all operations on batch_jobs"
ON batch_jobs FOR ALL USING (true) WITH CHECK (true);

-- Policy: email_templates
CREATE POLICY "Allow all operations on email_templates"
ON email_templates FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- COMENTARIOS (Documentación en BD)
-- ====================================================================
COMMENT ON TABLE content_configurations IS 'Configuraciones reutilizables para generar contenidos en múltiples formatos';
COMMENT ON TABLE generated_contents IS 'Contenidos generados con IA, una fila por formato/versión';
COMMENT ON TABLE email_templates IS 'Templates base para generar emails con estructura consistente';
COMMENT ON TABLE batch_jobs IS 'Jobs de generación en lote, permite procesar múltiples Plans en paralelo';

COMMENT ON COLUMN content_configurations.enabled_formats IS 'JSON: {blog: bool, email: bool, social_linkedin: bool, etc}';
COMMENT ON COLUMN generated_contents.status IS 'draft | approved | published | archived';
COMMENT ON COLUMN batch_jobs.status IS 'pending | processing | partial | completed | failed';
