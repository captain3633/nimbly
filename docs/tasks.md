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
