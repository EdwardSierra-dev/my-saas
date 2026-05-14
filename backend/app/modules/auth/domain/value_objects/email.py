"""Email value object with validation."""

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class Email:
    """Email value object with validation."""
    
    value: str
    
    def __post_init__(self):
        """Validate email format on initialization."""
        if not self._is_valid(self.value):
            raise ValueError(f"Invalid email format: {self.value}")
    
    @staticmethod
    def _is_valid(email: str) -> bool:
        """
        Validate email format.
        
        Args:
            email: Email string to validate
            
        Returns:
            bool: True if email is valid
        """
        if not email or len(email) > 255:
            return False
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    def __str__(self) -> str:
        """Return email as string."""
        return self.value
    
    def __repr__(self) -> str:
        """Return email representation."""
        return f"Email('{self.value}')"
