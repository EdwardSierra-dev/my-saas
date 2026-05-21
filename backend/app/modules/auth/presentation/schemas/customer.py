"""Customer-related schemas."""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.shared.constants.enums import CustomerPreferenceCategory, OAuthProvider


class RegisterCustomerSchema(BaseModel):
    """Schema for customer registration."""
    
    full_name: str = Field(..., min_length=2, max_length=100, description="Customer full name")
    email: EmailStr = Field(..., description="Customer email address")
    password: str = Field(..., min_length=8, description="Password (min 8 characters)")
    confirm_password: str = Field(..., description="Password confirmation")
    preferences: List[CustomerPreferenceCategory] = Field(
        default_factory=list,
        description="Customer preference categories"
    )
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in v):
            raise ValueError("Password must contain at least one special character")
        return v
    
    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        """Validate that passwords match."""
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "full_name": "Juan Pérez",
                "email": "juan.perez@example.com",
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!",
                "preferences": ["beauty_aesthetics", "pharmacy"]
            }
        }
    }


class RegisterCustomerOAuthSchema(BaseModel):
    """Schema for customer registration via OAuth."""
    
    temp_token: str = Field(..., description="Temporary OAuth token")
    preferences: List[CustomerPreferenceCategory] = Field(
        default_factory=list,
        description="Customer preference categories"
    )
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "temp_token": "temp_abc123xyz",
                "preferences": ["beauty_aesthetics", "fast_food"]
            }
        }
    }


class LoginCustomerSchema(BaseModel):
    """Schema for customer login."""
    
    email: EmailStr = Field(..., description="Customer email address")
    password: str = Field(..., description="Customer password")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "juan.perez@example.com",
                "password": "SecurePass123!"
            }
        }
    }


class CustomerPreferencesSchema(BaseModel):
    """Schema for customer preferences."""
    
    categories: List[CustomerPreferenceCategory] = Field(
        ...,
        description="Customer preference categories"
    )
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "categories": ["beauty_aesthetics", "pharmacy", "specialists"]
            }
        }
    }


class CustomerResponseSchema(BaseModel):
    """Schema for customer response."""
    
    id: int
    email: str
    name: str
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    preferences: List[str] = Field(default_factory=list)
    created_at: str
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "email": "juan.perez@example.com",
                "name": "Juan Pérez",
                "avatar_url": None,
                "is_active": True,
                "is_verified": False,
                "preferences": ["beauty_aesthetics", "pharmacy"],
                "created_at": "2024-01-15T10:30:00"
            }
        }
    }


class RegisterCustomerResponseSchema(BaseModel):
    """Schema for customer registration response."""
    
    user: CustomerResponseSchema
    tokens: "TokenResponseSchema"
    
    model_config = {
        "from_attributes": True
    }


# Import TokenResponseSchema to avoid circular import
from .auth import TokenResponseSchema
RegisterCustomerResponseSchema.model_rebuild()
