# PROGRESS.md — Project Status Tracker

> **Last updated**: 2026-04-09
> **Current Phase**: Phase 1 — MVP Build (Day 4 complete — awaiting credentials to go live)
> **MRR**: $0 | **Customers**: 0 | **Target**: $100K MRR by Month 18
> **API**: Running on localhost:3001 ✅ | **Web**: Running on localhost:3000 ✅
> **Database**: Supabase PostgreSQL — all 9 tables live ✅
> **Build**: `next build` + `tsc --noEmit` both pass cleanly ✅

---

## Phase Overview

| Phase | Name | Goal | Status |
|---|---|---|---|
| Phase 0 | Foundation | Docs, stack, repo setup | ✅ COMPLETE |
| Phase 1 | MVP Build | Working product end-to-end | 🟡 IN PROGRESS (~75%) |
| Phase 2 | First 10 Customers | $990 MRR | ⬜ NOT STARTED |
| Phase 3 | Scale to 100 | $9,900 MRR | ⬜ NOT STARTED |
| Phase 4 | Scale to 500 | $49,500 MRR | ⬜ NOT STARTED |
| Phase 5 | Scale to 1,000+ | $99,000+ MRR | ⬜ NOT STARTED |

---

## Phase 0: Foundation ✅ COMPLETE

- [x] Business idea, name, brand color, tagline defined
- [x] Reverse-engineering analysis: Trainual + Loom
- [x] Market validation: 5M+ TAM, confirmed gap
- [x] Revenue model: $99/$149/$199 tiers
- [x] CLAUDE.md, PLAN.md, PROGRESS.md written

---

## Phase 1: MVP Build 🟡 IN PROGRESS

### Day 1 — 2026-04-06 ✅

#### Infrastructure & Monorepo
- [x] Turborepo + npm workspaces (`package.json`, `turbo.json`)
- [x] Directory structure: `apps/web`, `apps/api`, `packages/db`, `packages/ai`, `packages/ui`
- [x] TypeScript configured across all packages
- [x] `.gitignore` (excludes `.env`, `.next`, `node_modules`, `.turbo`)

#### `packages/db` — Database Layer
- [x] Prisma 5 schema with **9 tables**:
  - `organizations` — businesses, plan enum (TRIAL/STARTER/GROWTH/SCALE), Stripe IDs, trialEndsAt
  - `users` — permission enum (ADMIN/MANAGER/EMPLOYEE), bcrypt password
  - `roles` — org-defined roles (e.g. "HVAC Technician", "Dispatcher")
  - `sops` — SopStatus enum (DRAFT/PUBLISHED/ARCHIVED)
  - `sop_steps` — stepNumber, content, safetyNote, screenshotUrl, timestampRef
  - `recordings` — RecordingStatus enum (UPLOADING/TRANSCRIBING/GENERATING/COMPLETED/FAILED)
  - `assignments` — userId + sopId, completedAt, quizScore
  - `quiz_questions` — question, options (JSON), correctAnswer (index)
  - `sop_roles` — junction table (auto-assign SOPs to roles)
- [x] All foreign keys with CASCADE deletes
- [x] Unique indexes: org slug, email, role name per org, step number per SOP, assignment per user+SOP
- [x] Prisma client singleton with dev-mode query logging

#### `packages/ai` — AI Pipeline
- [x] `transcribe.ts` — OpenAI Whisper API (`whisper-1`, verbose_json, segment timestamps)
- [x] `generate-sop.ts` — Anthropic Claude claude-sonnet-4-20250514:
  - `generateSop()` — transcript → structured SOP (title, description, estimated_duration, materials_needed, steps[])
  - `generateQuiz()` — SOP steps → 4 multiple choice questions with correct answer index
  - Zod schemas validate all AI output at runtime
  - Step count auto-estimated from transcript word count (max 15, min 3)
- [x] Lazy client initialization (inside function bodies) — prevents startup crash before .env loads

#### `apps/api` — Fastify REST API (15 endpoints)
- [x] `dotenv/config` imported first — env vars available before any module loads
- [x] `async main()` wrapper — eliminates top-level await CJS incompatibility
- [x] `pino-pretty` logging
- [x] CORS restricted to `WEB_URL` env var
- [x] JWT via `@fastify/jwt` + `requireAuth` preHandler helper
- [x] Multipart uploads via `@fastify/multipart` (500MB limit)
- [x] **Auth routes** (`/api/auth`):
  - `POST /signup` — creates org + admin user, sets `trialEndsAt = now + 14 days`, returns JWT
  - `POST /login` — bcrypt.compare (12 rounds) → JWT
  - `GET /me` — returns user + org + role
- [x] **SOP routes** (`/api/sops`):
  - `GET /` — list org SOPs with step/assignment counts
  - `GET /:id` — full SOP with steps, quizzes, creator
  - `PATCH /:id` — update title/description/status
  - `PATCH /:id/steps/:stepId` — inline step editing
  - `POST /:id/assign` — upsert assignment for user
  - `POST /:id/complete` — mark completed with quiz score
- [x] **Recording routes** (`/api/recordings`):
  - `POST /upload` — saves to OS tmpdir, creates Draft SOP, fires async pipeline
  - `GET /:id/status` — polling endpoint (returns status + step count)
- [x] **User routes** (`/api/users`):
  - `GET /` — team list with assignments (manager/admin only)
  - `POST /invite` — creates user with temp password, auto-assigns SOPs by role
- [x] **Webhook routes** (`/api/webhooks`):
  - `POST /stripe` — handles `checkout.session.completed` (sets plan), `customer.subscription.deleted` (reverts to TRIAL)
  - Verified with Stripe signing secret
- [x] `GET /health` — `{ status: "ok", timestamp, version }`

#### `apps/web` — Next.js 16 Landing Page (initial)
- [x] Landing page: hero, how-it-works, stats bar, pain point callout, testimonials, pricing, FAQ, email capture
- [x] `EmailCapture` component (localStorage waitlist)
- [x] Production build passing (7 routes)

---

### Day 2 — 2026-04-07 ✅

#### Auth Pages
- [x] `src/lib/api.ts` — typed API client with all endpoint methods + XHR upload (progress callback)
- [x] `src/lib/auth.ts` — `saveSession()`, `clearSession()`, `isLoggedIn()`, `getStoredUser()`
- [x] `/signup` — 4-field form → POST /api/auth/signup → save JWT → redirect /dashboard
- [x] `/login` — email + password → POST /api/auth/login → save JWT → redirect /dashboard

#### Dashboard Shell
- [x] `/dashboard/layout.tsx` — fixed dark sidebar, auth guard (redirects to /login if no token), sign-out
- [x] Sidebar nav: SOPs (▤) / Record (⏺) / Team (◫) — active state with border + surface bg
- [x] Top bar with current page label

#### SOP Library
- [x] `/dashboard/page.tsx` — card grid with title, status badge (color-coded), step count, assignment count, date
- [x] Status badge colors: DRAFT = amber, PUBLISHED = green, ARCHIVED = muted
- [x] Hover border transition on cards
- [x] Empty state with icon + CTA

#### SOP Detail + Inline Editor
- [x] `/dashboard/sops/[id]/page.tsx` — full SOP page
- [x] `EditableText` component — click any field to enter edit mode, blur/Enter saves via PATCH, Escape cancels
- [x] Editable: SOP title, SOP description, each step title, each step content, each step safety note
- [x] Publish/Unpublish button (PATCH /api/sops/:id with new status)
- [x] Meta bar: step count, creator name, created date, status badge
- [x] Safety notes: amber bordered callout with ⚠ icon
- [x] Video timestamp display (e.g. "~1:30 in video")
- [x] Quiz section: all questions with answer options highlighted in green

#### Video Recorder
- [x] `VideoRecorder` component — 9-state machine:
  - `idle` → `requesting` → `ready` → `recording` → `preview` → `uploading` → `processing` → `done` → `error`
- [x] `getUserMedia({ facingMode: "environment" })` — defaults to rear camera on mobile
- [x] Codec detection: prefers `video/webm;codecs=vp9` → `video/webm` → `video/mp4`
- [x] Live recording timer (MM:SS), auto-stops at 10 minutes
- [x] Preview video before uploading (can retake)
- [x] XHR upload with real-time `%` progress bar
- [x] 2.5s polling loop on recording status → auto-redirects to SOP editor on COMPLETED
- [x] `/dashboard/record/page.tsx` wraps recorder, handles `onSopReady` redirect

#### Team Management
- [x] `/dashboard/team/page.tsx` — table with avatar, name, email, role, permission, training % bar
- [x] Training completion: `completed / total * 100`, color green at 100% else purple
- [x] Invite modal: name + email → POST /api/users/invite → shows temp password in green banner
- [x] Empty state with icon + CTA

#### API Bug Fixes (discovered during local testing)
- [x] **Top-level await crash** — wrapped all Fastify setup in `async main()`
- [x] **pino-pretty not found** — installed in apps/api
- [x] **AI clients crashing on import** — moved `new OpenAI()` / `new Anthropic()` inside function bodies
- [x] **`app.authenticate` undefined** — replaced with `requireAuth` helper using `req.jwtVerify()`
- [x] **Env vars not loading** — added `import "dotenv/config"` as first line in index.ts
- [x] **Prisma db push hangs on pooler** — switched to direct connection (port 5432); when blocked, generated SQL via `prisma migrate diff` and ran in Supabase SQL editor
- [x] **Supabase packages/db env** — created `packages/db/.env` with DATABASE_URL (Prisma looks for .env in CWD)

#### Database
- [x] Supabase project created
- [x] All 9 tables + 4 enums + all indexes + all foreign keys created in production DB
- [x] Direct connection (port 5432) confirmed working on current network

#### Dark Theme Redesign (Vercel-style)
- [x] CSS variables in `globals.css`: `--bg`, `--surface`, `--surface-2`, `--border`, `--border-hover`, `--text-primary/secondary/tertiary`, `--primer`, `--primer-glow`
- [x] `.grid-bg` utility class — CSS grid line pattern (60px grid, 3% white opacity)
- [x] `.hero-glow` — radial gradient from purple top
- [x] `.gradient-text` — white → gray gradient text using `background-clip: text`
- [x] `.card-shine` — pseudo-element shine effect on hover
- [x] All pages and components updated to use CSS variables (no hardcoded colors except `#7F77DD`)

#### Logo
- [x] `PrimerLogo.tsx` — SVG component with `PrimerMark` + `PrimerLogo` exports
- [x] Mark: two `<path>` chevrons, first at 100% opacity, second at 45% — creates depth
- [x] Accepts `size` prop (number) and `wordmarkSize` prop ("sm"/"md"/"lg")
- [x] Deployed to: landing nav, landing footer, `/signup`, `/login`, `/dashboard` sidebar
- [x] All logo instances link to `/` (home page navigation fixed)

---

### Day 3 — 2026-04-08 ✅

#### Technician Training View
- [x] `/dashboard/sops/[id]/train/page.tsx` — 5-phase state machine: loading → intro → steps → quiz → result
- [x] Intro screen: title, description, step count, quiz count, "Start Training" CTA
- [x] Steps view: progress bar, step number bubble, content, safety note (amber), prev/next/complete
- [x] Quiz: auto-advances 600ms after answer, highlights correct (green) / incorrect (red)
- [x] Result screen: score %, pass (≥70%) / fail UI, retry or back to dashboard
- [x] Calls `api.sops.complete(id, quizScore)` on finish
- [x] Added "▶ Train" button to SOP detail page linking to `/train`

#### PWA Support
- [x] `public/manifest.json` — standalone display, theme_color: #7F77DD, start_url: /dashboard
- [x] Shortcuts: "Record SOP" → /dashboard/record, "SOP Library" → /dashboard
- [x] Updated `apps/web/src/app/layout.tsx` with Viewport export + PWA metadata

#### Stripe Billing
- [x] `apps/api/src/routes/billing.ts` — billing status, Stripe Checkout session, cancel subscription
- [x] Registered as `/api/billing` prefix in index.ts
- [x] Added `billing` methods + `BillingStatus` type to `src/lib/api.ts`
- [x] `/dashboard/billing/page.tsx` — plan cards (Starter/Growth/Scale), current plan indicator, trial status, success banner

#### Trial Enforcement & Navigation
- [x] Added "Billing" (◈) to dashboard sidebar nav
- [x] Trial enforcement in `dashboard/layout.tsx` — calls `api.billing.status()` on mount, redirects to `/dashboard/billing` if trial expired
- [x] Skips check when already on billing page (prevents redirect loop)

#### Build
- [x] `next build` passes cleanly — 10 routes, 0 TypeScript errors, 0 ESLint warnings

---

### Day 4 — 2026-04-09 ✅

#### Database Connection Resilience
- [x] Updated `packages/db/prisma/schema.prisma` — added `directUrl = env("DIRECT_URL")`
- [x] `DATABASE_URL` = Supabase Transaction Pooler (port 6543) — works on any network
- [x] `DIRECT_URL` = Supabase direct connection (port 5432) — used only for migrations
- [x] Updated both `apps/api/.env` and `packages/db/.env` with `DIRECT_URL` field
- [x] Ran `prisma generate` — new client built with dual-URL support
- [x] **Fix**: port 5432 being blocked on some WiFi networks no longer breaks the running app

#### Cloudflare R2 Video Storage
- [x] Installed `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` in `apps/api`
- [x] Created `apps/api/src/lib/storage.ts`:
  - `uploadToR2(localPath, filename, contentType)` — uploads file to R2, returns public URL
  - `deleteFromR2(fileUrl)` — cleans up objects by URL
  - Graceful fallback: if `R2_ACCOUNT_ID/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET` not set, returns local tmpdir path (dev mode)
- [x] Updated `recordings.ts` — upload to R2 immediately after saving tmpfile, store public URL in DB
- [x] AI pipeline still transcribes from local tmpPath (file exists during processing, deleted after)
- [x] R2 env vars scaffolded in `.env`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`

#### Resend Email Invites
- [x] Installed `resend` package in `apps/api`
- [x] Created `apps/api/src/lib/email.ts`:
  - `sendInviteEmail(to, name, orgName, tempPassword, inviterName)` — branded HTML email
  - Email shows org name, inviter name, login URL, credentials box with email + temp password
  - Graceful fallback: logs to console if `RESEND_API_KEY` not set (non-blocking)
- [x] Updated `users.ts` invite route — sends email after user creation (non-blocking, fire-and-forget)
- [x] `RESEND_API_KEY` env var scaffolded in `.env`

#### PWA Icons
- [x] Created `scripts/generate-icons.mjs` — pure Node.js PNG encoder (no native deps)
- [x] Generated `apps/web/public/icon-192.png` and `apps/web/public/icon-512.png`
- [x] Both icons are solid #7F77DD (brand purple) — valid PNG format, referenced by manifest.json

#### TypeScript Fix
- [x] Fixed `Stripe.CheckoutSession` → `Stripe.Checkout.Session` in `webhooks.ts` (breaking type change in Stripe SDK v15)
- [x] `npx tsc --noEmit` in `apps/api` passes cleanly

---

## What's Left for MVP

### Awaiting credentials — code is ready, just needs env vars filled in
- [ ] **Supabase pooler URL** — update `DATABASE_URL` in `apps/api/.env` to Transaction Pooler URL (port 6543)
  - Get from: Supabase Dashboard → Settings → Database → Connection string → Transaction pooler
- [ ] **Stripe price IDs** — create 3 products ($99/$149/$199 monthly recurring) in Stripe Dashboard → Products
  - Add `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_SCALE` to `apps/api/.env`
- [ ] **Resend API key** — sign up at resend.com (free tier: 3,000 emails/month)
  - Add `RESEND_API_KEY` to `apps/api/.env`; verify sending domain
- [ ] **Cloudflare R2 credentials** — create bucket `primer-videos`, generate API token
  - Add `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` to `apps/api/.env`

### Nice-to-have before launch
- [ ] SOP assignment UI (currently only available via API — no frontend)
- [ ] Password reset flow
- [ ] Org settings page (name, plan info, trial countdown)
- [ ] Completion certificate PDF
- [ ] Error boundaries + user-facing error pages
- [ ] End-to-end test: sign up → record video → SOP generated → train → quiz → complete

### Nice-to-have before launch
- [ ] SOP assignment UI (assign from dashboard, not just API)
- [ ] Password reset flow
- [ ] Org settings page (name, plan info, trial countdown)
- [ ] Completion certificate PDF
- [ ] Error boundaries + user-facing error pages

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-06 | Name: **Primer** | Three meanings: trade primer, documentation primer, to prime. Brand color = PVC primer purple #7F77DD. Eliminated: Fieldbook (taken), Ingrain (in use), Guild (conflict), Tradecraft (CIA), Codex (OpenAI). |
| 2026-04-06 | Target home service businesses | Massive TAM, 40-60% turnover pain, completely underserved |
| 2026-04-06 | Price at $99/$149/$199/month | Below Trainual avg ($340/mo), above "free tool" territory, 97% gross margin |
| 2026-04-06 | AI: Whisper + Claude | Best-in-class transcription + generation; Zod validation catches bad AI output |
| 2026-04-06 | PWA first, native app later | Ship faster, test market before investing in App Store review process |
| 2026-04-06 | Turborepo monorepo | Shared `@primer/db`, `@primer/ai`, `@primer/ui` packages; turbo caching |
| 2026-04-06 | Fastify over Express | Better TypeScript support, faster, plugin ecosystem, built-in schema |
| 2026-04-06 | JWT (not sessions/Clerk) | Stateless — works across PWA, mobile, future native app without cookie issues |
| 2026-04-06 | Prisma ORM | Type-safe, migration-based, great DX, works perfectly with Supabase |
| 2026-04-07 | Supabase (not local Postgres) | Instant hosted DB with free tier, no infra management |
| 2026-04-07 | Direct connection for Prisma | PgBouncer pooler hangs on DDL (known Prisma limitation) |
| 2026-04-07 | Vercel dark theme | Most professional/modern aesthetic for a B2B SaaS; keeps brand purple as accent |
| 2026-04-07 | Chevron (>>) logo | Geometric like Vercel triangle; implies forward motion, step-by-step, record/play |
| 2026-04-07 | Lazy AI client init | Module-scope `new OpenAI()` crashes before dotenv loads; lazy init solves it cleanly |

---

## Next 5 Actions (Priority Order)

1. **Fill in credentials** — Supabase pooler URL, Stripe price IDs, Resend API key, R2 credentials
2. **End-to-end test** — sign up → record video → confirm SOP generated → train → quiz → complete
3. **Switch Stripe to live mode** — create live products, swap `sk_test_` → `sk_live_` key
4. **First 3 beta customers** — reach out to home service contacts, offer free first month
5. **SOP assignment UI** — build frontend to assign SOPs to team members (currently API-only)

---

## Weekly Metrics

| Week | MRR | Customers | SOPs | Key Work |
|---|---|---|---|---|
| 2026-W14 | $0 | 0 | 0 | Monorepo, schema, AI pipeline, landing page |
| 2026-W15 | $0 | 0 | 0 | Auth, dashboard, recorder, dark theme, logo, DB live |
| 2026-W15 | $0 | 0 | 0 | Training view, billing page, trial enforcement, PWA manifest, R2, Resend, icons |

---

## Known Technical Risks

| Risk | Severity | Notes |
|---|---|---|
| Whisper accuracy on HVAC jargon | Medium | "Refrigerant" → "refriderant" type errors; may need post-processing |
| Video file size from iPhone | High | HEVC/H.265 = large files; need client-side compression before upload |
| AI SOP quality variability | High | Need to test 50+ real videos; prompt may need tuning per trade |
| MediaRecorder Safari iOS | Medium | Limited codec support; `video/mp4` fallback required |
| OS tmpdir for video | High | Not persistent, not scalable; must replace with R2 before launch |
| Port 5432 blocked on some networks | Low | Solved: use Supabase SQL editor as fallback for schema changes |

---

## Resources & References

- Trainual business analysis: thebrandhopper.com
- Whisper API: platform.openai.com/docs/guides/speech-to-text
- Anthropic Claude API: docs.anthropic.com
- Cloudflare R2: developers.cloudflare.com/r2
- Prisma + Supabase guide: prisma.io/docs/guides/database/supabase
- Stripe webhooks: stripe.com/docs/webhooks
- Jobber developer API: developer.getjobber.com
- MediaRecorder API: developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
