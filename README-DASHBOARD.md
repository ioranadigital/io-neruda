# io-neruda Dashboard

Sistema de gestión de contenidos multipropósito con interfaz web local (VPS-ready).

## Instalación Rápida

### 1. Preparar Supabase

Copia el contenido de `SUPABASE-SCHEMA.sql` y ejecutalo en Supabase SQL Editor:

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. SQL Editor → New Query
4. Pega el contenido y ejecuta

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Instalar Dependencias

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 4. Ejecutar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
cp .env.example .env.local
npm run dev
```

Backend en http://localhost:4003

**Terminal 2 - Frontend:**
```bash
cd frontend
cp .env.example .env.local
npm run dev
```

Frontend en http://localhost:3003

## Docker (VPS)

```bash
docker-compose up -d
```

Acceso:
- Frontend: http://localhost:3003
- Backend: http://localhost:4003/health

## Estructura de Directorios

```
frontend/                     ← Next.js 15
├── app/
│   ├── (app)/
│   │   ├── dashboard/        ← Estadísticas
│   │   ├── proyectos/        ← Lista de proyectos
│   │   ├── [proyecto]/       ← Pipeline (3 columnas)
│   │   └── config/           ← Configuración
│   └── layout.tsx
├── components/               ← React components
├── lib/
│   ├── api.ts               ← Cliente HTTP centralizado
│   └── supabase.ts          ← Cliente Supabase
└── package.json

backend/                      ← Node.js + Express
├── routes/
│   ├── projects.routes.js    ← CRUD proyectos
│   ├── content.routes.js     ← CRUD contenidos
│   ├── export.routes.js      ← Exportar
│   └── publish.routes.js     ← Publicar a WordPress
├── services/
│   ├── pipeline.service.js   ← Leer/escribir filesystem
│   ├── export.service.js     ← Ejecutar exporters Python
│   └── wordpress.service.js  ← XML-RPC
├── config/
│   └── supabase.js           ← Conexión Supabase
├── utils/
│   └── logger.js             ← Winston logger
└── server.js
```

## API Endpoints

### Proyectos
- `GET /api/projects` - Listar
- `GET /api/projects/:name` - Obtener
- `POST /api/projects` - Crear
- `PATCH /api/projects/:name` - Actualizar
- `GET /api/projects/:name/stats` - Estadísticas

### Contenido
- `GET /api/content?project=&stage=` - Listar
- `GET /api/content/:id` - Obtener
- `POST /api/content` - Crear
- `PATCH /api/content/:id` - Actualizar
- `DELETE /api/content/:id` - Eliminar
- `POST /api/content/:id/promote` - Mover a siguiente stage

### Exportar
- `POST /api/export` - Ejecutar exportación
- `GET /api/export` - Historial
- `GET /api/export/download/:id` - Descargar

### Publicar
- `POST /api/publish/wordpress` - Publicar a WordPress
- `GET /api/publish/history` - Historial

## Integración con Exporters Python

El backend ejecuta los scripts Python existentes via `child_process`:

```javascript
// export.service.js
const python = spawn('python', [
  'scripts/publish.py',
  '--project', projectName,
  '--file', filename,
  '--target', ...targets,
]);
```

## Paleta de Colores

- Background: zinc-950 / zinc-900
- Borders: zinc-800
- Textos: zinc-200 / zinc-400
- Acento: blue-600 / blue-500

## Próximas Fases

**Fase 2:** Backend CRUD + Pipeline service (45min)
**Fase 3:** Frontend core (dashboard, proyectos, pipeline) (60min)
**Fase 4:** Editor + Exportar panel (45min)
**Fase 5:** Publish + Docker (30min)

## Debugging

### Backend logs
```bash
tail -f logs/combined.log
```

### Frontend console
Browser DevTools → Console

### Supabase schema
```sql
SELECT * FROM neruda_projects;
SELECT * FROM neruda_contents;
```

## Documentación

- [io-neruda Instructions](../docs/INSTRUCCIONES-io-neruda.md)
- [Exporters Guide](../EXPORTERS.md)
- [SurfVintage Migration](../docs/MIGRACION-SURFVINTAGE.md)

---

**Status:** Phase 1 Scaffolding ✅  
**Next:** Phase 2 - Backend CRUD
