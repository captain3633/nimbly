# Changelog

All notable changes to Nimbly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 2.5 User Experience (Planned)
- **Profile Management System**
  - Personal information (name, photo, phone, currency, timezone)
  - Password change and reset functionality
  - Two-factor authentication (2FA)
  - Active sessions management
  - Login history tracking
  - Data export (JSON/CSV)
  - Account deletion with grace period
  
- **Professional Onboarding Flow**
  - 5-step guided setup (< 2 minutes)
  - Profile setup with photo upload
  - Preference customization (theme, currency, notifications)
  - First receipt upload with guidance
  - Skippable steps with progress saving
  - Success celebration with quick tips
  
- **Enhanced Profile UI**
  - Avatar with edit overlay
  - Quick stats card (receipts, insights)
  - Organized settings sections with icons
  - Biometric authentication (mobile)
  - Keyboard shortcuts (web)
  - Accessibility improvements

### Phase 2 Infrastructure (Next Priority)
- Async processing with Celery + Redis
- Scalable storage with MinIO/S3
- **LLM integration: Gemini 2.0 Flash** (chosen for simplicity, cost-effectiveness)
  - Single API vs mixed providers (GPT-4 + Claude)
  - Free tier for testing, ~$1.70/month for 1,000 receipts
  - Better math accuracy and structured output
  - Handles receipt edge cases (shadows, handwriting)
- Advanced insights (5 new types)
- Improved parsing confidence scoring

---

## [0.3.0] - 2026-01-12 - Phase 1 Complete! 🎊

### Added - Mobile App
- **React Native mobile app with Expo**
  - Authentication screens (sign up, sign in)
  - Camera integration for receipt capture
  - Gallery picker for existing photos
  - Receipt list with pull-to-refresh
  - Receipt detail view with line items
  - Insights feed with 4 insight types
  - Profile screen with theme toggle
  - Light/dark mode with AsyncStorage persistence
  - Secure token storage with SecureStore
  - Professional UI matching web design
  - Loading, empty, and error states

### Technical - Mobile
- Expo Router for file-based navigation
- TypeScript with path aliases
- Context API for auth and theme state
- Axios for API calls
- Professional animations and transitions

---

## [0.2.0] - 2026-01-12 - Phase 1 Web Complete! 🎉

### Added - Web App
- **Authentication System**
  - Email/password sign up and sign in with validation
  - Social authentication (Google, Apple, Meta OAuth 2.0)
  - Magic link fallback for passwordless access
  - Session management with localStorage
  - Protected routes for authenticated views

- **Receipt Management**
  - File upload with drag-and-drop support
  - Receipt list view with pagination
  - Receipt detail view with line items
  - Professional receipt cards with store names, dates, amounts
  - Parse status indicators (success, pending, failed)
  - Empty states for new users
  - Error handling with retry functionality

- **Insights Feed**
  - Read-only insights display with 4 types:
    - Purchase frequency (shopping patterns at stores)
    - Price trends (price changes over time)
    - Common purchases (frequently bought items)
    - Store patterns (shopping distribution)
  - Confidence badges (high, medium, low)
  - Color-coded insight types with icons
  - Data point counts and timestamps
  - Links to related receipts
  - Empty state with helpful messaging
  - Educational "How insights work" card

- **UI/UX Features**
  - Consistent right-to-left slide animations (x: 20 → 0)
  - Collapsible sidebar with state persistence
  - Theme toggle (light/dark mode)
  - Professional color scheme (sage green primary)
  - Loading states with spinners
  - Error states with retry buttons
  - Empty states with call-to-action
  - Responsive design (desktop + mobile web)

- **Navigation**
  - Sidebar navigation (Home, Receipts, Insights, Deals)
  - Mobile bottom navigation
  - User profile card with avatar
  - Footer with links (About, Contact, Privacy, Terms)
  - 404 page with authenticated user detection

### Changed
- Store names now properly capitalized (Walmart, not walmart)
- Amounts display with $ symbol ($45.67)
- Missing data shows descriptive text ("Amount unknown" instead of "—")
- Parse failures use amber color (not red) for less alarming appearance
- Receipt detail view shows "Total not available" for missing totals
- Insights page uses color-coded cards for different insight types

### Technical
- TypeScript with proper types throughout
- Consistent error handling across all pages
- API client with proper error messages
- Clean component structure with reusable UI components (shadcn/ui)
- Dark mode support throughout
- Performance optimized with proper loading states

---

## [0.1.0] - 2026-01-08 - Phase 0 Backend Complete

### Added - Backend
- **Core Infrastructure**
  - FastAPI backend with PostgreSQL database
  - SQLAlchemy ORM with proper relationships
  - Docker Compose configuration
  - Environment variable management
  - Health check endpoint

- **Authentication**
  - Magic link authentication system
  - JWT session tokens
  - Email/password authentication
  - User management

- **Receipt Processing**
  - Receipt upload endpoint (JPEG, PNG, PDF, TXT)
  - OCR parsing with Tesseract
  - OpenCV image preprocessing
  - Text extraction from PDFs
  - Store name detection with fuzzy matching
  - Purchase date extraction
  - Line item extraction (product, quantity, price)
  - Total amount extraction
  - Confidence scoring (high/medium/low)
  - Parse status tracking (success, pending, failed, needs_review)

- **Data Management**
  - Store normalization (prevents duplicates)
  - Product normalization (groups similar items)
  - Price history tracking
  - Automatic price history records for all line items

- **Insights Generation**
  - Purchase frequency insights (min 3 receipts from store)
  - Price trend insights (min 2 purchases of product)
  - Common purchase insights (min 3 purchases of product)
  - Store pattern insights (min 5 receipts)
  - Confidence levels for all insights
  - Underlying data transparency

- **API Endpoints**
  - POST /api/auth/signup - Email/password sign up
  - POST /api/auth/signin - Email/password sign in
  - POST /api/auth/request-magic-link - Request magic link
  - GET /api/auth/verify - Verify magic link token
  - POST /api/receipts/upload - Upload receipt file
  - GET /api/receipts - List user's receipts (paginated)
  - GET /api/receipts/{id} - Get receipt details
  - GET /api/insights - Generate and return insights

- **Quality & Testing**
  - Comprehensive error handling
  - Structured logging with context
  - pytest test suite
  - Property-based tests with Hypothesis
  - Integration tests
  - Database seed script with sample data

- **Documentation**
  - OpenAPI/Swagger docs at /docs
  - Comprehensive README
  - API endpoint documentation
  - Setup instructions
  - Testing guide

### Technical Details
- Python 3.11+ with FastAPI
- PostgreSQL 15+ for database
- Tesseract OCR for image text extraction
- OpenCV for image preprocessing
- PyPDF2 for PDF text extraction
- rapidfuzz for fuzzy string matching
- Pydantic for request/response validation
- SQLAlchemy for ORM
- Alembic for database migrations
- Docker for containerization

---

## Project Milestones

### Phase 0: Foundation ✅ Complete (January 8, 2026)
Backend core with receipt processing and insights generation

### Phase 1: Usable Interface ✅ Complete (January 12, 2026)
- **Web App:** Complete with all features
- **Mobile App:** Complete with camera, receipts, insights

### Phase 2: Understanding 🚧 Next Priority
Infrastructure improvements and LLM integration

### Phase 3: Learning 📋 Future
Longitudinal patterns and user baselines

### Phase 4: Guidance 📋 Future
Gentle suggestions and timing nudges

---

## Version History

- **0.3.0** - Phase 1 Complete (Web + Mobile)
- **0.2.0** - Phase 1 Web App Complete
- **0.1.0** - Phase 0 Backend Complete
- **0.0.1** - Initial project setup

---

**Note:** This project follows a phased development approach. See `docs/roadmap.md` for the complete development plan.
