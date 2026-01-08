"""
Authentication endpoints and logic
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import logging

from api.database import get_db
from api.models import User
from api.schemas import MagicLinkRequest, MagicLinkResponse, TokenVerifyResponse, ErrorResponse
from api.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

def create_magic_link_token(email: str) -> str:
    """Create a JWT token for magic link authentication"""
    expire = datetime.utcnow() + timedelta(seconds=settings.magic_link_expiry_seconds)
    to_encode = {
        "sub": email,
        "exp": expire,
        "type": "magic_link"
    }
    token = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return token

def create_session_token(user_id: str, email: str) -> str:
    """Create a JWT session token"""
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
        "type": "session"
    }
    token = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return token

def verify_token(token: str, expected_type: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("type") != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

@router.post("/request-magic-link", response_model=MagicLinkResponse)
async def request_magic_link(
    request: MagicLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Request a magic link for authentication.
    In development, the magic link is logged to console instead of emailed.
    """
    email = request.email
    
    # Create magic link token
    token = create_magic_link_token(email)
    
    # In development, log the magic link to console
    magic_link = f"http://localhost:8000/api/auth/verify?token={token}"
    logger.info(f"Magic link for {email}: {magic_link}")
    print(f"\n🔗 Magic Link for {email}:\n{magic_link}\n")
    
    return MagicLinkResponse(
        message=f"Magic link sent to {email}",
        expires_in=settings.magic_link_expiry_seconds
    )

@router.get("/verify", response_model=TokenVerifyResponse)
async def verify_magic_link(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Verify magic link token and create or authenticate user session.
    """
    # Verify the magic link token
    payload = verify_token(token, "magic_link")
    email = payload.get("sub")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"Created new user: {email}")
    else:
        logger.info(f"User authenticated: {email}")
    
    # Create session token
    session_token = create_session_token(user.id, user.email)
    
    return TokenVerifyResponse(
        user_id=user.id,
        email=user.email,
        session_token=session_token
    )

def get_current_user(
    token: str,
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from session token.
    """
    payload = verify_token(token, "session")
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

