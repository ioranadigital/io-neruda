# 🚀 QUICK START - io-neruda Dashboard

¡Las tablas ya están creadas! Aquí está cómo ejecutar el dashboard.

## Paso 1: Configurar Backend

```powershell
cd E:\git\app\tools\io-neruda\backend

# Crear .env.local
cp .env.example .env.local
```

Edita `backend\.env.local` y copia credenciales desde `E:\master.env`:
- `SUPABASE_URL` ← `SUPABASE_URL` de master.env
- `SUPABASE_KEY` ← `SUPABASE_SERVICE_KEY` de master.env (la que tiene "service_role")
- Otras variables ya están preconfiguradas

```powershell
# Instalar dependencias
npm install
```

## Paso 2: Configurar Frontend

```powershell
cd E:\git\app\tools\io-neruda\frontend

# Crear .env.local
cp .env.example .env.local
```

Edita `frontend\.env.local` y copia desde `E:\master.env`:
- `NEXT_PUBLIC_SUPABASE_URL` ← `NEXT_PUBLIC_SUPABASE_URL` de master.env
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← `NEXT_PUBLIC_SUPABASE_ANON_KEY` de master.env

```powershell
# Instalar dependencias
npm install
```

## Paso 3: Ejecutar

**Terminal 1 - Backend:**
```powershell
cd E:\git\app\tools\io-neruda\backend
npm run dev
```

Deberías ver: `🚀 Backend running on http://localhost:4003`

**Terminal 2 - Frontend:**
```powershell
cd E:\git\app\tools\io-neruda\frontend
npm run dev
```

Deberías ver: `▲ Ready in Xs - Local: http://localhost:3003`

## Paso 4: Acceder

👉 **http://localhost:3003**

- Dashboard con estadísticas
- Lista de proyectos (verás "surfvintage")
- Click en un proyecto → Pipeline de 3 columnas (Insights | Planes | Ready)

## ¿Problemas?

| Error | Solución |
|-------|----------|
| `Port 4003 already in use` | Cambia PORT en backend/.env.local |
| `Port 3003 already in use` | Usa `npm run dev -- -p 3001` |
| `SUPABASE_KEY error` | Verifica que copiaste la SERVICE_ROLE_KEY (no la anon key) |
| `API connection failed` | Backend debe estar ejecutándose primero |

## Siguientes pasos

✅ **Phase 3 (Frontend Core)** - DONE
- Dashboard ✓
- Lista de proyectos ✓
- Vista pipeline kanban ✓

📋 **Phase 4 (Editor + Export)** - TODO
- Editor markdown con preview
- Panel de exportación
- Selector de formatos

🚀 **Phase 5 (Publish + Docker)** - TODO
- Publicación a WordPress
- Docker compose
- VPS deployment

---

**Status:** Phase 3 Complete ✅
**Ready:** Yes, el dashboard está listo para usar!
