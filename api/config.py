"""
Configuration management for Nimbly API
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://nimbly:nimbly@localhost:5432/nimbly"
    )
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    algorithm: str = "HS256"
    magic_link_expiry_seconds: int = int(os.getenv("MAGIC_LINK_EXPIRY_SECONDS", "900"))
    
    # File storage
    upload_dir: str = os.getenv("UPLOAD_DIR", "./uploads")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    class Config:
        env_file = ".env"

settings = Settings()
