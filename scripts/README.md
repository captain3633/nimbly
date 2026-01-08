# Scripts

Utility scripts for testing and development.

## test_api.py

Comprehensive API test suite that validates all endpoints.

**Usage:**
```bash
conda activate nimbly
python scripts/test_api.py
```

**Tests:**
- Public endpoints (root, health, docs)
- Authentication (magic link request, validation)
- Protected endpoints (receipts, insights)
- Error handling

**Requirements:**
- `requests` package (install with `pip install requests`)
- API running on http://localhost:8000
