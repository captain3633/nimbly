"""
Receipt parsing logic
"""
import re
from pathlib import Path
from typing import Optional, List, Tuple
from decimal import Decimal
from datetime import datetime
import logging

try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    logging.warning("Tesseract not available. Image parsing will fail.")

try:
    import PyPDF2
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    logging.warning("PyPDF2 not available. PDF parsing will fail.")

from api.models import Receipt, LineItem, Store, ParseStatus, PriceHistory
from api.utils import normalize_store_name, normalize_product_name
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Store name patterns
STORE_PATTERNS = [
    r'whole\s*foods',
    r'trader\s*joe',
    r'safeway',
    r'kroger',
    r'walmart',
    r'target',
    r'costco',
    r'publix',
    r'albertsons',
    r'food\s*lion',
]

# Date patterns
DATE_PATTERNS = [
    r'\d{1,2}/\d{1,2}/\d{2,4}',  # MM/DD/YYYY or M/D/YY
    r'\d{4}-\d{2}-\d{2}',         # YYYY-MM-DD
    r'\d{2}-\d{2}-\d{4}',         # DD-MM-YYYY
]

# Line item pattern: product name followed by price
LINE_ITEM_PATTERN = r'(.+?)\s+(\d+\.\d{2})\s*$'

# Total pattern
TOTAL_PATTERNS = [
    r'(?:total|amount\s*due|balance).*?(\d+\.\d{2})',
    r'total\s*(\d+\.\d{2})',
]

def extract_text_from_image(file_path: str) -> str:
    """Extract text from image using OCR"""
    if not TESSERACT_AVAILABLE:
        raise Exception("Tesseract not available")
    
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        logger.error(f"OCR failed: {str(e)}")
        raise

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF"""
    if not PDF_AVAILABLE:
        raise Exception("PyPDF2 not available")
    
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"PDF extraction failed: {str(e)}")
        raise

def extract_text_from_file(file_path: str) -> str:
    """Extract text from receipt file based on extension"""
    ext = Path(file_path).suffix.lower()
    
    if ext in ['.jpg', '.jpeg', '.png']:
        return extract_text_from_image(file_path)
    elif ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext == '.txt':
        with open(file_path, 'r') as f:
            return f.read()
    else:
        raise Exception(f"Unsupported file type: {ext}")

def extract_store_name(text: str) -> Optional[str]:
    """Extract store name from receipt text"""
    # Look in first 5 lines
    lines = text.split('\n')[:5]
    text_to_search = '\n'.join(lines).lower()
    
    for pattern in STORE_PATTERNS:
        match = re.search(pattern, text_to_search, re.IGNORECASE)
        if match:
            return match.group(0).strip()
    
    return None

def extract_date(text: str) -> Optional[datetime]:
    """Extract purchase date from receipt text"""
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, text)
        if match:
            date_str = match.group(0)
            # Try to parse the date
            for fmt in ['%m/%d/%Y', '%m/%d/%y', '%Y-%m-%d', '%d-%m-%Y']:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
    
    return None

def extract_line_items(text: str) -> List[Tuple[str, Decimal]]:
    """Extract line items (product name and price) from receipt text"""
    items = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Look for pattern: text followed by price
        match = re.search(LINE_ITEM_PATTERN, line)
        if match:
            product_name = match.group(1).strip()
            price = Decimal(match.group(2))
            
            # Filter out likely non-product lines
            if len(product_name) > 2 and not re.match(r'^(total|tax|subtotal)', product_name, re.IGNORECASE):
                items.append((product_name, price))
    
    return items

def extract_total(text: str) -> Optional[Decimal]:
    """Extract total amount from receipt text"""
    # Look in last 10 lines
    lines = text.split('\n')[-10:]
    text_to_search = '\n'.join(lines).lower()
    
    for pattern in TOTAL_PATTERNS:
        match = re.search(pattern, text_to_search, re.IGNORECASE)
        if match:
            return Decimal(match.group(1))
    
    return None

def assess_parsing_confidence(store_name: Optional[str], date: Optional[datetime], 
                              items: List, total: Optional[Decimal]) -> Tuple[ParseStatus, str]:
    """Assess confidence level of parsing results"""
    if not items:
        return ParseStatus.FAILED, "No line items extracted"
    
    if not store_name or not date:
        return ParseStatus.NEEDS_REVIEW, "Missing store name or date"
    
    if len(items) < 3:
        return ParseStatus.NEEDS_REVIEW, "Few line items extracted"
    
    # Check if total matches sum of items (within tolerance)
    if total:
        items_sum = sum(price for _, price in items)
        diff = abs(total - items_sum)
        if diff > Decimal('0.50'):
            return ParseStatus.NEEDS_REVIEW, "Total doesn't match sum of items"
    
    return ParseStatus.SUCCESS, None

def parse_receipt(receipt: Receipt, db: Session, file_base_path: str = "./uploads"):
    """
    Parse a receipt and update database with extracted data.
    """
    try:
        # Build full file path
        full_path = Path(file_base_path) / receipt.original_file_path
        
        # Extract text
        text = extract_text_from_file(str(full_path))
        logger.info(f"Extracted text from receipt {receipt.id}")
        
        # Extract data
        store_name = extract_store_name(text)
        date = extract_date(text)
        items = extract_line_items(text)
        total = extract_total(text)
        
        # Assess confidence
        parse_status, error_msg = assess_parsing_confidence(store_name, date, items, total)
        
        # Update receipt
        receipt.parse_status = parse_status
        receipt.parse_error = error_msg
        receipt.purchase_date = date.date() if date else None
        receipt.total_amount = total
        
        # Handle store
        if store_name:
            normalized_name = normalize_store_name(store_name)
            store = db.query(Store).filter(Store.normalized_name == normalized_name).first()
            if not store:
                store = Store(name=store_name, normalized_name=normalized_name)
                db.add(store)
                db.flush()
            receipt.store_id = store.id
        
        # Create line items
        for idx, (product_name, price) in enumerate(items):
            line_item = LineItem(
                receipt_id=receipt.id,
                product_name=product_name,
                normalized_product_name=normalize_product_name(product_name),
                total_price=price,
                line_number=idx + 1
            )
            db.add(line_item)
            db.flush()
            
            # Create price history record
            if receipt.store_id and date:
                price_history = PriceHistory(
                    product_name=normalize_product_name(product_name),
                    store_id=receipt.store_id,
                    price=price,
                    observed_date=date.date(),
                    source_line_item_id=line_item.id
                )
                db.add(price_history)
        
        db.commit()
        logger.info(f"Receipt {receipt.id} parsed successfully: {len(items)} items, status={parse_status.value}")
        
    except Exception as e:
        logger.error(f"Parsing failed for receipt {receipt.id}: {str(e)}", exc_info=True)
        receipt.parse_status = ParseStatus.FAILED
        receipt.parse_error = str(e)
        db.commit()

