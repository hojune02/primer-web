# CLAUDE.md — Project Context & Operating Instructions

## Name & Brand

**Product name**: Primer
**Tagline**: "Apply once. Stick forever." / "Record once. Train forever."
**Domain targets**: tryprimer.com · primer.app · getprimer.io
**Brand color**: #7F77DD (PVC primer purple)
**Logo**: Two right-pointing chevrons (>>) — geometric, scalable SVG in `PrimerLogo.tsx`. Inspired by Vercel's minimalist triangle. Meaning: step-by-step progress, record → train, forward motion.

### Why "Primer"
Three simultaneous meanings:
1. **Trade tool**: A primer coat is used by every trade we serve — HVAC, plumbing, electrical, painting. It's the base layer that makes everything else stick.
2. **Documentation**: A "primer" is a foundational guide — exactly what our SOPs are.
3. **To prime**: "Prime your crew" = prepare them fully before they touch the job.

---

## Mission
Build **Primer** — an AI-powered video-to-SOP (Standard Operating Procedure) platform targeting home service businesses (HVAC, plumbing, cleaning, landscaping, electrical). Goal: $100K/month profit within 18 months of launch.

## The Business in One Sentence
Record a 2-minute video of yourself doing any job → Primer's AI automatically generates a structured, step-by-step SOP → your technicians access it from their phone and complete training with a quiz.

## Revenue Target
- **Starter**: $99/month — up to 10 team members
- **Growth**: $149/month — up to 25 team members
- **Scale**: $199/month — up to 50 team members
- **Goal**: 1,000+ paying businesses within 18 months → ~$100K MRR

---

## Competitive Positioning

### Primary competitor: Trainual ($32.6M ARR, 8,000 customers)
- Requires MANUAL content creation (hours per SOP)
- Moving upmarket, abandoning SMBs (hid pricing in 2025)
- Desktop-first, not built for field workers

### Secondary competitor: Loom (acquired by Atlassian for $975M)
- AI metadata (title, summary) but NO structured SOP generation
- Now Atlassian-focused → irrelevant to home service businesses
- Screen recording only, not physical job demonstration

### Our gap: AI-native + mobile-first + affordable + video input
Neither Trainual nor Loom occupies this quadrant. We do.

| Product | Price | Gap We Exploit |
|---|---|---|
| Trainual | ~$340/mo avg | Manual creation, not mobile-first, moving upmarket |
| Notion | $8-15/user/mo | No training structure, no video capture |
| Loom | $12.50/user/mo | No SOP generation, Atlassian-focused |
| Google Docs | Free | No training structure, no completion tracking |
| ServiceTitan | $398+/mo | Operations-focused, no SOP/training module |

---

## Target Customer
**Home service business owners with 3–25 employees**
- HVAC contractors (105,000 in US)
- Residential cleaning (1.2M businesses)
- Plumbing (480,000)
- Landscaping (600,000+)
- Electrical (70,000+)
- **TAM**: 5M+ home service businesses in the US

**Key pain points:**
1. 40–60% annual technician turnover → constant retraining cost
2. Processes live in the owner's head → quality inconsistency when they leave
3. Existing tools (Notion, Google Docs) are too complex for field workers
4. New hires take 4–6 weeks to be productive without documentation
5. Trainual is priced for 150-person companies, not 8-person crews

**ROI argument**: One technician onboarded 2 weeks faster = $1,600+ saved. Primer at $99/month = $1,188/year. ROI is 5x in year one.

---

## Actual Tech Stack (as built)

### Frontend — `apps/web`
- **Next.js 16.2.2** (App Router, Turbopack)
- **Tailwind CSS v4** (via `@import "tailwindcss"`)
- **TypeScript** throughout
- **Geist font** (Next.js built-in)
- **Design system**: Vercel-inspired dark theme — pure black bg, `#111` cards, `rgba(255,255,255,0.08)` borders, gradient headings

### Backend — `apps/api`
- **Fastify 4** (Node.js, TypeScript)
- **tsx watch** for development hot-reload
- **dotenv/config** for environment variables
- **@fastify/jwt** — stateless JWT auth (Bearer tokens)
- **@fastify/cors** — origin-restricted CORS
- **@fastify/multipart** — video file uploads (500MB limit)
- **bcryptjs** — password hashing (12 rounds)
- **pino-pretty** — structured logging
- **Stripe** — webhook handling for subscriptions
- **@aws-sdk/client-s3** — Cloudflare R2 video uploads (S3-compatible API)
- **resend** — transactional email (invite emails)

### Database — `packages/db`
- **PostgreSQL** via **Supabase** (hosted)
- **Prisma 5** ORM — type-safe queries, schema-first
- **Direct connection only**: `DATABASE_URL` uses port 5432 exclusively — for both runtime queries and migrations
- Schema deployed via `prisma migrate diff --from-empty --to-schema-datamodel` → SQL run in Supabase SQL editor

### AI Pipeline — `packages/ai`
- **OpenAI Whisper API** (`whisper-1`) — audio transcription with segment timestamps
- **Anthropic Claude claude-sonnet-4-20250514** — SOP generation from transcript
- **Zod** — runtime validation of AI JSON output
- Clients are lazy-initialized (inside function bodies, not module scope) to avoid startup crashes before env vars load

### Infrastructure
- **Supabase** — PostgreSQL database (free tier)
- **Cloudflare R2** — video storage (`apps/api/src/lib/storage.ts`); graceful fallback to OS tmpdir if env vars not set
- **Resend** — transactional email (`apps/api/src/lib/email.ts`); graceful fallback to console.log if `RESEND_API_KEY` not set
- **Stripe** — subscriptions, webhook verified with signing secret

### Monorepo
- **Turborepo** + **npm workspaces**
- Packages: `@primer/db`, `@primer/ai`, `@primer/ui`
- Apps: `@primer/api` (port 3001), web (port 3000)

---

## Database Schema (9 tables)

```
organizations   — businesses (plan, Stripe IDs, trialEndsAt)
users           — people (ADMIN / MANAGER / EMPLOYEE)
roles           — org-defined roles (e.g. "HVAC Technician")
sops            — procedures (DRAFT / PUBLISHED / ARCHIVED)
sop_steps       — AI-generated steps (title, content, safetyNote, timestampRef)
recordings      — video uploads (UPLOADING → TRANSCRIBING → GENERATING → COMPLETED / FAILED)
assignments     — user ↔ SOP links (completedAt, quizScore)
quiz_questions  — AI-generated multiple choice (options: JSON array)
sop_roles       — junction: which SOPs auto-assign to which roles
```

---

## API Endpoints (15 routes)

```
GET  /health                          — liveness check
POST /api/auth/signup                 — create org + admin user, 14-day trial
POST /api/auth/login                  — bcrypt verify → JWT
GET  /api/auth/me                     — authenticated profile

GET  /api/sops                        — list org SOPs
GET  /api/sops/:id                    — SOP + steps + quiz
PATCH /api/sops/:id                   — update title/description/status
PATCH /api/sops/:id/steps/:stepId     — inline step edit
POST /api/sops/:id/assign             — assign SOP → user
POST /api/sops/:id/complete           — mark complete + quiz score

POST /api/recordings/upload           — multipart → async AI pipeline
GET  /api/recordings/:id/status       — poll: TRANSCRIBING / GENERATING / COMPLETED

GET  /api/users                       — org team list (manager+ only)
POST /api/users/invite                — invite user, auto-assign role SOPs

POST /api/webhooks/stripe             — checkout.session.completed, subscription.deleted
```

---

## Frontend Routes (10 pages)

```
/                         — Landing page (dark, Vercel-style)
/signup                   — Create org + admin account
/login                    — Sign in
/dashboard                — SOP library grid
/dashboard/record         — VideoRecorder (MediaRecorder API)
/dashboard/sops/[id]      — SOP detail + inline editor + quiz preview + "▶ Train" button
/dashboard/sops/[id]/train — Technician training view (5-phase: loading → intro → steps → quiz → result)
/dashboard/team           — Member list + invite modal (sends Resend email)
/dashboard/billing        — Plan selection (Starter/Growth/Scale), Stripe Checkout, trial status
```

---

## AI Pipeline (the core differentiator)

```
Video file uploaded (multipart)
    ↓
Recording row created (status: TRANSCRIBING)
    ↓
OpenAI Whisper API → full transcript with timestamps
    ↓
Recording updated (status: GENERATING)
    ↓
Claude claude-sonnet-4-20250514 prompt:
  - Extract N steps (estimated from transcript word count)
  - Each step: title (action verb), content (2-3 sentences), safetyNote, timestampRef
  - Output: materials_needed, estimated_duration, steps[]
  - Output format: strict JSON, validated by Zod
    ↓
SopSteps created in DB (one per step)
    ↓
Claude generates 4 quiz questions (multiple choice, Zod-validated)
    ↓
QuizQuestions created in DB
    ↓
Recording status → COMPLETED
    ↓
Frontend polling detects COMPLETED → redirects to /dashboard/sops/[id]
```

---

## UI/UX Design System

**Theme**: Vercel-inspired dark mode (reverse-engineered and applied to Primer)
- Background: `#000000`
- Surface/cards: `#111111` with `rgba(255,255,255,0.08)` borders
- Text: `#ffffff` primary, `#888888` secondary, `#444444` tertiary
- Accent: `#7F77DD` (brand purple) for buttons, badges, progress bars, step numbers
- Hero: CSS grid background pattern + radial purple glow
- Nav: Fixed, `backdrop-filter: blur(12px)`, bottom border
- Cards: Hover border transition (`border-hover` → `rgba(255,255,255,0.15)`)
- Typography: Geist font (geometric sans), gradient headings (white → gray)
- Buttons: Purple filled (primary), dark ghost (secondary)

**Logo**: `PrimerLogo` SVG component — two chevrons, first at 100% opacity, second at 45%. Placed in nav (links to `/`), auth pages, dashboard sidebar, footer.

---

## Claude Code Operating Instructions

1. Always check PROGRESS.md before starting work to understand current state
2. Update PROGRESS.md, CLAUDE.md, and PLAN.md after completing any meaningful milestone
3. Follow the phased plan in PLAN.md — do not skip phases
4. The AI pipeline (video → transcript → SOP) is the core differentiator — prioritize quality here
5. Build for mobile-first: assume technicians are on Android/iPhone in the field
6. Every feature must pass the "field worker test": can a 45-year-old HVAC tech use this without training?
7. Keep UI extremely simple — this is NOT a power user product
8. AI clients (OpenAI, Anthropic) must be lazy-initialized inside function bodies, NOT at module scope
9. Both `prisma db push` and the running app use `DATABASE_URL` on port 5432 (direct connection only).
10. Stripe integration is critical — never build features without payment gates
11. Maintain `/health` endpoint and basic logging from day one
12. JWT is stored in localStorage — this is intentional for PWA/mobile compatibility
13. R2 and Resend both have graceful fallbacks — app stays functional in dev without those credentials
14. Stripe type for checkout session is `Stripe.Checkout.Session` (not `Stripe.CheckoutSession`) in SDK v15+

---

## Key Metrics to Track
- MRR (Monthly Recurring Revenue)
- Churn rate (target: <3%/month)
- Time-to-first-SOP (target: <10 minutes after signup)
- SOPs created per active customer (target: >5)
- Mobile vs desktop usage ratio

---

## Known Technical Gotchas (learned in development)

| Issue | Root Cause | Fix Applied |
|---|---|---|
| `tsx` fails on top-level await | CJS output format doesn't support it | Wrap everything in `async main()` |
| OpenAI/Anthropic crash on startup | Clients initialized at module scope before env loads | Lazy-init inside each function |
| `prisma db push` hangs | PgBouncer transaction mode blocks DDL | Use `DIRECT_URL` (port 5432) for migrations only |
| Port 5432 blocked on some networks | ISP/firewall blocks direct Postgres port | Switch to a network that allows port 5432 (most home/office WiFi works) |
| `pino-pretty` not found | Not installed in api package | `npm install pino-pretty` in apps/api |
| `app.authenticate` undefined | @fastify/jwt doesn't auto-decorate | Use `requireAuth` helper with `req.jwtVerify()` |
| `Stripe.CheckoutSession` type error | SDK v15 moved type to `Stripe.Checkout.Session` | Updated `webhooks.ts` to use correct namespace |
| R2 upload fails without credentials | S3Client throws if env vars are empty strings | `isR2Configured()` guard checks all 4 vars before using S3 |
