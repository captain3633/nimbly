# Database Migrations

This directory contains SQL migration files for the Nimbly database.

## Naming Convention

Migration files follow this naming pattern:
```
YYYYMMDD_NNN_description.sql
```

Where:
- `YYYYMMDD` = Date (e.g., 20260111)
- `NNN` = Sequential number for that day (001, 002, etc.)
- `description` = Brief description using snake_case

## Examples
- `20260111_001_add_password_auth.sql`
- `20260111_002_add_user_preferences.sql`
- `20260115_001_add_receipt_tags.sql`

## Running Migrations

From the project root:

```bash
# Run a specific migration
python scripts/migrate_db.py 20260111_001_add_password_auth.sql

# Or from Docker
docker exec nimbly-api python /app/scripts/migrate_db.py 20260111_001_add_password_auth.sql
```

## Best Practices

1. **Idempotent**: Use `IF NOT EXISTS` and `IF EXISTS` clauses
2. **Reversible**: Consider creating a rollback script if needed
3. **Tested**: Test migrations on a copy of production data
4. **Documented**: Add comments explaining what and why
5. **Atomic**: Keep migrations focused on one logical change
6. **Safe**: Avoid operations that lock tables for long periods

## Migration Checklist

Before running a migration:
- [ ] Tested on local database
- [ ] Reviewed for performance impact
- [ ] Checked for breaking changes
- [ ] Documented in this README if needed
- [ ] Backed up production database (if applicable)

## Current Migrations

| File | Date | Description | Status |
|------|------|-------------|--------|
| `20260111_001_add_password_auth.sql` | 2026-01-11 | Add password authentication support | Pending |
