# Visual Architecture - Content Generation System

**Diagramas y visualizaciones del sistema**

---

## 1. FLUJO DE USUARIO (UX Flow)

```
┌─────────────────────────────────────────────────────────┐
│                  DASHBOARD io-neruda                     │
├─────────────────────────────────────────────────────────┤
│ Sidebar                    │ Main Content               │
│                            │                             │
│ • Dashboard                │ [Proyecto: Marketing]      │
│ • Proyectos                │ ┌──────────────────────┐  │
│ • Configuración            │ │ Pipeline - 3 Etapas  │  │
│                            │ ├──────────────────────┤  │
│                            │ │ 01-Insights:   5     │  │
│                            │ │ 02-Plans:      3     │  │
│                            │ │ 03-Ready:      1     │  │
│                            │ └──────────────────────┘  │
│                            │                             │
│                            │ [Plan: "Guía SEO 2025"]    │
│                            │ ┌──────────────────────┐  │
│                            │ │ Titulo:              │  │
│                            │ │ "Guía Completa de... │  │
│                            │ │                      │  │
│                            │ │ Body: 500 palabras   │  │
│                            │ │                      │  │
│                            │ │ [Generar Contenidos] │◄─ CLICK
│                            │ └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Paso 1: Seleccionar Formatos

```
┌──────────────────────────────────────────────────────────────┐
│  Modal: Generar Contenidos                        [X]        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  PASO 1 de 3: Selecciona Formatos de Salida                 │
│  ════════════════════════════════════════════                │
│                                                               │
│  ☑ 📝 Blog Post                                             │
│     1500+ palabras, SEO-optimizado                          │
│                                                               │
│  ☑ 💌 Email Newsletter                                      │
│     200-350 palabras, marketing copy                        │
│                                                               │
│  ☑ 💼 LinkedIn Post                                         │
│     150-250 palabras, profesional                           │
│                                                               │
│  ☐ 📸 Instagram Post                                        │
│     Caption + hashtags                                       │
│                                                               │
│  ☐ 💬 WhatsApp Message                                      │
│     120 caracteres, directo                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [← Anterior]                    [Siguiente →]       │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Paso 2: Configurar Contexto

```
┌──────────────────────────────────────────────────────────────┐
│  Modal: Generar Contenidos                        [X]        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  PASO 2 de 3: Keywords y Contexto                           │
│  ═══════════════════════════════════                        │
│                                                               │
│  Keywords de Nicho:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [SEO] [x]  [marketing digital] [x]  [inbound] [x]  │   │
│  │ [+ Agregar keyword]                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Keywords Long-tail:                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [cómo mejorar posicionamiento google] [x]           │   │
│  │ [+ Agregar keyword long-tail]                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [← Anterior]                    [Siguiente →]       │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Paso 3: Seleccionar Tono

```
┌──────────────────────────────────────────────────────────────┐
│  Modal: Generar Contenidos                        [X]        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  PASO 3 de 3: Tono de Escritura                             │
│  ═════════════════════════════════════                      │
│                                                               │
│  ◉ 🎩 PROFESIONAL                                           │
│    Formal, estructurado, corporativo                        │
│    Ideal para: Empresas, B2B, negocios                      │
│                                                               │
│  ○ 😊 AMIGABLE                                              │
│    Conversacional, cálido, relatable                        │
│    Ideal para: Comunidades, marcas personales               │
│                                                               │
│  ○ 🔬 TÉCNICO                                               │
│    Preciso, especializado, detallado                        │
│    Ideal para: Desarrolladores, especialistas               │
│                                                               │
│  ○ ✏️ PERSONALIZADO                                         │
│    Escribe tus propias guías de tono                        │
│    ┌─────────────────────────────────────────────────────┐ │
│    │ [textarea multiline]                               │ │
│    │ Ej: "Sofisticado, exclusivo, premium, lujo..."    │ │
│    └─────────────────────────────────────────────────────┘ │
│                                                               │
│  ☐ Guardar esta configuración como template                │
│     Nombre: [_____________________________]                  │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [← Anterior]                    [Generar ✨]        │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Generando...

```
┌──────────────────────────────────────────────────────────────┐
│  Modal: Generar Contenidos                        [X]        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ⏳ GENERANDO CONTENIDOS...                                  │
│                                                               │
│  📝 Blog Post         ████████░░  80%  (2.3 seg)           │
│  💌 Email Newsletter  ███████░░░  70%  (1.8 seg)           │
│  💼 LinkedIn Post     ██████░░░░  60%  (1.2 seg)           │
│                                                               │
│  Tiempo estimado: 2-3 segundos                              │
│                                                               │
│  💡 Tip: Estamos generando 3 contenidos en paralelo          │
│           usando IA. Esto normalmente tomaría horas.        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Preview de Resultados

```
┌────────────────────────────────────────────────────────────┐
│  Modal: Contenidos Generados                        [X]    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  [Blog] [Email] [LinkedIn]  ← TABS PARA CAMBIAR          │
│  ══════                                                    │
│                                                             │
│  📝 BLOG POST                                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ # Guía Completa: Cómo Mejorar tu SEO en 2025     │  │
│  │                                                    │  │
│  │ En el mundo del marketing digital, el SEO es...   │  │
│  │ [... 1500+ palabras generadas ...]                │  │
│  │                                                    │  │
│  │ Palabras: 1,543 | Keywords: SEO (2.1%), Marketing│  │
│  │ Densidad: 2.5% | ✓ Tono: Profesional             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                             │
│  [✓ Guardar]  [↻ Regenerar]  [✎ Editar]                 │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 2. ARQUITECTURA DE BASE DE DATOS

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE (PostgreSQL)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐       ┌──────────────────────┐   │
│  │ io_neruda_projects   │       │ io_neruda_contents   │   │
│  ├──────────────────────┤       ├──────────────────────┤   │
│  │ • id (PK)            │◄──┐   │ • id (PK)            │   │
│  │ • name               │   └──▶│ • project_id (FK)    │   │
│  │ • display_name       │       │ • title              │   │
│  │ • type               │       │ • body               │   │
│  │ • status             │       │ • stage (insight/... │   │
│  │ • created_at         │       │ • created_at         │   │
│  └──────────────────────┘       └──────────────────────┘   │
│                                           │                  │
│                                           │ 1:N              │
│                                           │                  │
│                                  ┌────────▼─────────┐       │
│                                  │generated_contents │       │
│                                  ├──────────────────┤       │
│                                  │ • id (PK)        │       │
│                                  │ • content_id (FK)│       │
│                                  │ • format (blog..)│       │
│                                  │ • generated_text │       │
│                                  │ • keywords_used  │       │
│                                  │ • tone_applied   │       │
│                                  │ • status (draft..)       │
│                                  │ • version        │       │
│                                  │ • created_at     │       │
│                                  └──────────────────┘       │
│                                           ▲                  │
│                                           │                  │
│                        ┌──────────────────┘                  │
│  ┌──────────────────────┐     opcional                      │
│  │content_configurations│                                    │
│  ├──────────────────────┤                                    │
│  │ • id (PK)            │                                    │
│  │ • project_id (FK)    │                                    │
│  │ • name               │                                    │
│  │ • keywords_niche     │                                    │
│  │ • keywords_longtail  │                                    │
│  │ • tone               │                                    │
│  │ • tone_custom_text   │                                    │
│  │ • enabled_formats    │                                    │
│  │ • usage_count        │                                    │
│  │ • created_at         │                                    │
│  └──────────────────────┘                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. ARQUITECTURA BACKEND (Express)

```
┌────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND (Node.js)               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ server.js                                          │  │
│  │ ├─ app.use(cors())                                │  │
│  │ ├─ app.use(express.json())                        │  │
│  │ └─ app.use(morgan logging)                        │  │
│  └────────────────────────────────────────────────────┘  │
│                                    │                       │
│  ┌──────────────────────────────┬─┴──────────────────┐  │
│  │ ROUTES                       │ MIDDLEWARE         │  │
│  ├──────────────────────────────┼────────────────────┤  │
│  │ /api/projects/...           │ Validation (Zod)   │  │
│  │ /api/content/...            │ Error handling     │  │
│  │ /api/export/...             │ Logging            │  │
│  │ /api/publish/...            │ Rate limiting      │  │
│  │ /api/generators/... ← NEW   │ Auth (future)      │  │
│  │   ├─ POST /generate         │                    │  │
│  │   ├─ POST /config           │                    │  │
│  │   ├─ GET /config/:projectId │                    │  │
│  │   └─ PUT /generated/:id     │                    │  │
│  └──────────────────────────────┴────────────────────┘  │
│                        │                                  │
│  ┌─────────────────────▼──────────────────────────────┐  │
│  │ SERVICES                                          │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │                                                    │  │
│  │  content-generator.service.js                      │  │
│  │  ├─ generateMultiFormat()                          │  │
│  │  └─ generateForFormat()                            │  │
│  │                                                    │  │
│  │  tone-engine.service.js                            │  │
│  │  ├─ TONE_TEMPLATES                                │  │
│  │  └─ applyTone()                                    │  │
│  │                                                    │  │
│  │  keyword-optimizer.service.js                      │  │
│  │  ├─ integrateKeywords()                            │  │
│  │  ├─ calculateDensity()                             │  │
│  │  └─ validateIntegration()                          │  │
│  │                                                    │  │
│  │  format-generators/                                │  │
│  │  ├─ blog-generator.js                              │  │
│  │  ├─ email-generator.js                             │  │
│  │  ├─ social-generators/                             │  │
│  │  └─ whatsapp-generator.js                          │  │
│  │                                                    │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼──────────────────────────────┐  │
│  │ INTEGRATIONS                                      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ • Supabase (DB client)                           │  │
│  │ • Claude API (IA generation)                     │  │
│  │ • File System (pipeline folders)                 │  │
│  │ • Logger (Winston)                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 4. FLUJO DE GENERACIÓN (Secuencia)

```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND: User clicks [Generar]                         │
└──────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────┐
│ POST /api/generators/generate                           │
│ {                                                        │
│   contentId: "uuid",                                    │
│   keywordsNiche: ["SEO", "marketing digital"],         │
│   keywordsLongtail: ["cómo mejorar seo"],              │
│   tone: "professional",                                 │
│   enabledFormats: { blog: true, email: true, ... }   │
│ }                                                        │
└──────────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────┐
│ BACKEND: Route handler                                  │
│ 1. Validate input (Zod)                                │
│ 2. Fetch original content from DB                      │
│ 3. Call generateMultiFormat()                          │
└──────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
   ┌────────┐  ┌────────┐  ┌────────┐
   │ BLOG   │  │ EMAIL  │  │LINKEDIN│
   │GENERATOR│  │GENERATOR│  │GENERATOR│
   └────────┘  └────────┘  └────────┘
   (Parallel)  (Parallel) (Parallel)
        │           │           │
        ▼           ▼           ▼
   ┌────────────────────────────────────┐
   │ 1. Build format-specific prompt     │
   │ 2. Call Claude API                  │
   │ 3. Get generated text               │
   └────────────────────────────────────┘
        │           │           │
        ▼           ▼           ▼
   ┌────────────────────────────────────┐
   │ Apply Tone Engine                   │
   │ (Rewrite with tone guidelines)      │
   └────────────────────────────────────┘
        │           │           │
        ▼           ▼           ▼
   ┌────────────────────────────────────┐
   │ Integrate Keywords Naturally        │
   │ (Validate density + placement)      │
   └────────────────────────────────────┘
        │           │           │
        ▼           ▼           ▼
   ┌────────────────────────────────────┐
   │ Validate & Format Output            │
   │ (Word count, structure, etc)        │
   └────────────────────────────────────┘
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Save ALL to DB (one   │
        │ generated_contents    │
        │ row per format)       │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Return JSON response  │
        │ with all 3 contents   │
        └───────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────┐
│ FRONTEND: Receive response                              │
│ Show preview tabs (Blog | Email | LinkedIn)            │
│ Highlight keywords in each preview                     │
└──────────────────────────────────────────────────────────┘
```

---

## 5. COMPONENTES FRONTEND

```
┌────────────────────────────────────────────────────────────┐
│           app/(app)/[proyecto]/generate/page.tsx          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ContentGeneratorModal (Main Component)              │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │                                                     │  │
│  │ State:                                              │  │
│  │ ├─ step: 'formats' | 'keywords' | 'tone' | ...    │  │
│  │ ├─ selectedFormats: { blog: true, email: true }   │  │
│  │ ├─ keywords: { niche: [], longtail: [] }          │  │
│  │ ├─ tone: 'professional'                            │  │
│  │ └─ generatedContents: { blog: {...}, ... }        │  │
│  │                                                     │  │
│  │ Subcomponents:                                      │  │
│  │ ├─ FormatSelector                                  │  │
│  │ │  ├─ Checkbox per format                          │  │
│  │ │  ├─ Description                                  │  │
│  │ │  └─ Icon                                         │  │
│  │ │                                                  │  │
│  │ ├─ KeywordsInput                                   │  │
│  │ │  ├─ Input niche keywords (array)                │  │
│  │ │  ├─ Input longtail keywords (array)             │  │
│  │ │  └─ Add/remove buttons                           │  │
│  │ │                                                  │  │
│  │ ├─ ToneSelector                                    │  │
│  │ │  ├─ Radio buttons (4 presets)                   │  │
│  │ │  └─ Textarea for custom tone                    │  │
│  │ │                                                  │  │
│  │ ├─ GenerationProgress                              │  │
│  │ │  └─ Progress bars per format                    │  │
│  │ │                                                  │  │
│  │ └─ GeneratedContentPreview                         │  │
│  │    ├─ Tabs (Blog | Email | LinkedIn)              │  │
│  │    ├─ FormatPreview (format-specific rendering)   │  │
│  │    ├─ KeywordHighlighter (mark keywords)          │  │
│  │    └─ Save button                                 │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 6. FLUJO DE DATOS (End-to-End)

```
                    USER
                     │
                     ▼
            ┌────────────────┐
            │ 1. Open Plan   │
            └────────────────┘
                     │
                     ▼
         ┌──────────────────────┐
         │ [Generar Contenidos] │ ← Click
         └──────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │ Modal: Select Formats    │
         │ ☑ Blog ☑ Email ☑ LinkedIn│
         └──────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │ Modal: Keywords + Tone   │
         │ "SEO" | "Profesional"    │
         └──────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │ [Generar] button         │
         └──────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                 │
    ▼                ▼                 ▼
  FRONTEND         BACKEND           CLAUDE API
  ─────────        ────────           ──────────
  
  POST request       Receive
  with config        │
                     ▼
                  Validate (Zod)
                     │
                     ▼
                  Fetch Plan
                  from DB
                     │
                     ▼
                  For each format:
                  ├─ Build prompt
                  ├─ Call Claude
                  ├─ Apply tone       ◄─── [GENERATE BLOG]
                  ├─ Add keywords       ◄─── [GENERATE EMAIL]
                  └─ Validate           ◄─── [GENERATE LINKEDIN]
                     │
                     ▼
                  Save all to
                  generated_contents
                  table
                     │
                     ▼
    ◄────────────────┼────────────────
    │                │
    ▼                │
 Show Tabs      ◄────┘
  + Preview    Return JSON
    │
    ▼
  User reviews
    │
    ▼
  [✓ Save]
    │
    ▼
  Update status
  to "approved"
    │
    ▼
  Ready to
  publish
```

---

## 7. INTEGRACIÓN CON PIPELINE ACTUAL

```
PIPELINE EXISTENTE (3 etapas + Filesystem)

┌───────────────────────────────────────────────────────┐
│ io_neruda_projects/                                   │
├───────────────────────────────────────────────────────┤
│                                                        │
│  E:\lib\003-Pipeline-Contenidos\{proyecto}\          │
│  ├─ 00-Config/                                        │
│  │  ├─ config.json                                   │
│  │  └─ .env.{project}                                │
│  │                                                   │
│  ├─ 01-Buzon-Insights/                              │
│  │  └─ *.md files (insights)                        │
│  │                                                   │
│  ├─ 02-Generador-Planes/                            │
│  │  └─ *.md files (plans) ◄── FUENTE ACTUAL        │
│  │                                                   │
│  └─ 03-Ready-To-Publish/                            │
│     └─ *.md files (ready to export)                 │
│                                                        │
│  assets/                                              │
│  ├─ headers/                                          │
│  └─ images/                                           │
│                                                        │
└───────────────────────────────────────────────────────┘
              ▲
              │
              │ (sigue existiendo intacto)
              │
              
SUPABASE (NEW TABLES)

┌───────────────────────────────────────────────────────┐
│ generated_contents (NUEVA TABLA)                      │
├───────────────────────────────────────────────────────┤
│                                                        │
│ Apunta a: io_neruda_contents (plans)                │
│                                                        │
│ Contiene:                                             │
│  ├─ blog_post.md (1500+ palabras)                   │
│  ├─ email_newsletter.html (250 palabras)            │
│  ├─ linkedin_post.txt (150 palabras)                │
│  └─ ... (más formatos)                              │
│                                                        │
│ Status:                                               │
│  ├─ draft (generado, no revisado)                   │
│  ├─ approved (usuario aprobó)                       │
│  ├─ published (publicado en canal)                  │
│  └─ archived (ya no se usa)                         │
│                                                        │
└───────────────────────────────────────────────────────┘
              ▲
              │
              │ (nueva capa, aditiva)
              │

WORKFLOW ACTUAL → WORKFLOW NUEVO

Antes:                          Después:
1. Usuario abre Plan            1. Usuario abre Plan
2. Lee el contenido             2. Click [Generar]
3. Escribe Blog (1 hora)        3. Selecciona formatos
4. Escribe Email (30 min)       4. Sistema GENERA
5. Escribe Posts (1 hora)       5. Usuario revisa preview
6. Publica cada uno             6. Guarda
                                7. Publica (1 hora total)
Total: 2.5 horas               Total: 0.5 horas (5x más rápido)
```

---

## 8. COHERENCIA VISUAL

### Paleta de Colores (Consistente)

```
Primary CTA:      bg-blue-600      ← [Generar] button
Secondary:        bg-zinc-700      ← Back button
Success:          bg-green-600     ← Save button
Warning:          bg-yellow-600    ← Regenerate
Background:       bg-zinc-900      ← Cards
Text Primary:     text-zinc-100    ← Main text
Text Secondary:   text-zinc-400    ← Descriptions
Borders:          border-zinc-800  ← Separators
Hover:            hover:border-blue-600 ← Interactive
```

### Espacios y Componentes

```
Modal:
├─ Padding: p-8 (outer)
├─ Content gap: gap-6 (vertical)
└─ Button gap: gap-4 (horizontal)

Cards:
├─ bg-zinc-900 border border-zinc-800 rounded-lg p-6
├─ hover:border-blue-600 transition
└─ Text: text-zinc-100 (headings), text-zinc-400 (description)

Input Fields:
├─ bg-zinc-800 border border-zinc-700
├─ placeholder-zinc-500
├─ focus:ring-2 focus:ring-blue-600
└─ rounded px-3 py-2

Progress Bars:
├─ bg-zinc-700 (background)
├─ bg-blue-600 (fill)
└─ Animación smooth
```

---

Esta documentación visual te ayudará a:
1. **Entender el flujo** sin leer código
2. **Validar arquitectura** visualmente
3. **Implementar componentes** con referencia clara
4. **Comunicar** a otros developers

---

**Última actualización:** 2026-06-04
