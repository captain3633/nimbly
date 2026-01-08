# Nimbly Requirements

## Problem Statement

Grocery prices are rising, and everyday spending decisions are becoming increasingly difficult. Most financial tools either shame users with budget alerts or overwhelm them with complex features. People need a way to understand their grocery spending patterns and make smarter decisions without stress, guilt, or financial jargon.

Nimbly addresses this by learning from real purchase behavior (receipts) and providing transparent, factual insights that help users spend smarter over time.

## Target Users and Real-Life Situations

### Primary Users

**Everyday Grocery Shoppers**
- Age: 25-55
- Income: Middle class, budget-conscious
- Tech comfort: Comfortable with mobile apps
- Pain point: Feeling like grocery prices are unpredictable and rising

**Real-life situations:**
- Standing in the grocery store wondering if this is a good price
- Noticing the same product costs different amounts at different stores
- Feeling like they're spending more but not sure where or why
- Wanting to save money without extreme couponing or budgeting apps

### Secondary Users

**Household Managers**
- Responsible for family grocery shopping
- Making frequent trips to multiple stores
- Trying to balance quality, convenience, and cost
- Need visibility into spending patterns without manual tracking

**Real-life situations:**
- Shopping at 2-3 different stores per week
- Buying the same staple items repeatedly
- Wondering if switching stores would save money
- Wanting to understand spending trends without spreadsheets

## Core User Journeys

### Journey 1: First Receipt Upload

1. User creates account with email (magic link)
2. User uploads first grocery receipt (photo or PDF)
3. System parses receipt and extracts items
4. User sees confirmation: "Receipt from [Store] added. [X] items recorded."
5. User sees message: "Savvy is learning. Upload more receipts to see patterns."

**Success criteria:** User understands what happened and what to do next.

### Journey 2: Building the Learning Phase

1. User uploads 3-5 receipts over 1-2 weeks
2. After each upload, user sees receipt details (store, date, items, total)
3. User can view list of all uploaded receipts
4. User sees progress: "Savvy is learning. [X] receipts uploaded."

**Success criteria:** User feels progress and anticipates insights without frustration.

### Journey 3: First Insight Discovery

1. User uploads enough receipts to trigger insight generation (5+ receipts)
2. User navigates to insights view
3. User sees first insight: "You've shopped at Whole Foods 8 times in the past 30 days."
4. User can see the underlying data (list of receipts)
5. User understands this is an observation, not a judgment

**Success criteria:** User trusts the insight and wants to see more.

### Journey 4: Price Trend Awareness

1. User buys the same product multiple times
2. System detects price change
3. User sees insight: "Almond Milk at Whole Foods: $4.49 on Dec 20, $4.99 on Jan 5."
4. User sees the specific receipts and dates
5. User gains awareness of price changes without being told what to do

**Success criteria:** User feels informed and empowered, not pressured.

## Functional Requirements

### MUST (v0)

**Authentication**
- Magic link email authentication
- Secure session management
- User account creation and login

**Receipt Management**
- Upload receipts (JPEG, PNG, PDF, text)
- Store original receipt files
- List all uploaded receipts
- View receipt details with line items
- Display parsing status and errors

**Receipt Parsing**
- Extract store name, date, total
- Extract line items (product, quantity, price)
- Handle common grocery receipt formats
- Mark uncertain parses for review
- Store structured data in database

**Data Tracking**
- Track price history over time
- Normalize product names for grouping
- Normalize store names for matching
- Associate prices with stores and dates
- Maintain referential integrity

**Insight Generation**
- Generate purchase frequency insights
- Generate price trend insights
- Generate common purchase insights
- Generate store pattern insights
- Show underlying data for all insights
- Communicate when data is insufficient

**API**
- RESTful endpoints for all operations
- Input validation on all requests
- Consistent error response format
- Comprehensive logging
- API documentation

**Development**
- Docker Compose setup
- Database migrations
- Seed data scripts
- Environment configuration
- Local development docs

### SHOULD (Near-Term)

**Enhanced Parsing**
- Support more receipt formats
- Improve OCR accuracy
- Handle multi-page receipts
- Extract product categories
- Detect sales and discounts

**Richer Insights**
- Store price comparisons
- Seasonal price patterns
- Product substitution suggestions (factual, not recommendations)
- Shopping frequency patterns by day/time

**User Experience**
- Receipt upload from mobile camera
- Receipt editing/correction interface
- Insight filtering and search
- Data visualization (charts, graphs)
- Export receipt data

**Performance**
- Faster parsing
- Pagination for large receipt lists
- Caching for frequently accessed data
- Background processing for uploads

### COULD (Future)

**Advanced Intelligence**
- Predictive insights (with high confidence)
- Personalized recommendations (transparent)
- Budget tracking (optional, non-judgmental)
- Shopping list optimization

**Integrations**
- Bank account linking (optional)
- Store loyalty program integration
- Calendar integration for shopping patterns
- Email receipt forwarding

**Social Features**
- Anonymous price comparisons
- Community price alerts
- Shared shopping lists (household)

**Monetization**
- Premium features (advanced insights)
- Store partnerships (ethical, transparent)
- Data export and reporting

## Non-Functional Requirements

### Privacy

- User data is never shared with third parties without explicit consent
- Receipt images are stored securely and encrypted
- Users can delete their data at any time
- No tracking or analytics beyond essential product metrics
- Clear privacy policy in plain language

### Transparency

- All insights show the underlying data
- Parsing confidence levels are visible
- System limitations are communicated clearly
- No "black box" algorithms
- Users can see exactly what data Nimbly has

### Reliability

- 99% uptime for API
- Graceful error handling (no crashes)
- Data integrity maintained at all times
- Automatic database backups
- Clear error messages for users

### Performance

- Receipt upload completes in < 5 seconds
- Parsing completes in < 30 seconds
- API response time < 500ms for most requests
- Support 1000+ receipts per user without degradation
- Database queries optimized for common operations

### Accessibility

- API responses use clear, simple language
- Error messages are actionable
- No financial jargon
- Support for multiple languages (future)
- Readable by screen readers (when UI is built)

## Explicit Out-of-Scope List

**Not in v0:**
- Full budgeting system with limits and alerts
- Payment processing or subscriptions
- Advertising or sponsored content
- Social features (sharing, friends, comparisons)
- Product recommendations from brands
- Unexplained predictions or forecasts
- Multi-user household accounts
- Gamification (points, badges, streaks)
- Data export functionality
- Bank or store integrations
- Mobile or web frontend (backend only)
- Complex authentication (passwords, OAuth, roles)
- Caching layer (Redis, etc.)
- Message queues or async processing
- Microservices architecture
- Web scraping or data aggregation from third parties

**Never:**
- Shame-based messaging
- Pressure tactics or urgency
- Selling user data
- Unexplained algorithms
- Financial advice or investment recommendations
- Predatory monetization
- Scraping behind logins or paywalls
- Bypassing website protections
- Claiming guaranteed savings or "best price"
- Affiliate or sponsored promotions disguised as insights

## Why Groceries and Receipts Come First

### Why Groceries?

1. **Universal and frequent**: Everyone buys groceries, usually weekly
2. **Price-sensitive**: Grocery prices change often and matter to people
3. **Low emotional stakes**: Less stressful than rent, debt, or investments
4. **Tangible value**: Small savings compound over time
5. **Clear patterns**: Regular purchases create observable trends
6. **Broad market**: Not limited to specific demographics

### Why Receipts?

1. **Ground truth**: Receipts show actual behavior, not plans or intentions
2. **Privacy-preserving**: No bank account access required
3. **Universal**: Works at any store, any payment method
4. **Rich data**: Contains store, date, items, prices, quantities
5. **User control**: Users choose what to upload
6. **Trust-building**: Transparent about what data we have
7. **No integrations**: No dependencies on third-party APIs

### The Learning Foundation

Receipts provide the factual foundation for Savvy to learn:
- What users actually buy (not what they plan to buy)
- Where they shop (not where they think they shop)
- What they pay (not what they think they pay)
- How often they shop (not how often they intend to)

This factual basis allows Savvy to earn trust through accurate observations before ever attempting predictions. Starting with receipts establishes credibility and transparency from day one.

## Success Metrics for v0

**Engagement:**
- Average receipts uploaded per user per week
- Retention rate (users returning after first week)
- Time from signup to first insight

**Quality:**
- Receipt parsing accuracy rate
- User-reported parsing errors
- Insight relevance (user feedback)

**Trust:**
- User survey: "I trust Savvy's insights" (1-5 scale)
- User survey: "I understand how Savvy works" (1-5 scale)
- Privacy concern reports

**Technical:**
- API uptime percentage
- Average response time
- Error rate
- Database query performance
