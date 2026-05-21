"""Customer preferences domain entity."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List


@dataclass
class CustomerPreferences:
    """Customer preferences entity for personalized recommendations."""
    
    id: Optional[int]
    user_id: int
    categories: List[str]  # Beauty, Fast Food, Pharmacy, Specialists
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def has_category(self, category: str) -> bool:
        """Check if customer has a specific preference category."""
        return category in self.categories
    
    def add_category(self, category: str) -> None:
        """Add a new preference category."""
        if category not in self.categories:
            self.categories.append(category)
    
    def remove_category(self, category: str) -> None:
        """Remove a preference category."""
        if category in self.categories:
            self.categories.remove(category)
