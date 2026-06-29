-- ====================================================================
-- Migration 005: Add missing client fields for all 9 form tabs
-- Fecha: 2026-06-19
-- Tabs: Marca, Contenido, Keywords, Competencia, Canales,
--       Referencias, Integración, Métricas, Gestión
-- ====================================================================

ALTER TABLE io_neruda_clients

  -- TabIdentity: long_description faltante
  ADD COLUMN IF NOT EXISTS long_description TEXT,

  -- TabAudience: buyer_personas_list (array of {name, description} objects)
  ADD COLUMN IF NOT EXISTS buyer_personas_list JSONB DEFAULT '[]',

  -- TabContent: keywords básicas faltantes
  ADD COLUMN IF NOT EXISTS keywords_niche TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS keywords_longtail TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS keywords_producto TEXT[] DEFAULT '{}',

  -- TabKeywords: jerarquía semántica completa
  ADD COLUMN IF NOT EXISTS keywords_hierarchical JSONB DEFAULT '{}',

  -- TabIntegration: publicación en LinkedIn y WordPress
  ADD COLUMN IF NOT EXISTS linkedin_connected BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS linkedin_profile_id VARCHAR,
  ADD COLUMN IF NOT EXISTS wordpress_connected BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS wordpress_url VARCHAR,
  ADD COLUMN IF NOT EXISTS wordpress_username VARCHAR,
  ADD COLUMN IF NOT EXISTS publishing_integrations JSONB DEFAULT '[]';

-- ====================================================================
-- Índice para búsquedas en keywords_hierarchical (GIN para JSONB)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_keywords_hierarchical
  ON io_neruda_clients USING GIN (keywords_hierarchical);

CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_buyer_personas_list
  ON io_neruda_clients USING GIN (buyer_personas_list);

-- ====================================================================
-- Verificación post-migración
-- ====================================================================
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'io_neruda_clients'
-- ORDER BY ordinal_position;
