# Nimbly Documentation

This directory contains the complete documentation for Nimbly v0.

## Documentation Files

### [CHANGELOG.md](CHANGELOG.md)
Project changelog tracking all notable changes, additions, and updates following Keep a Changelog format.

### [requirements.md](requirements.md)
Complete requirements document including:
- Problem statement and target users
- Core user journeys
- Functional requirements (MUST, SHOULD, COULD)
- Non-functional requirements (privacy, transparency, reliability, performance, accessibility)
- Explicit out-of-scope list
- Why groceries and receipts come first

### [design.md](design.md)
System design document including:
- Simple system overview (one backend service)
- Proposed folder structure for /api
- Data model v0 (users, receipts, line items, stores, price history)
- Receipt ingestion flow (upload, parse, store, review)
- API endpoints v0 with example requests and responses
- Savvy logic v0 (factual observations only, no predictions)
- Error handling and logging strategy
- Local development approach

### [tasks.md](tasks.md)
Implementation task list including:
- Single v0 milestone
- 18 tasks with descriptions, acceptance criteria, and dependencies
- Tasks feel realistic and buildable
- "Start Here" section with first 3 tasks

### [tone.md](tone.md)
Savvy's voice and tone guide including:
- Voice principles (do and do not)
- Language rules (simple, global, non-judgmental)
- Example microcopy for common scenarios
- Explicit examples of what Savvy must never say

### [decisions.md](decisions.md)
Key product and technical decisions including:
- 12 major decisions with rationale and tradeoffs
- Why receipts are the learning foundation
- Why predictions are delayed
- Why auth is simple
- What "polished" means for Nimbly
- What Nimbly refuses to become
- Assumptions and open questions

## Spec Files

In addition to the docs above, there are formal specification files in `.kiro/specs/nimbly-v0/`:

- **requirements.md**: EARS-formatted requirements with acceptance criteria
- **design.md**: Complete design with 29 correctness properties for property-based testing
- **tasks.md**: Implementation plan with property-based test tasks

These spec files follow a structured format for systematic development and testing.

## Reading Order

For new team members or contributors:

1. Start with **requirements.md** to understand the problem and scope
2. Read **decisions.md** to understand key choices and tradeoffs
3. Review **design.md** to understand the technical approach
4. Check **tone.md** to understand Savvy's voice
5. Use **tasks.md** as the implementation guide

## Quality Bar

These documents represent thoughtful, serious work:
- Clear, grounded, and calm
- No hype language or buzzwords
- Every decision feels intentional
- Assumptions are documented explicitly

## Next Steps

To begin implementation:
1. Review all documentation
2. Set up local development environment (see design.md)
3. Start with Task 1 from tasks.md
4. Follow the implementation plan sequentially

## Feedback

If you find gaps, inconsistencies, or have questions about any documentation, please open an issue or start a discussion.
