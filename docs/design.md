# Design Document: Nimbly v0

## Overview

Nimbly v0 is a single-service backend application built with FastAPI and PostgreSQL. The system accepts receipt uploads from users, parses them into structured data, tracks price history over time, and generates factual insights about spending patterns. The design prioritizes simplicity, transparency, and data integrity while establishing a foundation for future intelligence.

The architecture is deliberately minimal: one service, one database, no queues, no caches, no complex abstractions. This approach allows rapid iteration while maintaining clarity and reliability.

## Architecture

### System Components

```
┌─────────────┐
│   Client    │
│  (Future)   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────┐
│       FastAPI Service           │
│                                 │
│  ┌──────────┐  ┌─────────────┐ │
│  │   Auth   │  │   Receipt   │ │
│  │ Endpoints│  │  Endpoints  │ │
│  └──────────┘  └─────────────┘ │
│                                 │
│  ┌──────────┐  ┌─────────────┐ │
│  │  Parser  │  │   Insight   │ │
│  │  Logic   │  │   Engine    │ │
│  └──────────┘  └─────────────┘ │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│                 │
│  users          │
│  receipts       │
│  line_items     │
│  stores         │
│  price_history  │
└─────────────────┘
```

### Design Principles

1. **Backend-first**: All logic lives in the API service
2. **No layers**: Direct database access from endpoints, no repository pattern
3. **Explicit over clever**: Clear code over abstractions
4. **Fail loudly**: Errors should be obvious and logged
5. **Data-driven**: All insights come from actual user data

## Folder Structure

```
/api
├── main.py                 # FastAPI app initialization
├── config.py               # Environment configuration
├── database.py             # Database connection and session management
├── models.py               # SQLAlchemy ORM models
├── schemas.py              # Pydantic request/response schemas
├── auth.py                 # Authentication logic (magic links)
├── receipts.py             # Receipt upload and retrieval endpoints
├── parser.py               # Receipt parsing logic
├── insights.py             # Insight generation logic
├── utils.py                # Shared utilities
└── tests/
    ├── test_auth.py
    ├── test_receipts.py
    ├── test_parser.py
    └── test_insights.py

/migrations                 # Alembic database migrations
/uploads                    # Local storage for receipt files (dev only)
/docker
├── Dockerfile
└── docker-compose.yml
```

## Data Models

### User

```python
class User:
    id: UUID (primary key)
    email: str (unique, indexed)
    created_at: datetime
    updated_at: datetime
```

### Receipt

```python
class Receipt:
    id: UUID (primary key)
    user_id: UUID (foreign key to User)
    store_id: UUID (foreign key to Store, nullable)
    upload_timestamp: datetime
    purchase_date: date (nullable, from parsed data)
    total_amount: Decimal (nullable, from parsed data)
    original_file_path: str
    parse_status: enum ['pending', 'success', 'failed', 'needs_review']
    parse_error: str (nullable)
    created_at: datetime
    updated_at: datetime
```

### LineItem

```python
class LineItem:
    id: UUID (primary key)
    receipt_id: UUID (foreign key to Receipt)
    product_name: str
    normalized_product_name: str (for grouping similar items)
    quantity: Decimal (nullable)
    unit_price: Decimal (nullable)
    total_price: Decimal
    line_number: int (position in receipt)
    created_at: datetime
```

### Store

```python
class Store:
    id: UUID (primary key)
    name: str
    normalized_name: str (for matching)
    address: str (nullable)
    created_at: datetime
    updated_at: datetime
```

### PriceHistory

```python
class PriceHistory:
    id: UUID (primary key)
    product_name: str (normalized)
    store_id: UUID (foreign key to Store)
    price: Decimal
    observed_date: date
    source_line_item_id: UUID (foreign key to LineItem)
    created_at: datetime
```

## Receipt Ingestion Flow

### Upload Process

1. **Client uploads receipt** → POST /api/receipts/upload
2. **Validate file format** → Check JPEG, PNG, PDF, or text
3. **Store original file** → Save to disk with UUID filename
4. **Create receipt record** → Insert into database with status 'pending'
5. **Return receipt ID** → Client receives confirmation
6. **Parse asynchronously** → Trigger parsing in background (same process, no queue)
7. **Update receipt status** → Mark as 'success', 'failed', or 'needs_review'
8. **Extract and store data** → Create LineItem and PriceHistory records

### Parsing Strategy

For v0, parsing will use a simple rule-based approach:

1. **Text extraction**: Use OCR library (Tesseract) for images, direct text for PDFs
2. **Pattern matching**: Regex patterns for common receipt formats
3. **Store detection**: Match store name from header text
4. **Date extraction**: Look for date patterns near top of receipt
5. **Line item extraction**: Identify product lines with price patterns
6. **Total extraction**: Find total amount near bottom

**Parsing confidence levels:**
- High confidence: All fields extracted, patterns match expected format
- Medium confidence: Some fields missing, mark for review
- Low confidence: Parsing failed, mark as 'failed'

## API Endpoints

### Authentication

#### POST /api/auth/request-magic-link

Request a magic link for authentication.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Magic link sent to user@example.com",
  "expires_in": 900
}
```

#### GET /api/auth/verify

Verify magic link token and create session.

**Query params:** `token=<magic_link_token>`

**Response:**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "session_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Receipts

#### POST /api/receipts/upload

Upload a new receipt.

**Headers:** `Authorization: Bearer <session_token>`

**Request:** multipart/form-data with file field

**Response:**
```json
{
  "receipt_id": "123e4567-e89b-12d3-a456-426614174001",
  "status": "pending",
  "message": "Receipt uploaded successfully. Parsing in progress."
}
```

#### GET /api/receipts

List all receipts for authenticated user.

**Headers:** `Authorization: Bearer <session_token>`

**Query params:** 
- `limit` (optional, default 20)
- `offset` (optional, default 0)

**Response:**
```json
{
  "receipts": [
    {
      "receipt_id": "123e4567-e89b-12d3-a456-426614174001",
      "store_name": "Whole Foods",
      "purchase_date": "2026-01-05",
      "total_amount": 87.43,
      "parse_status": "success",
      "upload_timestamp": "2026-01-05T14:32:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

#### GET /api/receipts/{receipt_id}

Get detailed information for a specific receipt.

**Headers:** `Authorization: Bearer <session_token>`

**Response:**
```json
{
  "receipt_id": "123e4567-e89b-12d3-a456-426614174001",
  "store_name": "Whole Foods",
  "purchase_date": "2026-01-05",
  "total_amount": 87.43,
  "parse_status": "success",
  "line_items": [
    {
      "product_name": "Organic Bananas",
      "quantity": 2.5,
      "unit_price": 0.79,
      "total_price": 1.98
    },
    {
      "product_name": "Almond Milk",
      "quantity": 1,
      "unit_price": 4.99,
      "total_price": 4.99
    }
  ]
}
```

### Insights

#### GET /api/insights

Get insights for authenticated user.

**Headers:** `Authorization: Bearer <session_token>`

**Response:**
```json
{
  "insights": [
    {
      "type": "purchase_frequency",
      "title": "You shop at Whole Foods regularly",
      "description": "You've shopped at Whole Foods 8 times in the past 30 days.",
      "data_points": 8,
      "confidence": "high",
      "generated_at": "2026-01-07T10:00:00Z"
    },
    {
      "type": "price_trend",
      "title": "Almond Milk price increased",
      "description": "Almond Milk at Whole Foods went from $4.49 to $4.99 over the past 2 weeks.",
      "data_points": 3,
      "confidence": "medium",
      "generated_at": "2026-01-07T10:00:00Z"
    }
  ]
}
```

## Savvy Logic v0

Savvy in v0 is purely observational. It generates insights based on factual patterns in user data.

### Insight Types

1. **Purchase Frequency**
   - Observation: "You shop at [Store] [X] times per [period]"
   - Minimum data: 3 receipts from same store
   - Calculation: Count receipts per store in time window

2. **Price Trends**
   - Observation: "[Product] at [Store] went from $[X] to $[Y]"
   - Minimum data: 2 purchases of same product at same store
   - Calculation: Compare most recent price to previous price

3. **Common Purchases**
   - Observation: "You buy [Product] regularly"
   - Minimum data: 3 purchases of same product
   - Calculation: Count occurrences of normalized product name

4. **Store Patterns**
   - Observation: "You usually shop on [day of week]"
   - Minimum data: 5 receipts
   - Calculation: Mode of purchase day of week

### Insight Generation Rules

- **No predictions**: Never say "you will" or "you should"
- **Factual only**: State what was observed, not what it means
- **Minimum data thresholds**: Do not generate insights without sufficient data
- **Transparent**: Always show the data points behind an insight
- **Non-judgmental**: Avoid language that implies good/bad spending

### Insufficient Data Messaging

When a user has uploaded fewer than 3 receipts:
- "Savvy is learning. Upload more receipts to see patterns."

When a specific insight cannot be generated:
- "Not enough data yet to spot [pattern type]."

## Error Handling

### Error Categories

1. **User errors**: Invalid input, unauthorized access
   - HTTP 400 (Bad Request) or 401 (Unauthorized)
   - Clear, actionable message
   - No technical details exposed

2. **System errors**: Database failures, parsing crashes
   - HTTP 500 (Internal Server Error)
   - Generic message to user
   - Full details logged internally

3. **Not found errors**: Resource does not exist
   - HTTP 404 (Not Found)
   - Clear message about what was not found

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "Receipt must be JPEG, PNG, PDF, or text file",
    "details": null
  }
}
```

### Logging Strategy

- **All requests**: Log endpoint, user_id, timestamp, response status
- **Errors**: Log full stack trace, request context, user_id
- **Receipt uploads**: Log file size, format, parse status
- **Parsing failures**: Log receipt_id, error type, raw text (truncated)
- **Insights generated**: Log user_id, insight type, data point count

**Log levels:**
- DEBUG: Detailed parsing steps, database queries
- INFO: Successful operations, insight generation
- WARNING: Parsing confidence issues, missing data
- ERROR: Exceptions, failed operations
- CRITICAL: Database connection failures, system crashes

## Testing Strategy

### Unit Tests

Unit tests verify specific examples and edge cases:

- **Auth**: Magic link generation, token validation, expiration
- **Receipt upload**: File validation, storage, error cases
- **Parser**: Known receipt formats, edge cases (missing fields, malformed text)
- **Insights**: Calculation logic with sample data
- **API endpoints**: Request validation, response formats

### Property-Based Tests

Property-based tests verify universal properties across all inputs:

- Each property test runs minimum 100 iterations
- Tests use randomized inputs to catch edge cases
- Each test references its design document property
- Tag format: **Feature: nimbly-v0, Property {number}: {property_text}**

Property tests will be defined in the Correctness Properties section below.

### Testing Tools

- **pytest**: Test framework
- **Hypothesis**: Property-based testing library for Python
- **pytest-asyncio**: For testing async FastAPI endpoints
- **httpx**: For testing HTTP requests

## Local Development

### Setup

1. Clone repository
2. Copy `.env.example` to `.env`
3. Run `docker-compose up`
4. Database migrations run automatically
5. API available at `http://localhost:8000`

### Environment Variables

```
DATABASE_URL=postgresql://nimbly:nimbly@db:5432/nimbly
SECRET_KEY=<random_secret_for_jwt>
MAGIC_LINK_EXPIRY_SECONDS=900
UPLOAD_DIR=/app/uploads
LOG_LEVEL=INFO
```

### Database Migrations

Using Alembic:
- `alembic revision --autogenerate -m "description"`
- `alembic upgrade head`

### Seed Data

Provide a seed script that creates:
- 2 sample users
- 5 sample receipts per user
- Realistic line items and price history
- Mix of parse statuses


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Magic Link Authentication Round Trip

*For any* valid email address, requesting a magic link and then verifying that link should successfully create or authenticate a user session with the correct email.

**Validates: Requirements 1.1, 1.2**

### Property 2: Expired Token Rejection

*For any* magic link token that has exceeded the expiration time, authentication attempts should be rejected with clear error feedback.

**Validates: Requirements 1.3**

### Property 3: Session Persistence

*For any* established user session, that session token should remain valid across multiple API requests until expiration.

**Validates: Requirements 1.5**

### Property 4: File Format Validation

*For any* uploaded file, the system should accept files with extensions JPEG, PNG, PDF, or TXT, and reject all other formats with clear error messages.

**Validates: Requirements 2.1**

### Property 5: Receipt Upload Round Trip

*For any* valid receipt file uploaded by a user, the system should store the file and allow retrieval of the exact same file content, and the receipt should appear in that user's receipt list.

**Validates: Requirements 2.2, 2.4, 8.1**

### Property 6: Upload Error Handling

*For any* receipt upload that fails due to invalid input or system error, the system should return a clear error message and not create partial or corrupted receipt records.

**Validates: Requirements 2.3**

### Property 7: Temporal Data Integrity

*For any* created record (receipt, line item, price history), the system should automatically populate timestamp fields with valid datetime values.

**Validates: Requirements 2.5, 4.4, 5.1**

### Property 8: Parsed Receipt Structure

*For any* receipt that parses successfully, the resulting data should include store information, purchase date, and at least one line item with product name and price.

**Validates: Requirements 3.1, 3.2**

### Property 9: Parse Failure Marking

*For any* receipt where parsing fails or produces low-confidence results, the system should set parse_status to 'failed' or 'needs_review' and record the error reason.

**Validates: Requirements 3.3**

### Property 10: Parse Data Persistence

*For any* receipt that completes parsing, querying the database should return all extracted line items with their associated data.

**Validates: Requirements 3.4**

### Property 11: Referential Integrity

*For any* receipt or line item, the system should enforce that receipts cannot exist without a valid user_id, line items cannot exist without a valid receipt_id, and deleting a receipt with line items should be prevented.

**Validates: Requirements 4.1, 4.2, 4.5**

### Property 12: Store Normalization

*For any* store name encountered during parsing, the system should either find an existing store record with matching normalized name or create a new one, ensuring no duplicate stores exist.

**Validates: Requirements 4.3**

### Property 13: Price History Accumulation

*For any* sequence of purchases of the same product, the system should maintain all price records in chronological order, allowing price changes to be tracked over time.

**Validates: Requirements 5.2, 5.4**

### Property 14: Product Name Normalization

*For any* set of similar product names (differing only in case, whitespace, or minor variations), the system should map them to the same normalized form for grouping purposes.

**Validates: Requirements 5.3**

### Property 15: Multi-Store Price Differentiation

*For any* product that appears at multiple stores, the system should maintain separate price history records for each store, allowing store-specific price tracking.

**Validates: Requirements 5.5**

### Property 16: Insight Generation Thresholds

*For any* user with sufficient data (meeting minimum thresholds), the system should generate appropriate insights about purchase frequency, price trends, or common purchases.

**Validates: Requirements 6.1, 6.2**

### Property 17: Insufficient Data Messaging

*For any* user with fewer than the minimum required data points for a specific insight type, the system should return a message indicating more data is needed rather than generating an insight.

**Validates: Requirements 6.4**

### Property 18: No Predictive Language

*For any* generated insight text, the content should not contain predictive language patterns such as "you will", "you should", "we recommend", or future-tense predictions.

**Validates: Requirements 6.5**

### Property 19: Insight Transparency

*For any* generated insight, the response should include both the observation text and the underlying data points that support the insight, along with a confidence level.

**Validates: Requirements 7.1, 7.2, 7.5**

### Property 20: Receipt List Completeness

*For any* authenticated user, requesting their receipt list should return all receipts associated with that user in reverse chronological order.

**Validates: Requirements 8.1, 8.4**

### Property 21: Receipt Response Structure

*For any* receipt returned by the API, the response should include store name, purchase date, total amount, and parse status fields.

**Validates: Requirements 8.2**

### Property 22: Line Item Completeness

*For any* receipt detail request, the response should include all line items associated with that receipt.

**Validates: Requirements 8.3**

### Property 23: Parse Error Indication

*For any* receipt with parse_status set to 'failed' or 'needs_review', the API response should include a parse_error field with a descriptive message.

**Validates: Requirements 8.5**

### Property 24: Input Validation

*For any* API request with invalid input data (missing required fields, wrong types, out-of-range values), the system should reject the request before processing and return a 400 status code with validation errors.

**Validates: Requirements 9.2**

### Property 25: Error Response Consistency

*For any* API error (4xx or 5xx), the response should follow a consistent format with error code, message, and optional details fields, and should not expose internal implementation details like stack traces.

**Validates: Requirements 9.3, 9.4, 10.5**

### Property 26: Comprehensive Error Logging

*For any* error that occurs during request processing, the system should create a log entry containing the error message, stack trace, timestamp, and request context.

**Validates: Requirements 10.1, 10.4**

### Property 27: Operation Audit Logging

*For any* receipt upload or parsing operation, the system should create a log entry recording the operation type, user_id, receipt_id, and outcome.

**Validates: Requirements 10.3**

### Property 28: Secure Session Tokens

*For any* authenticated session, the session token should be a properly signed JWT containing user_id and expiration claims, and should be verifiable using the system's secret key.

**Validates: Requirements 11.3**

### Property 29: Authorization Enforcement

*For any* user attempting to access receipts or insights, the system should only return data belonging to that authenticated user and reject attempts to access other users' data with a 403 status code.

**Validates: Requirements 11.4**

## Summary

These 29 properties provide comprehensive coverage of the testable acceptance criteria. Each property is universally quantified and can be validated through property-based testing with randomized inputs. Properties that were marked as examples or edge cases in the prework (such as specific configuration checks) will be covered by unit tests rather than property tests.

The properties focus on:
- Data integrity and persistence (round-trip properties)
- Business logic correctness (insight generation, parsing)
- Security and authorization (session management, access control)
- API contract compliance (response formats, error handling)
- System reliability (logging, error recovery)
