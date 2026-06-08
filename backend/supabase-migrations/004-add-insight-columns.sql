-- ====================================================================
-- Content Generation System - Insight & Intent Columns
-- Fecha: 2026-06-08
-- Descripción: Agregar campos dinámicos para origen del insight,
--             intención de contenido y SEO local a generaciones
-- ====================================================================

-- ====================================================================
-- 1. ALTER TABLE: io_neruda_generated_contents
-- Agregar 4 columnas nuevas para parámetros estratégicos
-- ====================================================================
ALTER TABLE io_neruda_generated_contents
ADD COLUMN IF NOT EXISTS insight_origin VARCHAR(50),
ADD COLUMN IF NOT EXISTS content_intent VARCHAR(50),
ADD COLUMN IF NOT EXISTS local_geo_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS local_geo_value VARCHAR(200);

-- Comentarios para documentación
COMMENT ON COLUMN io_neruda_generated_contents.insight_origin IS 'Origen del insight para esta generación: direct_idea | keyword_seo | obsidian_drive';
COMMENT ON COLUMN io_neruda_generated_contents.content_intent IS 'Intención estratégica del contenido: educational | transactional | social_proof | thought_leadership';
COMMENT ON COLUMN io_neruda_generated_contents.local_geo_enabled IS 'Flag para indicar si aplica optimización SEO local';
COMMENT ON COLUMN io_neruda_generated_contents.local_geo_value IS 'Ubicación específica para SEO local (ciudad, región, etc)';

-- ====================================================================
-- 2. CREATE INDEXES para queries rápidas
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_generated_insight_origin
ON io_neruda_generated_contents(insight_origin)
WHERE insight_origin IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_generated_content_intent
ON io_neruda_generated_contents(content_intent)
WHERE content_intent IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_generated_local_geo_enabled
ON io_neruda_generated_contents(local_geo_enabled)
WHERE local_geo_enabled = TRUE;

-- ====================================================================
-- 3. VERIFICACIÓN post-migración
-- ====================================================================
-- Ejecutar después de la migración para confirmar:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'io_neruda_generated_contents'
-- AND column_name IN ('insight_origin', 'content_intent', 'local_geo_enabled', 'local_geo_value');
--
-- SELECT COUNT(*) as total_generated FROM io_neruda_generated_contents;
