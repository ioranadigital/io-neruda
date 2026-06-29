# Sincronizar ESGARDEN a Supabase

ESGARDEN está en localStorage pero necesita estar en Supabase.

## Opción 1: Sincronización automática (Recomendado)

1. Abre http://localhost:3003
2. Ve a **Clientes** → busca **ESGARDEN**
3. Haz cualquier cambio (ej: edita el buyer persona)
4. Haz click en **"Guardar Cambios"**
5. ✅ ESGARDEN se guardará automáticamente en Supabase

## Opción 2: SQL directo (si quieres migrar ya)

Ejecuta en Supabase SQL Editor:

```sql
INSERT INTO io_neruda_clients (
  id, name, slug, description, target_audience, 
  default_tone, forbidden_keywords, competitor_urls, 
  logo_url, color_primary, color_secondary, 
  buyer_personas_list, is_active, created_at, updated_at
) VALUES (
  '6',
  'Esgarden',
  'esgarden',
  'E-Commerce | Tienda de Artículos para Exterior y Jardinería',
  'Propietarios de vivienda, gestores de comunidades, profesionales del interiorismo y paisajismo, restauradores y dueños de hostelería, constructores, diseñadores',
  'professional',
  '[]'::jsonb,
  '[]'::jsonb,
  '',
  '',
  '',
  '[{"name":"Propietario de Casa Premium","description":"Edad 38-55, con casa propia de €400k+, busca mejorar y embellecer jardín/terraza, presupuesto €3k-€15k/proyecto, valora calidad y longevidad, presente en Redes (Facebook, Pinterest), influenciable por fotografías antes/después"},{"name":"Gestor de Comunidad Residencial","description":"Edad 45-65, responsable de espacios comunes en fincas, requiere proveedores B2B, presupuesto €10k-€50k/local, presión en rentabilidad, requiere facilidad de mantenimiento y garantías"},{"name":"Professional Interiorista / Paisajista","description":"Edad 28-50, recomiendan a clientes, busca catálogo pro, márgenes mayoristas, presupuesto sin límite superior, busca novedades, sensible a precios competitivos, presente en redes profesionales"},{"name":"Restaurador / Dueño Hostelería","description":"Edad 35-60, equipa terrazas de bares/restaurantes, necesita durabilidad y fácil mantenimiento, presupuesto €2k-€20k/local, presión en rentabilidad, requiere facilidad de mantenimiento y garantías"}]'::jsonb,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = 'Esgarden',
  slug = 'esgarden',
  description = 'E-Commerce | Tienda de Artículos para Exterior y Jardinería',
  target_audience = 'Propietarios de vivienda, gestores de comunidades, profesionales del interiorismo y paisajismo, restauradores y dueños de hostelería, constructores, diseñadores',
  default_tone = 'professional',
  buyer_personas_list = '[{"name":"Propietario de Casa Premium","description":"Edad 38-55, con casa propia de €400k+, busca mejorar y embellecer jardín/terraza, presupuesto €3k-€15k/proyecto, valora calidad y longevidad, presente en Redes (Facebook, Pinterest), influenciable por fotografías antes/después"},{"name":"Gestor de Comunidad Residencial","description":"Edad 45-65, responsable de espacios comunes en fincas, requiere proveedores B2B, presupuesto €10k-€50k/local, presión en rentabilidad, requiere facilidad de mantenimiento y garantías"},{"name":"Professional Interiorista / Paisajista","description":"Edad 28-50, recomiendan a clientes, busca catálogo pro, márgenes mayoristas, presupuesto sin límite superior, busca novedades, sensible a precios competitivos, presente en redes profesionales"},{"name":"Restaurador / Dueño Hostelería","description":"Edad 35-60, equipa terrazas de bares/restaurantes, necesita durabilidad y fácil mantenimiento, presupuesto €2k-€20k/local, presión en rentabilidad, requiere facilidad de mantenimiento y garantías"}]'::jsonb,
  updated_at = NOW();
```

## Verificar en Supabase

1. Ve a **Database** → **io_neruda_clients**
2. Busca **Esgarden** (ID: 6)
3. Verifica que `buyer_personas_list` tenga los 4 buyer personas

## Próximos pasos

Una vez que ESGARDEN esté en Supabase:
1. Abre http://localhost:3003
2. Edita ESGARDEN
3. Los cambios se guardarán automáticamente en Supabase ✅
