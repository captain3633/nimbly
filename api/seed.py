"""
Database seed script for development and testing
Creates sample users, receipts, and data
"""
import sys
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from sqlalchemy.orm import Session
from api.database import SessionLocal, engine, Base
from api.models import User, Store, Receipt, LineItem, PriceHistory, ParseStatus
from api.auth import create_session_token
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clear_database(db: Session):
    """Clear all data from database"""
    logger.info("Clearing database...")
    db.query(PriceHistory).delete()
    db.query(LineItem).delete()
    db.query(Receipt).delete()
    db.query(Store).delete()
    db.query(User).delete()
    db.commit()
    logger.info("Database cleared")

def create_sample_data(db: Session):
    """Create sample data for testing"""
    
    # Create users
    logger.info("Creating users...")
    user1 = User(email="alice@example.com")
    user2 = User(email="bob@example.com")
    db.add_all([user1, user2])
    db.commit()
    db.refresh(user1)
    db.refresh(user2)
    
    # Generate session tokens for easy testing
    token1 = create_session_token(user1.id, user1.email)
    token2 = create_session_token(user2.id, user2.email)
    
    logger.info(f"User 1: {user1.email} (ID: {user1.id})")
    logger.info(f"  Token: {token1}")
    logger.info(f"User 2: {user2.email} (ID: {user2.id})")
    logger.info(f"  Token: {token2}")
    
    # Create stores
    logger.info("Creating stores...")
    stores = [
        Store(name="Whole Foods Market", normalized_name="whole foods market"),
        Store(name="Trader Joe's", normalized_name="trader joes"),
        Store(name="Safeway", normalized_name="safeway"),
        Store(name="Target", normalized_name="target"),
    ]
    db.add_all(stores)
    db.commit()
    
    # Sample products
    products = [
        ("Organic Bananas", Decimal("1.99")),
        ("Almond Milk", Decimal("3.49")),
        ("Whole Wheat Bread", Decimal("4.29")),
        ("Free Range Eggs", Decimal("5.99")),
        ("Greek Yogurt", Decimal("1.29")),
        ("Avocados", Decimal("2.49")),
        ("Chicken Breast", Decimal("8.99")),
        ("Spinach", Decimal("2.99")),
        ("Tomatoes", Decimal("3.49")),
        ("Olive Oil", Decimal("12.99")),
    ]
    
    # Create receipts for user 1
    logger.info("Creating receipts for user 1...")
    base_date = datetime.now() - timedelta(days=60)
    
    for i in range(5):
        store = stores[i % len(stores)]
        purchase_date = base_date + timedelta(days=i * 12)
        
        # Determine parse status
        if i == 4:
            parse_status = ParseStatus.NEEDS_REVIEW
            parse_error = "Low confidence: few items detected"
        elif i == 3:
            parse_status = ParseStatus.FAILED
            parse_error = "OCR failed: image too blurry"
        else:
            parse_status = ParseStatus.SUCCESS
            parse_error = None
        
        receipt = Receipt(
            user_id=user1.id,
            store_id=store.id,
            upload_timestamp=purchase_date,
            purchase_date=purchase_date.date(),
            parse_status=parse_status,
            parse_error=parse_error,
            original_file_path=f"user1/receipt_{i+1}.jpg"
        )
        db.add(receipt)
        db.flush()
        
        # Add line items only for successful/needs_review receipts
        if parse_status != ParseStatus.FAILED:
            total = Decimal("0.00")
            num_items = 3 if parse_status == ParseStatus.NEEDS_REVIEW else 5
            
            for j in range(num_items):
                product_name, base_price = products[j % len(products)]
                # Add some price variation
                price = base_price + Decimal(str(i * 0.10))
                
                line_item = LineItem(
                    receipt_id=receipt.id,
                    product_name=product_name,
                    normalized_product_name=product_name.lower(),
                    quantity=Decimal("1.0"),
                    unit_price=price,
                    total_price=price,
                    line_number=j + 1
                )
                db.add(line_item)
                db.flush()
                
                # Create price history
                price_history = PriceHistory(
                    product_name=product_name.lower(),
                    store_id=store.id,
                    price=price,
                    observed_date=purchase_date.date(),
                    source_line_item_id=line_item.id
                )
                db.add(price_history)
                
                total += price
            
            receipt.total_amount = total
    
    # Create receipts for user 2
    logger.info("Creating receipts for user 2...")
    for i in range(5):
        store = stores[(i + 1) % len(stores)]
        purchase_date = base_date + timedelta(days=i * 10 + 5)
        
        receipt = Receipt(
            user_id=user2.id,
            store_id=store.id,
            upload_timestamp=purchase_date,
            purchase_date=purchase_date.date(),
            parse_status=ParseStatus.SUCCESS,
            original_file_path=f"user2/receipt_{i+1}.jpg"
        )
        db.add(receipt)
        db.flush()
        
        # Add line items
        total = Decimal("0.00")
        for j in range(4):
            product_name, base_price = products[(j + i) % len(products)]
            price = base_price + Decimal(str(i * 0.15))
            
            line_item = LineItem(
                receipt_id=receipt.id,
                product_name=product_name,
                normalized_product_name=product_name.lower(),
                quantity=Decimal("1.0"),
                unit_price=price,
                total_price=price,
                line_number=j + 1
            )
            db.add(line_item)
            db.flush()
            
            # Create price history
            price_history = PriceHistory(
                product_name=product_name.lower(),
                store_id=store.id,
                price=price,
                observed_date=purchase_date.date(),
                source_line_item_id=line_item.id
            )
            db.add(price_history)
            
            total += price
        
        receipt.total_amount = total
    
    db.commit()
    logger.info("Sample data created successfully!")
    
    # Print summary
    logger.info("\n" + "="*60)
    logger.info("SEED DATA SUMMARY")
    logger.info("="*60)
    logger.info(f"Users created: 2")
    logger.info(f"Stores created: {len(stores)}")
    logger.info(f"Receipts created: 10 (5 per user)")
    logger.info(f"Parse statuses: SUCCESS, FAILED, NEEDS_REVIEW")
    logger.info("\nTest with these tokens:")
    logger.info(f"\nAlice: Bearer {token1}")
    logger.info(f"\nBob: Bearer {token2}")
    logger.info("="*60 + "\n")

def main():
    """Main seed function"""
    logger.info("Starting database seed...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Clear existing data
        clear_database(db)
        
        # Create sample data
        create_sample_data(db)
        
        logger.info("Database seeded successfully!")
        
    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}", exc_info=True)
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
