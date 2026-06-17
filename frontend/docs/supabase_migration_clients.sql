-- Create io_neruda_clients table
CREATE TABLE IF NOT EXISTS io_neruda_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  target_audience TEXT,
  default_tone TEXT DEFAULT 'professional',
  forbidden_keywords TEXT[] DEFAULT '{}',
  competitor_urls TEXT[] DEFAULT '{}',
  logo_url TEXT,
  color_primary TEXT,
  color_secondary TEXT,
  buyer_personas_list JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_slug ON io_neruda_clients(slug);
CREATE INDEX IF NOT EXISTS idx_io_neruda_clients_is_active ON io_neruda_clients(is_active);

-- Enable Row Level Security
ALTER TABLE io_neruda_clients ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (anon key)
CREATE POLICY "Allow read access for all"
  ON io_neruda_clients
  FOR SELECT
  USING (true);

-- Allow anyone to insert/update (anon key)
CREATE POLICY "Allow insert/update for all"
  ON io_neruda_clients
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update for all"
  ON io_neruda_clients
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert initial data (Surfvintage and Esgarden)
INSERT INTO io_neruda_clients (
  id, name, slug, description, target_audience, default_tone,
  logo_url, color_primary, color_secondary, is_active,
  created_at, updated_at, buyer_personas_list
) VALUES
(
  '5',
  'Surfvintage',
  'surfvintage',
  'Tienda online especializada en ropa vintage auténtica de los años 70-90 y artículos de surf clásicos.',
  'Millennials nostálgicos, Gen-Z fashionistas, coleccionistas de vintage, surfistas clásicos',
  'friendly',
  'https://surfvintage.com/logo-surfvintage.svg',
  '#FF6B6B',
  '#FFD93D',
  true,
  '2026-06-08T00:00:00Z',
  '2026-06-09T00:00:00Z',
  '[
    {"name": "Nostálgico Millennial", "description": "Edad 25-35, profesional establecido, busca recrear looks de infancia, valora autenticidad y rareza"},
    {"name": "Influencer de Moda Alternativa", "description": "Edad 18-32, creador de contenido, compra para TikTok/Instagram, busca prendas únicas"},
    {"name": "Coleccionista Experto", "description": "Edad 35-60, coleccionista serio, experto en épocas y marcas, busca ediciones limitadas"},
    {"name": "Surfista Clásico Entusiasta", "description": "Edad 28-45, apasionado de cultura surf, busca tablas y wetsuits vintage"}
  ]'::jsonb
),
(
  '6',
  'Esgarden',
  'esgarden',
  'Tienda online especializada en soluciones premium para jardines, terrazas y espacios exteriores.',
  'Propietarios de vivienda, gestores de comunidades, profesionales del interiorismo y paisajismo',
  'professional',
  'https://esgarden.es/logo-esgarden.svg',
  '#2BBF4B',
  '#8BC34A',
  true,
  '2026-06-08T00:00:00Z',
  '2026-06-09T00:00:00Z',
  '[
    {"name": "Propietario de Casa Premium", "description": "Edad 38-55, con casa propia de €400k+, busca mejorar y embellecer jardín/terraza"},
    {"name": "Gestor de Comunidad Residencial", "description": "Edad 45-65, responsable de espacios comunes en fincas, requiere proveedores B2B"},
    {"name": "Profesional Interiorista / Paisajista", "description": "Edad 28-50, recomienda a clientes, busca catálogo pro, márgenes mayoristas"},
    {"name": "Restaurador / Dueño Hostelería", "description": "Edad 35-60, equipa terrazas de bares/restaurantes, necesita durabilidad"}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
