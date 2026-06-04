# Setup: Content Generation System Backend

**Implementación de Fase 1 - Backend Core**

---

## 🚀 Pasos de Setup

### PASO 1: Crear Tablas en Supabase (5 minutos)

**Ubicación:** `E:\git\app\tools\io-neruda\backend\supabase-migrations\001-generators-tables.sql`

**Instrucciones:**

1. Abre [https://supabase.com](https://supabase.com)
2. Accede al proyecto: **zvehtloitnuglyjtxwye**
3. Ve a **SQL Editor**
4. Copia TODO el contenido de `001-generators-tables.sql`
5. Pega en el SQL Editor
6. Click **Run** (▶️)
7. Verifica que se crearon 4 tablas:
   - ✅ content_configurations
   - ✅ generated_contents
   - ✅ email_templates
   - ✅ batch_jobs

**Alternativa (CLI):**
```bash
cd E:\git\app\tools\io-neruda\backend
supabase db push --local
```

---

### PASO 2: Instalar Dependencias Backend

```bash
cd E:\git\app\tools\io-neruda\backend

# Instalar paquetes necesarios
npm install p-limit idb dotenv

# Verificar que Zod ya está instalado
npm list zod
```

**Paquetes necesarios:**
- `p-limit` - Control de concurrencia (3 Plans en paralelo)
- `idb` - IndexedDB (para frontend offline después)
- `zod` - Validación (ya existe)

---

### PASO 3: Crear Estructura de Carpetas

```bash
cd E:\git\app\tools\io-neruda\backend

# Crear directorios
mkdir -p services\generators
mkdir -p validators
mkdir -p supabase-migrations

# Listar para verificar
ls -la
```

**Estructura esperada:**
```
backend/
├── routes/
│   ├── projects.routes.js
│   ├── content.routes.js
│   ├── generators.routes.js (CREAR)
│   └── ...
├── services/
│   ├── generators/ (CREAR)
│   │   ├── content-generator.service.js
│   │   ├── tone-engine.service.js
│   │   ├── keyword-optimizer.service.js
│   │   └── batch-processor.service.js
│   └── ...
├── validators/ (CREAR)
│   └── generators.schema.js
├── supabase-migrations/ ✅ (creado con SQL)
└── server.js
```

---

### PASO 4: Crear Validators (Zod Schemas)

**Archivo:** `backend/validators/generators.schema.js`

Voy a generar este archivo en el próximo paso.

---

### PASO 5: Crear Services

**Archivos a crear:**
- `backend/services/generators/content-generator.service.js`
- `backend/services/generators/tone-engine.service.js`
- `backend/services/generators/keyword-optimizer.service.js`
- `backend/services/generators/batch-processor.service.js`

Voy a generar estos archivos en el próximo paso.

---

### PASO 6: Crear Routes

**Archivo:** `backend/routes/generators.routes.js`

Voy a generar este archivo en el próximo paso.

---

### PASO 7: Actualizar server.js

**Archivo:** `backend/server.js`

Agregar línea:
```javascript
import generatorsRoutes from './routes/generators.routes.js';
app.use('/api/generators', generatorsRoutes);
```

---

## ✅ Verificación

Después de cada paso, verifica:

### Supabase
```bash
# Verificar tablas creadas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected output:
```
content_configurations
generated_contents
email_templates
batch_jobs
io_neruda_projects
io_neruda_contents
... (otras tablas)
```

### Backend
```bash
cd E:\git\app\tools\io-neruda\backend

# Verificar estructura
ls -la services/generators/
ls -la validators/

# Iniciar servidor
npm run dev

# Debería mostrar:
# 🚀 Backend running on http://localhost:4006
```

---

## 🔗 Credenciales (de master.env)

```
SUPABASE_URL=https://zvehtloitnuglyjtxwye.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (disponible en master.env)
ANTHROPIC_API_KEY=sk-ant-api03-... (disponible en master.env)
```

---

## 📋 Checklist Fase 1

- [ ] SQL ejecutado en Supabase
- [ ] 4 tablas creadas
- [ ] Dependencias instaladas (npm install)
- [ ] Carpetas creadas (mkdir)
- [ ] Validators creados
- [ ] Services creados
- [ ] Routes creadas
- [ ] server.js actualizado
- [ ] Backend inicia sin errores (npm run dev)
- [ ] Prueba POST /api/generators/config

---

## 🧪 Test Rápido

Una vez todo instalado:

```bash
# Terminal 1: Iniciar backend
cd E:\git\app\tools\io-neruda\backend
npm run dev

# Terminal 2: Test endpoint
curl -X POST http://localhost:4006/api/generators/config \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "tu-project-uuid",
    "name": "Test Config",
    "keywordsNiche": ["test"],
    "keywordsLongtail": [],
    "tone": "professional",
    "enabledFormats": {"blog": true, "email": true}
  }'
```

**Respuesta esperada:**
```json
{
  "id": "uuid-generado",
  "name": "Test Config",
  "createdAt": "2026-06-04T...",
  ...
}
```

---

## ⏱️ Timeline Esperado

- SQL + Dependencias: **5 min**
- Validators: **15 min**
- Services: **45 min**
- Routes: **30 min**
- Testing: **15 min**

**Total Fase 1:** ~2 horas

---

## ❓ Problemas Comunes

**Error: "Table already exists"**
→ Las tablas ya existen, puedes ignorar o ejecutar con `ON CONFLICT DO NOTHING`

**Error: "Service role key not found"**
→ Verifica que SUPABASE_SERVICE_ROLE_KEY está en .env

**Error: "Cannot find module 'p-limit'"**
→ Ejecuta: `npm install p-limit`

**Error: POST /api/generators/config returns 404**
→ Verifica que `app.use('/api/generators', generatorsRoutes)` está en server.js

---

**Estado:** Ready to begin implementation  
**Fecha:** 2026-06-04  
**Equipo:** Ricardo (director) + Claude Code (developer)
