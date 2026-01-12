# Nimbly Development Roadmap

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

## Phase 1: Usable Interface ✅ COMPLETE!

**Status:** Web and mobile apps complete (January 12, 2026)

**Goal:** Create calm, functional interfaces that validate the API and express Savvy's tone.

### Web App ✅ COMPLETE
- ✅ Authentication:
  - **Primary:** Email/password sign in and sign up with strong password requirements
  - **Social auth:** Google, Apple, Meta (OAuth 2.0)
  - **Fallback:** Magic link (simplified, email-only for passwordless access)
- ✅ Receipt upload (file picker + drag-and-drop)
- ✅ Receipt list and detail views
- ✅ Read-only insights feed with 4 insight types
- ✅ Loading, empty, and error states
- ✅ Collapsible sidebar with state persistence
- ✅ Theme toggle (light/dark mode)
- ✅ Professional UI polish with consistent animations
- ✅ Responsive design (desktop + mobile web)

### Mobile App (React Native) ✅ COMPLETE
- ✅ Authentication screens (sign up, sign in)
- ✅ Camera integration for receipt capture
- ✅ Gallery picker for existing photos
- ✅ Receipt list with pull-to-refresh
- ✅ Receipt detail view with line items
- ✅ Insights feed with 4 insight types
- ✅ Profile screen with theme toggle
- ✅ Loading, empty, and error states
- ✅ Light/dark mode with persistence
- ✅ Professional UI matching web design

### Deployment Options 🚀
**Web:** Vercel/Netlify ready
**Mobile:** EAS Build ready for TestFlight (iOS) and Play Store (Android)

### Focus:
- UX clarity and flow correctness
- Calm, trustworthy presentation
- Validate API contracts
- Express Savvy's voice through copy
- Frictionless authentication

### Non-goals:
- Advanced animations or transitions
- Dashboards or data visualizations
- Personalization settings
- Recommendations or predictions
- Design system expansion

### Tech Stack:
- **Web:** Next.js 14+ with shadcn/ui and Tailwind CSS ✅
- **Mobile:** React Native with Expo ✅
- **Shared:** Follow docs/visuals.md strictly

---

## Phase 2: Understanding 🚧 NEXT PRIORITY

**Status:** Ready to start

**Goal:** Improve accuracy and intelligence without scope explosion.

**LLM Strategy:** Using Gemini 2.0 Flash exclusively (simpler than mixing multiple providers)
- Single API integration vs managing GPT-4 + Claude
- Free tier for development/testing in Google AI Studio
- More cost-effective than mixed approach ($1.70 vs $0.75/1000 receipts, but simpler)
- Better at math and structured output than GPT-4o-mini
- Handles receipt edge cases (shadows, handwriting) better than pure OCR

### Infrastructure Improvements ⭐ START HERE
**Timeline:** 1 week | **Impact:** HIGH

**Why now:** Better UX, scalable architecture, enables Phase 2 features

**Implementation:**
```yaml
# Add to docker-compose.yml
redis:
  image: redis:7-alpine
  ports: ["6379:6379"]

celery-worker:
  build: .
  command: celery -A api.tasks worker --loglevel=info
  depends_on: [redis, postgres]

minio:
  image: minio/minio:latest
  ports: ["9000:9000", "9001:9001"]
  command: server /data --console-address ":9001"
```

**Features:**
- **Async Processing:** Celery + Redis for background tasks
  - Upload returns immediately (no blocking)
  - Retry logic for failed parsing
  - Status polling endpoint
- **Storage:** MinIO/S3 for scalable file storage
  - Self-hosted S3-compatible storage
  - Easy migration to AWS S3 later
- **Caching:** Redis for insights and API responses
- **Scheduled Jobs:** Celery Beat for daily insights and cleanup

**Cost:** ~$10-20/month for managed Redis + MinIO storage + ~$2/month for Gemini API (1,000 receipts)

### Receipt Understanding Improvements
- **LLM Integration:** Gemini 2.0 Flash for structured receipt parsing
  - Speed: Returns structured JSON (date, total, items) in one step
  - Intelligence: Auto-categorizes expenses, fixes OCR typos
  - Quality: Handles various receipt conditions (shadows, handwritten notes)
  - **Pricing Model:**
    - Free tier: Available in Google AI Studio for testing (rate limited)
    - Paid tier: $0.50 per 1M input tokens, $3.00 per 1M output tokens
    - Per receipt: ~560 input tokens ($0.0003) + ~200 output tokens ($0.0006) = $0.0009
    - **Cost estimate: $1.70/month for 1,000 receipts** (includes buffer)
- Hybrid approach: OpenCV + Tesseract first, Gemini fallback for failures
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
- Prefer boring, reliable improvements over clever ideas

---

## Phase 2.5: User Experience & Profile Management 🎯 HIGH PRIORITY

**Status:** Planned after infrastructure

**Goal:** Professional user experience with complete profile management and smooth onboarding

### Profile Management System
**Timeline:** 1 week | **Impact:** HIGH

**User Profile Features:**
- [ ] **Personal Information**
  - Full name (first + last)
  - Profile photo upload (with crop/resize)
  - Email address (with verification)
  - Phone number (optional)
  - Preferred currency
  - Timezone selection

- [ ] **Account Settings**
  - Change password (with current password verification)
  - Two-factor authentication (2FA) setup
  - Email notification preferences
  - Push notification settings (mobile)
  - Data export (download all receipts + insights as JSON/CSV)
  - Account deletion (with confirmation + grace period)

- [ ] **Privacy & Security**
  - Active sessions management (see all logged-in devices)
  - Login history (last 10 logins with IP/device)
  - Security alerts (email on password change, new device login)
  - Privacy settings (data sharing preferences)

**Backend API Endpoints:**
```python
# Profile Management
GET    /api/users/me                    # Get current user profile
PATCH  /api/users/me                    # Update profile (name, phone, etc.)
POST   /api/users/me/avatar             # Upload profile photo
DELETE /api/users/me/avatar             # Remove profile photo

# Password Management
POST   /api/users/me/change-password    # Change password
POST   /api/users/me/reset-password     # Request password reset
POST   /api/auth/reset-password         # Complete password reset

# Account Management
GET    /api/users/me/sessions           # List active sessions
DELETE /api/users/me/sessions/:id       # Revoke session
GET    /api/users/me/login-history      # Get login history
POST   /api/users/me/export-data        # Request data export
DELETE /api/users/me/account            # Delete account (soft delete)

# Notifications
GET    /api/users/me/preferences        # Get notification preferences
PATCH  /api/users/me/preferences        # Update preferences
```

### Onboarding Experience
**Timeline:** 3-4 days | **Impact:** HIGH

**Goal:** Guide new users to first value (uploaded receipt + first insight) in < 2 minutes

**5-Step Flow:**

1. **Welcome Screen** (5 sec) - Friendly greeting with 🐇, "Get Started" button
2. **Profile Setup** (30 sec) - Name + optional photo upload, skippable
3. **Preferences** (20 sec) - Theme (Light/Dark/Auto), currency, notification toggles
4. **First Receipt Upload** (60 sec) - Camera/gallery with example receipt shown
5. **Success & Tips** (10 sec) - Celebration 🎉 + quick tips carousel

**Features:**
- Every step skippable with "Skip for now" link
- Progress indicator (1/4, 2/4, 3/4, 4/4)
- State saved to localStorage/AsyncStorage
- Resume from last step if interrupted
- Never show again after completion
- Analytics tracking (completion rate, drop-off points, time per step)

**Success Metrics:**
- Completion rate > 70%
- Time to complete < 2 minutes
- First receipt upload rate > 50%
- 7-day retention > 60%

### UI/UX Improvements

**Profile Screen Redesign:**
- [ ] Avatar with edit button overlay
- [ ] Name + email prominently displayed
- [ ] Quick stats card (receipts uploaded, insights generated)
- [ ] Organized sections with icons:
  - 👤 Personal Information
  - 🔒 Security & Privacy
  - 🔔 Notifications
  - ⚙️ Preferences
  - 📊 Data & Storage
  - ❓ Help & Support
- [ ] Professional card-based layout
- [ ] Smooth animations on interactions

**Settings Screens:**
- [ ] Individual screens for each setting category
- [ ] Clear descriptions for each option
- [ ] Inline validation for forms
- [ ] Success/error toasts for actions
- [ ] Confirmation dialogs for destructive actions

### Mobile-Specific Features
- [ ] Biometric authentication (Face ID, Touch ID, Fingerprint)
- [ ] Quick actions from profile (3D Touch/Long press)
- [ ] Share profile QR code (for family accounts - future)
- [ ] Offline mode indicator
- [ ] App version + build number display

### Web-Specific Features
- [ ] Keyboard shortcuts guide
- [ ] Browser extension link (future)
- [ ] Desktop notifications permission
- [ ] Multi-tab session handling

### Accessibility
- [ ] Screen reader support for all profile screens
- [ ] High contrast mode option
- [ ] Font size adjustment
- [ ] Keyboard navigation (web)
- [ ] VoiceOver/TalkBack optimization (mobile)

### Analytics & Monitoring
- [ ] Track onboarding completion rate
- [ ] Monitor profile update frequency
- [ ] Measure time to first receipt upload
- [ ] Track feature adoption (2FA, notifications, etc.)

**Success Metrics:**
- Onboarding completion rate > 70%
- Time to first receipt < 2 minutes
- Profile completion rate > 50%
- User retention after onboarding > 60% (7-day)

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
