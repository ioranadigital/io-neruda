# Phase 2 Roadmap: Frontend Implementation

**Project:** IO Neruda - Content Generation System v2.0  
**Phase:** 2 (Frontend)  
**Timeline:** 1-2 weeks  
**Team:** Ricardo (Director) + Claude Code (Developer)  
**Status:** 🎯 Ready to Start

---

## 🎯 PHASE 2 OBJECTIVES

Build a **unified React panel** for the Content Generation System that allows users to:
1. ✨ Generate multi-format content in **3 clicks**
2. 📊 Track batch jobs in **real-time**
3. 💾 Manage generated content with **versioning**
4. 🎨 Create custom **email templates**
5. 🔄 Sync offline with **IndexedDB**
6. 🚀 Integrate with **Claude API** (optional)

---

## 📦 DELIVERABLES (Phase 2)

### 1. React Components (10-15 components)

**Core Panels:**
- `GeneratorPanel.tsx` — Main unified interface
- `QuickGenerate.tsx` — 3-click generation flow
- `ConfigBuilder.tsx` — Configuration manager
- `ContentGallery.tsx` — View & edit generated content
- `BatchMonitor.tsx` — Real-time batch progress
- `EmailTemplateBuilder.tsx` — Custom template UI
- `VersionHistory.tsx` — Content versions & alternatives

**Utility Components:**
- `FormatSelector.tsx` — Multi-format toggles
- `ToneSelector.tsx` — Tone/style picker
- `KeywordInput.tsx` — Keyword management
- `ProgressBar.tsx` — Batch progress visualization
- `TemplatePreview.tsx` — Email template preview

### 2. State Management (React Context)

**Global State:**
- `GeneratorContext.tsx` — Configurations & templates
- `ContentContext.tsx` — Generated content storage
- `BatchContext.tsx` — Batch job tracking
- `OfflineContext.tsx` — IndexedDB sync state

### 3. API Integration Layer

**Hooks:**
- `useGenerator.ts` — Content generation hook
- `useBatchJobs.ts` — Batch processing hook
- `useConfigurations.ts` — Config CRUD hook
- `useEmailTemplates.ts` — Template management hook
- `useOfflineSync.ts` — IndexedDB synchronization

### 4. Offline-First (IndexedDB)

**Database Schema:**
- `configurations` — Local config cache
- `generated_content` — Generated content cache
- `sync_queue` — Pending API calls
- `batch_jobs` — Batch tracking

**Sync Strategy:**
- Auto-sync on online
- Queue offline requests
- Conflict resolution
- Background sync

### 5. Styling & UX

**UI Framework:** Tailwind CSS v4 (Already in project)

**Pages:**
- `/generators` — Main generator page
- `/generators/history` — Content history
- `/generators/templates` — Email templates
- `/generators/settings` — User preferences

---

## 📅 WEEK-BY-WEEK BREAKDOWN

### Week 1: Foundation (Days 1-5)

#### Day 1: Project Setup
- [ ] Create React component structure
- [ ] Setup Tailwind CSS
- [ ] Create context providers
- [ ] Setup TypeScript interfaces

**Deliverable:** Component boilerplate + context setup

#### Day 2: Core Panels
- [ ] Build `GeneratorPanel` layout
- [ ] Create `QuickGenerate` 3-step flow
- [ ] Build `FormatSelector` component
- [ ] Build `ToneSelector` component

**Deliverable:** Interactive UI mockup (non-functional)

#### Day 3: API Integration - Part 1
- [ ] Create `useGenerator` hook
- [ ] Create `useConfigurations` hook
- [ ] Implement config CRUD
- [ ] Wire up generator endpoint

**Deliverable:** Working config management

#### Day 4: API Integration - Part 2
- [ ] Create `useBatchJobs` hook
- [ ] Create batch monitoring UI
- [ ] Implement real-time progress
- [ ] Add batch result display

**Deliverable:** Working batch processing

#### Day 5: Content Management
- [ ] Build `ContentGallery` component
- [ ] Build `VersionHistory` component
- [ ] Implement PUT endpoint (update content)
- [ ] Add content filtering/search

**Deliverable:** Full content management interface

### Week 2: Advanced Features (Days 6-10)

#### Day 6: Offline-First
- [ ] Setup IndexedDB schema
- [ ] Create `useOfflineSync` hook
- [ ] Implement auto-sync on online
- [ ] Add sync status indicator

**Deliverable:** Working offline support

#### Day 7: Email Templates
- [ ] Build `EmailTemplateBuilder`
- [ ] Build `TemplatePreview`
- [ ] Implement custom template CRUD
- [ ] Add template variables support

**Deliverable:** Custom email template UI

#### Day 8: Polish & Testing
- [ ] Responsive design (mobile)
- [ ] Error handling UI
- [ ] Loading states
- [ ] Toast notifications
- [ ] Form validation

**Deliverable:** Production-ready UI

#### Day 9: Claude API Integration (Optional)
- [ ] Add API key input
- [ ] Toggle mock vs Claude
- [ ] Real content generation
- [ ] Rate limiting UI

**Deliverable:** Optional Claude API feature

#### Day 10: Documentation & Deployment
- [ ] Component documentation
- [ ] User guide
- [ ] Deployment setup
- [ ] Performance optimization

**Deliverable:** Production-ready application

---

## 🏗️ PROJECT STRUCTURE

```
E:\git\app\tools\io-neruda\frontend/
├── src/
│   ├── components/
│   │   ├── panels/
│   │   │   ├── GeneratorPanel.tsx
│   │   │   ├── ConfigBuilder.tsx
│   │   │   ├── ContentGallery.tsx
│   │   │   └── BatchMonitor.tsx
│   │   ├── selectors/
│   │   │   ├── FormatSelector.tsx
│   │   │   ├── ToneSelector.tsx
│   │   │   └── KeywordInput.tsx
│   │   └── shared/
│   │       ├── ProgressBar.tsx
│   │       └── TemplatePreview.tsx
│   ├── hooks/
│   │   ├── useGenerator.ts
│   │   ├── useBatchJobs.ts
│   │   ├── useConfigurations.ts
│   │   ├── useEmailTemplates.ts
│   │   └── useOfflineSync.ts
│   ├── context/
│   │   ├── GeneratorContext.tsx
│   │   ├── ContentContext.tsx
│   │   ├── BatchContext.tsx
│   │   └── OfflineContext.tsx
│   ├── services/
│   │   ├── api.ts (API client)
│   │   ├── indexeddb.ts (DB operations)
│   │   └── sync.ts (Offline sync)
│   ├── types/
│   │   └── generator.ts
│   ├── pages/
│   │   ├── GeneratorPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   └── App.tsx
├── public/
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 UI MOCKUP FLOW

### 3-Click Generation Flow

```
Click 1: Select Project/Format
┌─────────────────────────────┐
│ Select Your Project:        │
│ [Dropdown ▼]               │
│                             │
│ Select Formats:            │
│ ☑ Blog   ☐ Email           │
│ ☐ LinkedIn ☐ Instagram     │
└─────────────────────────────┘
         ↓ NEXT

Click 2: Configure Content
┌─────────────────────────────┐
│ Content Title:              │
│ [________________]          │
│                             │
│ Keywords (comma-separated): │
│ [________________]          │
│                             │
│ Tone: [Professional ▼]     │
└─────────────────────────────┘
         ↓ NEXT

Click 3: Generate & Review
┌─────────────────────────────┐
│ Generating... 65%            │
│ ████████░░░░░░░░░░         │
│                             │
│ Blog post... ✅             │
│ Email... ⏳                  │
└─────────────────────────────┘
         ↓ DONE

Generated Content View
┌─────────────────────────────┐
│ Blog Post                    │
│ ════════════════════════════ │
│                             │
│ # Generated Title           │
│                             │
│ This is the generated...    │
│                             │
│ [Edit] [Publish] [Delete]  │
└─────────────────────────────┘
```

---

## 🔌 API ENDPOINTS USED

**From Phase 1 Backend:**
- `POST /api/generators/config` — Save configurations
- `GET /api/generators/config/:projectId` — List configs
- `POST /api/generators/generate` — Generate content
- `GET /api/generators/generated/:contentId` — Get versions
- `PUT /api/generators/generated/:id` — Update content
- `POST /api/generators/batch` — Start batch
- `GET /api/generators/batch/:jobId` — Get progress
- `GET /api/generators/email-templates` — List templates

**All endpoints documented in:** `backend/API_ENDPOINTS.md`

---

## 📊 STATE MANAGEMENT EXAMPLE

```typescript
// GeneratorContext - Global state
interface GeneratorState {
  configurations: Configuration[];
  selectedConfig: Configuration | null;
  generatedContent: GeneratedContent[];
  batchJobs: BatchJob[];
  emailTemplates: EmailTemplate[];
  isLoading: boolean;
  error: string | null;
}

// Actions
type GeneratorAction =
  | { type: 'SET_CONFIGS'; payload: Configuration[] }
  | { type: 'CREATE_CONFIG'; payload: Configuration }
  | { type: 'START_GENERATION'; payload: string }
  | { type: 'UPDATE_CONTENT'; payload: GeneratedContent }
  | { type: 'UPDATE_BATCH'; payload: BatchJob }
  | { type: 'SET_ERROR'; payload: string };
```

---

## 🧪 TESTING STRATEGY

**Unit Tests:** React Testing Library
```typescript
test('QuickGenerate shows 3 steps', () => {
  render(<QuickGenerate />);
  expect(screen.getByText('Step 1')).toBeInTheDocument();
});
```

**Integration Tests:** E2E with Playwright
```typescript
test('End-to-end generation workflow', async () => {
  // 1. Select config
  // 2. Fill form
  // 3. Generate
  // 4. Verify results
});
```

**API Tests:** Against running backend
```typescript
test('Generate endpoint works', async () => {
  const result = await generateContent({...});
  expect(result.status).toBe(200);
});
```

---

## 🚀 DEPLOYMENT

### Local Development
```bash
cd E:\git\app\tools\io-neruda\frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Hosting Options
1. **Vercel** (Recommended for Next.js projects)
2. **Netlify** (Simple React deployment)
3. **Self-hosted** (Hetzner VPS)

---

## 🎯 SUCCESS CRITERIA

### Functionality
- ✅ 3-click generation works
- ✅ Real-time batch monitoring
- ✅ Content versioning
- ✅ Offline support
- ✅ Email template builder

### Performance
- ✅ Page load < 2s
- ✅ Generation UI updates < 500ms
- ✅ IndexedDB sync < 100ms
- ✅ Responsive on mobile

### Code Quality
- ✅ 80%+ test coverage
- ✅ TypeScript strict mode
- ✅ ESLint clean
- ✅ Accessibility (WCAG AA)

---

## 📋 DEPENDENCIES

**Already in project:**
- React 18+
- TypeScript 5.x
- Tailwind CSS v4
- Next.js (optional)

**To install:**
```json
{
  "react-context-api": "built-in",
  "idb": "^8.0.0",
  "axios": "^1.6.0",
  "date-fns": "^2.30.0",
  "react-icons": "^4.12.0",
  "@testing-library/react": "^14.0.0",
  "@playwright/test": "^1.40.0"
}
```

---

## 🔄 GIT WORKFLOW

```bash
# Create feature branch
git checkout -b feat/phase2-generator-panel

# Work on features
git add .
git commit -m "Add QuickGenerate component"

# Push and create PR
git push origin feat/phase2-generator-panel
# Create PR in GitHub

# Merge when ready
git checkout main
git merge feat/phase2-generator-panel
```

---

## 📞 TEAM COMMUNICATION

**Daily Standup:** 10am
- What's done
- Blockers
- Today's focus

**Weekly Demo:** Friday
- Show progress
- Gather feedback
- Plan next week

---

## 🎓 PHASE 2 SUCCESS LOOKS LIKE

✨ Users can:
1. Open the app
2. Click 3 times
3. Get generated content in 5 formats
4. Manage it offline
5. Sync when online

🚀 Backend + Frontend working seamlessly  
📊 Real-time batch progress tracking  
💾 Full offline support  
🎯 Production-ready code

---

## 📝 NEXT STEPS

1. ✅ Execute Supabase SQL fix
2. ✅ Verify backend tests pass
3. **Create React app structure** ← START HERE
4. Setup TypeScript + Tailwind
5. Build GeneratorPanel component
6. Integrate API hooks
7. Add offline support
8. Deploy to Vercel

---

**Ready to build Phase 2? Let's go! 🚀**

Start date: [When SQL fix executed]  
Estimated completion: 1-2 weeks  
Status: 🎯 Ready
