-- ====================================================================
-- Content Generation System v2.0 - Supabase Migrations (FIXED)
-- Fecha: 2026-06-04
-- FIX: Orden correcto + Prefijo io_neruda_
-- ====================================================================

-- ====================================================================
-- 1. TABLE: io_neruda_email_templates (PRIMERO - sin FKs hacia otras)
-- Sistema de Email Templates reutilizables
-- ====================================================================
CREATE TABLE IF NOT EXISTS io_neruda_email_templates (
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

CREATE INDEX IF NOT EXISTS idx_io_neruda_email_templates_project
ON io_neruda_email_templates(project_id);

CREATE INDEX IF NOT EXISTS idx_io_neruda_email_templates_category
ON io_neruda_email_templates(category);

CREATE INDEX IF NOT EXISTS idx_io_neruda_email_templates_is_system
ON io_neruda_email_templates(is_system);

-- ====================================================================
-- 2. TABLE: io_neruda_batch_jobs (SEGUNDO - depende solo de io_neruda_projects)
-- Control de generación en lote
-- ====================================================================
CREATE TABLE IF NOT EXISTS io_neruda_batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES io_neruda_projects(id) ON DELETE CASCADE,

  -- Configuración del batch
  config_id UUID,
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

CREATE INDEX IF NOT EXISTS idx_io_neruda_batch_jobs_project
ON io_neruda_batch_jobs(project_id);

CREATE INDEX IF NOT EXISTS idx_io_neruda_batch_jobs_status
ON io_neruda_batch_jobs(status);

-- ====================================================================
-- 3. TABLE: io_neruda_content_configurations (TERCERO)
-- Guardar configuraciones reutilizables de generación
-- ====================================================================
CREATE TABLE IF NOT EXISTS io_neruda_content_configurations (
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

  -- Email Template Selection (ahora io_neruda_email_templates existe)
  email_template_id UUID REFERENCES io_neruda_email_templates(id),

  -- Metadata
  is_template BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_io_neruda_content_configs_project
ON io_neruda_content_configurations(project_id);

CREATE INDEX IF NOT EXISTS idx_io_neruda_content_configs_is_template
ON io_neruda_content_configurations(is_template);

-- Ahora agregamos FK a io_neruda_batch_jobs.config_id
ALTER TABLE io_neruda_batch_jobs
ADD CONSTRAINT fk_io_neruda_batch_jobs_config_id
FOREIGN KEY (config_id) REFERENCES io_neruda_content_configurations(id) ON DELETE SET NULL;

-- ====================================================================
-- 4. TABLE: io_neruda_generated_contents (CUARTO)
-- Guardar contenidos generados en múltiples formatos
-- ====================================================================
CREATE TABLE IF NOT EXISTS io_neruda_generated_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  content_id UUID NOT NULL REFERENCES io_neruda_contents(id) ON DELETE CASCADE,
  config_id UUID REFERENCES io_neruda_content_configurations(id),
  batch_job_id UUID REFERENCES io_neruda_batch_jobs(id),

  -- Contenido generado
  format VARCHAR(50) NOT NULL,
  generated_text TEXT NOT NULL,

  -- Para emails: referencia al template usado
  email_template_id UUID REFERENCES io_neruda_email_templates(id),

  -- Metadata de generación
  keywords_used TEXT[],
  tone_applied VARCHAR(50),
  word_count INTEGER,
  keyword_density FLOAT,

  -- Versioning
  version INTEGER DEFAULT 1,
  is_alternative BOOLEAN DEFAULT FALSE,
  parent_generation_id UUID REFERENCES io_neruda_generated_contents(id),

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

CREATE INDEX IF NOT EXISTS idx_io_neruda_generated_contents_content
ON io_neruda_generated_contents(content_id);

CREATE INDEX IF NOT EXISTS idx_io_neruda_generated_contents_format
ON io_neruda_generated_contents(format);

CREATE INDEX IF NOT EXISTS idx_io_neruda_generated_contents_status
ON io_neruda_generated_contents(status);

CREATE INDEX IF NOT EXISTS idx_io_neruda_generated_contents_batch
ON io_neruda_generated_contents(batch_job_id);

-- ====================================================================
-- RLS POLICIES (Row Level Security)
-- ====================================================================

ALTER TABLE io_neruda_content_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE io_neruda_generated_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE io_neruda_batch_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE io_neruda_email_templates ENABLE ROW LEVEL SECURITY;

-- Para desarrollo: permitir todo
CREATE POLICY "Allow all operations on io_neruda_content_configurations"
ON io_neruda_content_configurations FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on io_neruda_generated_contents"
ON io_neruda_generated_contents FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on io_neruda_batch_jobs"
ON io_neruda_batch_jobs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on io_neruda_email_templates"
ON io_neruda_email_templates FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- INSERTS: Email Templates del Sistema (Seeds)
-- ====================================================================
INSERT INTO io_neruda_email_templates (name, category, template_type, template_body, is_system) VALUES
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
-- COMENTARIOS (Documentación en BD)
-- ====================================================================
COMMENT ON TABLE io_neruda_content_configurations IS 'Configuraciones reutilizables para generar contenidos en múltiples formatos';
COMMENT ON TABLE io_neruda_generated_contents IS 'Contenidos generados con IA, una fila por formato/versión';
COMMENT ON TABLE io_neruda_email_templates IS 'Templates base para generar emails con estructura consistente';
COMMENT ON TABLE io_neruda_batch_jobs IS 'Jobs de generación en lote, permite procesar múltiples Plans en paralelo';

COMMENT ON COLUMN io_neruda_content_configurations.enabled_formats IS 'JSON: {blog: bool, email: bool, social_linkedin: bool, etc}';
COMMENT ON COLUMN io_neruda_generated_contents.status IS 'draft | approved | published | archived';
COMMENT ON COLUMN io_neruda_batch_jobs.status IS 'pending | processing | partial | completed | failed';
