"""Business-related schemas for customer view."""

from typing import Optional, List
from pydantic import BaseModel, Field
from app.shared.constants.enums import BusinessType, ColombiaDepartment


class BusinessSearchSchema(BaseModel):
    """Schema for business search filters."""
    
    query: Optional[str] = Field(None, description="Search by business name")
    business_type: Optional[BusinessType] = Field(None, description="Filter by business type")
    city: Optional[str] = Field(None, description="Filter by city")
    department: Optional[ColombiaDepartment] = Field(None, description="Filter by department")
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "query": "Barbería",
                "business_type": "barbershop",
                "city": "Bogotá",
                "department": "Cundinamarca",
                "page": 1,
                "page_size": 20
            }
        }
    }


class BusinessListItemSchema(BaseModel):
    """Schema for business list item (summary view)."""
    
    id: int
    name: str
    business_type: str
    city: str
    department: str
    address: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    rating: Optional[float] = Field(None, description="Average rating (0-5)")
    total_reviews: int = Field(0, description="Total number of reviews")
    created_at: str
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "name": "Barbería El Clásico",
                "business_type": "barbershop",
                "city": "Bogotá",
                "department": "Cundinamarca",
                "address": "Calle 123 #45-67",
                "phone": "3001234567",
                "is_active": True,
                "rating": 4.5,
                "total_reviews": 128,
                "created_at": "2024-01-15T10:30:00"
            }
        }
    }


class BusinessDetailSchema(BaseModel):
    """Schema for business detail view."""
    
    id: int
    name: str
    business_type: str
    city: str
    department: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: str
    is_active: bool
    rating: Optional[float] = Field(None, description="Average rating (0-5)")
    total_reviews: int = Field(0, description="Total number of reviews")
    description: Optional[str] = None
    owner_name: str
    created_at: str
    
    # TODO: Add these fields when modules are implemented
    # products_count: int = 0
    # services_count: int = 0
    # has_delivery: bool = False
    # has_chat: bool = False
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "name": "Barbería El Clásico",
                "business_type": "barbershop",
                "city": "Bogotá",
                "department": "Cundinamarca",
                "address": "Calle 123 #45-67",
                "phone": "3001234567",
                "email": "contacto@barberiaelclasico.com",
                "is_active": True,
                "rating": 4.5,
                "total_reviews": 128,
                "description": "Barbería tradicional con más de 10 años de experiencia",
                "owner_name": "Juan Pérez",
                "created_at": "2024-01-15T10:30:00"
            }
        }
    }


class BusinessSearchResponseSchema(BaseModel):
    """Schema for business search response with pagination."""
    
    businesses: List[BusinessListItemSchema]
    total: int
    page: int
    page_size: int
    total_pages: int
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "businesses": [
                    {
                        "id": 1,
                        "name": "Barbería El Clásico",
                        "business_type": "barbershop",
                        "city": "Bogotá",
                        "department": "Cundinamarca",
                        "address": "Calle 123 #45-67",
                        "phone": "3001234567",
                        "is_active": True,
                        "rating": 4.5,
                        "total_reviews": 128,
                        "created_at": "2024-01-15T10:30:00"
                    }
                ],
                "total": 45,
                "page": 1,
                "page_size": 20,
                "total_pages": 3
            }
        }
    }
