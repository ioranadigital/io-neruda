# Content Generation System - io-neruda

**Versión:** 2.0  
**Fecha:** 2026-06-04  
**Status:** 🚀 Documento mejorado — Listo para Claude Code  
**Autor:** Claude Code + Usuario | **Revisado por:** Lead Developer Iorana Digital

---

> **Changelog v1 → v2:**  
> ✅ Email Templates Library añadida (Gap crítico no cubierto)  
> ✅ Batch Processing: arquitectura completa para 10+ planes  
> ✅ Wizard rediseñado: Regla de los 3 Clics (panel único vs. wizard de 3 pasos)  
> ✅ Offline-First: IndexedDB como fallback cuando Supabase no responde  
> ✅ Versioning y Alternativas: generar múltiples versiones por formato  
> ✅ Prompt Engineering enriquecido por formato  
> ✅ Error Handling & Retry Logic completo  
> ✅ Estado Global con React Context (aplicando H_Framework-Arquitectura-Datos-Local)  
> ✅ Micro-interacciones y feedback visual (H_Framework-UX-UI-Productividad)  
> ✅ Preguntas pendientes resueltas  

---

## 1. CONTEXTO: ¿QUÉ ES IO-NERUDA?

### Propósito General
io-neruda es una **plataforma multipropósito de gestión y generación de contenidos** que permite crear, organizar y exportar contenido en múltiples formatos:

- **📝 Blog Posts** (Markdown/HTML optimizado para SEO)
- **💌 Emails** (MJML/HTML responsive + Templates reutilizables)
- **📱 Social Media** (Instagram, LinkedIn, Twitter/X)
- **💬 WhatsApp** (Mensajes cortos con CTA directo)
- **📄 PDFs** (Reportes descargables)
- **🔗 JSON** (APIs/consumo externo)

### Usuarios Objetivo
- Consultores de contenidos
- Agencias digitales
- Content managers
- Equipos de marketing
- Creadores independientes

### Valor Propuesto
**"De un insight, múltiples contenidos optimizados"**
- Escribe UNA idea
- Selecciona qué formatos quieres
- El sistema genera automáticamente versiones optimizadas con keywords y tono
- Cada versión con keywords, tono y estructura específica por canal
- **[NUEVO v2]** Guarda configuraciones reutilizables como Templates de Campaña

---

## 2. ARQUITECTURA ACTUAL (MVP)

### Pipeline de 3 Etapas

```
INSIGHT (Idea bruta)
    ↓
    └─→ 01-Buzon-Insights/
        [Usuario recopila ideas, enlaces, notas]

PLAN (Estructura y esquema)
    ↓
    └─→ 02-Generador-Planes/
        [Usuario crea el esquema del contenido]

READY (Listo para publicar)
    ↓
    └─→ 03-Ready-To-Publish/
        [Contenido final, listo para exportar]
```

### Almacenamiento
- **Base de datos:** Supabase (`io_neruda_projects`, `io_neruda_contents`)
- **Sistema de archivos:** `E:\lib\003-Pipeline-Contenidos\{proyecto}\{stage}`
- **[NUEVO v2] Fallback Local:** IndexedDB para modo offline
- **Exportadores activos:** Markdown, WhatsApp, HTML, JSON, Social, Email

### Stack Tecnológico

| Layer | Tech | Detalles |
|-------|------|----------|
| **Frontend** | Next.js 15 + React | TypeScript, Tailwind CSS, React Hot Toast |
| **Backend** | Express.js (Node) | Validación con Zod, logging con Winston |
| **Base de Datos** | Supabase | PostgreSQL + Auth |
| **Almacenamiento Local** | IndexedDB (idb) | Offline-first fallback |
| **Estado Global** | React Context + useReducer | Sin recargas, cambios reflejados en toda la app |

---

## 3. PROBLEMAS IDENTIFICADOS Y RESUELTOS

### Gap 1: Sin Generación Automática ✅ Resuelto
~~Actualmente el usuario debe escribir manualmente cada versión del contenido.~~  
**Solución:** Content Generator Service con Claude API, generación en paralelo por formato.

### Gap 2: Sin Contexto de Keywords ✅ Resuelto
~~Los contenidos se generan sin considerar SEO o palabras clave de mercado.~~  
**Solución:** Keyword Optimizer Service con validación de densidad y integración natural vía IA.

### Gap 3: Sin Control de Tono ✅ Resuelto
~~No hay forma de estandarizar el tono de escritura.~~  
**Solución:** Tone Engine con 4 presets + modo Custom. Se aplica consistentemente en todos los formatos.

### Gap 4: Sin Interfaz de Selección Modular ✅ Resuelto
~~El usuario no puede elegir qué formatos quiere generar.~~  
**Solución:** Panel unificado con checkboxes por formato, respetando la Regla de los 3 Clics.

### Gap 5: Sin Email Templates Library ⚠️ NUEVO — Crítico
~~No existe un sistema para guardar y reutilizar estructuras de email (bienvenida, newsletter, promocional).~~  
**Solución:** `email_templates` tabla + Template Picker en el modal de generación.

### Gap 6: Sin Batch Processing ⚠️ NUEVO — Alta prioridad
~~No se pueden procesar múltiples Plans en paralelo.~~  
**Solución:** Batch Queue con control de concurrencia y progreso en tiempo real.

### Gap 7: Sin Versioning de Contenidos ⚠️ NUEVO
~~No hay forma de tener múltiples versiones del mismo contenido generado.~~  
**Solución:** Sistema de alternativas con `version` y `parent_generation_id` en `generated_contents`.

---

## 4. PROPUESTA: CONTENT GENERATION SYSTEM v2

### 4.1 Concepto Core

**Una herramienta integrada que genere contenido en múltiples formatos desde UN Plan:**
- Selección modular (checkboxes por formato)
- Integración automática de keywords con control de densidad
- Control de tono unificado (4 presets + custom)
- Email Templates Library para estructuras reutilizables
- Configuraciones de campaña guardables
- Batch processing para múltiples planes
- Versioning con regeneración por formato

### 4.2 Principios de Diseño Aplicados (H_Framework-UX-UI-Productividad)

| Principio | Implementación |
|-----------|----------------|
| **Regla de los 3 Clics** | Seleccionar Plan → Abrir Panel → Click Generar (3 clics máximo) |
| **Jerarquía Visual** | Panel lateral colapsable, espacios negativos entre secciones |
| **Micro-interacciones** | Progress bar por formato, toast al guardar, check animado al aprobar |
| **Modo Enfoque** | Modal full-screen para generación, fondo oscuro, tipografía Inter |

### 4.3 Flujo de Usuario Rediseñado (Single Panel vs. Wizard)

**[CAMBIO v2]** El wizard de 3 pasos se reemplaza por un panel único con secciones colapsables. Esto cumple la Regla de los 3 Clics y reduce la fricción cognitiva.

```
ANTES (v1 — 3 pantallas):
  Paso 1: Seleccionar Formatos → [Siguiente]
  Paso 2: Keywords → [Siguiente]
  Paso 3: Tono → [Generar]

AHORA (v2 — 1 panel):
  ┌─────────────────────────────────────────┐
  │ [✓] Formatos     [✓] Keywords    [✓] Tono │  ← Secciones accordion
  │                                          │
  │  ☑ Blog ☑ Email ☑ LinkedIn ☐ Instagram  │
  │  Keywords: [SEO] [marketing digital] [+] │
  │  Tono: ● Profesional ○ Amigable          │
  │                                          │
  │  [⚡ Generar Contenidos] (1 click)        │
  └─────────────────────────────────────────┘
```

### 4.4 Flujo Completo de Usuario

```
1. Usuario abre un Plan
   └─ Ej: "Guía: Cómo elegir hosting en 2025"

2. Click [⚡ Generar Contenidos]  ← CLIC 1
   └─ Se abre el GeneratorPanel lateral/modal

3. PANEL ÚNICO: Todo configurable en una pantalla
   
   ── FORMATOS ──────────────────────────────────
   ☑ Blog Post (1500+ palabras)
   ☑ Email Newsletter (250 palabras)
   ☑ LinkedIn Post (150 palabras)
   ☐ Instagram Post (caption + hashtags)
   ☐ WhatsApp (120 caracteres)
   
   ── EMAIL TEMPLATE (visible si Email ☑) ───────
   ◉ Newsletter estándar
   ○ Email de bienvenida
   ○ Promocional / Oferta
   ○ [Custom Template]
   
   ── KEYWORDS ──────────────────────────────────
   Nicho: [SEO] [marketing digital] [×]
   Long-tail: [cómo elegir hosting 2025] [×]
   
   ── TONO ──────────────────────────────────────
   ◉ Profesional  ○ Amigable  ○ Técnico  ○ Custom
   
   ── CONFIGURACIÓN ─────────────────────────────
   [ ] Guardar esta config como template
   Nombre: [__________________]
   
   [⚡ Generar] ← CLIC 2

4. Sistema genera en paralelo con feedback visual:
   Blog    ████████████ 100% ✓
   Email   ████████░░░░  70%
   LinkedIn ██░░░░░░░░░░  20%

5. PREVIEW PANEL (Tab por formato):
   [📝 Blog] [💌 Email] [💼 LinkedIn]
   
   Preview con keywords highlighted + métricas
   
   [✓ Aprobar] [↻ Regenerar] [✎ Editar]  ← CLIC 3
```

---

## 5. ARQUITECTURA TÉCNICA

### 5.1 Base de Datos (Supabase)

#### Tabla: `content_configurations` (sin cambios estructurales, se amplía)
```sql
CREATE TABLE content_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES io_neruda_projects(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,          -- "Blog + Email Sep 2025"
  description TEXT,
  
  -- Keywords
  keywords_niche TEXT[] NOT NULL DEFAULT '{}',
  keywords_longtail TEXT[] DEFAULT '{}',
  
  -- Tone
  tone VARCHAR(50) NOT NULL DEFAULT 'professional',
    -- 'professional', 'friendly', 'technical', 'custom'
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
  
  -- [NUEVO v2] Email Template Selection
  email_template_id UUID REFERENCES email_templates(id),
  
  -- Metadata
  is_template BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(100)
);

CREATE INDEX idx_content_configs_project ON content_configurations(project_id);
```

#### Tabla: `generated_contents` (ampliada con versioning)
```sql
CREATE TABLE generated_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relaciones
  content_id UUID NOT NULL REFERENCES io_neruda_contents(id) ON DELETE CASCADE,
  config_id UUID REFERENCES content_configurations(id),
  batch_job_id UUID REFERENCES batch_jobs(id), -- [NUEVO v2]
  
  -- Contenido generado
  format VARCHAR(50) NOT NULL,
    -- 'blog', 'email', 'social_linkedin', 'social_instagram', 'whatsapp', 'pdf'
  generated_text TEXT NOT NULL,
  
  -- [NUEVO v2] Para emails: referencia al template base usado
  email_template_id UUID REFERENCES email_templates(id),
  
  -- Metadata de generación
  keywords_used TEXT[],
  tone_applied VARCHAR(50),
  word_count INTEGER,
  keyword_density FLOAT,
  
  -- Versioning [NUEVO v2]
  version INTEGER DEFAULT 1,
  is_alternative BOOLEAN DEFAULT FALSE,
  parent_generation_id UUID REFERENCES generated_contents(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
    -- 'draft', 'approved', 'published', 'archived'
  
  -- IA tracking
  ai_model VARCHAR(50),
  ai_prompt_hash VARCHAR(64),  -- hash del prompt para deduplicación
  generation_time_ms INTEGER,  -- tiempo de generación para métricas
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_generated_contents_content ON generated_contents(content_id);
CREATE INDEX idx_generated_contents_format ON generated_contents(format);
CREATE INDEX idx_generated_contents_status ON generated_contents(status);
CREATE INDEX idx_generated_contents_batch ON generated_contents(batch_job_id); -- [NUEVO v2]
```

#### [NUEVA v2] Tabla: `email_templates`
```sql
-- Sistema de Email Templates reutilizables
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES io_neruda_projects(id),
    -- NULL = template global del sistema
  
  name VARCHAR(100) NOT NULL,
    -- "Newsletter Semanal", "Email de Bienvenida", "Promocional"
  
  category VARCHAR(50) NOT NULL,
    -- 'newsletter', 'welcome', 'promotional', 'transactional', 'custom'
  
  -- Estructura del email (MJML o HTML)
  template_type VARCHAR(20) NOT NULL DEFAULT 'mjml',
    -- 'mjml', 'html', 'plain'
  
  template_body TEXT NOT NULL,
    -- El template con {{variables}} para reemplazar:
    -- {{subject}}, {{preheader}}, {{greeting}}, {{body_intro}},
    -- {{body_main}}, {{cta_text}}, {{cta_url}}, {{signature}}
  
  -- Configuración visual
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  font_family VARCHAR(50) DEFAULT 'Inter, sans-serif',
  
  -- Metadatos
  is_system BOOLEAN DEFAULT FALSE,  -- templates del sistema (no editables)
  usage_count INTEGER DEFAULT 0,
  preview_image_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates del sistema (seeds)
INSERT INTO email_templates (name, category, is_system, template_body) VALUES
  ('Newsletter Estándar', 'newsletter', TRUE, '...'),
  ('Email de Bienvenida', 'welcome', TRUE, '...'),
  ('Email Promocional', 'promotional', TRUE, '...'),
  ('Resumen Semanal', 'newsletter', TRUE, '...');

CREATE INDEX idx_email_templates_project ON email_templates(project_id);
CREATE INDEX idx_email_templates_category ON email_templates(category);
```

#### [NUEVA v2] Tabla: `batch_jobs`
```sql
-- Control de generación en lote (Batch Processing)
CREATE TABLE batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES io_neruda_projects(id) ON DELETE CASCADE,
  
  -- Configuración del batch
  config_id UUID REFERENCES content_configurations(id),
  content_ids UUID[] NOT NULL,       -- Array de Plan IDs a procesar
  
  -- Status del batch
  status VARCHAR(20) DEFAULT 'pending',
    -- 'pending', 'processing', 'partial', 'completed', 'failed'
  
  total_items INTEGER NOT NULL,
  processed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  
  -- Resultados por item
  results JSONB DEFAULT '[]',
    -- [{ contentId, status, generatedIds, error }]
  
  -- Control de concurrencia
  concurrency_limit INTEGER DEFAULT 3, -- máximo 3 Plans en paralelo
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by VARCHAR(100)
);

CREATE INDEX idx_batch_jobs_project ON batch_jobs(project_id);
CREATE INDEX idx_batch_jobs_status ON batch_jobs(status);
```

#### Diagrama de Relaciones Completo
```
io_neruda_projects
    ├─→ io_neruda_contents (Insights/Plans)
    │       └─→ generated_contents (Outputs por formato)
    │               ├─→ email_templates (template usado)
    │               └─→ batch_jobs (si es parte de un lote)
    │
    ├─→ content_configurations (Configs reutilizables)
    │       └─→ email_templates (template preferido)
    │
    ├─→ email_templates (templates del proyecto)
    └─→ batch_jobs (trabajos en lote)
```

---

### 5.2 Backend — Routes

#### `POST /api/generators/config`
Crear o actualizar una configuración reutilizable.

```javascript
// Request
{
  projectId: "uuid",
  name: "Blog + Email - Marketing",
  keywordsNiche: ["SEO", "marketing digital"],
  keywordsLongtail: ["cómo mejorar posicionamiento google 2025"],
  tone: "professional",
  toneCustomText: null,
  enabledFormats: {
    blog: true,
    email: true,
    social_linkedin: true,
    social_instagram: false,
    whatsapp: false
  },
  emailTemplateId: "uuid-template-newsletter", // [NUEVO v2]
  isTemplate: true
}

// Response: 201 Created
{
  id: "uuid",
  ...configuración guardada
}
```

#### `POST /api/generators/generate`
Generar contenido en múltiples formatos para un Plan.

```javascript
// Request
{
  contentId: "uuid",
  configId: "uuid",           // config guardada (opcional)
  
  // O inline si no quiere guardar:
  keywordsNiche: ["SEO"],
  keywordsLongtail: ["cómo mejorar google"],
  tone: "professional",
  enabledFormats: { blog: true, email: true },
  emailTemplateId: "uuid",    // [NUEVO v2]
  
  generateAlternatives: 1,    // [NUEVO v2] cuántas alternativas por formato (0-3)
  saveConfig: false           // [NUEVO v2] guardar config automáticamente
}

// Response: 200 OK
{
  jobId: "uuid",
  generatedContents: {
    blog: {
      id: "uuid",
      format: "blog",
      text: "# Guía completa...",
      wordCount: 1543,
      keywordsUsed: ["SEO", "posicionamiento"],
      keywordDensity: 2.5,
      generationTimeMs: 4200,
      alternatives: []         // [NUEVO v2] versiones alternativas
    },
    email: {
      id: "uuid",
      format: "email",
      text: "<mjml>...</mjml>",
      htmlRendered: "<html>...</html>",  // [NUEVO v2] pre-renderizado
      wordCount: 287,
      keywordsUsed: ["SEO"],
      emailTemplateUsed: "Newsletter Estándar"
    }
  }
}
```

#### `POST /api/generators/batch` — [NUEVO v2]
Procesar múltiples Plans en lote.

```javascript
// Request
{
  projectId: "uuid",
  contentIds: ["uuid-1", "uuid-2", "uuid-3", "..."],  // hasta 50 Plans
  configId: "uuid",           // misma config para todos
  concurrencyLimit: 3         // cuántos en paralelo (default: 3)
}

// Response: 202 Accepted (procesamiento async)
{
  batchJobId: "uuid",
  status: "processing",
  totalItems: 10,
  estimatedTimeSeconds: 120   // estimación basada en formatos activos
}

// GET /api/generators/batch/:batchJobId → polling de progreso
{
  batchJobId: "uuid",
  status: "processing",
  totalItems: 10,
  processedItems: 4,
  failedItems: 0,
  percentComplete: 40,
  results: [
    { contentId: "uuid-1", status: "completed", generatedIds: ["uuid", "uuid", "uuid"] },
    { contentId: "uuid-2", status: "completed", ... },
    ...
  ]
}
```

#### `POST /api/generators/generate/:generatedId/alternative` — [NUEVO v2]
Regenerar una alternativa de un contenido ya generado.

```javascript
// Response: 200 OK
{
  id: "uuid-nueva-alternativa",
  format: "blog",
  text: "# Versión alternativa...",
  version: 2,
  isAlternative: true,
  parentGenerationId: "uuid-original"
}
```

#### `GET /api/generators/email-templates` — [NUEVO v2]
Listar templates de email disponibles (sistema + proyecto).

```javascript
// Response: 200 OK
{
  system: [
    { id: "uuid", name: "Newsletter Estándar", category: "newsletter", isSystem: true },
    { id: "uuid", name: "Email de Bienvenida", category: "welcome", isSystem: true },
    { id: "uuid", name: "Email Promocional", category: "promotional", isSystem: true }
  ],
  project: [
    { id: "uuid", name: "Newsletter Cliente X", category: "newsletter", isSystem: false }
  ]
}
```

#### `GET /api/generators/config/:projectId`
Listar configuraciones del proyecto (sin cambios).

#### `GET /api/generators/generated/:contentId`
Listar contenidos generados con versiones (ampliado).

```javascript
// Response
{
  contentId: "uuid",
  originalPlan: { title: "...", body: "..." },
  generatedVersions: [
    {
      format: "blog",
      status: "approved",
      versions: [
        { id: "uuid-v1", version: 1, isAlternative: false, wordCount: 1543 },
        { id: "uuid-v2", version: 2, isAlternative: true, wordCount: 1612 }  // alternativa
      ]
    },
    ...
  ]
}
```

#### `PUT /api/generators/generated/:generatedId`
Actualizar contenido generado (sin cambios).

---

### 5.3 Backend — Services

#### `content-generator.service.js` (ampliado)
```javascript
import pLimit from 'p-limit'; // control de concurrencia

// Generación individual
export async function generateMultiFormat(plan, config, emailTemplate, llmClient) {
  const results = {};
  const startTime = Date.now();
  
  // Generar todos los formatos en paralelo (Promise.allSettled para no fallar todo si uno falla)
  const formatEntries = Object.entries(config.enabledFormats).filter(([, enabled]) => enabled);
  
  const settled = await Promise.allSettled(
    formatEntries.map(([format]) =>
      generateForFormat(plan, format, config, emailTemplate, llmClient)
    )
  );
  
  settled.forEach((result, i) => {
    const [format] = formatEntries[i];
    if (result.status === 'fulfilled') {
      results[format] = result.value;
    } else {
      results[format] = { error: result.reason.message, status: 'failed' };
    }
  });
  
  return results;
}

// Batch processing con control de concurrencia
export async function processBatch(contentIds, config, emailTemplate, llmClient, concurrencyLimit = 3) {
  const limit = pLimit(concurrencyLimit);
  
  const tasks = contentIds.map(contentId =>
    limit(async () => {
      try {
        const plan = await fetchPlan(contentId);
        const generated = await generateMultiFormat(plan, config, emailTemplate, llmClient);
        return { contentId, status: 'completed', generated };
      } catch (error) {
        return { contentId, status: 'failed', error: error.message };
      }
    })
  );
  
  return Promise.allSettled(tasks);
}

// Retry logic con backoff exponencial
async function generateForFormatWithRetry(plan, format, config, emailTemplate, llmClient, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateForFormat(plan, format, config, emailTemplate, llmClient);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function generateForFormat(plan, format, config, emailTemplate, llmClient) {
  const startTime = Date.now();
  const generator = FORMAT_GENERATORS[format];
  
  if (!generator) throw new Error(`Unknown format: ${format}`);
  
  const prompt = generator.buildPrompt(plan, config, emailTemplate);
  const generated = await llmClient.generate(prompt);
  
  const withKeywords = await keywordOptimizer.integrate(
    generated,
    config.keywordsNiche,
    config.keywordsLongtail,
    format,
    llmClient
  );
  
  const withTone = await toneEngine.apply(
    withKeywords,
    config.tone,
    config.toneCustomText,
    llmClient
  );
  
  return {
    text: withTone,
    wordCount: countWords(withTone),
    keywordsUsed: extractKeywords(withTone, [...config.keywordsNiche, ...config.keywordsLongtail]),
    keywordDensity: calculateDensity(withTone, [...config.keywordsNiche, ...config.keywordsLongtail]),
    generationTimeMs: Date.now() - startTime
  };
}
```

#### `tone-engine.service.js` (ampliado con 4 presets)
```javascript
const TONE_TEMPLATES = {
  professional: {
    vocabulary: "formal, corporativo, orientado a resultados",
    sentence_structure: "frases estructuradas, datos concretos, lenguaje de negocios",
    examples_style: "casos de estudio empresariales, estadísticas de industria",
    cta_style: "directo, orientado a acción, beneficio claro",
    forbidden: "jerga informal, exclamaciones excesivas, emojis"
  },
  friendly: {
    vocabulary: "casual, conversacional, cercano, en primera persona",
    sentence_structure: "frases cortas, preguntas retóricas, tono de conversación",
    examples_style: "historias personales, analogías cotidianas",
    cta_style: "cálido, invitación, sin presión",
    forbidden: "tecnicismos innecesarios, lenguaje corporativo frío"
  },
  technical: {
    vocabulary: "especializado, preciso, terminología del sector",
    sentence_structure: "detallado, estructurado, con sub-puntos técnicos",
    examples_style: "especificaciones técnicas, benchmarks, código o diagramas cuando aplica",
    cta_style: "basado en beneficios técnicos, proof-of-concept",
    forbidden: "simplificaciones excesivas, metáforas vagas"
  },
  educational: {
    vocabulary: "claro, didáctico, paso a paso",
    sentence_structure: "progresivo de simple a complejo, analogías explicativas",
    examples_style: "ejemplos prácticos, comparaciones simples",
    cta_style: "aprender más, explorar, descubrir",
    forbidden: "jerga sin explicar, dar por sentado conocimiento previo"
  }
};

export async function applyTone(text, tone, customTone, llmClient) {
  const toneConfig = tone === 'custom'
    ? { description: customTone }
    : TONE_TEMPLATES[tone];
  
  if (!toneConfig) throw new Error(`Invalid tone: ${tone}`);
  
  const prompt = tone === 'custom'
    ? buildCustomTonePrompt(text, customTone)
    : buildPresetTonePrompt(text, tone, toneConfig);
  
  return llmClient.generate(prompt);
}

function buildPresetTonePrompt(text, tone, toneConfig) {
  return `
Rewrites the following text applying a "${tone}" tone consistently.

TONE GUIDELINES:
- Vocabulary: ${toneConfig.vocabulary}
- Sentence structure: ${toneConfig.sentence_structure}
- Examples style: ${toneConfig.examples_style}
- CTA style: ${toneConfig.cta_style}
- Avoid: ${toneConfig.forbidden}

Maintain: the factual content, keywords, structure, and approximate length.
Only change: tone, vocabulary, phrasing.

OUTPUT: Only the rewritten text, no explanations.

TEXT TO REWRITE:
${text}
  `.trim();
}
```

#### `keyword-optimizer.service.js` (ampliado)
```javascript
const DENSITY_LIMITS = {
  blog: { min: 1.0, max: 3.0, ideal: 2.0 },
  email: { min: 0.5, max: 2.0, ideal: 1.5 },
  social_linkedin: { min: 0.5, max: 2.5, ideal: 1.5 },
  social_instagram: { min: 0.5, max: 3.0, ideal: 2.0 },
  whatsapp: { min: 0, max: 5.0, ideal: 2.0 }  // más flexible por ser corto
};

export async function integrateKeywords(text, keywordsNiche, keywordsLongtail, format, llmClient) {
  const keywords = [...keywordsNiche, ...keywordsLongtail];
  const currentDensity = calculateDensity(text, keywords);
  const limits = DENSITY_LIMITS[format] || DENSITY_LIMITS.blog;
  
  if (currentDensity >= limits.min && currentDensity <= limits.max) {
    return text; // ya está en rango, no modificar
  }
  
  const action = currentDensity < limits.min ? 'increase' : 'decrease';
  
  const prompt = `
Adjust keyword presence in this text (currently at ${currentDensity.toFixed(2)}% density).
Goal: reach ${limits.ideal}% density (range: ${limits.min}%-${limits.max}%).
Action needed: ${action} keyword usage.

KEYWORDS TO ${action === 'increase' ? 'ADD NATURALLY' : 'REDUCE/VARY'}:
- Primary (niche): ${keywordsNiche.join(', ')}
- Secondary (long-tail): ${keywordsLongtail.join(', ')}

RULES:
- Keywords must flow naturally in context
- Do not start more than 1 sentence with a keyword
- Use synonyms or variations when possible to avoid repetition
- Preserve the original meaning and structure
- Format type: ${format}

OUTPUT: Only the adjusted text.

TEXT:
${text}
  `.trim();
  
  return llmClient.generate(prompt);
}

function calculateDensity(text, keywords) {
  const words = text.toLowerCase().split(/\s+/);
  let matchCount = 0;
  
  for (const keyword of keywords) {
    const regex = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex) || [];
    matchCount += matches.length;
  }
  
  return words.length > 0 ? (matchCount / words.length) * 100 : 0;
}
```

---

### 5.4 Format-Specific Generators con Prompt Engineering

```
backend/services/format-generators/
├── blog-generator.js        (1500-2000 palabras, SEO, Markdown)
├── email-generator.js       (200-350 palabras, MJML, con template)
├── social-generators/
│   ├── linkedin-generator.js (150-250 palabras, profesional, con hashtags)
│   ├── instagram-generator.js (caption 150 chars + 15 hashtags)
│   └── twitter-generator.js  (threads de 3-5 tweets)
└── whatsapp-generator.js    (120-140 chars, emoji estratégico, CTA)
```

#### Blog Generator Prompt (mejorado)
```javascript
function buildBlogPrompt(plan, config) {
  return `
You are a senior content writer specializing in ${config.keywordsNiche[0] || 'digital marketing'}.

CONTENT PLAN:
Title: ${plan.title}
Body/Outline: ${plan.body}

PRIMARY TASK:
Write a comprehensive, SEO-optimized blog post (1500-2000 words) in Markdown.

STRUCTURE REQUIRED:
1. H1 title (include primary keyword)
2. Introduction (150 words): Hook + problem statement + what the reader will learn
3. 3-5 H2 sections with H3 subsections as needed
4. Each section: actionable insights, not just theory
5. Conclusion (100 words): summary + key takeaway
6. CTA paragraph (50 words): clear, specific action

KEYWORDS (integrate naturally, never force):
- Primary: ${config.keywordsNiche.join(', ')}
- Secondary: ${config.keywordsLongtail.join(', ')}
- Target density: ~2% of total words

SEO REQUIREMENTS:
- Include primary keyword in first 100 words
- Include primary keyword in at least 1 H2 heading
- Use semantically related terms throughout
- Short paragraphs (2-4 sentences max)
- Use bullet lists and bold for scanability

TONE: ${config.tone} — see tone guidelines applied separately.

OUTPUT: Only the Markdown content. No frontmatter. No meta descriptions.
  `.trim();
}
```

#### Email Generator Prompt (nuevo con template)
```javascript
function buildEmailPrompt(plan, config, emailTemplate) {
  const templateVars = `
TEMPLATE VARIABLES TO FILL:
{{subject}}: compelling subject line (max 50 chars)
{{preheader}}: preview text (max 85 chars, tease without spoiling)
{{greeting}}: opening salutation
{{body_intro}}: hook paragraph (50 words)
{{body_main}}: main content (150-200 words) — the core value
{{cta_text}}: call to action button text (3-5 words)
{{signature}}: closing + sender name
  `;
  
  return `
You are an email copywriter specializing in high-conversion marketing emails.

CONTENT PLAN:
${plan.title}
${plan.body}

EMAIL TYPE: ${emailTemplate?.category || 'newsletter'}
${emailTemplate ? `BASE TEMPLATE: ${emailTemplate.name}` : ''}

${templateVars}

KEYWORDS TO INTEGRATE:
- Primary: ${config.keywordsNiche.join(', ')}
- Target: 1-2 keyword mentions maximum (email is not SEO-focused)

COPYWRITING RULES:
- Subject line: curiosity gap OR benefit OR number (never clickbait)
- First sentence after greeting: must hook immediately
- Body: one main idea only — emails that try to say everything say nothing
- CTA: one CTA only, verb-first ("Download", "Read", "Join")
- Total reading time: 60 seconds or less

TONE: ${config.tone}

OUTPUT: Fill each {{variable}} with the copy. Return as JSON:
{
  "subject": "...",
  "preheader": "...",
  "greeting": "...",
  "body_intro": "...",
  "body_main": "...",
  "cta_text": "...",
  "signature": "..."
}
  `.trim();
}
```

#### LinkedIn Generator Prompt (mejorado)
```javascript
function buildLinkedInPrompt(plan, config) {
  return `
You are a LinkedIn content strategist with 10k+ followers.

CONTENT PLAN:
${plan.title}
${plan.body}

TASK: Write a high-engagement LinkedIn post (150-250 words).

LINKEDIN FORMAT RULES:
1. Hook line: 1-2 sentences that stop the scroll (do NOT start with "I")
2. Short paragraphs: max 2-3 lines each (mobile-first reading)
3. White space: line breaks between every paragraph
4. Body: story, insight, or framework — not a summary
5. Closing: thought-provoking question OR strong statement
6. Hashtags: 3-5 relevant hashtags at the end (no more)

ENGAGEMENT TRIGGERS (use 1-2):
- Contrarian opinion
- Personal story with lesson
- Numbered framework ("3 things I learned...")
- Data point that surprises

KEYWORDS: ${config.keywordsNiche.slice(0, 2).join(', ')} (use naturally, 1-2 times max)
TONE: ${config.tone}

OUTPUT: The post text only, ready to paste into LinkedIn.
  `.trim();
}
```

---

### 5.5 Offline-First con IndexedDB (H_Framework-Arquitectura-Datos-Local)

```javascript
// frontend/lib/offline-storage.ts
import { openDB } from 'idb';

const DB_NAME = 'io-neruda-offline';
const DB_VERSION = 1;

export const db = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Cache de contenidos generados para acceso offline
    const store = db.createObjectStore('generated_contents', { keyPath: 'id' });
    store.createIndex('contentId', 'content_id');
    store.createIndex('format', 'format');
    
    // Cache de configuraciones
    db.createObjectStore('content_configurations', { keyPath: 'id' });
    
    // Queue de operaciones pendientes (cuando vuelva internet)
    db.createObjectStore('pending_sync', { keyPath: 'id', autoIncrement: true });
  }
});

// Guardar contenido generado localmente
export async function cacheGeneratedContent(content) {
  const dbInstance = await db;
  await dbInstance.put('generated_contents', {
    ...content,
    cachedAt: Date.now(),
    syncStatus: 'synced'
  });
}

// Obtener contenidos en modo offline
export async function getOfflineContents(contentId) {
  const dbInstance = await db;
  return dbInstance.getAllFromIndex('generated_contents', 'contentId', contentId);
}

// Encolar operaciones cuando no hay internet
export async function queueForSync(operation) {
  const dbInstance = await db;
  await dbInstance.add('pending_sync', {
    operation,
    queuedAt: Date.now(),
    attempts: 0
  });
}
```

```javascript
// frontend/lib/generator-api.ts — con fallback offline

export async function generateContent(params) {
  try {
    // Intentar generar online
    const response = await fetch('/api/generators/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(30000) // 30s timeout
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    // Cachear en IndexedDB para acceso offline futuro
    for (const [format, content] of Object.entries(data.generatedContents)) {
      await cacheGeneratedContent(content);
    }
    
    return { source: 'online', data };
    
  } catch (error) {
    // Fallback: buscar en caché local
    const cached = await getOfflineContents(params.contentId);
    
    if (cached.length > 0) {
      return { source: 'offline-cache', data: { generatedContents: cached } };
    }
    
    // No hay caché: encolar para cuando vuelva internet
    await queueForSync({ type: 'generate', params });
    throw new Error('Sin conexión. La generación se completará cuando vuelva internet.');
  }
}
```

---

### 5.6 Estado Global (React Context)

```typescript
// frontend/context/generator-context.tsx

interface GeneratorState {
  activeConfig: ContentConfiguration | null;
  generatedContents: Record<string, GeneratedContent[]>;  // por contentId
  batchJobs: BatchJob[];
  emailTemplates: EmailTemplate[];
  isGenerating: boolean;
  isOnline: boolean;
}

type GeneratorAction =
  | { type: 'SET_CONFIG'; config: ContentConfiguration }
  | { type: 'ADD_GENERATED'; contentId: string; contents: GeneratedContent[] }
  | { type: 'UPDATE_STATUS'; generatedId: string; status: ContentStatus }
  | { type: 'SET_BATCH_JOB'; job: BatchJob }
  | { type: 'UPDATE_BATCH_PROGRESS'; jobId: string; progress: BatchProgress }
  | { type: 'SET_GENERATING'; value: boolean }
  | { type: 'SET_ONLINE'; value: boolean };

const generatorReducer = (state: GeneratorState, action: GeneratorAction): GeneratorState => {
  switch (action.type) {
    case 'ADD_GENERATED':
      return {
        ...state,
        generatedContents: {
          ...state.generatedContents,
          [action.contentId]: [
            ...(state.generatedContents[action.contentId] || []),
            ...action.contents
          ]
        }
      };
    // ... otros casos
    default: return state;
  }
};

export const GeneratorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(generatorReducer, initialState);
  
  // Monitor de conectividad
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', value: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', value: false });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <GeneratorContext.Provider value={{ state, dispatch }}>
      {children}
    </GeneratorContext.Provider>
  );
};
```

---

## 6. ARQUITECTURA FRONTEND

### 6.1 Estructura de Componentes

```
frontend/app/(app)/[proyecto]/
├── page.tsx                    (Pipeline existente)
├── generate/
│   ├── page.tsx               (Batch Generator landing)
│   └── [contentId]/
│       └── page.tsx           (Individual generator view)
│
└── templates/                  [NUEVO v2]
    ├── page.tsx               (Listar email templates)
    ├── new/page.tsx           (Crear template)
    └── [templateId]/page.tsx  (Editar template)

frontend/components/generator/
├── GeneratorPanel.tsx          (MAIN - Panel único, reemplaza al wizard)
│   ├── FormatSelector.tsx
│   ├── EmailTemplatePicker.tsx [NUEVO v2]
│   ├── KeywordsInput.tsx
│   ├── ToneSelector.tsx
│   ├── ConfigurationSaver.tsx
│   └── GenerateButton.tsx
│
├── GenerationProgress.tsx      (Barras por formato, feedback visual)
│
├── GeneratedContentPanel.tsx
│   ├── FormatTabs.tsx
│   ├── FormatPreview.tsx       (Renderiza por tipo: MD, email HTML, plain)
│   ├── KeywordHighlighter.tsx
│   ├── ContentEditor.tsx       (Edición inline)
│   └── VersionSwitcher.tsx    [NUEVO v2]
│
├── BatchGeneratorPanel.tsx     [NUEVO v2]
│   ├── PlanSelector.tsx
│   ├── BatchProgress.tsx
│   └── BatchResults.tsx
│
└── EmailTemplateManager.tsx    [NUEVO v2]
    ├── TemplateCard.tsx
    ├── TemplatePreview.tsx
    └── TemplateEditor.tsx
```

### 6.2 Component: GeneratorPanel (Rediseñado — Panel Único)

```tsx
'use client';

import { useState, useCallback } from 'react';
import { useGenerator } from '@/context/generator-context';
import FormatSelector from './FormatSelector';
import EmailTemplatePicker from './EmailTemplatePicker';
import KeywordsInput from './KeywordsInput';
import ToneSelector from './ToneSelector';
import GenerationProgress from './GenerationProgress';
import GeneratedContentPanel from './GeneratedContentPanel';

interface GeneratorPanelProps {
  contentId: string;
  projectId: string;
  initialConfig?: ContentConfiguration;
}

export default function GeneratorPanel({ contentId, projectId, initialConfig }: GeneratorPanelProps) {
  const { state, dispatch } = useGenerator();
  
  const [selectedFormats, setSelectedFormats] = useState(
    initialConfig?.enabledFormats ?? { blog: true, email: false, social_linkedin: false, social_instagram: false, whatsapp: false }
  );
  const [emailTemplateId, setEmailTemplateId] = useState(initialConfig?.emailTemplateId ?? null);
  const [keywords, setKeywords] = useState({
    niche: initialConfig?.keywordsNiche ?? [],
    longtail: initialConfig?.keywordsLongtail ?? []
  });
  const [tone, setTone] = useState(initialConfig?.tone ?? 'professional');
  const [toneCustom, setToneCustom] = useState(initialConfig?.toneCustomText ?? '');
  const [saveConfig, setSaveConfig] = useState(false);
  const [configName, setConfigName] = useState('');
  const [generationProgress, setGenerationProgress] = useState<Record<string, number>>({});
  const [generatedContents, setGeneratedContents] = useState(null);

  const hasFormats = Object.values(selectedFormats).some(Boolean);
  const hasKeywords = keywords.niche.length > 0;
  const canGenerate = hasFormats && hasKeywords && !state.isGenerating;

  const handleGenerate = useCallback(async () => {
    dispatch({ type: 'SET_GENERATING', value: true });
    
    // Simular progreso visual por formato
    const enabledFormats = Object.entries(selectedFormats)
      .filter(([, enabled]) => enabled)
      .map(([format]) => format);
    
    enabledFormats.forEach(format => {
      setGenerationProgress(prev => ({ ...prev, [format]: 0 }));
    });
    
    try {
      const response = await fetch('/api/generators/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          keywordsNiche: keywords.niche,
          keywordsLongtail: keywords.longtail,
          tone,
          toneCustomText: tone === 'custom' ? toneCustom : null,
          enabledFormats: selectedFormats,
          emailTemplateId,
          saveConfig,
          configName: saveConfig ? configName : undefined
        })
      });
      
      if (!response.ok) throw new Error('Error en la generación');
      
      const data = await response.json();
      setGeneratedContents(data.generatedContents);
      dispatch({ type: 'ADD_GENERATED', contentId, contents: Object.values(data.generatedContents) });
      
    } catch (error) {
      // toast.error('Error generando contenido. Intenta de nuevo.');
      console.error(error);
    } finally {
      dispatch({ type: 'SET_GENERATING', value: false });
    }
  }, [selectedFormats, keywords, tone, toneCustom, emailTemplateId, saveConfig, configName, contentId]);

  return (
    <div className="flex gap-6 h-full">
      {/* LEFT PANEL: Configuración */}
      <div className="w-96 shrink-0 flex flex-col gap-4 overflow-y-auto">
        
        {/* Offline indicator */}
        {!state.isOnline && (
          <div className="bg-amber-900/50 border border-amber-700 rounded-lg px-4 py-2 text-sm text-amber-200">
            ⚠️ Modo offline — Los cambios se sincronizarán al reconectar
          </div>
        )}
        
        {/* SECCIÓN: Formatos */}
        <section className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Formatos de salida
          </h3>
          <FormatSelector selected={selectedFormats} onChange={setSelectedFormats} />
        </section>
        
        {/* SECCIÓN: Email Template (condicional) */}
        {selectedFormats.email && (
          <section className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Template de Email
            </h3>
            <EmailTemplatePicker
              projectId={projectId}
              selected={emailTemplateId}
              onChange={setEmailTemplateId}
            />
          </section>
        )}
        
        {/* SECCIÓN: Keywords */}
        <section className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Keywords
          </h3>
          <KeywordsInput keywords={keywords} onChange={setKeywords} />
        </section>
        
        {/* SECCIÓN: Tono */}
        <section className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Tono de escritura
          </h3>
          <ToneSelector
            tone={tone}
            customText={toneCustom}
            onToneChange={setTone}
            onCustomChange={setToneCustom}
          />
        </section>
        
        {/* SECCIÓN: Guardar Config */}
        <section className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveConfig}
              onChange={e => setSaveConfig(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-zinc-300">Guardar como template reutilizable</span>
          </label>
          {saveConfig && (
            <input
              type="text"
              placeholder="Nombre del template..."
              value={configName}
              onChange={e => setConfigName(e.target.value)}
              className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
            />
          )}
        </section>
        
        {/* BOTÓN GENERAR */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm transition-all
            ${canGenerate
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }
          `}
        >
          {state.isGenerating ? '⏳ Generando...' : '⚡ Generar Contenidos'}
        </button>
        
        {/* Validación hints */}
        {!hasFormats && (
          <p className="text-xs text-zinc-500 text-center">Selecciona al menos un formato</p>
        )}
        {!hasKeywords && (
          <p className="text-xs text-zinc-500 text-center">Añade al menos 1 keyword de nicho</p>
        )}
        
      </div>
      
      {/* RIGHT PANEL: Preview / Progress */}
      <div className="flex-1 min-w-0">
        {state.isGenerating && (
          <GenerationProgress
            formats={selectedFormats}
            progress={generationProgress}
          />
        )}
        
        {generatedContents && !state.isGenerating && (
          <GeneratedContentPanel
            contents={generatedContents}
            keywords={[...keywords.niche, ...keywords.longtail]}
            onApprove={(id) => {/* PUT /api/generators/generated/:id */}}
            onRegenerate={(format) => {/* generar alternativa */}}
          />
        )}
        
        {!state.isGenerating && !generatedContents && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <span className="text-5xl mb-4">⚡</span>
            <p className="text-lg">Configura y genera tu contenido</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 6.3 Component: GenerationProgress (Micro-interacciones)

```tsx
// Feedback visual por formato durante la generación
export default function GenerationProgress({ formats, progress }) {
  const FORMAT_ICONS = {
    blog: '📝',
    email: '💌',
    social_linkedin: '💼',
    social_instagram: '📸',
    whatsapp: '💬'
  };
  
  const FORMAT_LABELS = {
    blog: 'Blog Post',
    email: 'Email',
    social_linkedin: 'LinkedIn',
    social_instagram: 'Instagram',
    whatsapp: 'WhatsApp'
  };

  const activeFormats = Object.entries(formats).filter(([, enabled]) => enabled);

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold mb-4">Generando contenidos...</h3>
      <div className="space-y-4">
        {activeFormats.map(([format]) => {
          const pct = progress[format] ?? 0;
          const isDone = pct === 100;
          
          return (
            <div key={format}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-zinc-300">
                  {FORMAT_ICONS[format]} {FORMAT_LABELS[format]}
                </span>
                <span className="text-sm text-zinc-400">
                  {isDone ? '✓ Listo' : `${pct}%`}
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDone ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 6.4 Component: BatchGeneratorPanel (Nuevo)

```tsx
// Generación en lote para múltiples Plans
export default function BatchGeneratorPanel({ projectId }) {
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [configId, setConfigId] = useState<string | null>(null);
  const [batchJob, setBatchJob] = useState(null);
  
  const handleStartBatch = async () => {
    const response = await fetch('/api/generators/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        contentIds: selectedPlanIds,
        configId,
        concurrencyLimit: 3
      })
    });
    
    const job = await response.json();
    setBatchJob(job);
    
    // Polling de progreso
    pollBatchProgress(job.batchJobId);
  };
  
  const pollBatchProgress = (batchJobId) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/generators/batch/${batchJobId}`);
      const updated = await res.json();
      setBatchJob(updated);
      
      if (['completed', 'failed', 'partial'].includes(updated.status)) {
        clearInterval(interval);
      }
    }, 3000); // polling cada 3 segundos
  };
  
  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">
        🚀 Generación en Lote
      </h2>
      
      {!batchJob ? (
        <>
          <PlanSelector
            projectId={projectId}
            selected={selectedPlanIds}
            onChange={setSelectedPlanIds}
          />
          <ConfigSelector
            projectId={projectId}
            selected={configId}
            onChange={setConfigId}
          />
          <button
            onClick={handleStartBatch}
            disabled={selectedPlanIds.length === 0 || !configId}
            className="mt-4 bg-blue-600 px-6 py-3 rounded-xl font-semibold"
          >
            ⚡ Generar {selectedPlanIds.length} Plan{selectedPlanIds.length !== 1 ? 'es' : ''}
          </button>
        </>
      ) : (
        <BatchProgress job={batchJob} />
      )}
    </div>
  );
}
```

---

## 7. FLUJO COMPLETO END-TO-END (Actualizado v2)

```
┌────────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                                │
└────────────────────────────────────────────────────────────────┘
                           │
               1. Selecciona Plan (Clic 1)
                           │
               2. Click [⚡ Generar] (Clic 2)
                           │
┌────────────────────────────────────────────────────────────────┐
│              GENERATOR PANEL (Panel Único)                      │
│  Formatos | Email Template | Keywords | Tono | Config          │
│  [☑ Blog] [☑ Email: Newsletter] [☑ LinkedIn]                  │
│  Keywords: [SEO] [marketing digital]                            │
│  Tono: ◉ Profesional                                           │
└────────────────────────────────────────────────────────────────┘
                           │
               3. Click [⚡ Generar] (Clic 3)
                           │
┌────────────────────────────────────────────────────────────────┐
│              VALIDACIÓN & DISPATCH                               │
│  ✓ Formatos seleccionados                                       │
│  ✓ Keywords presentes                                           │
│  → POST /api/generators/generate                               │
└────────────────────────────────────────────────────────────────┘
                           │
┌────────────────────────────────────────────────────────────────┐
│                  EXPRESS BACKEND                                │
│  1. Fetch Plan original de Supabase                             │
│  2. Fetch Email Template (si email enabled)                     │
│  3. Promise.allSettled → 3 generaciones en paralelo            │
│     a. Build prompt específico por formato                      │
│     b. Call Claude API (claude-sonnet-4-20250514)              │
│     c. Keyword optimizer (ajusta densidad al rango ideal)      │
│     d. Tone engine (aplica preset o custom)                     │
│     e. Save to Supabase + IndexedDB cache                      │
│  4. Aggregated response                                         │
└────────────────────────────────────────────────────────────────┘
                           │
┌────────────────────────────────────────────────────────────────┐
│                  CLAUDE API (Parallel)                          │
│  ┌─────────────┬─────────────┬─────────────┐                   │
│  │    Blog     │    Email    │  LinkedIn   │                   │
│  │  Generator  │  Generator  │  Generator  │                   │
│  │ 1500-2000w  │  200-350w  │  150-250w  │                   │
│  └─────────────┴─────────────┴─────────────┘                   │
└────────────────────────────────────────────────────────────────┘
                           │
┌────────────────────────────────────────────────────────────────┐
│    SUPABASE: generated_contents + IndexedDB cache local        │
│  blog: { text, wordCount: 1543, density: 2.1%, status: draft } │
│  email: { text, htmlRendered, template: "Newsletter" }          │
│  social_linkedin: { text, wordCount: 187, hashtags: [...] }    │
└────────────────────────────────────────────────────────────────┘
                           │
┌────────────────────────────────────────────────────────────────┐
│              FRONTEND — Preview Panel                           │
│  [📝 Blog] [💌 Email] [💼 LinkedIn]                             │
│  ─────────────────────────────────────────────────────────     │
│  "# Guía completa de SEO..."    Keywords: SEO (2.1%) ✓         │
│  ─────────────────────────────────────────────────────────     │
│  [✓ Aprobar] [↻ Regenerar alternativa] [✎ Editar]             │
└────────────────────────────────────────────────────────────────┘
                           │
              User aprueba → status: "approved"
                           │
┌────────────────────────────────────────────────────────────────┐
│           03-Ready-To-Publish / Supabase                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 8. MATRIZ DE COHERENCIA (Actualizada v2)

### 8.1 ¿Encaja con la Arquitectura Actual?

| Aspecto | Situación | Análisis |
|---------|-----------|----------|
| **Pipeline 3 etapas** | ✅ Compatible | Plans siguen siendo la fuente; generamos desde ellos |
| **Supabase DB** | ✅ Compatible | 3 tablas nuevas vinculadas a las existentes |
| **Sistema de archivos** | ✅ Compatible | Exportadores existentes siguen activos |
| **Exportadores** | ✅ Mejorado | Email ahora genera MJML/HTML renderizado |
| **Frontend Next.js 15** | ✅ Compatible | Nuevas rutas y componentes integrados |
| **Express Backend** | ✅ Compatible | Rutas y servicios siguen el patrón existente |
| **Autenticación** | ⚠️ Future | Sin cambios; se integrará cuando se implemente auth |
| **IndexedDB (nuevo)** | ✅ Añade resilencia | Fallback offline, no rompe nada existente |

### 8.2 ¿Cubre todos los Gaps?

| Gap | Solución v2 | Cobertura |
|-----|-------------|-----------|
| Sin generación automática | Generator Service + Claude API | ✅ Completa |
| Sin contexto de keywords | Keyword Optimizer con densidad por formato | ✅ Completa |
| Sin control de tono | Tone Engine + 4 presets + Custom | ✅ Completa |
| Sin selección modular | Panel único con checkboxes | ✅ Completa |
| Sin Email Templates Library | `email_templates` + Template Picker | ✅ Nuevo |
| Sin Batch Processing | `batch_jobs` + Queue con concurrencia | ✅ Nuevo |
| Sin Versioning | `version` + `parent_generation_id` | ✅ Nuevo |
| Sin Offline Support | IndexedDB + sync queue | ✅ Nuevo |

### 8.3 Principios de Producto Aplicados

| Framework | Principio | Implementación |
|-----------|-----------|----------------|
| H_Framework-Product-Discovery | MVP | GeneratorPanel es el core; batch y templates son extensión |
| H_Framework-Product-Discovery | User Journey | Mapeado en sección 4.3 (3 clics end-to-end) |
| H_Framework-Product-Discovery | Escalabilidad | Cada format-generator es independiente; fácil añadir Twitter, TikTok |
| H_Framework-UX-UI-Productividad | 3 Clics | Seleccionar Plan → Abrir Panel → Click Generar |
| H_Framework-UX-UI-Productividad | Jerarquía Visual | Secciones accordion, espacios negativos entre bloques |
| H_Framework-UX-UI-Productividad | Micro-interacciones | Progress bars por formato, toast al aprobar |
| H_Framework-UX-UI-Productividad | Modo Enfoque | Panel limpio, tipografía Inter, fondo zinc-900 |
| H_Framework-Arquitectura-Datos-Local | Offline-First | IndexedDB como fallback + sync queue |
| H_Framework-Arquitectura-Datos-Local | Normalización | Tablas sin duplicados; template referenciado por ID |
| H_Framework-Arquitectura-Datos-Local | Estado Global | React Context + useReducer para toda la app |

---

## 9. ROADMAP DE IMPLEMENTACIÓN (Actualizado v2)

### Fase 1: Database & Backend Core (Día 1)
- [ ] Crear 3 tablas en Supabase: `email_templates`, `batch_jobs`, ampliar `generated_contents`
- [ ] Seed de 4 email templates del sistema
- [ ] Implementar routes básicas (`/config`, `/generate`, `/email-templates`)
- [ ] Validación con Zod en todas las routes
- [ ] Setup Claude API client

### Fase 2: IA Integration (Día 2)
- [ ] `content-generator.service.js` con Promise.allSettled
- [ ] `tone-engine.service.js` con 4 presets
- [ ] `keyword-optimizer.service.js` con densidad por formato
- [ ] Format-specific generators (blog, email, linkedin, instagram, whatsapp)
- [ ] Retry logic con backoff exponencial

### Fase 3: Batch Processing (Día 2 — paralelo)
- [ ] `POST /api/generators/batch` con `p-limit`
- [ ] `GET /api/generators/batch/:id` para polling
- [ ] `BatchGeneratorPanel.tsx` en frontend

### Fase 4: Frontend Core (Día 3)
- [ ] `GeneratorContext` con useReducer
- [ ] `GeneratorPanel.tsx` (panel único)
- [ ] `FormatSelector`, `EmailTemplatePicker`, `KeywordsInput`, `ToneSelector`
- [ ] `GenerationProgress.tsx` con micro-interacciones
- [ ] `GeneratedContentPanel.tsx` con tabs y editor

### Fase 5: Offline-First (Día 3 — paralelo)
- [ ] Setup `idb` library
- [ ] `offline-storage.ts` con IndexedDB
- [ ] `generator-api.ts` con fallback offline
- [ ] Indicador de estado de conexión en UI

### Fase 6: Email Templates (Día 4)
- [ ] `EmailTemplateManager.tsx` (listar, crear, editar)
- [ ] `TemplatePreview.tsx` con MJML renderer
- [ ] `/templates` routes en frontend

### Fase 7: Polish & QA (Día 4)
- [ ] Error handling completo (toasts, estados de error en UI)
- [ ] Loading skeletons durante fetch
- [ ] Testing de los servicios principales
- [ ] Documentación de APIs

---

## 10. MÉTRICAS DE ÉXITO

```
✅ Usuario genera múltiples formatos en ≤ 3 clics
✅ Tiempo de generación individual < 30 segundos
✅ Tiempo de generación en batch (10 planes × 3 formatos) < 5 minutos
✅ Keywords integradas naturalmente (densidad en rango ideal por formato)
✅ Tono consistente entre todos los formatos de la misma generación
✅ Email templates seleccionables y aplicados correctamente
✅ Configuraciones guardadas y reutilizables entre proyectos
✅ Funcionamiento offline con datos cacheados (sin crash)
✅ Volúmenes: blog (1500+w), email (200-350w), LinkedIn (150-250w), WhatsApp (120c)
✅ UI sin tutorial necesario (onboarding zero-friction)
```

---

## 11. PREGUNTAS RESUELTAS

| Pregunta Original | Respuesta v2 |
|-------------------|--------------|
| ¿Tenemos acceso a Claude API key? | Usar `claude-sonnet-4-20250514`. Configurar en `.env` como `ANTHROPIC_API_KEY` |
| ¿Queremos batch processing? | ✅ Sí — arquitectura completa en sección 5.1 y 5.2 |
| ¿Queremos versioning? | ✅ Sí — `version` + `is_alternative` + `parent_generation_id` en `generated_contents` |
| ¿Integración con IA de imágenes? | 🔄 Fase futura — añadir `image_generation_url` a `generated_contents`. Usar DALL-E 3 o Flux |
| ¿Confirmado Supabase para nuevas tablas? | ✅ Sí — 3 tablas nuevas documentadas en sección 5.1 |

---

## 12. VARIABLES DE ENTORNO REQUERIDAS

```env
# .env.local (Next.js) / .env (Express)

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Solo en backend, no exponer al cliente

# Configuración del generador
GENERATOR_DEFAULT_CONCURRENCY=3    # Límite de generaciones paralelas en batch
GENERATOR_MAX_RETRIES=3            # Intentos de retry por formato
GENERATOR_TIMEOUT_MS=30000         # Timeout por generación (30s)

# Feature flags
NEXT_PUBLIC_BATCH_ENABLED=true
NEXT_PUBLIC_OFFLINE_MODE=true
```

---

**Documento generado:** 2026-06-04  
**Versión:** 2.0  
**Estado:** ✅ Listo para implementación con Claude Code  
**Próximo paso:** `Claude Code` → implementar Fase 1 (Database + Backend Core)
