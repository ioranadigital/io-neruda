# 📚 IO Neruda — Content Generation Dashboard

**Sistema multipropósito de generación de contenidos con IA**

---

## INSTRUCCIÓN: Si el usuario escribe "menu", muestra el menú de abajo

Si el usuario escribe exactamente `menu`, `Menu`, `MENU` o `/menu`, MUESTRA este menú y ESPERA que seleccione un número (1-10). No hagas nada más.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ MENÚ DE OPCIONES - IO NERUDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué te gustaría hacer?

1 Generar contenido
2 Revisar/editar contenido generado
3 Configurar prompts
4 Mejorar performance
5 Debuggear un problema
6 Revisar datos de entrada
7 Exportar contenido
8 Integración con otros sistemas
10 Ver status del proyecto (stack, entorno, TODOs)
9 Otra cosa específica

Escribe el número (1-10):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ¿Qué te gustaría hacer?

1 Generar contenido
2 Revisar/editar contenido generado
3 Configurar prompts
4 Mejorar performance
5 Debuggear un problema
6 Revisar datos de entrada
7 Exportar contenido
8 Integración con otros sistemas
10 Ver status del proyecto (stack, entorno, TODOs)
9 Otra cosa específica

---

## 🚀 Arranque Rápido

```powershell
# Desde E:\git\app\tools\io-neruda (raíz del monorepo)
pnpm install                          # Instala todas las dependencias
cd frontend && pnpm run dev           # Inicia dev server (puerto 3003)
```

**Acceso:** http://localhost:3003

---

## 📊 Estado Actual

| Aspecto | Estado | Última Actualización |
|---------|--------|---------------------|
| Build | ✅ Passing | 2026-06-05 |
| ESLint | ✅ No errors | 2026-06-05 |
| TypeScript | ✅ Strict | 2026-06-05 |
| Routes | ✅ Consolidated | e0c509a |

---

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                          ← Next.js 15 App Router (única fuente)
│   ├── page.tsx                  ← Home
│   ├── layout.tsx                ← Root layout
│   ├── globals.css               ← Global styles
│   ├── generators/
│   │   └── page.tsx              ← Content Generator (main page)
│   ├── dashboard/
│   │   └── page.tsx              ← Dashboard analytics
│   └── api/                      ← API routes (si aplica)
├── src/
│   ├── components/               ← Reutilizable components
│   │   ├── panels/               ← Full-feature panels
│   │   │   ├── GeneratorPanel.tsx
│   │   │   ├── ContentGallery.tsx
│   │   │   ├── BatchMonitor.tsx
│   │   │   └── EmailTemplateBuilder.tsx
│   │   ├── selectors/            ← Input selectors
│   │   │   ├── FormatSelector.tsx
│   │   │   ├── ToneSelector.tsx
│   │   │   └── KeywordInput.tsx
│   │   └── shared/               ← Basic UI components
│   ├── hooks/                    ← Custom React hooks
│   │   ├── useGenerator.ts       ← Content generation logic
│   │   ├── useOfflineSync.ts     ← Offline synchronization
│   │   ├── useBatchJobs.ts       ← Batch processing
│   │   ├── useEmailTemplates.ts  ← Email template CRUD
│   │   ├── useIndexedDB.ts       ← LocalStorage wrapper
│   │   └── ...
│   ├── context/                  ← React Context providers
│   │   └── GeneratorContext.tsx  ← Global generator state
│   ├── types/                    ← TypeScript types & interfaces
│   │   └── generator.ts
│   └── utils/                    ← Utility functions
│       └── indexeddb.ts
├── public/
│   └── sw.js                     ← Service Worker (PWA)
├── package.json
├── tsconfig.json                 ← TypeScript (strict: true)
├── next.config.js
├── tailwind.config.js            ← Tailwind CSS v4
├── playwright.config.ts          ← E2E test config
└── .env.local                    ← Environment variables

```

---

## 🔑 Características Principales

### ✨ Generador de Contenido
- Multipropósito: Blog, Email, Social Media, PDF, WhatsApp
- Keywords niche + longtail customization
- Tone selector (professional, casual, technical, etc.)
- 3-step wizard interface

### 📧 Email Templates
- CRUD completo para templates
- Preview en vivo
- Integración con generador

### 🚀 Batch Processing
- Procesar múltiples solicitudes en paralelo
- Monitor de progreso real-time
- Historial de trabajos

### 🔌 Offline Capabilities
- IndexedDB para persistencia local
- Service Worker para PWA
- Sync automático cuando hay conexión

### 📱 Responsive Design
- Mobile-first con Tailwind CSS
- Progressive Web App (PWA)
- 4 rutas optimizadas para producción

---

## 📡 Stack Técnico

| Capa | Stack |
|------|-------|
| **Frontend** | Next.js 15, React 18.3, TypeScript 5.3 |
| **Styling** | Tailwind CSS 4, PostCSS |
| **UI Components** | lucide-react (icons), react-hot-toast (notifications) |
| **State** | React Context + Hooks |
| **Database** | Supabase (PostgreSQL + Auth) |
| **Testing** | Playwright E2E |
| **Linting** | ESLint 8, TypeScript strict mode |
| **Package Manager** | pnpm (monorepo aware) |

---

## 🛠️ Comandos Principales

### Development
```bash
cd frontend

pnpm run dev                # Start dev server (port 3003)
pnpm run build              # Production build
pnpm run start              # Start production server
pnpm run type-check         # TypeScript validation (strict)
pnpm run lint               # ESLint check & fix
```

### Testing
```bash
pnpm run test               # Unit tests (Jest)
pnpm run test:e2e           # E2E tests (Playwright)
pnpm run test:e2e:ui        # Playwright UI mode
pnpm run test:e2e:debug     # Playwright debug mode
```

### Analysis
```bash
pnpm run analyze            # Bundle size analysis
```

---

## 🌍 Rutas Principales

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page |
| `/generators` | `app/generators/page.tsx` | Content Generator (main) |
| `/dashboard` | `app/dashboard/page.tsx` | Analytics & monitoring |

---

## 🔄 Refactor Reciente (2026-06-05)

**Commit:** `e0c509a`

**Cambios ejecutados:**
- ✅ Eliminado `app/(app)` route group (rutas duplicadas)
- ✅ Consolidado `GeneratorPage` en `app/generators/page.tsx`
- ✅ Modernizado `GeneratorPanel` con type safety explícita
- ✅ Regenerado `pnpm-lock.yaml` (consistency)
- ✅ Build optimizado: 4 rutas generadas
- ✅ TypeScript strict: sin errores
- ✅ ESLint: sin warnings

**Impacto:**
- Reducción de -4545 líneas (limpieza)
- Eliminados 6 archivos huérfanos
- Build time: 5.1s ✅

---

## 🔧 Configuración Importante

### TypeScript (strict mode)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Next.js
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
};
```

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 📋 Qué hacer ahora

1. **Desarrollo** → Usa `pnpm run dev` para cambios locales
2. **Testing** → Ejecuta `pnpm run lint && pnpm run type-check` antes de commitear
3. **Production** → `pnpm run build` genera `.next/` optimizado
4. **Monitoring** → Revisar `/dashboard` para analytics

---

## 🐛 Troubleshooting

**Build error con app/(app)/**
→ Ya resuelto (commit e0c509a). Las rutas viejas fueron eliminadas.

**pnpm-lock.yaml corrupto**
→ Ejecuta: `pnpm install --force` desde la raíz del monorepo

**TypeScript errors en .next/**
→ Borra `.next/` y recompila: `pnpm run build`

---

## 📚 Documentación Relacionada

- [Monorepo Master](../../CLAUDE.md) — Governanza de los 6 repos
- [lib CLAUDE.md](../../lib/CLAUDE.md) — Librería compartida
- [Supabase Setup](./backend/) — API & database

---

**Última actualización:** 2026-06-05  
**Status:** ✅ Operacional y listo para producción  
**Mantenedor:** Claude Code (Autonomous Mode)
---

## PROTOCOLO GLOBAL: Almacenamiento de Archivos Generados

REGLA ABSOLUTA: Todos los archivos generados van en docs/[tipo]/ del proyecto.

Si docs/ no existe, se crea automaticamente con estructura:
- docs/instructions/ (Instrucciones, README)
- docs/database/ (SQL migrations, schemas)
- docs/analysis/ (Audits, reports)
- docs/api/ (OpenAPI specs)
- docs/architecture/ (Diagramas)
- docs/deployment/ (Deploy, Docker)
- docs/generated/ (Otros)

Confirmacion: Se reportara - Guardado en: docs/[tipo]/[archivo]

Documentacion: E:\git\app\PROTOCOLO-GLOBAL-ARCHIVOS.md

---
---

## INSTRUCCION CRITICA: Leer Master.env al iniciar servidores

OBLIGATORIO cada vez que inicie servidores:

1. LEER E:\master.env (PRIMERO - OBLIGATORIO)
2. EXTRAER puertos: [PROYECTO]_FRONTEND_PORT, [PROYECTO]_BACKEND_PORT
3. VERIFICAR: . E:\scripts\verify-ports.ps1
4. REUTILIZAR procesos existentes (NO reiniciar)
5. INICIAR solo los faltantes
6. USAR puerto EXACTO de master.env (NO automatico)

Puertos en master.env (2026-06-10):
- 3000 (main), 3002 (io-semantico-front), 3003 (io-neruda-front)
- 3004 (io-prospector-front), 4000 (io-semantico-back)
- 4005 (io-neruda-back), 4006 (io-prospector-back)
- 5000 (io-semantico-python), 6379 (redis)

Documentacion: E:\git\app\INSTRUCCION-LEER-MASTER-ENV.md

---
---

## INSTRUCCION: Crear Nuevo Proyecto (con CLAUDE.md)

Cada nuevo proyecto DEBE incluir CLAUDE.md desde el inicio.

CHECKLIST para nuevo proyecto:
[ ] Carpeta creada: E:\git\app\[TIPO]\[NOMBRE]
[ ] CLAUDE.md creado con instrucciones globales
[ ] Puertos agregados a E:\master.env
[ ] Estructura docs/ creada
[ ] Agregado a pnpm-workspace.yaml
[ ] pnpm install sin errores
[ ] tsc --noEmit sin errores

Documentacion completa: E:\git\app\INSTRUCCION-CREAR-NUEVO-PROYECTO.md

---
---

## INSTRUCCION: Archivos de Configuracion para Nuevo Proyecto

Despues de crear estructura base, necesitas estos 10 archivos:

OBLIGATORIOS:
- .gitignore (Ignorar node_modules, .env.local, dist, etc)
- .env.example (Template sin valores reales)
- .env.local (Desarrollo local - NO versionado)
- next.config.js (Si es Next.js)
- tailwind.config.js (Si usa Tailwind)
- .eslintrc.json (Linting rules)
- prettier.config.js (Formato codigo)
- tsconfig.json (TypeScript config)
- README.md (Documentacion basica)
- src/ (Estructura de codigo)

OPCIONAL:
- .github/workflows/ci.yml (GitHub Actions)

Documentacion completa: E:\git\app\INSTRUCCION-ARCHIVOS-CONFIGURACION-PROYECTO.md

---
---

## INSTRUCCION: Estructura de Carpeta /docs/

La carpeta /docs/ es para documentacion operacional y referencia (NO codigo).

ESTRUCTURA RECOMENDADA:
docs/
├── README.md (Indice)
├── QUICK-START.md
├── setup/ (Instalacion)
├── usage/ (Uso)
├── architecture/ (Diseno)
├── database/ (Esquemas BD)
├── deployment/ (Deploy)
├── development/ (Desarrollo)
├── changelog/ (Historial)
├── operations/ (Operacion)
├── security/ (Seguridad)
├── troubleshooting/ (Problemas)
└── resources/ (Recursos)

QUE VA EN /docs/:
✓ Instrucciones de uso
✓ Esquemas de BD (para ejecutar manualmente)
✓ Guias de configuracion
✓ Procesos operacionales
✓ Decisiones de arquitectura
✓ Historias de cambios

QUE NO VA EN /docs/:
✗ Codigo fuente (va en src/)
✗ Archivos de configuracion (van en raiz)
✗ Tests (van en tests/)

Documentacion completa: E:\git\app\INSTRUCCION-CARPETA-DOCS-COMPLETA.md

---