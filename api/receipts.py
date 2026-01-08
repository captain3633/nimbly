"""
Receipt upload and retrieval endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Header, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid
import os
from pathlib import Path
import logging

from api.database import get_db
from api.models import User, Receipt, ParseStatus, LineItem
from api.schemas import (
    ReceiptUploadResponse, 
    ReceiptListResponse, 
    ReceiptListItem,
    ReceiptDetailResponse,
    LineItemResponse,
    ErrorResponse
)
from api.config import settings
from api.auth import get_current_user
from api.parser import parse_receipt

router = APIRouter()
logger = logging.getLogger(__name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf", ".txt"}

def validate_file_format(filename: str) -> bool:
    """Validate that the file has an allowed extension"""
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXTENSIONS

def save_receipt_file(user_id: uuid.UUID, file: UploadFile) -> str:
    """Save uploaded receipt file to disk"""
    # Create user upload directory
    user_dir = Path(settings.upload_dir) / str(user_id)
    user_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    receipt_id = uuid.uuid4()
    filename = f"{receipt_id}{file_ext}"
    file_path = user_dir / filename
    
    # Save file
    with open(file_path, "wb") as f:
        content = file.file.read()
        f.write(content)
    
    # Return relative path
    return str(file_path.relative_to(settings.upload_dir))

@router.post("/upload", response_model=ReceiptUploadResponse)
async def upload_receipt(
    file: UploadFile = File(...),
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    Upload a receipt file (JPEG, PNG, PDF, or TXT).
    Requires authentication via Bearer token.
    """
    # Extract token from Authorization header
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user(token, db)
    
    # Validate file format
    if not validate_file_format(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Receipt must be JPEG, PNG, PDF, or text file"
        )
    
    try:
        # Save file to disk
        file_path = save_receipt_file(user.id, file)
        
        # Create receipt record
        receipt = Receipt(
            user_id=user.id,
            original_file_path=file_path,
            parse_status=ParseStatus.PENDING
        )
        db.add(receipt)
        db.commit()
        db.refresh(receipt)
        
        logger.info(f"Receipt uploaded: user={user.id}, receipt={receipt.id}, file={file.filename}")
        
        # Parse receipt synchronously
        try:
            parse_receipt(receipt, db, settings.upload_dir)
        except Exception as parse_error:
            logger.error(f"Parsing failed but receipt saved: {str(parse_error)}")
        
        return ReceiptUploadResponse(
            receipt_id=receipt.id,
            status=receipt.parse_status.value,
            message=f"Receipt uploaded. Status: {receipt.parse_status.value}"
        )
    
    except Exception as e:
        logger.error(f"Receipt upload failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload receipt"
        )

@router.get("", response_model=ReceiptListResponse)
async def list_receipts(
    authorization: str = Header(...),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    List all receipts for authenticated user.
    Returns paginated list sorted by upload timestamp (newest first).
    """
    # Extract token and get user
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user(token, db)
    
    # Query receipts
    query = db.query(Receipt).filter(Receipt.user_id == user.id)
    total = query.count()
    
    receipts = query.order_by(Receipt.upload_timestamp.desc()).offset(offset).limit(limit).all()
    
    # Build response
    receipt_items = []
    for receipt in receipts:
        receipt_items.append(ReceiptListItem(
            receipt_id=receipt.id,
            store_name=receipt.store.name if receipt.store else None,
            purchase_date=receipt.purchase_date,
            total_amount=receipt.total_amount,
            parse_status=receipt.parse_status.value,
            upload_timestamp=receipt.upload_timestamp
        ))
    
    return ReceiptListResponse(
        receipts=receipt_items,
        total=total,
        limit=limit,
        offset=offset
    )

@router.get("/{receipt_id}", response_model=ReceiptDetailResponse)
async def get_receipt_detail(
    receipt_id: uuid.UUID,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    """
    Get detailed information for a specific receipt.
    Includes all line items.
    """
    # Extract token and get user
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user(token, db)
    
    # Query receipt
    receipt = db.query(Receipt).filter(
        Receipt.id == receipt_id,
        Receipt.user_id == user.id
    ).first()
    
    if not receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receipt not found or you don't have access"
        )
    
    # Build line items response
    line_items = []
    for item in receipt.line_items:
        line_items.append(LineItemResponse(
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        ))
    
    return ReceiptDetailResponse(
        receipt_id=receipt.id,
        store_name=receipt.store.name if receipt.store else None,
        purchase_date=receipt.purchase_date,
        total_amount=receipt.total_amount,
        parse_status=receipt.parse_status.value,
        parse_error=receipt.parse_error,
        line_items=line_items
    )


