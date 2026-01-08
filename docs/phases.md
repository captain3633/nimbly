# Nimbly Development Phases

This document explains how Nimbly evolves over time.
Each phase has a clear focus and explicit non-goals.

## Phase 0: Foundation ✅ COMPLETE

**Status:** Complete (January 8, 2026)

**Delivered:**
- Backend core with FastAPI + PostgreSQL
- Receipt ingestion (JPEG, PNG, PDF, TXT)
- OCR parsing with Tesseract
- Price history tracking
- Factual insights (4 types)
- Magic link authentication
- Comprehensive test suite
- Docker deployment
- API documentation

**Non-goals:**
- UI
- Predictions
- Optimization

---

## Phase 1: Usable Interface 🚧 IN PROGRESS

**Status:** Starting (January 8, 2026)

**Goal:** Create calm, functional interfaces that validate the API and express Savvy's tone.

### Web App (Next.js)
- Magic link authentication flow
- Receipt upload (file picker)
- Receipt list and detail views
- Read-only insights feed
- Loading, empty, and error states

### Mobile App (React Native)
- Magic link authentication flow
- Receipt upload (camera + file picker)
- Receipt list and detail views
- Read-only insights feed
- Loading, empty, and error states

### Focus:
- UX clarity and flow correctness
- Calm, trustworthy presentation
- Validate API contracts
- Express Savvy's voice through copy

### Non-goals:
- Advanced animations or transitions
- Dashboards or data visualizations
- Personalization settings
- Recommendations or predictions
- Design system expansion

### Tech Stack:
- **Web:** Next.js 14+ with shadcn/ui and Tailwind CSS
- **Mobile:** React Native with Expo
- **Shared:** Follow docs/visuals.md strictly

---

## Phase 2: Understanding (Planned - Parallel with Phase 1)

**Status:** Planned

**Goal:** Improve accuracy and intelligence without scope explosion.

### Receipt Understanding Improvements
- Improve OCR accuracy and resilience
- Handle messy or partial receipts better
- Better confidence scoring for parsed fields
- Clear separation between "high confidence" and "needs review"
- Explicit parsing failure modes and recovery paths

### Insight Expansion (still factual, not predictive)
New insight types:
- Typical repurchase intervals
- Price volatility per product or store
- Items frequently bought together
- Store-level pricing patterns over time
- User-specific "usually paid" baselines

All insights must:
- Be explainable
- Reference underlying data
- Avoid forward-looking predictions
- Use calm, non-judgmental language

### Savvy Maturity
Savvy should:
- Clearly distinguish observation vs interpretation
- Communicate uncertainty honestly
- Say "not enough data yet" confidently
- Never imply optimization or guarantees

Savvy must not:
- Suggest what to buy
- Suggest when to buy
- Rank users or behaviors
- Use financial jargon

### API and Data Model Hardening
- Review existing endpoints for frontend readiness
- Improve pagination, filtering, and sorting where useful
- Ensure insight APIs can support feeds and timelines
- Add safe limits and guards (rate limits, file size limits)
- Keep schema changes minimal and backward-compatible

### Developer Experience and Ops Readiness
- Improve local dev experience where rough
- Tighten logging and error clarity
- Add simple safeguards for auth and uploads
- Document production assumptions clearly

### Constraints:
- No new third-party services unless clearly justified
- No ML models unless explicitly approved
- No background workers or queues yet
- No frontend implementation (that's Phase 1)
- Prefer boring, reliable improvements over clever ideas

---

## Phase 3: Learning (Future)

**Status:** Not started

- Longitudinal patterns
- User baselines
- Early predictive signals (transparent)

---

## Phase 4: Guidance (Future)

**Status:** Not started

- Gentle suggestions
- Timing nudges
- Still no guarantees

---

## Development Approach

### Parallel Tracks
- **Phase 1 (UI)** and **Phase 2 (Backend)** can progress simultaneously
- UI validates API shape and user flows
- Backend improvements enhance data quality
- Both maintain the core principles: calm, transparent, factual

### Quality Bar
- Changes should feel like natural evolution, not rewrites
- Everything must remain explainable to non-technical users
- Prefer boring, reliable improvements over clever ideas
- If a feature cannot be explained simply, exclude it
