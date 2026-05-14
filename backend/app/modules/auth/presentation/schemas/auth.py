"""Authentication request/response schemas."""

from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional
import re

from .user import UserResponseSchema
from .tenant import TenantResponseSchema


class RegisterBusinessSchema(BaseModel):
    """Schema for business registration request."""
    
    temp_token: str = Field(..., description="Temporary token from OAuth callback")
    name: str = Field(..., min_length=2, max_length=100, description="Business name")
    business_type: str = Field(..., description="Type of business")
    city: str = Field(..., min_length=2, max_length=100, description="City")
    department: str = Field(..., description="Colombian department")
    phone: str = Field(..., description="10-digit Colombian phone number")
    password: str = Field(..., min_length=8, description="Password")
    confirm_password: str = Field(..., description="Password confirmation")
    address: Optional[str] = Field(None, max_length=500, description="Business address (optional)")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "temp_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "name": "John's Barbershop",
                "business_type": "barbershop",
                "city": "Bogotá",
                "department": "Cundinamarca",
                "phone": "3001234567",
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!",
                "address": "Calle 123 #45-67"
            }
        }
    )
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Validate Colombian phone format."""
        if not re.match(r'^\d{10}$', v):
            raise ValueError("Phone must be exactly 10 digits")
        return v
    
    @field_validator("business_type")
    @classmethod
    def validate_business_type(cls, v: str) -> str:
        """Validate business type."""
        valid_types = ["barbershop", "spa", "local_store", "restaurant", "pharmacy", "independent_worker"]
        if v not in valid_types:
            raise ValueError(f"business_type must be one of: {', '.join(valid_types)}")
        return v
    
    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        """Validate Colombian department - accepts with or without accents."""
        # Lista de departamentos válidos (con y sin tildes)
        valid_departments = [
            "Amazonas", "Antioquia", "Arauca", "Atlántico", "Atlantico",
            "Bolívar", "Bolivar", "Boyacá", "Boyaca", "Caldas", "Caquetá", "Caqueta",
            "Casanare", "Cauca", "Cesar", "Chocó", "Choco", "Córdoba", "Cordoba",
            "Cundinamarca", "Guainía", "Guainia", "Guaviare", "Huila", "La Guajira",
            "Magdalena", "Meta", "Nariño", "Narino", "Norte de Santander",
            "Putumayo", "Quindío", "Quindio", "Risaralda", "San Andrés y Providencia",
            "San Andres y Providencia", "Santander", "Sucre", "Tolima",
            "Valle del Cauca", "Vaupés", "Vaupes", "Vichada"
        ]
        
        # Normalizar: convertir a título y quitar tildes para comparación
        v_normalized = v.strip()
        
        # Buscar coincidencia (case-insensitive)
        for dept in valid_departments:
            if v_normalized.lower() == dept.lower():
                # Retornar la versión con tilde si existe
                if dept in ["Atlántico", "Bolívar", "Boyacá", "Caquetá", "Chocó", "Córdoba", 
                           "Guainía", "Nariño", "Quindío", "Vaupés"]:
                    return dept
                return v_normalized
        
        raise ValueError(f"department must be a valid Colombian department")
        return v


class TokenResponseSchema(BaseModel):
    """Token response schema."""
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 900
            }
        }
    )


class RegisterBusinessResponseSchema(BaseModel):
    """Response schema for business registration."""
    
    user: UserResponseSchema
    tenant: TenantResponseSchema
    tokens: TokenResponseSchema
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "user": {
                    "id": 1,
                    "email": "john@example.com",
                    "name": "John's Barbershop",
                    "role": "business_owner",
                    "phone": "3001234567",
                    "is_active": True,
                    "is_verified": True,
                    "tenant_id": 1,
                    "created_at": "2024-01-15T10:30:00Z"
                },
                "tenant": {
                    "id": 1,
                    "name": "John's Barbershop",
                    "business_type": "barbershop",
                    "slug": "johns-barbershop",
                    "city": "Bogotá",
                    "department": "Cundinamarca",
                    "country": "Colombia",
                    "is_active": True,
                    "created_at": "2024-01-15T10:30:00Z"
                },
                "tokens": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                    "expires_in": 900
                }
            }
        }
    )


class OAuthUserDataSchema(BaseModel):
    """OAuth user data schema."""
    
    provider: str
    provider_user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None


class OAuthCallbackResponseSchema(BaseModel):
    """Response schema for OAuth callback."""
    
    oauth_data: OAuthUserDataSchema
    temp_token: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "oauth_data": {
                    "provider": "google",
                    "provider_user_id": "123456789",
                    "email": "john@example.com",
                    "name": "John Doe",
                    "picture": "https://example.com/photo.jpg"
                },
                "temp_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    )


class RefreshTokenSchema(BaseModel):
    """Refresh token request schema."""
    
    refresh_token: str = Field(..., description="Refresh token")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    )


class LogoutSchema(BaseModel):
    """Logout request schema."""
    
    refresh_token: str = Field(..., description="Refresh token to revoke")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    )
