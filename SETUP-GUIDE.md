# Setup Guide - io-neruda Dashboard

Complete setup instructions for running the dashboard locally and on VPS.

## Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- Python 3.11 (for exporters)

## Step 1: Supabase Configuration

### 1a. Create Supabase Project

1. Go to https://app.supabase.com
2. Create a new project
3. Wait for it to initialize (5-10 minutes)

### 1b. Create Database Schema

1. Go to **SQL Editor** → **New Query**
2. Copy entire contents from `SUPABASE-SCHEMA.sql`
3. Execute the query
4. Verify tables created: neruda_projects, neruda_contents, neruda_exports, neruda_publications

### 1c. Get Credentials

From Supabase project settings:

- **Project Settings** → **API**
  - Copy `Project URL` → `SUPABASE_URL`
  - Copy `service_role key` → `SUPABASE_KEY` (backend only)
  - Copy `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (frontend)

## Step 2: Local Development Setup

### 2a. Clone & Install

```bash
cd E:\git\app\tools\io-neruda

# Install frontend deps
cd frontend
npm install

# Install backend deps
cd ../backend
npm install
```

### 2b. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env.local
```

Edit `backend/.env.local`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
NODE_ENV=development
PORT=4003
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4003/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2c. Run Backend

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Backend running on http://localhost:4003
```

Test health endpoint:
```bash
curl http://localhost:4003/health
```

### 2d. Run Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 15.0.0
 ⚡ Ready in 3.5s
 Local: http://localhost:3003
```

Visit: http://localhost:3003

## Step 3: Test the API

### Test: List Projects

```bash
curl http://localhost:4003/api/projects
```

Should return empty array: `[]`

### Test: Create Project

```bash
curl -X POST http://localhost:4003/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-project",
    "displayName": "Test Project",
    "type": "blog"
  }'
```

Expected response:
```json
{
  "id": "uuid-here",
  "name": "test-project",
  "display_name": "Test Project",
  "type": "blog",
  "status": "active",
  "created_at": "2026-05-29T...",
  "updated_at": "2026-05-29T..."
}
```

This automatically creates folders in:
```
E:\lib\003-Pipeline-Contenidos\test-project\
├── 00-Config\
├── 01-Buzon-Insights\
├── 02-Generador-Planes\
├── 03-Ready-To-Publish\
└── assets\
```

### Test: Create Content

```bash
curl -X POST http://localhost:4003/api/content \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "uuid-from-previous-response",
    "projectName": "test-project",
    "stage": "insight",
    "filename": "my-insight.md",
    "title": "My First Insight",
    "body": "# Heading\n\nSome content here."
  }'
```

This creates file: `E:\lib\003-Pipeline-Contenidos\test-project\01-Buzon-Insights\my-insight.md`

### Test: List Contents

```bash
curl "http://localhost:4003/api/content?project=test-project&stage=insight"
```

## Step 4: Frontend Testing

### Navigate to Dashboard

http://localhost:3003/dashboard

- Should show 1 project, 0 contents, 0 exports

### Navigate to Proyectos

http://localhost:3003/proyectos

- Should see "Test Project" card
- Click to view project pipeline

## Troubleshooting

### Backend won't start

**Error:** `❌ Faltan SUPABASE_URL y SUPABASE_KEY`

**Fix:** Verify `.env.local` has correct credentials

**Error:** `Port 4003 already in use`

**Fix:** Kill process or change PORT in `.env.local`

### Frontend blank screen

**Fix:** 
1. Check browser console (F12) for errors
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Backend health check: `curl http://localhost:4003/health`

### Supabase connection errors

**Fix:**
1. Verify internet connection
2. Check Supabase project is online
3. Verify credentials in `.env.local`

### File creation fails

**Fix:**
1. Verify `E:\lib\003-Pipeline-Contenidos\` exists
2. Check Windows file permissions
3. Verify path in `PIPELINE_ROOT` env var

## Docker Deployment (VPS)

### Prerequisites

- Docker + Docker Compose installed
- All `.env.local` variables ready

### Build & Deploy

```bash
cd E:\git\app\tools\io-neruda

# Create .env file for docker-compose
cp .env.example .env

# Edit .env with your Supabase credentials

# Build and run
docker-compose up -d
```

Access:
- Frontend: http://your-vps-ip:3003
- Backend: http://your-vps-ip:4003/health

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

## Next Steps

1. ✅ Phase 1 (Scaffolding) - DONE
2. ✅ Phase 2 (Backend CRUD) - DONE
3. Phase 3 (Frontend Core) - TODO
4. Phase 4 (Editor + Export) - TODO
5. Phase 5 (Publish + Docker) - TODO

## Support

- Backend logs: `E:\git\app\tools\io-neruda\backend\logs\`
- Frontend dev tools: Browser DevTools (F12)
- Database: Supabase SQL Editor

---

**Status:** Phase 2 Complete ✅  
**Guides:**
- [Dashboard README](README-DASHBOARD.md)
- [io-neruda Instructions](docs/INSTRUCCIONES-io-neruda.md)
- [Exporters Guide](EXPORTERS.md)
