"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID

# Auth schemas
class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkResponse(BaseModel):
    message: str
    expires_in: int

class TokenVerifyResponse(BaseModel):
    user_id: UUID
    email: str
    session_token: str

# Receipt schemas
class ReceiptUploadResponse(BaseModel):
    receipt_id: UUID
    status: str
    message: str

class LineItemResponse(BaseModel):
    product_name: str
    quantity: Optional[Decimal]
    unit_price: Optional[Decimal]
    total_price: Decimal
    
    class Config:
        from_attributes = True

class ReceiptListItem(BaseModel):
    receipt_id: UUID
    store_name: Optional[str]
    purchase_date: Optional[date]
    total_amount: Optional[Decimal]
    parse_status: str
    upload_timestamp: datetime
    
    class Config:
        from_attributes = True

class ReceiptListResponse(BaseModel):
    receipts: List[ReceiptListItem]
    total: int
    limit: int
    offset: int

class ReceiptDetailResponse(BaseModel):
    receipt_id: UUID
    store_name: Optional[str]
    purchase_date: Optional[date]
    total_amount: Optional[Decimal]
    parse_status: str
    parse_error: Optional[str]
    line_items: List[LineItemResponse]
    
    class Config:
        from_attributes = True

# Insight schemas
class InsightDataPoint(BaseModel):
    date: Optional[date]
    price: Optional[Decimal]
    receipt_id: Optional[UUID]

class Insight(BaseModel):
    type: str
    title: str
    description: str
    data_points: int
    confidence: str
    underlying_data: List[InsightDataPoint]
    generated_at: datetime

class InsightsResponse(BaseModel):
    insights: List[Insight]
    message: Optional[str]

# Error schema
class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[dict] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail
