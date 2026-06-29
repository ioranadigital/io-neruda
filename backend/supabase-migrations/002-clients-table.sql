-- ====================================================================
-- Content Generation System v2.0 - Clients & Brand Memory
-- Fecha: 2026-06-05
-- ====================================================================

-- ====================================================================
-- 1. TABLE: io_neruda_clients
-- Gestión de clientes con Brand Memory (identidad, estilo, ecosistema)
-- ====================================================================
CREATE TABLE IF NOT EXISTS io_neruda_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identidad de marca
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,

  -- Público objetivo
  target_audience TEXT,

  -- Configuración de tono por defecto
  default_tone VARCHAR(50) NOT NULL DEFAULT 'professional',

  -- Restricciones de palabras clave
  forbidden_keywords TEXT[] DEFAULT '{}',
  competitor_urls TEXT[] DEFAULT '{}',

  -- Branding visual
  logo_url TEXT,
  color_primary VARCHAR(7),
  color_secondary VARCHAR(7),

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_slug
ON io_neruda_clients(slug);

CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_is_active
ON io_neruda_clients(is_active);

CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_created_at
ON io_neruda_clients(created_at DESC);

-- ====================================================================
-- 2. ALTER TABLE: io_neruda_content_configurations
-- Agregar relación con io_neruda_clients (Brand Memory)
-- ====================================================================
ALTER TABLE io_neruda_content_configurations
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES io_neruda_clients(id) ON DELETE SET NULL;

-- Índice para queries por cliente
CREATE INDEX IF NOT EXISTS idx_io_neruda_content_configs_client
ON io_neruda_content_configurations(client_id);

-- ====================================================================
-- 3. RLS POLICIES (Row Level Security)
-- ====================================================================
ALTER TABLE io_neruda_clients ENABLE ROW LEVEL SECURITY;

-- Policy: io_neruda_clients (para ahora sin auth, permitir todo)
DO $$
BEGIN
  CREATE POLICY "Allow all operations on io_neruda_clients"
  ON io_neruda_clients FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- ====================================================================
-- 4. COMENTARIOS (Documentación en BD)
-- ====================================================================
COMMENT ON TABLE io_neruda_clients IS 'Clientes del sistema con Brand Memory: identidad, estilo, ecosistema y restricciones';

COMMENT ON COLUMN io_neruda_clients.id IS 'UUID único del cliente';
COMMENT ON COLUMN io_neruda_clients.name IS 'Nombre visible del cliente';
COMMENT ON COLUMN io_neruda_clients.slug IS 'Identificador único (URL-safe) del cliente';
COMMENT ON COLUMN io_neruda_clients.description IS 'Descripción de la marca/cliente';
COMMENT ON COLUMN io_neruda_clients.target_audience IS 'Público objetivo (texto libre para referencia)';
COMMENT ON COLUMN io_neruda_clients.default_tone IS 'Tono por defecto para generaciones: professional, friendly, technical, custom';
COMMENT ON COLUMN io_neruda_clients.forbidden_keywords IS 'Array de palabras prohibidas en contenidos generados';
COMMENT ON COLUMN io_neruda_clients.competitor_urls IS 'Array de URLs de competidores para análisis de benchmarking';
COMMENT ON COLUMN io_neruda_clients.logo_url IS 'URL del logo de la marca';
COMMENT ON COLUMN io_neruda_clients.color_primary IS 'Color primario en formato hex (#RRGGBB)';
COMMENT ON COLUMN io_neruda_clients.color_secondary IS 'Color secundario en formato hex (#RRGGBB)';
COMMENT ON COLUMN io_neruda_clients.is_active IS 'Flag de activación: clientes inactivos no aparecen en selector';

COMMENT ON COLUMN io_neruda_content_configurations.client_id IS 'Foreign key a io_neruda_clients(id) - identifica a qué cliente pertenece esta configuración';

-- ====================================================================
-- 5. SEED DATA (Clientes de ejemplo para testing)
-- ====================================================================
INSERT INTO io_neruda_clients (name, slug, description, target_audience, default_tone, is_active)
VALUES
  ('XANELUM', 'xanelum', 'Agencia digital especializada en SEO y content marketing', 'Agencias digitales, consultores', 'professional', TRUE),
  ('Demo Client', 'demo-client', 'Cliente de demostración del sistema', 'Equipo de QA', 'friendly', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ====================================================================
-- 6. VERIFICACIÓN
-- ====================================================================
-- Ejecutar después de la migración para confirmar:
-- SELECT COUNT(*) as total_clients FROM io_neruda_clients;
-- SELECT COUNT(*) as total_configs FROM io_neruda_content_configurations WHERE client_id IS NOT NULL;
