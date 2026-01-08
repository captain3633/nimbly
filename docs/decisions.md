# Key Product and Technical Decisions

## 1. Why Receipts Are the Learning Foundation

**Decision:** Build the entire v0 around receipt uploads as the primary data source.

**Rationale:**
- Receipts represent actual behavior, not intentions or plans
- They provide ground truth about what users buy, where, and at what price
- They require no integration with banks or stores (privacy-preserving)
- They work universally across any store or payment method
- They establish trust through transparency (users see exactly what data we have)

**Tradeoff:**
- Manual upload creates friction vs automatic bank feeds
- OCR parsing is imperfect vs structured API data
- We accept this tradeoff because trust and privacy are more valuable than convenience in v0

**Assumption:**
Users will tolerate manual uploads if the value is clear and the process is smooth.

## 2. Why Predictions Are Delayed

**Decision:** Savvy generates only factual observations in v0. No predictions, forecasts, or recommendations.

**Rationale:**
- Predictions without sufficient data erode trust
- Users need to see that Savvy understands their actual behavior first
- Transparency is easier with observations than predictions
- Starting with facts establishes credibility for future intelligence
- Avoids the "creepy" factor of premature personalization

**Tradeoff:**
- Less impressive demo vs more trustworthy product
- Slower path to "smart" features vs stronger foundation
- We accept this because trust is harder to rebuild than to establish

**Assumption:**
Users will value accurate observations more than premature predictions.

## 3. Why Authentication Is Simple

**Decision:** Use magic link email authentication only. No passwords, no OAuth, no social login.

**Rationale:**
- Passwords are a security burden and user friction point
- Magic links are familiar and increasingly common
- Email is universal and doesn't require third-party accounts
- Simpler auth means less code, fewer bugs, faster iteration
- We can add OAuth later if needed without breaking existing users

**Tradeoff:**
- Requires email access vs persistent login
- No "Sign in with Google" convenience vs no Google dependency
- We accept this because simplicity and security outweigh convenience in v0

**Assumption:**
Users have reliable email access and will tolerate the extra step.

## 4. What "Polished" Means for Nimbly

**Decision:** Polished means thoughtful, not fancy. Clear, not clever.

**Characteristics:**
- Every message is carefully written and tested
- Errors are handled gracefully with helpful feedback
- The system never leaves users confused about state
- Data is always explained, never just presented
- Performance is reliable, not necessarily fast
- Design is calm and uncluttered

**Not Required for v0:**
- Animations or transitions
- Real-time updates
- Offline support
- Advanced visualizations
- Gamification elements

**Rationale:**
Polish comes from attention to detail in core interactions, not surface-level features.

## 5. Single Service Architecture

**Decision:** Build v0 as a single FastAPI service with PostgreSQL. No microservices, no queues, no caches.

**Rationale:**
- Simpler to develop, test, and debug
- Faster iteration without distributed system complexity
- Easier to reason about data flow and state
- Sufficient for expected v0 load (hundreds of users, not thousands)
- Can refactor later if scaling requires it

**Tradeoff:**
- Less "impressive" architecture vs more maintainable code
- Potential scaling limitations vs immediate productivity
- We accept this because premature optimization is wasteful

**Assumption:**
v0 will not face scaling challenges that require distributed architecture.

## 6. No Clean Architecture Abstractions

**Decision:** Use direct database access from endpoints. No repository pattern, no hexagonal architecture, no DDD.

**Rationale:**
- Abstractions add complexity without clear benefit at this scale
- Direct access is easier to understand and modify
- Fewer layers means less code to maintain
- FastAPI + SQLAlchemy is already well-structured
- We can refactor later if complexity demands it

**Tradeoff:**
- Less "textbook" architecture vs more pragmatic code
- Harder to swap databases vs easier to read and modify
- We accept this because YAGNI (You Aren't Gonna Need It)

**Assumption:**
We won't need to swap databases or test without a database in v0.

## 7. Backend-First Focus

**Decision:** Build and validate the backend completely before investing in frontend or mobile.

**Rationale:**
- Backend is the source of truth and hardest to change later
- API design forces clarity about data models and business logic
- Can test backend thoroughly without UI complexity
- Frontend can be built quickly once backend is solid
- Reduces risk of building UI for unvalidated features

**Tradeoff:**
- No visual demo vs validated functionality
- Longer time to "shippable" product vs stronger foundation
- We accept this because backend mistakes are expensive to fix

**Assumption:**
A well-designed API will make frontend development straightforward.

## 8. Why Groceries First

**Decision:** Focus exclusively on grocery receipts in v0. No restaurants, gas, retail, or other categories.

**Rationale:**
- Groceries are high-frequency (weekly or more)
- Prices change frequently, making patterns interesting
- Universal need across all demographics
- Lower emotional stakes than other spending categories
- Receipt formats are relatively standardized
- Clear value proposition (everyone wants to save on groceries)

**Tradeoff:**
- Narrower market vs deeper focus
- Less versatile product vs clearer positioning
- We accept this because focus enables excellence

**Assumption:**
Grocery-focused value will be sufficient to attract and retain early users.

## 9. Property-Based Testing Strategy

**Decision:** Use property-based testing (Hypothesis) alongside traditional unit tests for all core logic.

**Rationale:**
- Properties catch edge cases that unit tests miss
- Forces clear thinking about what "correct" means
- Provides confidence in correctness across input space
- Aligns with transparency goal (explicit correctness properties)
- Industry best practice for data-intensive systems

**Tradeoff:**
- More upfront test design vs faster test writing
- Longer test execution vs better coverage
- We accept this because correctness is non-negotiable

**Assumption:**
The team has or will develop expertise in property-based testing.

## 10. Local-First Development

**Decision:** Optimize for local development experience. Docker Compose, seed data, clear setup docs.

**Rationale:**
- Fast feedback loops improve productivity
- Easy onboarding for new developers
- Reduces dependency on cloud services during development
- Enables offline work
- Simpler debugging and testing

**Tradeoff:**
- Local setup complexity vs cloud-first simplicity
- We accept this because developer experience compounds over time

**Assumption:**
Developers have machines capable of running Docker.

## 11. What Nimbly Refuses to Become

**Decision:** Explicitly define what Nimbly will never be.

**Never:**
- A budgeting app with strict limits and alerts
- A financial advisor making investment recommendations
- A coupon aggregator or deal-hunting tool
- A social platform for comparing spending with others
- A gamified app with points, badges, or streaks
- An advertising platform for brands or stores
- A data broker selling user information
- A web scraper bypassing logins or paywalls
- A service claiming guaranteed savings or "best price"

**Rationale:**
- These models create misaligned incentives
- They often lead to shame, pressure, or manipulation
- They distract from the core mission of helping people spend smarter
- They erode trust and privacy
- Scraping and bypassing protections violates ethical boundaries

**Commitment:**
Nimbly will always prioritize user interests over monetization opportunities that compromise the mission.

## Deal Intelligence Constraints

**Decision:** Savvy may only surface deals and savings insights using ethical, transparent data sources.

**Allowed data sources:**
- First-party user data (uploaded receipts and purchase history)
- User-visible price changes and clearance signals inferred from receipts
- Publicly available pricing information (weekly flyers, publicly browsable store listings)
- Public information treated as best-effort context only

**Prohibited practices:**
- Scraping behind logins or paywalls
- Bypassing website protections or rate limits
- Claiming guaranteed savings or "best price" outcomes
- Presenting affiliate, sponsored, or paid promotions as neutral insights
- Using data obtained through unethical means

**Framing requirement:**
All deal-related insights must be framed as observations or suggestions, with clear explanation of the underlying data source.

**Rationale:**
- Ethical data practices build long-term trust
- Transparency about data sources maintains credibility
- Avoiding guarantees prevents overpromising
- Clear framing prevents misleading users
- Respecting website protections is legally and ethically correct

**Example compliant insight:**
"Almond Milk at Whole Foods: $4.49 on Dec 20, $4.99 on Jan 5. Based on your receipts, price increased $0.50."

**Example non-compliant insight:**
"Best price alert! Almond Milk is $3.99 at Store X. Buy now!" (claims best price, creates urgency, unclear data source)

## 12. Progressive Intelligence Philosophy

**Decision:** Savvy grows smarter gradually, earning each new capability through demonstrated accuracy.

**Phases:**
1. **v0 (Observations):** State facts about past behavior
2. **v1 (Patterns):** Identify trends and correlations
3. **v2 (Insights):** Explain why patterns might exist
4. **v3 (Suggestions):** Offer optional, explainable recommendations
5. **v4 (Predictions):** Forecast future behavior with confidence intervals

**Rationale:**
- Each phase builds trust for the next
- Users see Savvy improve over time (creates engagement)
- Mistakes in early phases are less damaging
- Transparency is easier with simpler intelligence
- Allows learning from user feedback at each stage

**Tradeoff:**
- Slower feature rollout vs stronger user trust
- Less impressive initial product vs more sustainable growth
- We accept this because trust is the foundation of long-term success

**Assumption:**
Users will appreciate and engage with a system that visibly learns and improves.

## Assumptions Summary

These decisions rest on several key assumptions:

1. **User Behavior:** Users will upload receipts manually if value is clear
2. **Trust Building:** Transparency and accuracy build trust more than features
3. **Market Timing:** Grocery price awareness is increasingly important to users
4. **Technical:** v0 scale won't require distributed architecture
5. **Team:** We can iterate quickly and learn from user feedback
6. **Competition:** No dominant player has solved this problem well yet
7. **Privacy:** Users increasingly value privacy over convenience
8. **Simplicity:** Simple, focused products win over complex, feature-rich ones

## Decision Review Process

These decisions should be revisited when:

- User feedback contradicts assumptions
- Technical constraints change (scale, performance)
- Market conditions shift (competition, user needs)
- Team capabilities evolve (size, expertise)
- New data becomes available (usage patterns, feedback)

**Review cadence:** After v0 launch, then quarterly.

## Open Questions

Decisions we're explicitly deferring:

1. **Monetization:** How will Nimbly make money? (Subscription? Freemium? Other?)
2. **Multi-platform:** Web first, or mobile first, or both?
3. **Internationalization:** Which markets after initial launch?
4. **Data retention:** How long do we keep receipt data?
5. **Export:** Should users be able to export their data?
6. **Sharing:** Any social or sharing features in future?
7. **Integrations:** Which third-party services might we integrate with?

These questions don't need answers for v0, but should be considered before v1.
