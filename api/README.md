# Nimbly API

Backend service for Nimbly - a people-first app for smarter everyday spending.

## Quick Start

### Using Docker (Recommended)

1. **Start the services:**
   ```bash
   docker-compose up
   ```

2. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

### Local Development (with Conda)

1. **Create conda environment:**
   ```bash
   conda create -n nimbly python=3.11 -y
   conda activate nimbly
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Tesseract OCR:**
   - **macOS:** `brew install tesseract`
   - **Ubuntu:** `sudo apt-get install tesseract-ocr`
   - **Windows:** Download from https://github.com/UB-Mannheim/tesseract/wiki

4. **Start PostgreSQL:**
   ```bash
   docker-compose up db
   ```

5. **Run the API:**
   ```bash
   uvicorn api.main:app --reload
   ```

## Project Structure

```
api/
├── main.py              # FastAPI app initialization
├── config.py            # Configuration management
├── database.py          # Database connection
├── models.py            # SQLAlchemy ORM models
├── schemas.py           # Pydantic schemas
├── auth.py              # Authentication endpoints
├── receipts.py          # Receipt endpoints
├── insights.py          # Insight endpoints
├── parser.py            # Receipt parsing logic
├── utils.py             # Shared utilities
└── tests/               # Test suite
    ├── conftest.py      # Pytest fixtures
    ├── test_auth.py
    ├── test_receipts.py
    ├── test_parser.py
    └── test_insights.py
```

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=api

# Run specific test file
pytest api/tests/test_auth.py

# Run with verbose output
pytest -v
```

## Database Migrations

The application automatically creates database tables on startup. For production, consider using Alembic for migrations.

## Environment Variables

See `.env.example` for all available configuration options.

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development Workflow

1. Make changes to code
2. Tests run automatically (if using --reload)
3. Check logs for any errors
4. Test endpoints using /docs interface
5. Run test suite before committing

## Troubleshooting

**Database connection errors:**
- Ensure PostgreSQL is running: `docker-compose up db`
- Check DATABASE_URL in environment variables

**Import errors:**
- Ensure you're in the project root directory
- Activate conda environment: `conda activate nimbly`

**Tesseract not found:**
- Install Tesseract OCR for your platform
- Ensure it's in your PATH

## Next Steps

See `docs/tasks.md` for the implementation roadmap.
