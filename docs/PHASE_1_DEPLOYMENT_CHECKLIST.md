# ✅ PHASE 1 DEPLOYMENT CHECKLIST

**Status:** ✅ Frontend (1.1) COMPLETADA | ⏳ Backend (1.2) LISTO PARA APLICAR

---

## 📋 FASE 1.1 — FRONTEND (Ya Completada)

| Item | Status | Notas |
|------|--------|-------|
| Tipos de Cliente | ✅ `src/types/client.ts` creado | 5 interfaces + comentarios |
| GeneratorContext extendido | ✅ Agregadas 4 acciones | SET/ADD/SELECT/UPDATE_CLIENT |
| GeneratorState actualizado | ✅ 3 campos nuevos | clients, currentClientId, selectedClient |
| TypeScript validation | ✅ PASS | 0 errors, 0 warnings |
| ESLint | ✅ PASS | 0 errors, 0 warnings |
| Dev Server | ✅ RUNNING | Puerto 3003 responsive |

---

## 📊 FASE 1.2 — DATABASE (Listo para Deploy)

### Pre-Deployment Checklist

- [ ] Respaldar base de datos actual (IMPORTANTE)
  ```bash
  # En Supabase Console: Project Settings → Backups
  # O via CLI: supabase db pull
  ```

- [ ] Verificar que tienes acceso a Supabase
  - [ ] Project ID disponible
  - [ ] Credenciales actualizadas
  - [ ] Supabase CLI instalado (si usas CLI)

- [ ] Revisar archivo de migración
  ```bash
  cat backend/supabase-migrations/002-clients-table.sql
  # Verificar que se ve correcto
  ```

### Aplicar Migración (Elige 1 opción)

#### Opción A: Supabase Dashboard (Más seguro)
- [ ] Ir a https://app.supabase.com
- [ ] Seleccionar tu proyecto
- [ ] SQL Editor → New Query
- [ ] Copiar contenido de `002-clients-table.sql`
- [ ] Ejecutar
- [ ] Verificar resultado (sin errores)

#### Opción B: Supabase CLI
```bash
cd E:\git\app\tools\io-neruda
supabase db push
# O específicamente:
supabase db execute --file backend/supabase-migrations/002-clients-table.sql
```

- [ ] Comando ejecutado
- [ ] Output sin errores
- [ ] Confirmar con queries de verificación

#### Opción C: Node.js Script
```bash
cd backend
node execute-sql-fix.js < supabase-migrations/002-clients-table.sql
```

- [ ] Script ejecutado
- [ ] Confirmar en Supabase Console

### Post-Deployment Verification

Ejecutar estas queries en Supabase SQL Editor:

- [ ] **Query 1: Confirmar tabla existe**
  ```sql
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_name = 'clients';
  ```
  Resultado esperado: 1 fila

- [ ] **Query 2: Confirmar estructura**
  ```sql
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'clients'
  ORDER BY ordinal_position;
  ```
  Resultado esperado: 14 columnas

- [ ] **Query 3: Confirmar seed data**
  ```sql
  SELECT id, name, slug, is_active
  FROM clients;
  ```
  Resultado esperado: 2 filas (XANELUM, Demo Client)

- [ ] **Query 4: Confirmar foreign key**
  ```sql
  SELECT column_name, referenced_table_name
  FROM information_schema.key_column_usage
  WHERE table_name = 'content_configurations' 
  AND column_name = 'client_id';
  ```
  Resultado esperado: 1 fila

- [ ] **Query 5: Test insert** (Opcional)
  ```sql
  INSERT INTO clients (name, slug, default_tone, is_active)
  VALUES ('Test Client', 'test-client', 'friendly', true);
  
  SELECT COUNT(*) as total FROM clients;
  ```
  Resultado esperado: count = 3 (including seed data)

---

## 🔧 Troubleshooting During Deployment

| Problema | Solución |
|----------|----------|
| "Relation 'clients' already exists" | Migración ya fue aplicada (safe) |
| "Column 'client_id' already exists" | ALTER TABLE ya ejecutado (safe) |
| "Foreign key constraint error" | Verificar que clients.id existe |
| "UNIQUE constraint violation on slug" | Seed data intenta insertar duplicado (normal, manejado con ON CONFLICT) |
| "RLS policy error" | Asegúrate que RLS está habilitado en tabla |

---

## 📋 Si Algo Sale Mal (Rollback)

```sql
-- Remover la columna client_id
ALTER TABLE content_configurations
DROP COLUMN IF EXISTS client_id;

-- Remover la tabla clients
DROP TABLE IF EXISTS clients CASCADE;
```

---

## ✅ FASE 1 COMPLETE

Una vez completado:

- [ ] Migración aplicada en Supabase
- [ ] Todas las queries de verificación ejecutadas exitosamente
- [ ] Base de datos actualizada
- [ ] Frontend (TypeScript) ya está listo

**Status General:**
```
FASE 1.1 — Frontend:  ✅ DONE (TypeScript + Context)
FASE 1.2 — Database:  ⏳ PENDING (Espera deploying SQL)
```

---

## 🚀 SIGUIENTE PASO

Después de aplicar la migración, proceder con:

**FASE 2.1 — Hook para Clientes**
- Archivo: `src/hooks/useClients.ts`
- Métodos: getClients, createClient, selectClient, updateClientBrandMemory
- Integración: Supabase API calls + GeneratorContext

**Estimado:** 20-30 minutos

---

## 📞 Preguntas?

- ¿Cómo restaurar si algo sale mal? → Ver Rollback section
- ¿Cuál es la mejor forma de aplicar? → Recomendamos Opción A (Dashboard) por seguridad
- ¿Qué pasa si migración falla a mitad? → Supabase automáticamente rollback
- ¿Necesito hacer cambios en el código frontend? → No, ya está hecho en Phase 1.1

---

**Last Updated:** 2026-06-05  
**Status:** ✅ Ready to Deploy
