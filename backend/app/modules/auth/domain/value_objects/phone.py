"""Phone value object with Colombian format validation."""

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class Phone:
    """Phone value object with Colombian 10-digit format validation."""
    
    value: str
    
    def __post_init__(self):
        """Validate phone format on initialization."""
        if not self._is_valid(self.value):
            raise ValueError(
                f"Invalid Colombian phone format: {self.value}. "
                "Phone must be exactly 10 digits."
            )
    
    @staticmethod
    def _is_valid(phone: str) -> bool:
        """
        Validate Colombian phone format (10 digits).
        
        Args:
            phone: Phone string to validate
            
        Returns:
            bool: True if phone is valid
        """
        if not phone:
            return False
        
        # Colombian phone numbers are exactly 10 digits
        pattern = r'^\d{10}$'
        return bool(re.match(pattern, phone))
    
    def __str__(self) -> str:
        """Return phone as string."""
        return self.value
    
    def __repr__(self) -> str:
        """Return phone representation."""
        return f"Phone('{self.value}')"
    
    def formatted(self) -> str:
        """
        Return formatted phone number.
        
        Returns:
            str: Formatted phone (e.g., 300 123 4567)
        """
        if len(self.value) == 10:
            return f"{self.value[:3]} {self.value[3:6]} {self.value[6:]}"
        return self.value
