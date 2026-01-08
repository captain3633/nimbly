# Changelog

All notable changes to Nimbly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 1: Usable Interface (In Progress)
- Mobile and web application development
- User interface for authentication flow
- Receipt upload and review interface
- Insights feed display

## [0.1.0] - 2026-01-08

### Phase 0: Foundation - COMPLETE ✅

All v0 backend requirements implemented, tested, and validated. Backend is production-ready.

### Added
- Complete requirements documentation
- System design and architecture documentation
- Implementation task breakdown (18 tasks)
- Development phases document for project organization
- Savvy voice and tone guidelines
- Key product and technical decisions documentation
- Deal intelligence constraints and ethical data practices
- FastAPI project structure with SQLAlchemy models
- Magic link authentication with JWT tokens
- Receipt upload endpoint with file validation
- Receipt listing and detail endpoints with pagination
- Receipt parser with OCR, PDF extraction, and regex patterns
- Store and product normalization utilities
- Automatic price history tracking
- Insight generation system with 4 insight types
- Comprehensive error handling with global exception handlers
- Structured logging infrastructure with request IDs
- Database seed script with sample data
- Docker and docker-compose configuration with health checks
- Enhanced README with setup instructions
- Comprehensive API test suite (scripts/test_api.py)
- Backend status documentation

### Implemented - All 18 Tasks Complete ✅
- **Task 1:** Project foundation and database setup ✅
- **Task 2:** Magic link authentication system ✅
- **Task 3:** Receipt upload endpoint ✅
- **Task 4:** Receipt listing and detail endpoints ✅
- **Task 5:** Receipt parser implementation ✅
- **Task 6:** Store and product normalization ✅
- **Task 7:** Price history tracking ✅
- **Task 8:** Savvy insight generation logic ✅
- **Task 9:** Insights API endpoint ✅
- **Task 10:** Comprehensive error handling ✅
- **Task 11:** Logging infrastructure ✅
- **Task 12:** Docker and local development setup ✅
- **Task 13:** Database seed script ✅
- **Task 14:** Integration tests ✅
- **Task 15:** API documentation ✅
- **Task 16:** Property-based tests ✅
- **Task 17:** Performance optimization ✅
- **Task 18:** Final validation and documentation ✅

### Backend Features Complete ✅
- Magic link authentication with console logging in dev mode
- Receipt upload supporting JPEG, PNG, PDF, and TXT formats
- OCR-based receipt parsing with Tesseract
- Store name and product name normalization
- Automatic price history generation
- Four insight types: purchase frequency, price trends, common purchases, store patterns
- Minimum data thresholds enforced for all insights
- Transparent data display with confidence levels
- Pagination support for receipt listing
- User authorization enforced on all endpoints
- Consistent error responses with proper HTTP status codes
- Structured logging with request IDs and context
- Health check endpoint
- Auto-generated OpenAPI documentation at /docs

### Infrastructure ✅
- Docker Compose setup with PostgreSQL and FastAPI
- Container health checks for both API and database
- Clean container names (nimbly-api, nimbly-db)
- Environment variable configuration
- Automatic database table creation on startup
- Volume mounts for development and uploads
- Seed script for testing with 2 users and 10 receipts

### API Endpoints - All Working ✅
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - OpenAPI documentation
- `POST /api/auth/request-magic-link` - Request authentication
- `GET /api/auth/verify-magic-link` - Verify token
- `POST /api/receipts/upload` - Upload receipt (protected)
- `GET /api/receipts` - List receipts (protected)
- `GET /api/receipts/{id}` - Receipt details (protected)
- `GET /api/insights` - Generate insights (protected)

### Testing ✅
- Comprehensive API test suite (9/9 tests passing)
- Integration tests for all workflows
- Property-based tests with Hypothesis (29 properties)
- Tests for authentication flow, receipt upload/parsing, and insights
- Multi-user isolation tests
- Authorization enforcement tests
- Test script organized in scripts/ folder

### Fixed Issues
- Pydantic RecursionError resolved (Field defaults)
- SQLAlchemy circular reference fixed (PriceHistory model)
- Authorization header handling corrected (401 vs 400 errors)
- Docker container health checks implemented
- Container naming cleaned up

### Documentation ✅
- Requirements document with MUST/SHOULD/COULD prioritization
- Design document with 29 correctness properties
- Task list with clear acceptance criteria and dependencies
- Phases document for project organization
- Tone guide with examples of Savvy's voice
- Decisions document explaining key tradeoffs
- Comprehensive README with quick start guide
- API documentation auto-generated via FastAPI
- Testing guide for contributors
- Backend status document with completion checklist

### Configuration
- pytest.ini in api/ directory
- Enhanced .env.example with comments
- All environment variables documented
- Docker Compose version warning removed

## [0.0.0] - 2026-01-07

### Project Initialized
- Repository created
- Documentation foundation established
- Ready for v0 backend implementation
