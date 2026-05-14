"""User response schemas."""

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class UserResponseSchema(BaseModel):
    """User response schema."""
    
    id: int
    email: EmailStr
    name: str
    role: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    tenant_id: Optional[int] = None
    created_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "email": "john@example.com",
                "name": "John's Barbershop",
                "role": "business_owner",
                "phone": "3001234567",
                "avatar_url": "https://example.com/avatar.jpg",
                "is_active": True,
                "is_verified": True,
                "tenant_id": 1,
                "created_at": "2024-01-15T10:30:00Z"
            }
        }
    )
