"""
Shared utilities for Nimbly API
"""
import re

def normalize_store_name(name: str) -> str:
    """
    Normalize store name for matching and deduplication.
    Converts to lowercase and removes punctuation.
    """
    if not name:
        return ""
    
    # Convert to lowercase
    normalized = name.lower()
    
    # Remove punctuation and extra whitespace
    normalized = re.sub(r'[^\w\s]', '', normalized)
    normalized = re.sub(r'\s+', ' ', normalized)
    normalized = normalized.strip()
    
    return normalized

def normalize_product_name(name: str) -> str:
    """
    Normalize product name for grouping similar items.
    Converts to lowercase and removes extra whitespace.
    """
    if not name:
        return ""
    
    # Convert to lowercase
    normalized = name.lower()
    
    # Remove extra whitespace
    normalized = re.sub(r'\s+', ' ', normalized)
    normalized = normalized.strip()
    
    return normalized
