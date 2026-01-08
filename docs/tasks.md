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

### UI-10. Insights Feed (Web)

**Description:**
Display read-only feed of insights generated by Savvy. Show insight type, title, description, confidence level, and underlying data. Handle "not enough data yet" state gracefully.

**Acceptance Criteria:**
- Display all insights in a feed layout
- Each insight shows type, title, description
- Confidence level displayed (high/medium/low)
- Underlying data points visible (expandable or inline)
- "Not enough data yet" state with helpful copy
- Loading state while fetching
- Error state for API failures
- Copy follows docs/tone.md exactly
- Savvy UI accents use Sage color (#5F7D73)
- Deal highlights use Amber (#D9A441) sparingly

**Dependencies:** UI-6

**Priority:** Core

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

**Total Tasks:** 15
**Core Tasks:** 15
**Nice-to-Have Tasks:** 0

**Estimated Timeline:**
- Setup and design system: 1-2 days
- Authentication flows: 2-3 days
- Receipt upload flows: 2-3 days
- Receipt list and detail: 2-3 days
- Insights feed: 2-3 days
- Polish and testing: 2-3 days

**Total: 11-17 days for both web and mobile**

**Key Principles:**
- Follow docs/visuals.md strictly (colors, spacing, components)
- Follow docs/tone.md for all copy
- Support light and dark mode from day one
- Focus on clarity and correctness over visual flair
- Keep it calm, trustworthy, and functional
