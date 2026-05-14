"""Tenant response schemas."""

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class TenantResponseSchema(BaseModel):
    """Tenant response schema."""
    
    id: int
    name: str
    business_type: str
    slug: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    department: Optional[str] = None
    country: str
    logo_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "name": "John's Barbershop",
                "business_type": "barbershop",
                "slug": "johns-barbershop",
                "email": "john@example.com",
                "phone": "3001234567",
                "address": "Calle 123 #45-67",
                "city": "Bogotá",
                "department": "Cundinamarca",
                "country": "Colombia",
                "logo_url": "https://example.com/logo.jpg",
                "is_active": True,
                "created_at": "2024-01-15T10:30:00Z"
            }
        }
    )
