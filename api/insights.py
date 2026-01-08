"""
Insight generation logic and endpoint
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
from decimal import Decimal
import logging

from api.database import get_db
from api.models import Receipt, LineItem, PriceHistory, Store, ParseStatus
from api.schemas import InsightsResponse, Insight, InsightDataPoint
from api.auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# Minimum data thresholds
MIN_RECEIPTS_FOR_FREQUENCY = 3
MIN_PURCHASES_FOR_PRICE_TREND = 2
MIN_PURCHASES_FOR_COMMON = 3
MIN_RECEIPTS_FOR_STORE_PATTERN = 5

def generate_purchase_frequency_insights(user_id, db: Session) -> List[Insight]:
    """Generate insights about purchase frequency at stores"""
    insights = []
    
    # Get store visit counts
    store_counts = db.query(
        Store.name,
        Store.id,
        func.count(Receipt.id).label('visit_count')
    ).join(Receipt).filter(
        Receipt.user_id == user_id,
        Receipt.parse_status == ParseStatus.SUCCESS
    ).group_by(Store.id, Store.name).all()
    
    for store_name, store_id, count in store_counts:
        if count >= MIN_RECEIPTS_FOR_FREQUENCY:
            # Get receipt dates for this store
            receipts = db.query(Receipt.purchase_date, Receipt.id).filter(
                Receipt.user_id == user_id,
                Receipt.store_id == store_id,
                Receipt.purchase_date.isnot(None)
            ).order_by(Receipt.purchase_date).all()
            
            data_points = [
                InsightDataPoint(date=r.purchase_date, receipt_id=r.id)
                for r in receipts
            ]
            
            confidence = "high" if count >= 10 else "medium"
            
            insights.append(Insight(
                type="purchase_frequency",
                title=f"Shopping at {store_name}",
                description=f"You've shopped at {store_name} {count} times based on your receipts.",
                data_points=count,
                confidence=confidence,
                underlying_data=data_points,
                generated_at=datetime.utcnow()
            ))
    
    return insights

def generate_price_trend_insights(user_id, db: Session) -> List[Insight]:
    """Generate insights about price trends for products"""
    insights = []
    
    # Get products with multiple price points
    product_counts = db.query(
        PriceHistory.product_name,
        func.count(PriceHistory.id).label('count')
    ).join(LineItem).join(Receipt).filter(
        Receipt.user_id == user_id
    ).group_by(PriceHistory.product_name).having(
        func.count(PriceHistory.id) >= MIN_PURCHASES_FOR_PRICE_TREND
    ).all()
    
    for product_name, count in product_counts:
        # Get price history
        prices = db.query(
            PriceHistory.price,
            PriceHistory.observed_date,
            PriceHistory.source_line_item_id
        ).join(LineItem).join(Receipt).filter(
            Receipt.user_id == user_id,
            PriceHistory.product_name == product_name
        ).order_by(PriceHistory.observed_date).all()
        
        if len(prices) >= MIN_PURCHASES_FOR_PRICE_TREND:
            first_price = prices[0].price
            last_price = prices[-1].price
            
            # Get receipt IDs
            receipt_ids = db.query(Receipt.id).join(LineItem).join(PriceHistory).filter(
                Receipt.user_id == user_id,
                PriceHistory.product_name == product_name
            ).distinct().all()
            
            data_points = [
                InsightDataPoint(
                    date=p.observed_date,
                    price=p.price,
                    receipt_id=db.query(Receipt.id).join(LineItem).filter(
                        LineItem.id == p.source_line_item_id
                    ).scalar()
                )
                for p in prices
            ]
            
            # Determine trend
            if last_price > first_price:
                change = "increased"
                diff = last_price - first_price
            elif last_price < first_price:
                change = "decreased"
                diff = first_price - last_price
            else:
                change = "remained stable"
                diff = Decimal('0.00')
            
            confidence = "high" if count >= 5 else "medium"
            
            insights.append(Insight(
                type="price_trend",
                title=f"Price tracking: {product_name.title()}",
                description=f"The price for {product_name} has {change} from ${first_price} to ${last_price} across {count} purchases.",
                data_points=count,
                confidence=confidence,
                underlying_data=data_points,
                generated_at=datetime.utcnow()
            ))
    
    return insights

def generate_common_purchase_insights(user_id, db: Session) -> List[Insight]:
    """Generate insights about commonly purchased items"""
    insights = []
    
    # Get most frequently purchased products
    product_counts = db.query(
        LineItem.normalized_product_name,
        LineItem.product_name,
        func.count(LineItem.id).label('count')
    ).join(Receipt).filter(
        Receipt.user_id == user_id,
        Receipt.parse_status == ParseStatus.SUCCESS
    ).group_by(
        LineItem.normalized_product_name,
        LineItem.product_name
    ).having(
        func.count(LineItem.id) >= MIN_PURCHASES_FOR_COMMON
    ).order_by(func.count(LineItem.id).desc()).limit(5).all()
    
    for normalized_name, product_name, count in product_counts:
        # Get receipts with this product
        receipts = db.query(Receipt.id, Receipt.purchase_date).join(LineItem).filter(
            Receipt.user_id == user_id,
            LineItem.normalized_product_name == normalized_name
        ).distinct().all()
        
        data_points = [
            InsightDataPoint(date=r.purchase_date, receipt_id=r.id)
            for r in receipts
        ]
        
        confidence = "high" if count >= 10 else "medium"
        
        insights.append(Insight(
            type="common_purchase",
            title=f"Frequently purchased: {product_name.title()}",
            description=f"You've purchased {product_name} {count} times across your receipts.",
            data_points=count,
            confidence=confidence,
            underlying_data=data_points,
            generated_at=datetime.utcnow()
        ))
    
    return insights

def generate_store_pattern_insights(user_id, db: Session) -> List[Insight]:
    """Generate insights about shopping patterns across stores"""
    insights = []
    
    # Get total receipt count
    total_receipts = db.query(func.count(Receipt.id)).filter(
        Receipt.user_id == user_id,
        Receipt.parse_status == ParseStatus.SUCCESS
    ).scalar()
    
    if total_receipts >= MIN_RECEIPTS_FOR_STORE_PATTERN:
        # Get store distribution
        store_distribution = db.query(
            Store.name,
            func.count(Receipt.id).label('count')
        ).join(Receipt).filter(
            Receipt.user_id == user_id,
            Receipt.parse_status == ParseStatus.SUCCESS
        ).group_by(Store.name).order_by(func.count(Receipt.id).desc()).all()
        
        if store_distribution:
            top_store = store_distribution[0]
            percentage = (top_store.count / total_receipts) * 100
            
            data_points = []
            for store_name, count in store_distribution:
                store_receipts = db.query(Receipt.id, Receipt.purchase_date).filter(
                    Receipt.user_id == user_id,
                    Receipt.store.has(name=store_name)
                ).all()
                data_points.extend([
                    InsightDataPoint(date=r.purchase_date, receipt_id=r.id)
                    for r in store_receipts
                ])
            
            confidence = "high" if total_receipts >= 10 else "medium"
            
            insights.append(Insight(
                type="store_pattern",
                title="Shopping patterns",
                description=f"You shop most frequently at {top_store.name} ({top_store.count} receipts, {percentage:.0f}% of total). You've shopped at {len(store_distribution)} different stores.",
                data_points=total_receipts,
                confidence=confidence,
                underlying_data=data_points[:20],  # Limit data points
                generated_at=datetime.utcnow()
            ))
    
    return insights

@router.get("", response_model=InsightsResponse)
async def get_insights(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Generate and return insights for authenticated user.
    Insights are generated on-demand based on user's receipt data.
    """
    # Check if authorization header is present
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    # Extract token and get user
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    user = get_current_user(token, db)
    
    logger.info(f"Generating insights for user {user.id}")
    
    # Generate all insight types
    insights = []
    insights.extend(generate_purchase_frequency_insights(user.id, db))
    insights.extend(generate_price_trend_insights(user.id, db))
    insights.extend(generate_common_purchase_insights(user.id, db))
    insights.extend(generate_store_pattern_insights(user.id, db))
    
    # Check if we have enough data
    message = None
    if not insights:
        message = "Upload more receipts to generate insights. We need at least 3 receipts to start showing patterns."
    
    logger.info(f"Generated {len(insights)} insights for user {user.id}")
    
    return InsightsResponse(
        insights=insights,
        message=message
    )
