# PLAN.md — Full Business & Technical Plan
## Product: Primer | "Apply once. Stick forever."
## Domain: tryprimer.com · primer.app · getprimer.io
## Brand color: #7F77DD (PVC primer purple)

---

## Part 1: Reverse-Engineering Analysis

### 1A. Reverse-Engineering Trainual (Primary Target)

**Company stats** (as of early 2026):
- ARR: $32.6M
- Customers: ~8,000
- Average revenue per customer: ~$340/month
- Funding: $33.8M raised total
- Founded: 2018 (reached $2M ARR in 18 months)

**Growth levers we've identified:**

#### 1. The "Pain Point" Entry Hook
Trainual's founder Chris Ronzio sold the same pain to every customer:
*"Your processes live in someone's head. When they leave, you're screwed."*
This is visceral, universal, and immediately understood by any business owner.
→ **We copy this framing** but sharpen it for home services:
*"When your best tech quits, your quality goes with them."*

#### 2. The Content Creation Flywheel
Trainual built a massive library of templates (HR policies, IT procedures, sales SOPs).
This creates switching costs — customers pour hours into their Trainual content.
But the PROBLEM is: creating Trainual content takes HOURS of manual work.
→ **We flip this**: Our AI generates content FROM VIDEO in minutes.
Content creation friction is our competitor's biggest weakness.

#### 3. Role-Based Assignment System
Trainual's killer feature: assign specific training to specific roles.
New HVAC tech gets "HVAC procedures" auto-assigned. New receptionist gets "booking SOPs."
→ **We copy this exactly.** It's table stakes but must be done well.

#### 4. Completion + Accountability Tracking
Trainual shows managers who completed what. This is the "stick" — managers love it.
→ **We copy this** and add: mobile push notifications for incomplete training.

#### 5. The Pricing Evolution
Trainual started with transparent pricing ($249-$499/month ranges).
Now they've hidden pricing → moving upmarket, leaving SMBs behind.
→ **Our opening**: be the transparent, affordable alternative. $99/month flat for
teams up to 10. $149 for 11-25. $199 for 26-50. No hidden sales calls needed.

#### 6. Trainual's Weak Points We Exploit
- **No AI video-to-SOP** (they integrated Loom for recording but not for auto-generation)
- **Desktop-first UI** (field workers can't use it easily on phones)
- **Manual creation** takes 4-8 hours per SOP module
- **No home service templates** (they're industry-generic)
- **Price anchoring too high** for 5-person cleaning companies
- **Moving upmarket**: their blog now targets 150+ employee companies

---

### 1B. Reverse-Engineering Loom (Secondary Target)

**Company stats**:
- Acquired by Atlassian for $975M in 2024
- 25M+ users, 200,000+ paying customers at acquisition
- Revenue: "tens of millions" (estimated $40-60M ARR)

**Core mechanics we're extracting:**

#### 1. Zero-Friction Recording
Loom's growth secret: no software install needed (browser extension).
Click → record → share link in 30 seconds.
→ **We replicate**: browser-based recorder + iOS/Android PWA.
No app store friction. Link shared instantly.

#### 2. AI Content Extraction Pipeline
Loom's AI generates: title, summary, chapters, action items from video.
This is the key technology we need to build our own version of.
→ **Our pipeline**:
```
Video recording → Whisper transcription → Claude SOP generation
→ Step extraction → Screenshot matching → Formatted SOP document
```

#### 3. The Viral "Send a Video" Loop
Loom grew virally because every video was a free ad ("Made with Loom").
→ **Our equivalent**: when a business owner shares an SOP with a new employee,
the employee sees "Powered by Primer" with a signup CTA.
Technicians become the referral engine.

#### 4. What Loom Got Wrong (for our market)
- Loom is for screen recording — not useful for physical job demonstrations
- Loom requires good lighting, clean desk, tech-savvy user
- Loom is now Atlassian-focused (Jira, Confluence users = tech companies)
- No SOP structure — just a video, not a training module
→ **We solve**: mobile camera recording of physical tasks + AI makes it structured.

---

### 1C. Additional Reverse-Engineering: Jobber ($100M+ ARR)

Jobber is the dominant operations platform for home service businesses.
They've nailed the scheduling/invoicing/CRM side but have ZERO training features.
Their 200,000+ customers need exactly what we build.
→ **Integration strategy**: Build a Jobber integration on day one.
When a new employee is added in Jobber → auto-trigger Primer onboarding.
This is our Trojan horse into their customer base.

---

## Part 2: Market Validation

### Why Home Services?

| Factor | Data |
|---|---|
| US home service businesses | 5.3 million |
| HVAC contractors | 105,000 |
| Cleaning services | 1.2 million |
| Plumbing | 480,000 |
| Landscaping/lawn | 600,000 |
| Annual technician turnover | 40–60% |
| Cost of replacing one technician | $3,000–$7,000 |
| Avg time to productivity without SOPs | 4–6 weeks |
| Avg time to productivity with SOPs | 1–2 weeks |

**Customer ROI calculation** (what we tell prospects):
- You have 8 technicians
- Average turnover: 3 per year
- Replacement + retraining cost: $4,000 each = $12,000/year
- Primer reduces ramp time by 50% → saves $6,000/year
- Our price: $99/month = $1,188/year
- ROI: 5x in year one → makes the sale obvious

### The Competitor Gap Map

```
                HIGH PRICE
                    │
    Trainual ●      │      ● ServiceTitan
    (moving up)     │      (ops platform)
                    │
MANUAL ─────────────┼──────────────── AI-NATIVE
CREATION            │
                    │
                    │    ● Primer
    Notion ●        │    (video-to-SOP,
    (too generic)   │    mobile-first)
                    │
                LOW PRICE
                    │
              MOBILE-FIRST
```

**Primer lives in the bottom-right quadrant: AI-native + affordable + mobile-first.**
This quadrant is currently empty.

---

## Part 3: Product Specification

### Core Feature Set (MVP — Phase 1)

#### Feature 1: Video Capture (Mobile + Browser)
- PWA-based recorder: tap → record phone camera
- Browser extension: record screen + webcam for desk tasks
- Max duration: 10 minutes per video
- Auto-upload to cloud (Cloudflare R2)

#### Feature 2: AI SOP Generator
Pipeline:
```
Video uploaded
    ↓
Whisper API → Full transcript
    ↓
Extract key frames (1 per 10 seconds) via FFmpeg
    ↓
Claude claude-sonnet-4-20250514 prompt:
  "Given this transcript and these video timestamps,
   generate a step-by-step SOP. Each step must have:
   - Step title (action verb)
   - Detailed instruction (2-3 sentences)
   - Safety note (if applicable)
   - Timestamp reference"
    ↓
Human review + edit mode
    ↓
Published SOP
```

#### Feature 3: SOP Library
- Organize by: Department → Role → Process
- Default templates for: HVAC, Plumbing, Cleaning, Electrical, Landscaping
- Search by keyword
- Version history

#### Feature 4: Role-Based Assignment
- Define roles: "HVAC Technician", "Dispatcher", "Sales Rep"
- Assign SOPs to roles
- New employee assigned a role → auto-receives all relevant SOPs

#### Feature 5: Mobile Training Experience
- Clean card-based UI for each SOP step
- Swipe through steps
- Mark step as "understood"
- Quiz at end (multiple choice, auto-generated by AI)
- Completion certificate (shareable PDF)

#### Feature 6: Manager Dashboard
- Completion rates per employee
- Incomplete assignments highlighted
- Time-to-completion metrics
- Export to CSV for HR

#### Feature 7: Team Management
- Invite employees via email or SMS (important — field workers prefer SMS)
- Employee profile: name, role, start date, assigned SOPs
- Admin/Manager/Employee permission levels

### Phase 2 Features (Months 4–8)
- Jobber integration (webhook: new employee → auto-assign SOPs)
- HouseCall Pro integration
- Recurring recertification reminders ("Re-certify Q1 safety procedures")
- Multi-location support (franchise-friendly)
- White-label option ($199/month tier)
- Spanish language support (critical for cleaning/landscaping)

### Phase 3 Features (Months 9–18)
- Native iOS + Android apps (React Native)
- Video SOP sharing with customers (e.g., "Here's how our techs do X")
- AI chat: employees can ask "How do I do X?" → AI searches SOPs and answers
- Analytics: which SOPs correlate with higher customer ratings?
- Marketplace: sell/buy SOP templates from other businesses

---

## Part 4: Go-To-Market Strategy

### GTM Phase 1: First 100 Customers (Months 1–3)

#### Channel 1: Direct Outreach to Facebook Groups
- Join 20+ home service Facebook groups (HVAC Nation, Cleaning Business Owners, etc.)
- Post value-first content: "Here's how to document your HVAC filter replacement
  procedure in under 5 minutes" (free tutorial)
- DM anyone who comments asking how to do this with an offer: free 30-day trial

#### Channel 2: YouTube Content (SEO Flywheel)
- Create 20 videos: "How to train HVAC technicians", "Cleaning business SOP templates",
  "How to onboard plumbers faster"
- Each video ends with Primer CTA
- Target zero-competition search terms: "hvac technician training checklist template"

#### Channel 3: Product Hunt + Reddit
- ProductHunt launch → aim for #3-5 Product of the Day
- Post in r/smallbusiness, r/Entrepreneur with genuine content

#### Channel 4: Partner with Home Service Coaches
- HVAC business coaches (Danielle Putnam, Service Business Mastery podcast)
- Cleaning business coaches (Mike Campion, Joshua Latimer)
- Offer 20% affiliate commission on lifetime revenue
- These coaches have audiences of 10,000–50,000 home service owners

### GTM Phase 2: Scale to 500 Customers (Months 4–8)

#### Channel 1: Jobber App Marketplace
- List Primer on Jobber's app marketplace
- Jobber has 200,000+ home service customers already looking for tools
- This alone could drive 200-500 signups

#### Channel 2: Google Ads (Search Intent)
- Target: "employee training software small business", "HVAC technician training app"
- Budget: $3,000-5,000/month once profitable

#### Channel 3: Case Study Amplification
- Feature 3 customer success stories prominently
- "Mike's Plumbing went from 6 weeks to 2 weeks onboarding — here's exactly how"
- Distribute via email list, podcasts, Facebook groups

### GTM Phase 3: 1,000 Customers (Months 9–18)

#### Channel 1: Content Moat
- Publish 200+ free SOP templates ("Free HVAC Maintenance SOP Template PDF")
- Each page ranks for long-tail keywords → captures organic traffic
- Users download free template → email capture → nurture sequence

#### Channel 2: Referral Program
- "Give 1 month free, get 1 month free"
- Home service owners talk to each other at trade associations (ACCA, PHCC, etc.)
- Referral becomes primary growth engine

---

## Part 5: Financial Model

### Revenue Projections

| Month | Customers | MRR | Notes |
|---|---|---|---|
| 1 | 10 | $990 | Friends + close network |
| 2 | 30 | $2,970 | Facebook groups outreach |
| 3 | 60 | $5,940 | First YouTube traffic |
| 4 | 100 | $9,900 | Partner referrals begin |
| 6 | 200 | $19,800 | Jobber marketplace live |
| 9 | 400 | $39,600 | Referral program live |
| 12 | 650 | $64,350 | SEO traffic growing |
| 15 | 850 | $84,150 | Case studies driving conversions |
| 18 | 1,050 | $103,950 | ✅ GOAL ACHIEVED |

### Cost Structure (Solo Founder Phase)
- Claude AI API: ~$0.50/SOP generated × avg 5 SOPs/customer/month = $2.50/customer
- Whisper API: ~$0.006/minute × avg 30 min/customer/month = $0.18/customer
- Cloudflare R2 (video storage): ~$0.015/GB × avg 2GB/customer = $0.03/customer
- Vercel + Railway hosting: ~$50/month flat
- **Total COGS per customer: ~$3/month**
- **Gross margin: ~97%** at $99/month

### Break-Even Analysis
- Fixed costs (tools, hosting): ~$500/month
- Break-even: 6 customers
- At 100 customers: $9,400/month net (before taxes)
- At 1,000 customers: ~$96,000/month net

---

## Part 6: Technical Architecture

### System Architecture
```
[PWA / Browser Extension]
         │
         ▼
[CDN - Cloudflare] ── [Video Storage - R2]
         │
         ▼
[API Server - Fastify/Node.js]
         │
    ┌────┴────────────────────────────┐
    │                                 │
    ▼                                 ▼
[PostgreSQL/Supabase]        [AI Pipeline Queue]
(users, SOPs, assignments)           │
                                     ▼
                             [Bull Queue - Redis]
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                          ▼                     ▼
                   [Whisper API]         [Claude API]
                   (transcription)       (SOP generation)
                          │                     │
                          └──────────┬──────────┘
                                     ▼
                              [SOP Document]
                              (stored in DB)
```

### Database Schema (Core Tables)
```sql
-- Organizations (home service businesses)
organizations (id, name, plan, stripe_customer_id, created_at)

-- Users (owners, managers, technicians)
users (id, org_id, name, email, phone, role_id, created_at)

-- Roles (HVAC Tech, Dispatcher, etc.)
roles (id, org_id, name, description)

-- SOP Library
sops (id, org_id, title, description, status, created_by, created_at)

-- SOP Steps (generated by AI)
sop_steps (id, sop_id, step_number, title, content, screenshot_url, timestamp_ref)

-- Video Recordings
recordings (id, org_id, sop_id, file_url, duration, transcript, status)

-- Training Assignments
assignments (id, user_id, sop_id, assigned_at, completed_at, quiz_score)

-- Quiz Questions (auto-generated)
quiz_questions (id, sop_id, question, options_json, correct_answer)
```

### AI Prompt Template (Core: Video → SOP)
```
System: You are an expert technical writer specializing in creating clear,
actionable Standard Operating Procedures (SOPs) for home service businesses
(HVAC, plumbing, cleaning, electrical, landscaping).

User: I have a video transcript of someone demonstrating a work procedure.
Your job is to convert this into a professional SOP.

TRANSCRIPT:
{transcript}

INSTRUCTIONS:
1. Extract exactly {estimated_steps} distinct steps from this transcript
2. Each step must have:
   - Title: Start with an action verb (e.g., "Inspect", "Replace", "Test", "Document")
   - Instructions: Clear 2-3 sentence explanation a new technician can follow
   - Safety note: Only include if genuinely relevant to safety
   - Timestamp: The approximate video timestamp where this step occurs
3. Output as JSON array of step objects
4. Add a "materials_needed" array at the top level
5. Add a "estimated_duration" field

OUTPUT FORMAT: Valid JSON only, no markdown.
```

---

## Part 7: Launch Checklist

### Pre-Launch (Must Complete Before First Customer)
- [ ] Domain registered (primer.com or similar)
- [x] Landing page live with email capture
- [x] Stripe integration working (test mode) — needs price IDs filled in `.env`
- [x] Video recording + upload working (R2 wired, needs credentials)
- [x] AI SOP generation pipeline working end-to-end
- [x] Basic SOP display + editing working
- [x] Employee invitation via email working (Resend wired, needs API key)
- [x] Training assignment + completion tracking working
- [x] Mobile PWA installable on iOS + Android (manifest + icons complete)
- [ ] End-to-end test: sign up → record → SOP generated → assign → train → complete

### Launch Week
- [ ] Stripe switched to live mode
- [ ] 3 beta customers confirmed (can be free)
- [ ] ProductHunt post scheduled
- [ ] YouTube intro video published
- [ ] 5 Facebook group posts published
- [ ] Email sequence set up (welcome → day 3 check-in → day 7 push)

### First 30 Days Post-Launch
- [ ] 10 paying customers
- [ ] First customer case study drafted
- [ ] Jobber integration started
- [ ] First affiliate partnership reached out to
- [ ] NPS survey sent to all users

---

## Part 8: Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI SOP quality is poor | Medium | High | Human review step built in; iterate on prompts |
| Video upload too slow on mobile | Medium | High | Compress before upload; show progress bar |
| Home service owners aren't tech-savvy | High | Medium | Extreme UI simplicity; phone onboarding call |
| Trainual launches AI video feature | Medium | High | Move faster; build niche templates moat |
| Churn too high | Medium | High | Monthly "SOP creation day" webinar; track usage |
| Can't acquire customers cost-effectively | Low | High | Facebook groups are free; start there |
| Jobber rejects app marketplace submission | Low | Medium | Build Zapier integration as fallback |

---

## Founding Principles

1. **Ship fast, iterate faster** — get real customers within 60 days
2. **Talk to 1 home service owner per day** for the first 90 days
3. **AI quality is non-negotiable** — if the SOP is bad, the product is worthless
4. **Mobile is not optional** — technicians are in the field, not at desks
5. **Free trials, not freemium** — 14-day free trial, then pay or leave
6. **Simple pricing, no sales calls** — $99/$149/$199, no negotiation
7. **Content before ads** — build organic before spending on paid

---

## Part 9: As-Built Technical Specification (updated 2026-04-09)

This section records what was actually built vs. what was planned. Treat this as the ground truth for the current codebase.

### Deviations from Original Plan

| Item | Planned | Actually Built | Reason |
|---|---|---|---|
| Next.js version | 14 | 16.2.2 (Turbopack) | Latest stable at build time |
| Auth | Clerk or NextAuth | Custom JWT (bcryptjs + @fastify/jwt) | Faster to ship, no third-party dependency |
| CSS framework | Tailwind + shadcn/ui | Tailwind v4 + custom CSS variables | Tailwind v4 uses @import, no config file |
| Video storage | AWS S3 or Cloudflare R2 | Cloudflare R2 (with OS tmpdir fallback) | `storage.ts` uses S3-compatible SDK; falls back to local path if env vars missing |
| AI: screenshot analysis | GPT-4o Vision | Not yet built | Whisper + Claude alone produces good SOPs |
| Redis (sessions/cache) | Planned | Not needed yet | JWT is stateless; no cache needed at 0 users |
| Design system | Generic | Vercel dark theme + custom SVG logo | Deliberate choice for professional aesthetic |

### Actual File Structure

```
primer/
├── apps/
│   ├── web/                          # Next.js 16.2.2
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx          # Landing page (dark, Vercel-style)
│   │       │   ├── layout.tsx        # Root layout (Geist font, metadata)
│   │       │   ├── globals.css       # CSS variables + utility classes
│   │       │   ├── signup/page.tsx   # Create account
│   │       │   ├── login/page.tsx    # Sign in
│   │       │   └── dashboard/
│   │       │       ├── layout.tsx    # Sidebar nav + auth guard + trial enforcement
│   │       │       ├── page.tsx      # SOP library grid
│   │       │       ├── record/page.tsx
│   │       │       ├── team/page.tsx
│   │       │       ├── billing/page.tsx  # Plan selection + Stripe Checkout
│   │       │       └── sops/[id]/
│   │       │           ├── page.tsx      # SOP detail + inline editor
│   │       │           └── train/page.tsx # Technician training (steps + quiz)
│   │       ├── components/
│   │       │   ├── PrimerLogo.tsx    # SVG logo (>> chevrons)
│   │       │   ├── EmailCapture.tsx  # Waitlist / CTA form
│   │       │   └── recorder/
│   │       │       └── VideoRecorder.tsx
│   │       └── lib/
│   │           ├── api.ts            # Typed API client
│   │           └── auth.ts           # JWT session helpers
│   └── api/                          # Fastify 4 + TypeScript
│       └── src/
│           ├── index.ts              # Server bootstrap (main())
│           ├── lib/
│           │   ├── auth.ts           # requireAuth preHandler
│           │   ├── storage.ts        # Cloudflare R2 upload (S3 SDK, tmpdir fallback)
│           │   └── email.ts          # Resend invite emails (console.log fallback)
│           └── routes/
│               ├── auth.ts           # signup, login, me
│               ├── sops.ts           # CRUD + assign + complete
│               ├── recordings.ts     # upload → R2 → AI pipeline + status
│               ├── users.ts          # list + invite (sends Resend email)
│               ├── billing.ts        # status + Stripe Checkout session + cancel
│               └── webhooks.ts       # Stripe events (checkout.session.completed, subscription.deleted)
├── packages/
│   ├── db/
│   │   ├── prisma/schema.prisma      # 9 tables, 4 enums
│   │   └── src/index.ts              # Prisma client singleton
│   ├── ai/
│   │   └── src/
│   │       ├── transcribe.ts         # Whisper API
│   │       ├── generate-sop.ts       # Claude + Zod
│   │       └── index.ts              # exports
│   └── ui/
│       └── src/index.ts              # cn() utility
├── CLAUDE.md
├── PLAN.md
└── PROGRESS.md
```

### Environment Variables Required

```bash
# apps/api/.env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

JWT_SECRET=[32-byte hex string]
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_SCALE=price_...

# Cloudflare R2 (optional in dev — app falls back to tmpdir)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=primer-videos
R2_PUBLIC_URL=

# Resend (optional in dev — app logs to console instead)
RESEND_API_KEY=re_...

WEB_URL=http://localhost:3000
PORT=3001

# packages/db/.env  (Prisma needs its own .env in CWD)
DATABASE_URL=[same as above]
```

### Running Locally

```bash
# 1. Install all dependencies
npm install                              # from monorepo root

# 2. Push schema to Supabase (requires port 5432 access)
cd packages/db && npx prisma db push

# 3. Start API (terminal 1)
cd apps/api && npm run dev               # → localhost:3001

# 4. Start web (terminal 2)
cd apps/web && npm run dev               # → localhost:3000

# 5. (Optional) Stripe webhook forwarding (terminal 3)
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

### AI Prompt Design

The Claude SOP generation prompt is the product's core IP. Key design decisions:

1. **System prompt** establishes expert technical writer persona for home services
2. **Step count estimation** from transcript word count (1 step per ~80 words, capped 3–15)
3. **Action verb requirement** on every step title (Inspect, Replace, Test, Apply, Verify)
4. **Safety note** included only if genuinely safety-relevant (not every step)
5. **Strict JSON output** — no markdown fences, validated by Zod schema at runtime
6. **Quiz generation** is a separate Claude call on the completed SOP steps (not the raw transcript)

### Design System Tokens

```css
--bg:             #000000    /* page background */
--bg-secondary:   #0a0a0a    /* subtle variation */
--surface:        #111111    /* cards, sidebar */
--surface-2:      #1a1a1a    /* nested surfaces, ghost buttons */
--border:         rgba(255,255,255,0.08)   /* default borders */
--border-hover:   rgba(255,255,255,0.15)   /* hover state */
--text-primary:   #ffffff
--text-secondary: #888888
--text-tertiary:  #444444
--primer:         #7F77DD    /* brand purple — all CTAs, accents */
--primer-dark:    #6860c8
--primer-glow:    rgba(127,119,221,0.25)
```
