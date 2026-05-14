"""Tenant domain entity."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from app.shared.constants.enums import BusinessType


@dataclass
class Tenant:
    """Tenant entity representing a business account."""
    
    id: Optional[int]
    name: str
    business_type: BusinessType
    slug: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    department: Optional[str] = None
    country: str = "Colombia"
    timezone: str = "America/Bogota"
    currency: str = "COP"
    logo_url: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def is_service_business(self) -> bool:
        """
        Check if business offers services (vs products).
        
        Returns:
            bool: True if business is service-based
        """
        service_types = [
            BusinessType.BARBERSHOP,
            BusinessType.SPA,
            BusinessType.INDEPENDENT_WORKER
        ]
        return self.business_type in service_types
    
    def should_have_address(self) -> bool:
        """
        Check if business should have a physical address.
        
        Returns:
            bool: True if address is recommended
        """
        # All business types except independent workers typically need an address
        return self.business_type != BusinessType.INDEPENDENT_WORKER
