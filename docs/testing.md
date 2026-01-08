# Testing Guide

Quick guide for testing the Nimbly API.

## Setup

### Using Conda (Recommended)

```bash
# Activate environment
conda activate nimbly

# Install dependencies
cd api
pip install -r requirements.txt

# Start PostgreSQL (via Docker)
docker-compose up db -d

# Create test database
docker-compose exec db psql -U nimbly -c "CREATE DATABASE nimbly_test;"

# Run the API
uvicorn api.main:app --reload

# Seed database (in another terminal)
conda activate nimbly
python -m api.seed
```

### Using Docker

```bash
# Start everything
docker-compose up

# Seed database (in another terminal)
docker-compose exec api python -m api.seed
```

## Running Tests

```bash
# Activate conda environment
conda activate nimbly
cd api

# Create test database (first time only)
docker-compose exec db psql -U nimbly -c "CREATE DATABASE nimbly_test;"

# Run all tests
pytest

# Run with coverage
pytest --cov=api

# Run specific test file
pytest tests/test_auth.py

# Verbose output
pytest -v

# Run property-based tests
pytest tests/test_properties.py -v
```

## Test Database

Tests use a separate database `nimbly_test` to avoid affecting development data.
The test database is created/dropped automatically by pytest fixtures.

## Quick API Testing

The seed script outputs test tokens. Use them like this:

```bash
# Set token from seed output
export TOKEN="Bearer eyJhbGc..."

# Test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/receipts -H "Authorization: $TOKEN"
curl http://localhost:8000/api/insights -H "Authorization: $TOKEN"
```

## Interactive Testing

Visit http://localhost:8000/docs for Swagger UI with interactive API testing.

## Test Data

Seed script creates:
- 2 users with session tokens
- 10 receipts (5 per user)
- 4 stores
- Multiple products with price history
- Mix of parse statuses (success, failed, needs_review)

## Common Commands

```bash
# Reset database
conda activate nimbly
python -m api.seed

# Check logs
docker-compose logs -f api

# Run single test
pytest tests/test_auth.py::test_magic_link_request -v

# Run tests with output
pytest -s
```

## Test Status

**Written but not yet verified:**
- Integration tests (33+ test cases)
- Property-based tests (8 tests with 500+ iterations)
- End-to-end workflow tests

**To verify tests:**
1. Ensure test database exists
2. Run `pytest` from api directory
3. Fix any failures
4. Verify all tests pass

That's it! Check `/docs` endpoint for full API documentation.
