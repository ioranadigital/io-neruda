# 📊 Database Migration Guide — Clientes y Brand Memory

**Versión:** 1.0  
**Fecha:** 2026-06-05  
**Status:** ✅ SQL Validado, Listo para Deployar

---

## 📋 Resumen de Cambios

### Nueva Tabla: `io_neruda_clients`
- ✅ Tabla principal para Brand Memory
- ✅ 13 columnas (identidad, configuración, branding)
- ✅ 3 índices para performance
- ✅ RLS policies para seguridad

### Alter Existente: `io_neruda_content_configurations`
- ✅ Agregar columna `client_id` (foreign key)
- ✅ Crear índice en `client_id`
- ✅ Mantener compatibilidad backward (ON DELETE SET NULL)

### Seed Data
- ✅ 2 clientes de ejemplo (XANELUM, Demo Client)

---

## 🚀 Cómo Aplicar la Migración

### Opción A: Supabase Dashboard (Manual)

1. Abre [Supabase Console](https://app.supabase.com)
2. Navega a tu proyecto
3. Ve a **SQL Editor** → **New Query**
4. Copia el contenido de `002-clients-table.sql`
5. Ejecuta la query
6. Verifica que se completó sin errores

### Opción B: Supabase CLI (Recomendado)

```bash
# Desde la raíz del proyecto
cd E:\git\app\tools\io-neruda

# Aplicar migración
supabase db push

# O manualmente:
supabase db execute --file backend/supabase-migrations/002-clients-table.sql
```

### Opción C: Script Node.js

```bash
cd backend
node execute-sql-fix.js < supabase-migrations/002-clients-table.sql
```

---

## 📐 Esquema Resultante

### Tabla: `io_neruda_clients`

```sql
io_neruda_clients
├── id (UUID, PRIMARY KEY)
├── name (VARCHAR(100), NOT NULL)
├── slug (VARCHAR(100), UNIQUE, NOT NULL)
├── description (TEXT)
├── target_audience (TEXT)
├── default_tone (VARCHAR(50), DEFAULT 'professional')
├── forbidden_keywords (TEXT[], DEFAULT '{}')
├── competitor_urls (TEXT[], DEFAULT '{}')
├── logo_url (TEXT)
├── color_primary (VARCHAR(7))
├── color_secondary (VARCHAR(7))
├── is_active (BOOLEAN, DEFAULT TRUE)
├── created_at (TIMESTAMPTZ, DEFAULT NOW())
└── updated_at (TIMESTAMPTZ, DEFAULT NOW())

INDEXES:
├── idx_clients_slug (UNIQUE lookup)
├── idx_clients_is_active (filtrado por activos)
└── idx_clients_created_at (ordenamiento temporal)
```

### Cambio: `io_neruda_content_configurations`

```sql
io_neruda_content_configurations
├── ... (columnas existentes)
└── client_id (UUID, FOREIGN KEY → io_neruda_clients.id, ON DELETE SET NULL)

INDEX:
└── idx_io_neruda_content_configs_client
```

---

## 🔍 Verificación Post-Migración

### Query 1: Confirmar tabla existe
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'io_neruda_clients';
```
**Resultado esperado:** 1 fila

### Query 2: Ver estructura
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'io_neruda_clients'
ORDER BY ordinal_position;
```
**Resultado esperado:** 14 filas (columnas)

### Query 3: Ver seed data
```sql
SELECT id, name, slug, is_active
FROM io_neruda_clients;
```
**Resultado esperado:** 2 filas (XANELUM, Demo Client)

### Query 4: Ver foreign key
```sql
SELECT column_name, referenced_table_name
FROM information_schema.key_column_usage
WHERE table_name = 'io_neruda_content_configurations' AND column_name = 'client_id';
```
**Resultado esperado:** 1 fila con referencia a `io_neruda_clients`

---

## 🔐 RLS Policies

Actualmente:
- ✅ `Allow all operations on clients` — Permite lectura/escritura sin restricciones

**Futuro (cuando esté auth implementado):**
```sql
-- Permitir lectura de clientes activos
CREATE POLICY "Users can read active clients"
ON clients FOR SELECT
USING (is_active = true);

-- Permitir admin editar
CREATE POLICY "Admins can manage clients"
ON clients FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 📝 Notas Técnicas

### Foreign Key: ON DELETE SET NULL
- Si se elimina un cliente, las configuraciones quedan huérfanas (client_id = NULL)
- Las configuraciones NO se eliminan automáticamente
- Permite auditoría de qué configs estaban vinculadas

### Índices
- **idx_clients_slug:** Búsqueda rápida por slug
- **idx_clients_is_active:** Filtrado rápido de clientes activos
- **idx_clients_created_at DESC:** Ordenamiento temporal (más recientes primero)
- **idx_content_configs_client:** JOIN rápido entre configs y cliente

### Seed Data
- 2 clientes de ejemplo para testing
- Usar `ON CONFLICT (slug) DO NOTHING` para evitar duplicados en re-ejecuciones

---

## 🚨 Rollback (Si algo sale mal)

```sql
-- Remover foreign key y columna
ALTER TABLE content_configurations
DROP COLUMN IF EXISTS client_id;

-- Remover tabla
DROP TABLE IF EXISTS clients CASCADE;
```

---

## ✅ Checklist Post-Deployment

- [ ] Migración ejecutada sin errores
- [ ] Tabla `clients` visible en Supabase console
- [ ] 2 clientes seed data insertados
- [ ] Foreign key en `content_configurations` creada
- [ ] Índices creados (4 índices totales)
- [ ] Queries de verificación ejecutadas exitosamente
- [ ] RLS policies aplicadas
- [ ] Frontend TypeScript tipos sincronizados (ya están)

---

## 📞 Troubleshooting

### Error: "Relation 'clients' already exists"
**Solución:** Usar `CREATE TABLE IF NOT EXISTS` (ya incluido en migración)

### Error: "Column 'client_id' already exists"
**Solución:** Usar `ADD COLUMN IF NOT EXISTS` (ya incluido)

### Error: "Foreign key constraint error"
**Solución:** Verificar que referencia a `clients.id` existe

### Error: "UNIQUE constraint violation on slug"
**Solución:** Seed data usa `ON CONFLICT DO NOTHING` (manejo automático)

---

## 📊 Archivos de Migración

| Archivo | Status | Descripción |
|---------|--------|-------------|
| `001-generators-tables.sql` | ✅ Deployed | Tablas base del sistema |
| `002-clients-table.sql` | ✅ Ready | Clientes y Brand Memory (ESTA) |

---

**Próximos pasos:** Fase 2.1 — Hook para Clientes (`useClients.ts`)
