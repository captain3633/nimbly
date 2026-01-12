# Nimbly v0 Implementation Tasks

## Milestone: v0 Backend Foundation

Build a working FastAPI backend that accepts receipt uploads, parses them into structured data, tracks price history, and generates factual insights. The system should be deployable locally via Docker and ready for frontend integration.

## Tasks

### 1. Project Foundation and Database Setup

**Description:**
Set up the FastAPI project structure, configure PostgreSQL with SQLAlchemy, define all data models (User, Receipt, LineItem, Store, PriceHistory), and create initial database migrations. Set up testing framework with pytest and Hypothesis for property-based testing.

**Acceptance Criteria:**
- FastAPI project structure matches design document
- All SQLAlchemy models defined with proper relationships
- Database migrations run successfully
- Docker Compose configuration works
- pytest and Hypothesis installed and configured
- Can run `docker-compose up` and connect to database

**Dependencies:** None

---

### 2. Magic Link Authentication System

**Description:**
Implement email-based magic link authentication. Create endpoints for requesting magic links and verifying tokens. Use JWT for session tokens. In development, log magic links to console instead of sending emails.

**Acceptance Criteria:**
- POST /api/auth/request-magic-link endpoint works
- GET /api/auth/verify endpoint validates tokens
- Expired tokens are rejected with clear errors
- Session tokens are secure JWTs
- Magic links logged to console in dev mode
- User records created on first authentication

**Dependencies:** Task 1

---

### 3. Receipt Upload Endpoint

**Description:**
Create endpoint for uploading receipt files. Validate file formats (JPEG, PNG, PDF, TXT), store files to disk with UUID filenames, create receipt records in database with status 'pending'. Require authentication.

**Acceptance Criteria:**
- POST /api/receipts/upload accepts multipart/form-data
- Only valid file formats accepted
- Files stored securely with unique names
- Receipt records created with user association
- Upload timestamp recorded automatically
- Clear error messages for invalid uploads
- Authentication required

**Dependencies:** Task 2

---

### 4. Receipt Listing and Detail Endpoints

**Description:**
Create endpoints to list all receipts for a user and view details of a specific receipt. Include pagination for list endpoint. Ensure users can only access their own receipts.

**Acceptance Criteria:**
- GET /api/receipts returns paginated list
- List sorted by upload timestamp descending
- List includes store, date, total, status
- GET /api/receipts/{id} returns full details
- Detail view includes all line items
- Parse errors displayed when present
- Authorization enforced (users see only their receipts)

**Dependencies:** Task 3

---

### 5. Receipt Parser Implementation

**Description:**
Build receipt parsing logic using OCR (Tesseract) for images and text extraction for PDFs. Implement regex patterns to extract store name, date, line items (product, quantity, price), and total. Handle parsing failures gracefully.

**Acceptance Criteria:**
- OCR extracts text from images (JPEG, PNG)
- Text extracted from PDFs and plain text files
- Regex patterns detect store names
- Regex patterns extract purchase dates
- Regex patterns extract line items with prices
- Regex patterns extract total amounts
- Parsing confidence assessed (high/medium/low)
- Low confidence receipts marked 'needs_review'
- Parsing errors recorded in receipt records
- Structured data stored in database

**Dependencies:** Task 4

---

### 6. Store and Product Normalization

**Description:**
Implement normalization logic for store names and product names. Store normalization ensures "Whole Foods Market" and "whole foods" map to the same store. Product normalization groups similar items like "Organic Bananas" and "organic bananas".

**Acceptance Criteria:**
- Store names normalized (lowercase, punctuation removed)
- Duplicate stores prevented via normalized name lookup
- Product names normalized for grouping
- Normalization applied during parsing
- Store records created or linked correctly
- Similar products grouped for price tracking

**Dependencies:** Task 5

---

### 7. Price History Tracking

**Description:**
When line items are created, automatically generate price history records. Associate each price with product name (normalized), store, date, and source line item. Implement query logic to retrieve price history sorted chronologically.

**Acceptance Criteria:**
- Price history records created for all line items
- Records include product, store, price, date
- Link to source line item maintained
- Query function returns prices sorted by date
- Support filtering by product and store
- Handle same product at different stores separately

**Dependencies:** Task 6

---

### 8. Savvy Insight Generation Logic

**Description:**
Implement insight generation functions for purchase frequency, price trends, common purchases, and store patterns. Each insight type has minimum data thresholds. Generate insights only when sufficient data exists.

**Acceptance Criteria:**
- Purchase frequency insight (min 3 receipts from store)
- Price trend insight (min 2 purchases of product)
- Common purchase insight (min 3 purchases of product)
- Store pattern insight (min 5 receipts)
- Thresholds enforced before generating insights
- "More data needed" messages when thresholds not met
- Data point counts included in insights
- Confidence levels assigned (high/medium/low)
- No predictive language in any insights

**Dependencies:** Task 7

---

### 9. Insights API Endpoint

**Description:**
Create endpoint that generates and returns insights for authenticated user. Include insight type, title, description, underlying data points, and confidence level. Ensure transparency by showing the data behind each insight.

**Acceptance Criteria:**
- GET /api/insights returns list of insights
- Each insight includes type, title, description
- Underlying data points included for transparency
- Confidence levels displayed
- Authentication required
- Only user's own data used for insights
- Insights generated on-demand (no caching in v0)

**Dependencies:** Task 8

---

### 10. Comprehensive Error Handling

**Description:**
Implement consistent error response format across all endpoints. Map exceptions to appropriate HTTP status codes. Validate all input using Pydantic schemas. Separate user-facing messages from internal error details.

**Acceptance Criteria:**
- All endpoints use consistent error format
- 400 for invalid input with validation details
- 401 for authentication failures
- 403 for authorization failures
- 404 for not found resources
- 500 for system errors (generic message to user)
- Pydantic schemas validate all request bodies
- User-facing errors are clear and actionable
- Internal details not exposed to users

**Dependencies:** Task 9

---

### 11. Logging Infrastructure

**Description:**
Set up structured logging for all operations. Log API requests, errors, receipt operations, and insight generation. Use appropriate log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL). Include context like user_id, receipt_id, timestamps.

**Acceptance Criteria:**
- All API requests logged with endpoint and user_id
- All errors logged with stack traces and context
- Receipt uploads logged with file size and format
- Parsing attempts logged with status and errors
- Insight generation logged with type and data points
- Log levels used appropriately
- Logs include timestamps and request IDs
- Logs structured for easy searching

**Dependencies:** Task 10

---

### 12. Docker and Local Development Setup

**Description:**
Create production-ready Dockerfile and docker-compose.yml. Configure environment variables for all settings. Ensure database initializes automatically on startup. Add health check endpoint.

**Acceptance Criteria:**
- Dockerfile builds FastAPI service
- docker-compose.yml includes PostgreSQL
- Environment variables documented in .env.example
- Database schema created automatically on startup
- Health check endpoint (GET /health) works
- Can run `docker-compose up` and access API
- Clear README with setup instructions

**Dependencies:** Task 11

---

### 13. Database Seed Script

**Description:**
Create seed script that populates database with realistic sample data for testing. Include 2 users, 5 receipts per user, line items, stores, and price history. Mix of parse statuses.

**Acceptance Criteria:**
- seed.py script creates sample data
- 2 users with valid magic link tokens
- 5 receipts per user with realistic data
- Line items with varied products and prices
- Store records for multiple stores
- Price history records for tracking
- Mix of parse statuses (success, failed, needs_review)
- Script is idempotent (can run multiple times)
- Clear instructions for running seed script

**Dependencies:** Task 12

---

### 14. Integration Tests

**Description:**
Write integration tests that verify complete workflows: authentication flow, receipt upload through parsing, and insight generation. Test with multiple users and realistic data.

**Acceptance Criteria:**
- Test: magic link request → verify → authenticated request
- Test: upload receipt → parse → retrieve details
- Test: upload multiple receipts → generate insights
- Test: user can only access own receipts
- Test: expired tokens rejected
- Test: invalid file formats rejected
- Tests use realistic data
- Tests clean up after themselves

**Dependencies:** Task 13

---

### 15. API Documentation

**Description:**
Set up FastAPI automatic OpenAPI documentation. Add comprehensive docstrings to all endpoints with request/response examples. Ensure documentation is accessible and complete.

**Acceptance Criteria:**
- OpenAPI docs accessible at /docs
- All endpoints documented with descriptions
- Request schemas documented
- Response schemas documented
- Example requests and responses included
- Error responses documented
- Authentication requirements documented

**Dependencies:** Task 14

---

### 16. Property-Based Tests for Core Logic

**Description:**
Write property-based tests using Hypothesis for critical correctness properties: referential integrity, round-trip properties (upload/retrieve), normalization consistency, and insight generation thresholds.

**Acceptance Criteria:**
- Property test: receipts always belong to valid users
- Property test: upload then retrieve returns same data
- Property test: normalization is consistent
- Property test: insights only generated with sufficient data
- Property test: no predictive language in insights
- Property test: authorization always enforced
- Each test runs 100+ iterations
- Tests use randomized inputs

**Dependencies:** Task 15

---

### 17. Performance Optimization

**Description:**
Add database indexes for common queries. Optimize receipt listing and insight generation queries. Ensure API response times meet requirements (< 500ms for most requests).

**Acceptance Criteria:**
- Indexes on user_id, receipt_id, store_id
- Indexes on normalized product/store names
- Indexes on timestamps for sorting
- Receipt list query optimized with pagination
- Insight generation queries optimized
- API response times measured and logged
- No N+1 query problems

**Dependencies:** Task 16

---

### 18. Final Validation and Documentation

**Description:**
Run full test suite, verify all requirements implemented, test local setup from scratch, review logs, and create comprehensive README with setup instructions, API overview, and development guide.

**Acceptance Criteria:**
- All tests pass (unit, integration, property-based)
- All 12 requirements from requirements.md verified
- Local setup works from clean state
- Seed data loads successfully
- No errors or warnings in logs
- README includes setup instructions
- README includes API overview
- README includes development guide
- README includes testing instructions

**Dependencies:** Task 17

---

## Start Here

To begin implementation, start with these three tasks in order:

1. **Task 1: Project Foundation and Database Setup** - Establishes the core infrastructure
2. **Task 2: Magic Link Authentication System** - Enables user identity and security
3. **Task 3: Receipt Upload Endpoint** - Begins the core feature set

These three tasks create the foundation for all subsequent features. Once complete, you can proceed through tasks 4-18 sequentially, or work on tasks 4-7 (receipt handling) and tasks 8-9 (insights) in parallel if desired.

## Estimated Timeline

- Tasks 1-3: 2-3 days (foundation)
- Tasks 4-7: 3-4 days (receipt handling and parsing)
- Tasks 8-9: 2-3 days (insights)
- Tasks 10-13: 2-3 days (infrastructure)
- Tasks 14-18: 2-3 days (testing and polish)

**Total: 11-16 days for a single developer**

## Notes

- Each task should be completed and tested before moving to the next
- Integration tests (Task 14) will catch issues across tasks
- Property-based tests (Task 16) provide high-confidence correctness validation
- The seed script (Task 13) is essential for manual testing and demos
- Performance optimization (Task 17) can be deferred if timeline is tight


---

## Milestone: Phase 1 - Usable Interface

Build calm, functional web and mobile interfaces that validate the API and express Savvy's tone. Focus on core flows: authentication, receipt upload, receipt viewing, and insights display.

### UI-1. Project Setup and Design System ✅ COMPLETE

**Description:**
Set up Next.js web app and React Native mobile app with proper folder structure. Implement the visual system from docs/visuals.md including colors, typography, and base components. Support both light and dark mode from day one.

**Acceptance Criteria:**
- ✅ Next.js 16 project initialized with TypeScript
- ✅ React Native project initialized with Expo
- ✅ Tailwind CSS v4 configured with custom color tokens
- ✅ Base UI components created following shadcn/ui patterns
- ✅ Light and dark mode toggle working (both platforms)
- ✅ Base components: Button, Card, Input, Text
- ✅ All colors match docs/visuals.md exactly
- ✅ No additional colors introduced
- ✅ Theme providers implemented for both platforms
- ✅ Demo pages showcasing design system

**Dependencies:** Phase 0 complete

**Priority:** Core

**Status:** Complete (January 8, 2026)

---

### UI-2. Magic Link Authentication Flow (Web)

**Description:**
Implement the magic link authentication flow for web. User enters email, receives magic link (shown in console for dev), clicks link, gets authenticated, and receives session token stored in localStorage/cookies.

**Acceptance Criteria:**
- Email input screen with validation
- "Magic link sent" confirmation screen
- Magic link verification and redirect
- Session token stored securely
- Protected route wrapper component
- Logout functionality
- Error states for invalid/expired tokens
- Loading states during API calls
- Copy follows docs/tone.md

**Dependencies:** UI-1

**Priority:** Core

---

### UI-3. Magic Link Authentication Flow (Mobile)

**Description:**
Implement the magic link authentication flow for mobile. Similar to web but with mobile-specific considerations (deep linking, secure storage).

**Acceptance Criteria:**
- Email input screen with validation
- "Magic link sent" confirmation screen
- Deep link handling for magic link
- Session token stored in secure storage
- Protected screen wrapper component
- Logout functionality
- Error states for invalid/expired tokens
- Loading states during API calls
- Copy follows docs/tone.md

**Dependencies:** UI-1

**Priority:** Core

---

### UI-4. Receipt Upload Flow (Web)

**Description:**
Implement receipt upload for web using file picker. Show upload progress, parsing status, and success/error states. Follow the calm, clear tone from docs/tone.md.

**Acceptance Criteria:**
- File picker for JPEG, PNG, PDF, TXT
- File validation before upload
- Upload progress indicator
- Parsing status display
- Success confirmation with receipt details
- Error handling for invalid files
- Error handling for upload failures
- Copy follows docs/tone.md (e.g., "Receipt from Whole Foods added. 12 items recorded.")
- Redirects to receipt detail after success

**Dependencies:** UI-2

**Priority:** Core

---

### UI-5. Receipt Upload Flow (Mobile)

**Description:**
Implement receipt upload for mobile with camera integration and file picker. Show upload progress, parsing status, and success/error states.

**Acceptance Criteria:**
- Camera integration for taking receipt photos
- File picker for selecting from gallery
- Image preview before upload
- File validation before upload
- Upload progress indicator
- Parsing status display
- Success confirmation with receipt details
- Error handling for invalid files
- Error handling for upload failures
- Copy follows docs/tone.md
- Redirects to receipt detail after success

**Dependencies:** UI-3

**Priority:** Core

---

### UI-6. Receipt List View (Web)

**Description:**
Display paginated list of user's receipts sorted by upload date (newest first). Show store name, date, total, and parse status. Handle empty state for new users.

**Acceptance Criteria:**
- List displays all receipts with key info
- Sorted by upload timestamp descending
- Pagination controls (load more or infinite scroll)
- Parse status indicators (success, pending, failed, needs review)
- Empty state for new users with helpful copy
- Loading state while fetching
- Error state for API failures
- Click receipt to view details
- Copy follows docs/tone.md

**Dependencies:** UI-2

**Priority:** Core

---

### UI-7. Receipt List View (Mobile)

**Description:**
Display scrollable list of user's receipts sorted by upload date (newest first). Show store name, date, total, and parse status. Handle empty state for new users.

**Acceptance Criteria:**
- List displays all receipts with key info
- Sorted by upload timestamp descending
- Infinite scroll or pull-to-refresh
- Parse status indicators (success, pending, failed, needs review)
- Empty state for new users with helpful copy
- Loading state while fetching
- Error state for API failures
- Tap receipt to view details
- Copy follows docs/tone.md

**Dependencies:** UI-3

**Priority:** Core

---

### UI-8. Receipt Detail View (Web)

**Description:**
Display full receipt details including store, date, total, and all line items. Show parse status and any errors. Allow navigation back to list.

**Acceptance Criteria:**
- Display store name, purchase date, total amount
- Display all line items with product, quantity, price
- Show parse status clearly
- Show parse errors if status is failed/needs review
- Loading state while fetching
- Error state for API failures
- Back navigation to receipt list
- Copy follows docs/tone.md

**Dependencies:** UI-6

**Priority:** Core

---

### UI-9. Receipt Detail View (Mobile)

**Description:**
Display full receipt details including store, date, total, and all line items. Show parse status and any errors. Allow navigation back to list.

**Acceptance Criteria:**
- Display store name, purchase date, total amount
- Display all line items with product, quantity, price
- Show parse status clearly
- Show parse errors if status is failed/needs review
- Loading state while fetching
- Error state for API failures
- Back navigation to receipt list
- Copy follows docs/tone.md

**Dependencies:** UI-7

**Priority:** Core

---

### UI-10. Insights Feed (Web) ✅ COMPLETE

**Description:**
Display read-only feed of insights generated by Savvy. Show insight type, title, description, confidence level, and underlying data. Handle "not enough data yet" state gracefully.

**Acceptance Criteria:**
- ✅ Display all insights in a feed layout
- ✅ Each insight shows type, title, description
- ✅ Confidence level displayed (high/medium/low)
- ✅ Underlying data points visible with counts
- ✅ "Not enough data yet" state with helpful copy
- ✅ Loading state while fetching
- ✅ Error state for API failures with retry
- ✅ Copy follows docs/tone.md exactly
- ✅ Savvy UI accents use Sage color (#5F7D73)
- ✅ Deal highlights use Amber (#D9A441) sparingly
- ✅ Color-coded insight types (blue, sage, purple, amber)
- ✅ Price trend indicators (↑ ↓ —)
- ✅ Links to related receipts
- ✅ Educational "How insights work" card

**Dependencies:** UI-6

**Priority:** Core

**Status:** Complete (January 12, 2026)

---

### UI-11. Insights Feed (Mobile)

**Description:**
Display read-only feed of insights generated by Savvy. Show insight type, title, description, confidence level, and underlying data. Handle "not enough data yet" state gracefully.

**Acceptance Criteria:**
- Display all insights in a scrollable feed
- Each insight shows type, title, description
- Confidence level displayed (high/medium/low)
- Underlying data points visible (expandable or inline)
- "Not enough data yet" state with helpful copy
- Loading state while fetching
- Error state for API failures
- Copy follows docs/tone.md exactly
- Savvy UI accents use Sage color (#5F7D73)
- Deal highlights use Amber (#D9A441) sparingly

**Dependencies:** UI-7

**Priority:** Core

---

### UI-12. Error and Loading States (Both Platforms)

**Description:**
Create consistent, reusable error and loading components for both web and mobile. Ensure all error messages follow the calm, helpful tone from docs/tone.md.

**Acceptance Criteria:**
- Loading spinner/skeleton components
- Error message components
- Empty state components
- Network error handling
- API error handling with user-friendly messages
- Retry mechanisms where appropriate
- All copy follows docs/tone.md
- Consistent styling across both platforms

**Dependencies:** UI-1

**Priority:** Core

---

### UI-13. Navigation and Layout (Web)

**Description:**
Implement main navigation structure for web app. Simple, clear navigation between receipts, insights, and account/logout.

**Acceptance Criteria:**
- Top navigation bar or sidebar
- Links to: Receipts, Insights, Upload, Logout
- Active state indication
- Responsive layout
- Consistent across all pages
- Follows visual guidelines

**Dependencies:** UI-2

**Priority:** Core

---

### UI-14. Navigation and Layout (Mobile)

**Description:**
Implement main navigation structure for mobile app. Simple, clear navigation between receipts, insights, and account/logout.

**Acceptance Criteria:**
- Bottom tab navigation or drawer
- Tabs/links to: Receipts, Insights, Upload, Account
- Active state indication
- Consistent across all screens
- Follows visual guidelines

**Dependencies:** UI-3

**Priority:** Core

---

### UI-15. API Integration Layer

**Description:**
Create clean API client layer for both web and mobile that handles authentication, error handling, and request/response formatting. Make it easy to call backend endpoints.

**Acceptance Criteria:**
- API client with typed methods for all endpoints
- Automatic auth token injection
- Error handling and transformation
- Loading state management
- Request/response TypeScript types
- Environment-based API URL configuration
- Works on both web and mobile

**Dependencies:** UI-1

**Priority:** Core

---

## Phase 1 UI Summary

**Web App Status:** ✅ COMPLETE (January 12, 2026)
**Mobile App Status:** ✅ COMPLETE (January 12, 2026)

### Completed Features (Web)
- ✅ UI-1: Project Setup and Design System
- ✅ UI-2: Authentication Flow (email/password + social + magic link)
- ✅ UI-4: Receipt Upload Flow (drag-and-drop + file picker)
- ✅ UI-6: Receipt List View (with pagination, empty/error states)
- ✅ UI-8: Receipt Detail View (with line items, parse status)
- ✅ UI-10: Insights Feed (4 insight types, confidence badges)
- ✅ UI-12: Error and Loading States (consistent across all pages)
- ✅ UI-13: Navigation and Layout (sidebar, bottom nav, theme toggle)
- ✅ UI-15: API Integration Layer (TypeScript client with error handling)

### Completed Features (Mobile)
- ✅ UI-3: Authentication Flow (sign up, sign in)
- ✅ UI-5: Receipt Upload Flow (camera + gallery picker)
- ✅ UI-7: Receipt List View (pull-to-refresh, empty/error states)
- ✅ UI-9: Receipt Detail View (line items, parse status)
- ✅ UI-11: Insights Feed (4 insight types, color-coded)
- ✅ UI-14: Navigation and Layout (tabs, theme toggle, profile)

### Phase 1 Complete! 🎉
Web and mobile apps done. All features working, no errors.

**Next:** Phase 2 infrastructure, then Phase 2.5 user experience enhancements

---

## Milestone: Phase 2.5 - User Experience & Profile Management

Build professional profile management system and delightful onboarding experience. Focus on user retention and engagement through smooth first-time experience and comprehensive account controls.

### UX-1. Profile Management Backend

**Description:**
Implement comprehensive profile management API endpoints. Support personal information updates, password changes, session management, and account deletion. Add security features like login history and 2FA preparation.

**Acceptance Criteria:**
- GET /api/users/me returns full profile
- PATCH /api/users/me updates profile fields (name, phone, currency, timezone)
- POST /api/users/me/avatar handles photo upload with resize
- DELETE /api/users/me/avatar removes photo
- POST /api/users/me/change-password with current password verification
- POST /api/users/me/reset-password initiates reset flow
- GET /api/users/me/sessions lists active sessions
- DELETE /api/users/me/sessions/:id revokes session
- GET /api/users/me/login-history returns last 10 logins
- POST /api/users/me/export-data generates JSON/CSV export
- DELETE /api/users/me/account soft deletes with 30-day grace period
- All endpoints require authentication
- Proper validation and error handling

**Dependencies:** Phase 1 complete

**Priority:** High

**Status:** Planned

---

### UX-2. Onboarding Flow (Web)

**Description:**
Implement 5-step onboarding flow for web app. Guide new users from signup to first receipt upload in under 2 minutes. Make every step skippable and resumable. Track analytics for optimization.

**Acceptance Criteria:**
- Step 1: Welcome screen with "Get Started" button
- Step 2: Profile setup (name, photo upload)
- Step 3: Preferences (theme, currency, notifications)
- Step 4: First receipt upload with example
- Step 5: Success screen with quick tips
- Progress indicator shows current step (1/4, 2/4, etc.)
- All steps skippable with "Skip for now" link
- State saved to localStorage on each step
- Resume from last step if interrupted
- Mark onboarding complete on finish
- Never show again after completion
- Smooth animations between steps
- Analytics events tracked for each step
- Completion time < 2 minutes average

**Dependencies:** UX-1

**Priority:** High

**Status:** Planned

---

### UX-3. Onboarding Flow (Mobile)

**Description:**
Implement 5-step onboarding flow for mobile app. Same flow as web but optimized for mobile with camera integration, haptic feedback, and native animations.

**Acceptance Criteria:**
- Same 5 steps as web version
- Camera integration for photo uploads
- Haptic feedback on interactions
- Native animations (slide, fade)
- State saved to AsyncStorage
- Resume functionality works after app close
- Biometric prompt after onboarding (optional)
- Works on iOS and Android
- VoiceOver/TalkBack support
- Completion time < 2 minutes average

**Dependencies:** UX-1

**Priority:** High

**Status:** Planned

---

### UX-4. Profile Screen Redesign (Web)

**Description:**
Redesign profile screen with modern card-based layout. Organize settings into clear sections with icons. Add quick stats card showing user activity.

**Acceptance Criteria:**
- Avatar with edit button overlay
- Name and email prominently displayed
- Quick stats card (receipts uploaded, insights generated, days active)
- Organized sections:
  - 👤 Personal Information
  - 🔒 Security & Privacy
  - 🔔 Notifications
  - ⚙️ Preferences
  - 📊 Data & Storage
  - ❓ Help & Support
- Each section navigates to dedicated settings page
- Professional card-based layout
- Smooth hover animations
- Responsive design (desktop + mobile)
- Dark mode support

**Dependencies:** UX-1

**Priority:** High

**Status:** Planned

---

### UX-5. Profile Screen Redesign (Mobile)

**Description:**
Redesign mobile profile screen matching web design. Add mobile-specific features like biometric authentication and quick actions.

**Acceptance Criteria:**
- Same layout as web version
- Avatar with edit overlay
- Quick stats card
- Organized sections with icons
- Biometric authentication toggle
- Quick actions (long press on avatar)
- Pull to refresh
- Smooth native animations
- Works on iOS and Android

**Dependencies:** UX-1

**Priority:** High

**Status:** Planned

---

### UX-6. Personal Information Settings

**Description:**
Create dedicated screen for editing personal information. Support name, email, phone, currency, and timezone updates with inline validation.

**Acceptance Criteria:**
- Form fields for all personal info
- Inline validation (email format, phone format)
- Email verification flow if email changed
- Currency dropdown with search
- Timezone dropdown with auto-detect
- Save button with loading state
- Success/error toasts
- Unsaved changes warning
- Works on web and mobile

**Dependencies:** UX-1, UX-4, UX-5

**Priority:** Medium

**Status:** Planned

---

### UX-7. Security Settings

**Description:**
Create security settings screen with password change, session management, and login history. Prepare for 2FA integration.

**Acceptance Criteria:**
- Change password form (current + new + confirm)
- Password strength indicator
- Active sessions list (device, location, last active)
- Revoke session button with confirmation
- Login history table (date, IP, device, location)
- Security alerts toggle (email on password change)
- 2FA setup placeholder (for Phase 3)
- All actions require current password confirmation
- Works on web and mobile

**Dependencies:** UX-1, UX-4, UX-5

**Priority:** Medium

**Status:** Planned

---

### UX-8. Notification Preferences

**Description:**
Create notification preferences screen with granular controls. Support email and push notifications with preview examples.

**Acceptance Criteria:**
- Email notifications section:
  - Price alerts (when prices drop)
  - Weekly summary (spending recap)
  - New insights (patterns detected)
  - Security alerts (password changes)
  - Marketing emails (optional)
- Push notifications section (mobile only):
  - Same categories as email
  - Test notification button
- Notification preview examples
- Save button with loading state
- Works on web and mobile

**Dependencies:** UX-1, UX-4, UX-5

**Priority:** Medium

**Status:** Planned

---

### UX-9. Data Export & Account Deletion

**Description:**
Implement data export (download all user data) and account deletion with grace period. Ensure GDPR compliance.

**Acceptance Criteria:**
- Export data button generates JSON + CSV files
- Export includes: receipts, insights, profile, preferences
- Download link sent via email
- Account deletion requires password confirmation
- 30-day grace period before permanent deletion
- Email sent with cancellation link
- Clear explanation of what gets deleted
- Option to download data before deletion
- Works on web and mobile

**Dependencies:** UX-1, UX-4, UX-5

**Priority:** Medium

**Status:** Planned

---

### UX-10. Onboarding Analytics Dashboard

**Description:**
Create internal analytics dashboard to monitor onboarding performance. Track completion rates, drop-off points, and time to complete.

**Acceptance Criteria:**
- Completion rate chart (daily/weekly/monthly)
- Drop-off funnel visualization
- Average time per step
- Skip rate per step
- 7-day retention after onboarding
- Cohort analysis
- A/B test results (if running)
- Export to CSV
- Real-time updates

**Dependencies:** UX-2, UX-3

**Priority:** Low

**Status:** Planned

---

### UX-11. Accessibility Audit & Improvements

**Description:**
Conduct comprehensive accessibility audit of onboarding and profile screens. Fix all WCAG 2.1 AA violations. Add keyboard navigation and screen reader support.

**Acceptance Criteria:**
- All interactive elements keyboard accessible
- Proper focus indicators
- Screen reader announcements for all actions
- High contrast mode support
- Font size adjustment (web)
- VoiceOver optimization (iOS)
- TalkBack optimization (Android)
- No color-only information
- Alt text for all images
- ARIA labels where needed
- Passes WAVE and axe audits

**Dependencies:** UX-2, UX-3, UX-4, UX-5

**Priority:** High

**Status:** Planned

---

## Phase 2.5 Summary

**Timeline:** 3-4 weeks
**Impact:** High (improves retention and user satisfaction)

**Key Deliverables:**
1. Complete profile management system
2. Delightful onboarding experience (< 2 min)
3. Professional settings screens
4. Data export and account deletion
5. Analytics for optimization
6. Full accessibility compliance

**Success Metrics:**
- Onboarding completion rate > 70%
- Time to first receipt < 2 minutes
- Profile completion rate > 50%
- 7-day retention > 60%

---

### Phase 1 Complete! 🎉
Web and mobile apps done. All features working, no errors.

**Next:** Phase 2 infrastructure (async processing, storage, LLM integration)

---
