#!/usr/bin/env python3
"""
Database migration script for Nimbly
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from api.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migration(migration_file: str):
    """Run a SQL migration file"""
    engine = create_engine(settings.database_url)
    
    migration_path = Path(__file__).parent.parent / "api" / "migrations" / migration_file
    
    if not migration_path.exists():
        logger.error(f"Migration file not found: {migration_path}")
        logger.info(f"Looking in: {migration_path.parent}")
        logger.info("Available migrations:")
        if migration_path.parent.exists():
            for f in sorted(migration_path.parent.glob("*.sql")):
                logger.info(f"  - {f.name}")
        return False
    
    logger.info(f"Running migration: {migration_file}")
    logger.info(f"From: {migration_path}")
    
    with open(migration_path, 'r') as f:
        sql = f.read()
    
    try:
        with engine.connect() as conn:
            # Split by semicolon and execute each statement
            statements = [s.strip() for s in sql.split(';') if s.strip()]
            for i, statement in enumerate(statements, 1):
                logger.info(f"Executing statement {i}/{len(statements)}: {statement[:80]}...")
                conn.execute(text(statement))
                conn.commit()
        
        logger.info(f"✓ Migration completed successfully: {migration_file}")
        return True
    except Exception as e:
        logger.error(f"✗ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/migrate_db.py <migration_file>")
        print("\nExample:")
        print("  python scripts/migrate_db.py 20260111_001_add_password_auth.sql")
        print("\nAvailable migrations:")
        migrations_dir = Path(__file__).parent.parent / "api" / "migrations"
        if migrations_dir.exists():
            for f in sorted(migrations_dir.glob("*.sql")):
                print(f"  - {f.name}")
        sys.exit(1)
    
    migration_file = sys.argv[1]
    success = run_migration(migration_file)
    sys.exit(0 if success else 1)
