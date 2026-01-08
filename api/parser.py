"""
Receipt parsing logic with enhanced understanding
"""
import re
from pathlib import Path
from typing import Optional, List, Tuple, Dict
from decimal import Decimal
from datetime import datetime
import logging

try:
    import pytesseract
    from PIL import Image, ImageEnhance, ImageFilter
    import cv2
    import numpy as np
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    logging.warning("Tesseract/OpenCV not available. Image parsing will fail.")

try:
    import PyPDF2
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    logging.warning("PyPDF2 not available. PDF parsing will fail.")

try:
    from rapidfuzz import fuzz
    FUZZY_MATCH_AVAILABLE = True
except ImportError:
    FUZZY_MATCH_AVAILABLE = False
    logging.warning("rapidfuzz not available. Fuzzy matching disabled.")

from api.models import Receipt, LineItem, Store, ParseStatus, PriceHistory
from api.utils import normalize_store_name, normalize_product_name
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Enhanced store patterns with variations
STORE_PATTERNS = {
    'whole foods': [r'whole\s*foods?\s*market?', r'wfm', r'whole\s*food'],
    'trader joes': [r"trader\s*joe'?s?", r'tj'],
    'safeway': [r'safeway'],
    'kroger': [r'kroger'],
    'walmart': [r'wal\s*mart', r'walmart'],
    'target': [r'target'],
    'costco': [r'costco'],
    'publix': [r'publix'],
    'albertsons': [r'albertsons?'],
    'food lion': [r'food\s*lion'],
    'wegmans': [r'wegmans?'],
    'heb': [r'h\s*e\s*b', r'heb'],
    'aldi': [r'aldi'],
    'sprouts': [r'sprouts?\s*farmers?\s*market?'],
    'fresh market': [r'fresh\s*market'],
}

# Date patterns
DATE_PATTERNS = [
    r'\d{1,2}/\d{1,2}/\d{2,4}',  # MM/DD/YYYY or M/D/YY
    r'\d{4}-\d{2}-\d{2}',         # YYYY-MM-DD
    r'\d{2}-\d{2}-\d{4}',         # DD-MM-YYYY
    r'\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}',  # 15 Jan 2024
]

# Enhanced line item patterns
LINE_ITEM_PATTERNS = [
    # Product name, optional quantity/weight, price
    r'^(.+?)\s+(\d+\.?\d*\s*(?:lb|oz|kg|g|ct|ea)?)\s+(\d+\.\d{2})\s*$',
    # Product name, price (simple)
    r'^(.+?)\s+(\d+\.\d{2})\s*$',
    # Product with @ unit price
    r'^(.+?)\s+\d+\s*@\s*\d+\.\d{2}\s+(\d+\.\d{2})\s*$',
]

# Total patterns
TOTAL_PATTERNS = [
    r'(?:total|amount\s*due|balance|grand\s*total).*?(\d+\.\d{2})',
    r'total\s*(\d+\.\d{2})',
]

# Tax patterns
TAX_PATTERNS = [
    r'(?:tax|sales\s*tax).*?(\d+\.\d{2})',
]

def preprocess_image(image_path: str) -> Image.Image:
    """
    Preprocess image for better OCR accuracy.
    - Convert to grayscale
    - Increase contrast
    - Denoise
    - Deskew if needed
    """
    try:
        # Read with OpenCV
        img = cv2.imread(image_path)
        if img is None:
            # Fallback to PIL
            return Image.open(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive thresholding for better contrast
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)
        
        # Convert back to PIL Image
        pil_image = Image.fromarray(denoised)
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(pil_image)
        enhanced = enhancer.enhance(2.0)
        
        logger.info(f"Image preprocessed successfully: {image_path}")
        return enhanced
        
    except Exception as e:
        logger.warning(f"Preprocessing failed, using original: {str(e)}")
        return Image.open(image_path)

def extract_text_from_image(file_path: str) -> str:
    """Extract text from image using OCR with preprocessing"""
    if not TESSERACT_AVAILABLE:
        raise Exception("Tesseract not available")
    
    try:
        # Preprocess image
        image = preprocess_image(file_path)
        
        # Use custom Tesseract config for better accuracy
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, config=custom_config)
        
        logger.info(f"OCR extracted {len(text)} characters")
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

def extract_store_name(text: str) -> Tuple[Optional[str], float]:
    """
    Extract store name from receipt text with confidence score.
    Returns (store_name, confidence) where confidence is 0.0-1.0
    """
    # Look in first 10 lines
    lines = text.split('\n')[:10]
    text_to_search = '\n'.join(lines).lower()
    
    best_match = None
    best_confidence = 0.0
    
    # Try exact pattern matching first
    for store_name, patterns in STORE_PATTERNS.items():
        for pattern in patterns:
            match = re.search(pattern, text_to_search, re.IGNORECASE)
            if match:
                return match.group(0).strip(), 1.0
    
    # Try fuzzy matching if available
    if FUZZY_MATCH_AVAILABLE:
        for line in lines[:5]:  # Check first 5 lines
            line_clean = line.strip().lower()
            if len(line_clean) < 3:
                continue
            
            for store_name in STORE_PATTERNS.keys():
                ratio = fuzz.partial_ratio(store_name, line_clean)
                if ratio > 80 and ratio > best_confidence:
                    best_match = line.strip()
                    best_confidence = ratio / 100.0
    
    if best_match and best_confidence > 0.8:
        return best_match, best_confidence
    
    return None, 0.0

def extract_date(text: str) -> Tuple[Optional[datetime], float]:
    """
    Extract purchase date from receipt text with confidence score.
    Returns (date, confidence) where confidence is 0.0-1.0
    """
    # Look in first 15 lines
    lines = text.split('\n')[:15]
    text_to_search = '\n'.join(lines)
    
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, text_to_search, re.IGNORECASE)
        if match:
            date_str = match.group(0)
            # Try to parse the date
            formats = [
                '%m/%d/%Y', '%m/%d/%y', 
                '%Y-%m-%d', '%d-%m-%Y',
                '%d %b %Y', '%d %B %Y',
                '%d %b %y', '%d %B %y'
            ]
            for fmt in formats:
                try:
                    parsed_date = datetime.strptime(date_str, fmt)
                    # Confidence based on format clarity
                    confidence = 1.0 if '/' in date_str or '-' in date_str else 0.9
                    return parsed_date, confidence
                except ValueError:
                    continue
    
    return None, 0.0

def extract_line_items(text: str) -> Tuple[List[Tuple[str, Optional[str], Decimal]], Dict[str, any]]:
    """
    Extract line items (product name, quantity, price) from receipt text.
    Returns (items, metadata) where metadata contains extraction stats.
    """
    items = []
    lines = text.split('\n')
    metadata = {
        'total_lines': len(lines),
        'processed_lines': 0,
        'matched_lines': 0,
        'skipped_keywords': []
    }
    
    # Keywords to skip
    skip_keywords = [
        'total', 'subtotal', 'tax', 'balance', 'change', 'cash', 'credit',
        'debit', 'visa', 'mastercard', 'amex', 'discover', 'thank you',
        'receipt', 'store', 'phone', 'address', 'date', 'time'
    ]
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 3:
            continue
        
        metadata['processed_lines'] += 1
        
        # Skip lines with skip keywords
        if any(keyword in line.lower() for keyword in skip_keywords):
            metadata['skipped_keywords'].append(line[:30])
            continue
        
        # Try each pattern
        for pattern in LINE_ITEM_PATTERNS:
            match = re.search(pattern, line)
            if match:
                groups = match.groups()
                
                if len(groups) == 3:
                    # Pattern with quantity
                    product_name = groups[0].strip()
                    quantity = groups[1].strip()
                    price = Decimal(groups[2])
                elif len(groups) == 2:
                    # Simple pattern
                    product_name = groups[0].strip()
                    quantity = None
                    price = Decimal(groups[1])
                else:
                    continue
                
                # Validate product name
                if len(product_name) > 2 and not product_name.isdigit():
                    items.append((product_name, quantity, price))
                    metadata['matched_lines'] += 1
                    break
    
    logger.info(f"Extracted {len(items)} line items from {metadata['processed_lines']} lines")
    return items, metadata

def extract_total(text: str) -> Tuple[Optional[Decimal], float]:
    """
    Extract total amount from receipt text with confidence score.
    Returns (total, confidence) where confidence is 0.0-1.0
    """
    # Look in last 15 lines
    lines = text.split('\n')[-15:]
    text_to_search = '\n'.join(lines).lower()
    
    for pattern in TOTAL_PATTERNS:
        match = re.search(pattern, text_to_search, re.IGNORECASE)
        if match:
            total = Decimal(match.group(1))
            # Higher confidence if "total" is explicitly mentioned
            confidence = 1.0 if 'total' in match.group(0).lower() else 0.8
            return total, confidence
    
    return None, 0.0

def extract_tax(text: str) -> Optional[Decimal]:
    """Extract tax amount from receipt text"""
    lines = text.split('\n')[-15:]
    text_to_search = '\n'.join(lines).lower()
    
    for pattern in TAX_PATTERNS:
        match = re.search(pattern, text_to_search, re.IGNORECASE)
        if match:
            return Decimal(match.group(1))
    
    return None

def assess_parsing_confidence(
    store_name: Optional[str], 
    store_confidence: float,
    date: Optional[datetime],
    date_confidence: float,
    items: List, 
    items_metadata: Dict,
    total: Optional[Decimal],
    total_confidence: float,
    tax: Optional[Decimal]
) -> Tuple[ParseStatus, Optional[str], Dict[str, any]]:
    """
    Assess confidence level of parsing results with detailed scoring.
    Returns (status, error_message, confidence_details)
    """
    confidence_details = {
        'store_confidence': store_confidence,
        'date_confidence': date_confidence,
        'total_confidence': total_confidence,
        'items_count': len(items),
        'items_extraction_rate': items_metadata['matched_lines'] / max(items_metadata['processed_lines'], 1),
        'overall_confidence': 0.0,
        'issues': []
    }
    
    # Critical failures
    if not items:
        return ParseStatus.FAILED, "No line items extracted", confidence_details
    
    # Calculate overall confidence
    scores = []
    
    if store_name:
        scores.append(store_confidence * 0.25)
    else:
        confidence_details['issues'].append("Missing store name")
    
    if date:
        scores.append(date_confidence * 0.20)
    else:
        confidence_details['issues'].append("Missing purchase date")
    
    # Items score based on count and extraction rate
    items_score = min(len(items) / 5.0, 1.0) * 0.35  # Up to 5 items = full score
    scores.append(items_score)
    
    if total:
        scores.append(total_confidence * 0.20)
        
        # Validate total against items sum
        items_sum = sum(price for _, _, price in items)
        
        # If we have tax, add it to items sum
        if tax:
            items_sum += tax
        
        diff = abs(total - items_sum)
        diff_percent = (diff / total) * 100 if total > 0 else 100
        
        if diff_percent > 10:
            confidence_details['issues'].append(f"Total mismatch: {diff_percent:.1f}% difference")
            scores.append(-0.1)  # Penalty
    else:
        confidence_details['issues'].append("Missing total amount")
    
    confidence_details['overall_confidence'] = max(sum(scores), 0.0)
    
    # Determine status based on confidence
    if confidence_details['overall_confidence'] >= 0.75:
        return ParseStatus.SUCCESS, None, confidence_details
    elif confidence_details['overall_confidence'] >= 0.50:
        issues_str = "; ".join(confidence_details['issues'])
        return ParseStatus.NEEDS_REVIEW, f"Medium confidence: {issues_str}", confidence_details
    else:
        issues_str = "; ".join(confidence_details['issues'])
        return ParseStatus.NEEDS_REVIEW, f"Low confidence: {issues_str}", confidence_details

def parse_receipt(receipt: Receipt, db: Session, file_base_path: str = "./uploads"):
    """
    Parse a receipt and update database with extracted data.
    Enhanced with better confidence scoring and metadata tracking.
    """
    try:
        # Build full file path
        full_path = Path(file_base_path) / receipt.original_file_path
        
        # Extract text
        text = extract_text_from_file(str(full_path))
        logger.info(f"Extracted {len(text)} characters from receipt {receipt.id}")
        
        # Extract data with confidence scores
        store_name, store_confidence = extract_store_name(text)
        date, date_confidence = extract_date(text)
        items, items_metadata = extract_line_items(text)
        total, total_confidence = extract_total(text)
        tax = extract_tax(text)
        
        # Assess confidence with detailed scoring
        parse_status, error_msg, confidence_details = assess_parsing_confidence(
            store_name, store_confidence,
            date, date_confidence,
            items, items_metadata,
            total, total_confidence,
            tax
        )
        
        # Log confidence details
        logger.info(
            f"Receipt {receipt.id} parsing confidence: "
            f"{confidence_details['overall_confidence']:.2f} "
            f"(store={store_confidence:.2f}, date={date_confidence:.2f}, "
            f"items={len(items)}, total={total_confidence:.2f})"
        )
        
        # Update receipt
        receipt.parse_status = parse_status
        receipt.parse_error = error_msg
        receipt.purchase_date = date.date() if date else None
        receipt.total_amount = total
        
        # Handle store with fuzzy matching
        if store_name:
            normalized_name = normalize_store_name(store_name)
            store = db.query(Store).filter(Store.normalized_name == normalized_name).first()
            
            # If no exact match and fuzzy matching available, try fuzzy
            if not store and FUZZY_MATCH_AVAILABLE:
                all_stores = db.query(Store).all()
                best_match = None
                best_ratio = 0
                
                for existing_store in all_stores:
                    ratio = fuzz.ratio(normalized_name, existing_store.normalized_name)
                    if ratio > 85 and ratio > best_ratio:
                        best_match = existing_store
                        best_ratio = ratio
                
                if best_match:
                    store = best_match
                    logger.info(f"Fuzzy matched store '{store_name}' to '{store.name}' (ratio={best_ratio})")
            
            if not store:
                store = Store(name=store_name, normalized_name=normalized_name)
                db.add(store)
                db.flush()
            
            receipt.store_id = store.id
        
        # Create line items with quantity support
        for idx, (product_name, quantity, price) in enumerate(items):
            line_item = LineItem(
                receipt_id=receipt.id,
                product_name=product_name,
                normalized_product_name=normalize_product_name(product_name),
                quantity=quantity,  # Store quantity if available
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
        logger.info(
            f"Receipt {receipt.id} parsed: {len(items)} items, "
            f"status={parse_status.value}, confidence={confidence_details['overall_confidence']:.2f}"
        )
        
    except Exception as e:
        logger.error(f"Parsing failed for receipt {receipt.id}: {str(e)}", exc_info=True)
        receipt.parse_status = ParseStatus.FAILED
        receipt.parse_error = str(e)
        db.commit()

