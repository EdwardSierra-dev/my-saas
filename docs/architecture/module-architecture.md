# Module Architecture

## Overview

This document describes how modules are structured and how they interact within the Modular SaaS Platform.

## Module Structure

Each module follows **Clean Architecture** principles with four distinct layers:

```
module/
├── domain/              # Business logic and entities
├── application/         # Use cases and services
├── infrastructure/      # External dependencies
└── presentation/        # API and schemas
```

## Layer Responsibilities

### 1. Domain Layer (Core Business Logic)

**Purpose**: Contains the business entities, value objects, and domain rules. This is the heart of the module.

**Characteristics**:
- No dependencies on other layers
- Pure business logic
- Framework-agnostic
- Highly testable

**Components**:

#### Entities
Business objects with identity and lifecycle.

```python
# domain/entities/user.py
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class User:
    """User entity representing a system user."""
    
    id: Optional[int]
    email: str
    name: str
    role: str
    tenant_id: Optional[int]
    created_at: datetime
    
    def is_business_owner(self) -> bool:
        """Check if user is a business owner."""
        return self.role == "business_owner"
    
    def can_access_tenant(self, tenant_id: int) -> bool:
        """Check if user can access a specific tenant."""
        return self.tenant_id == tenant_id or self.role == "super_admin"
```

#### Value Objects
Immutable objects defined by their attributes.

```python
# domain/value_objects/email.py
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Email:
    """Email value object with validation."""
    
    value: str
    
    def __post_init__(self):
        if not self._is_valid(self.value):
            raise ValueError(f"Invalid email: {self.value}")
    
    @staticmethod
    def _is_valid(email: str) -> bool:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    def __str__(self) -> str:
        return self.value
```

#### Repository Interfaces
Define contracts for data access (implementation in infrastructure layer).

```python
# domain/repositories/user_repository.py
from abc import ABC, abstractmethod
from typing import Optional, List
from ..entities.user import User

class UserRepository(ABC):
    """Interface for user data access."""
    
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        pass
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        pass
    
    @abstractmethod
    def create(self, user: User) -> User:
        """Create a new user."""
        pass
    
    @abstractmethod
    def update(self, user: User) -> User:
        """Update existing user."""
        pass
    
    @abstractmethod
    def list_by_tenant(self, tenant_id: int) -> List[User]:
        """List all users for a tenant."""
        pass
```

### 2. Application Layer (Use Cases)

**Purpose**: Orchestrates the flow of data and business logic. Contains use cases and application services.

**Characteristics**:
- Depends only on domain layer
- Implements business workflows
- Coordinates between domain and infrastructure
- Transaction boundaries

**Components**:

#### Use Cases
Specific business operations.

```python
# application/use_cases/register_business.py
from dataclasses import dataclass
from typing import Optional

from ...domain.entities.user import User
from ...domain.repositories.user_repository import UserRepository
from ...domain.value_objects.email import Email
from ..services.oauth_service import OAuthService
from ..services.token_service import TokenService

@dataclass
class RegisterBusinessRequest:
    """Request to register a new business."""
    email: str
    name: str
    business_type: str
    oauth_provider: str
    oauth_token: str
    phone: str
    city: str
    department: str
    address: Optional[str] = None

@dataclass
class RegisterBusinessResponse:
    """Response from business registration."""
    user: User
    access_token: str
    refresh_token: str

class RegisterBusiness:
    """Use case for registering a new business account."""
    
    def __init__(
        self,
        user_repository: UserRepository,
        oauth_service: OAuthService,
        token_service: TokenService
    ):
        self.user_repository = user_repository
        self.oauth_service = oauth_service
        self.token_service = token_service
    
    def execute(self, request: RegisterBusinessRequest) -> RegisterBusinessResponse:
        """Execute the business registration use case."""
        
        # 1. Validate email
        email = Email(request.email)
        
        # 2. Check if user already exists
        existing_user = self.user_repository.get_by_email(str(email))
        if existing_user:
            raise UserAlreadyExistsError(f"User with email {email} already exists")
        
        # 3. Verify OAuth token
        oauth_data = self.oauth_service.verify_token(
            request.oauth_provider,
            request.oauth_token
        )
        
        # 4. Create user entity
        user = User(
            id=None,
            email=str(email),
            name=request.name,
            role="business_owner",
            tenant_id=None,  # Will be set after tenant creation
            created_at=datetime.utcnow()
        )
        
        # 5. Save user
        created_user = self.user_repository.create(user)
        
        # 6. Generate tokens
        access_token = self.token_service.create_access_token(created_user)
        refresh_token = self.token_service.create_refresh_token(created_user)
        
        # 7. Return response
        return RegisterBusinessResponse(
            user=created_user,
            access_token=access_token,
            refresh_token=refresh_token
        )
```

#### Application Services
Reusable services for common operations.

```python
# application/services/oauth_service.py
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class OAuthUserData:
    """Data retrieved from OAuth provider."""
    provider_user_id: str
    email: str
    name: str
    picture: Optional[str] = None

class OAuthService(ABC):
    """Service for OAuth operations."""
    
    @abstractmethod
    def verify_token(self, provider: str, token: str) -> OAuthUserData:
        """Verify OAuth token and get user data."""
        pass
    
    @abstractmethod
    def get_authorization_url(self, provider: str, state: str) -> str:
        """Get OAuth authorization URL."""
        pass
```

### 3. Infrastructure Layer (External Dependencies)

**Purpose**: Implements interfaces defined in domain layer. Handles external systems.

**Characteristics**:
- Depends on domain and application layers
- Implements repository interfaces
- Handles database, cache, external APIs
- Framework-specific code

**Components**:

#### Persistence (Database)

```python
# infrastructure/persistence/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class UserModel(Base):
    """SQLAlchemy model for users table."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    tenant_id = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

```python
# infrastructure/persistence/user_repository_impl.py
from typing import Optional, List
from sqlalchemy.orm import Session

from ...domain.entities.user import User
from ...domain.repositories.user_repository import UserRepository
from .models import UserModel

class UserRepositoryImpl(UserRepository):
    """SQLAlchemy implementation of UserRepository."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        return self._to_entity(model) if model else None
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        model = self.db.query(UserModel).filter(UserModel.email == email).first()
        return self._to_entity(model) if model else None
    
    def create(self, user: User) -> User:
        """Create a new user."""
        model = UserModel(
            email=user.email,
            name=user.name,
            role=user.role,
            tenant_id=user.tenant_id
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)
    
    def update(self, user: User) -> User:
        """Update existing user."""
        model = self.db.query(UserModel).filter(UserModel.id == user.id).first()
        if not model:
            raise UserNotFoundError(f"User {user.id} not found")
        
        model.name = user.name
        model.role = user.role
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)
    
    def list_by_tenant(self, tenant_id: int) -> List[User]:
        """List all users for a tenant."""
        models = self.db.query(UserModel).filter(
            UserModel.tenant_id == tenant_id
        ).all()
        return [self._to_entity(m) for m in models]
    
    @staticmethod
    def _to_entity(model: UserModel) -> User:
        """Convert SQLAlchemy model to domain entity."""
        return User(
            id=model.id,
            email=model.email,
            name=model.name,
            role=model.role,
            tenant_id=model.tenant_id,
            created_at=model.created_at
        )
```

#### External Services

```python
# infrastructure/external/google_oauth.py
import httpx
from typing import Dict, Any

from ...application.services.oauth_service import OAuthService, OAuthUserData

class GoogleOAuthService(OAuthService):
    """Google OAuth implementation."""
    
    def __init__(self, client_id: str, client_secret: str, redirect_uri: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
    
    def verify_token(self, provider: str, token: str) -> OAuthUserData:
        """Verify Google OAuth token."""
        if provider != "google":
            raise ValueError(f"Invalid provider: {provider}")
        
        # Exchange authorization code for access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": token,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "grant_type": "authorization_code"
        }
        
        with httpx.Client() as client:
            token_response = client.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
            
            # Get user info
            userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            headers = {"Authorization": f"Bearer {tokens['access_token']}"}
            userinfo_response = client.get(userinfo_url, headers=headers)
            userinfo_response.raise_for_status()
            user_data = userinfo_response.json()
        
        return OAuthUserData(
            provider_user_id=user_data["id"],
            email=user_data["email"],
            name=user_data["name"],
            picture=user_data.get("picture")
        )
    
    def get_authorization_url(self, provider: str, state: str) -> str:
        """Get Google OAuth authorization URL."""
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state
        }
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
```

### 4. Presentation Layer (API)

**Purpose**: Handles HTTP requests and responses. Exposes the application to external clients.

**Characteristics**:
- Depends on application layer
- FastAPI routes and dependencies
- Request/response validation with Pydantic
- Error handling and formatting

**Components**:

#### API Routes

```python
# presentation/api/v1/auth.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from ...application.use_cases.register_business import (
    RegisterBusiness,
    RegisterBusinessRequest,
    RegisterBusinessResponse
)
from ...infrastructure.persistence.user_repository_impl import UserRepositoryImpl
from ..schemas.auth import RegisterBusinessSchema, RegisterBusinessResponseSchema

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post(
    "/register/business",
    response_model=RegisterBusinessResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new business account"
)
async def register_business(
    request: RegisterBusinessSchema,
    db: Session = Depends(get_db)
) -> RegisterBusinessResponseSchema:
    """
    Register a new business account with OAuth authentication.
    
    - **email**: Business email address
    - **name**: Business name
    - **business_type**: Type of business
    - **oauth_provider**: OAuth provider (google, microsoft, linkedin)
    - **oauth_token**: OAuth authorization code
    """
    # Create dependencies
    user_repository = UserRepositoryImpl(db)
    oauth_service = get_oauth_service()  # Factory function
    token_service = get_token_service()  # Factory function
    
    # Create use case
    use_case = RegisterBusiness(user_repository, oauth_service, token_service)
    
    # Execute use case
    use_case_request = RegisterBusinessRequest(
        email=request.email,
        name=request.name,
        business_type=request.business_type,
        oauth_provider=request.oauth_provider,
        oauth_token=request.oauth_token,
        phone=request.phone,
        city=request.city,
        department=request.department,
        address=request.address
    )
    
    result = use_case.execute(use_case_request)
    
    # Convert to response schema
    return RegisterBusinessResponseSchema(
        user=UserSchema.from_entity(result.user),
        tokens=TokensSchema(
            access_token=result.access_token,
            refresh_token=result.refresh_token,
            token_type="bearer"
        )
    )
```

#### Pydantic Schemas

```python
# presentation/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterBusinessSchema(BaseModel):
    """Schema for business registration request."""
    
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    business_type: str
    oauth_provider: str = Field(..., regex="^(google|microsoft|linkedin)$")
    oauth_token: str
    phone: str = Field(..., regex=r"^\d{10}$")
    city: str
    department: str
    address: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "email": "john@example.com",
                "name": "John's Barbershop",
                "business_type": "barbershop",
                "oauth_provider": "google",
                "oauth_token": "authorization_code_here",
                "phone": "3001234567",
                "city": "Bogotá",
                "department": "Cundinamarca",
                "address": "Calle 123 #45-67"
            }
        }

class UserSchema(BaseModel):
    """Schema for user response."""
    
    id: int
    email: str
    name: str
    role: str
    tenant_id: Optional[int]
    created_at: str
    
    @classmethod
    def from_entity(cls, user: User) -> "UserSchema":
        """Create schema from domain entity."""
        return cls(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            tenant_id=user.tenant_id,
            created_at=user.created_at.isoformat()
        )

class TokensSchema(BaseModel):
    """Schema for authentication tokens."""
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RegisterBusinessResponseSchema(BaseModel):
    """Schema for business registration response."""
    
    user: UserSchema
    tokens: TokensSchema
```

## Module Communication

### Rules

1. **No Direct Dependencies**: Modules don't import from each other
2. **Shared Kernel**: Common types in `app/shared/`
3. **Event-Driven**: Use domain events for cross-module communication (future)
4. **API Gateway**: Frontend only talks to presentation layer

### Example: Cross-Module Communication

```python
# Future: Event-driven communication
from app.shared.events import EventBus

# In Business Profile module
event_bus.publish(
    event="business_profile.updated",
    data={"business_id": 123, "fields": ["name", "address"]}
)

# In Inventory module
@event_bus.subscribe("business_profile.updated")
def handle_business_updated(data):
    # Update inventory business reference
    business_id = data["business_id"]
    # ... update logic
```

## Dependency Injection

Use FastAPI's dependency injection system:

```python
# presentation/dependencies.py
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from ..infrastructure.persistence.user_repository_impl import UserRepositoryImpl
from ..domain.repositories.user_repository import UserRepository

def get_user_repository(
    db: Session = Depends(get_db)
) -> UserRepository:
    """Get user repository instance."""
    return UserRepositoryImpl(db)
```

## Testing Strategy

### Unit Tests (Domain & Application)

```python
# tests/unit/modules/auth/test_register_business.py
import pytest
from datetime import datetime

from app.modules.auth.domain.entities.user import User
from app.modules.auth.application.use_cases.register_business import (
    RegisterBusiness,
    RegisterBusinessRequest
)

class MockUserRepository:
    """Mock user repository for testing."""
    
    def __init__(self):
        self.users = []
    
    def get_by_email(self, email: str):
        return next((u for u in self.users if u.email == email), None)
    
    def create(self, user: User) -> User:
        user.id = len(self.users) + 1
        self.users.append(user)
        return user

def test_register_business_success():
    """Test successful business registration."""
    # Arrange
    repository = MockUserRepository()
    oauth_service = MockOAuthService()
    token_service = MockTokenService()
    use_case = RegisterBusiness(repository, oauth_service, token_service)
    
    request = RegisterBusinessRequest(
        email="test@example.com",
        name="Test Business",
        business_type="restaurant",
        oauth_provider="google",
        oauth_token="valid_token",
        phone="3001234567",
        city="Bogotá",
        department="Cundinamarca"
    )
    
    # Act
    result = use_case.execute(request)
    
    # Assert
    assert result.user.email == "test@example.com"
    assert result.user.name == "Test Business"
    assert result.user.role == "business_owner"
    assert result.access_token is not None
    assert result.refresh_token is not None
```

### Integration Tests (Infrastructure & Presentation)

```python
# tests/integration/modules/auth/test_auth_api.py
from fastapi.testclient import TestClient

def test_register_business_endpoint(client: TestClient, db_session):
    """Test business registration API endpoint."""
    # Arrange
    payload = {
        "email": "test@example.com",
        "name": "Test Business",
        "business_type": "barbershop",
        "oauth_provider": "google",
        "oauth_token": "valid_token",
        "phone": "3001234567",
        "city": "Bogotá",
        "department": "Cundinamarca"
    }
    
    # Act
    response = client.post("/api/v1/auth/register/business", json=payload)
    
    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["email"] == "test@example.com"
    assert "access_token" in data["tokens"]
    assert "refresh_token" in data["tokens"]
```

## Benefits of This Architecture

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap implementations (e.g., different database)
4. **Scalability**: Modules can be extracted to microservices
5. **Team Collaboration**: Teams can work on different modules independently

## Next Steps

1. Implement authentication module following this structure
2. Create additional modules (inventory, orders, etc.)
3. Add event-driven communication between modules
4. Implement comprehensive testing
