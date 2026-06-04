# 🚀 DEPLOYMENT GUIDE - IO NERUDA FRONTEND

**Status:** Production-Ready  
**Last Updated:** 2026-06-04  
**Framework:** Next.js 15 (App Router)  
**Hosting:** Vercel  

---

## Prerequisites

- Node.js 20+
- pnpm 9+
- Vercel CLI (`npm i -g vercel`)
- Git for version control
- Valid Supabase credentials

---

## Environment Setup

### 1. Local Development (.env.local)

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4005
NODE_ENV=development
```

### 2. Vercel Environment Variables

Set in Vercel dashboard under Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
NEXT_PUBLIC_API_URL = https://api.yourdomain.com
NEXT_PUBLIC_ENABLE_OFFLINE_MODE = true
NEXT_PUBLIC_ENABLE_PWA = true
```

---

## Pre-Deployment Checklist

### Code Quality

```bash
# Type checking
pnpm run type-check

# Linting
pnpm run lint

# Testing
pnpm run test
pnpm run test:e2e
```

### Build Verification

```bash
# Production build
pnpm run build

# Verify build output
ls -la .next/
```

### Performance Audit

```bash
# Lighthouse score (requires Chromium)
npx lighthouse https://localhost:3000 --view
```

---

## Deployment Methods

### Method 1: Vercel CLI (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy to staging
vercel --prod=false

# Deploy to production
vercel --prod
```

### Method 2: Git Integration

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Push to `main` branch for auto-deployment
4. Automatic preview deployments on PRs

### Method 3: PowerShell Script

```powershell
cd E:\git\app\tools\io-neruda
.\scripts\deploy.ps1 -Environment staging
# or
.\scripts\deploy.ps1 -Environment production
```

---

## Post-Deployment Verification

### 1. Health Check

```bash
# Check deployment status
vercel status

# View deployment logs
vercel logs
```

### 2. Smoke Tests

```bash
# Test main pages
curl -I https://your-app.vercel.app/
curl -I https://your-app.vercel.app/dashboard
curl -I https://your-app.vercel.app/generators
```

### 3. E2E Tests on Live

```bash
# Update baseURL in playwright.config.ts
# baseURL: 'https://your-app.vercel.app'

pnpm run test:e2e --project=chromium
```

### 4. Performance Monitoring

- Check Core Web Vitals in Vercel Analytics
- Monitor Lighthouse scores
- Check error logs in monitoring service

---

## Rollback Procedures

### Quick Rollback

```bash
# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback
```

### Manual Rollback

1. Identify stable deployment in Vercel dashboard
2. Set it as production in Domains section
3. Monitor error logs for issues

---

## Monitoring & Logging

### Enable Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable "Web Analytics" and "Real Experience Scoring"
3. Monitor in Vercel dashboard

### Error Tracking (Optional)

```env
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

Then implement in `app/layout.tsx`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Service Worker Monitoring

Check browser console for Service Worker registration:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('SW registered:', regs.length);
  });
}
```

---

## Performance Optimization

### Bundle Analysis

```bash
# Analyze production bundle
npm run analyze
```

### Image Optimization

- All images should use Next.js `Image` component
- Use dynamic imports for heavy components
- Enable image optimization in Vercel settings

### Cache Strategy

- Static pages: Long TTL (1 year)
- Dynamic pages: Short TTL (1 minute)
- API routes: No cache (revalidate immediately)

---

## Scaling Considerations

### Database Connection Pooling

Supabase automatically handles connection pooling for PostgreSQL.

### Rate Limiting

Implement rate limiting on API endpoints:

```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});
```

### CDN Caching

Vercel Edge Network automatically caches:
- Static assets
- Static generated pages
- ISR pages

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm run build
```

### Slow Initial Load

- Check for large dependencies in bundle
- Enable compression (automatic in Vercel)
- Use dynamic imports for heavy features

### Environment Variable Issues

```bash
# Verify env vars are set
vercel env pull

# Check in running application
curl https://your-app.vercel.app/api/config
```

### Service Worker Issues

- Clear browser cache: Ctrl+Shift+Delete
- Check browser console for SW registration errors
- Verify `public/sw.js` is accessible

---

## Maintenance

### Regular Tasks

- Weekly: Monitor error logs
- Bi-weekly: Check performance metrics
- Monthly: Review bundle size trends
- Quarterly: Update dependencies

### Dependency Updates

```bash
# Check outdated packages
pnpm outdated

# Update safely
pnpm up --interactive
pnpm run build
pnpm run test
```

---

## Disaster Recovery

### Data Backup

```bash
# Backup Supabase database
supabase db pull > backup.sql

# Backup IndexedDB (user action)
# Stored locally in browser, auto-syncs to server
```

### Restore from Backup

```bash
# Push database backup
supabase db push < backup.sql
```

---

## Support & Documentation

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Project Repo:** E:\git\app\tools\io-neruda

---

**Last Review:** 2026-06-04  
**Next Review:** 2026-07-04  
**Status:** ✅ Production Ready

Contact team for deployment approval.
