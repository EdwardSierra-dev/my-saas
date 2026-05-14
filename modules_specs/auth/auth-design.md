# Authentication Module - Design Specification

## Overview

This document provides the technical design for the Authentication Module, implementing the requirements specified in `auth-rqs-en.md`. The design follows Clean Architecture principles and integrates OAuth 2.0 authentication with JWT token management.

## Architecture

### Module Structure (Clean Architecture)

```
modules/auth/
├── domain/                     # Business logic and entities
│   ├── entities/
│   │   ├── user.py            # User entity
│   │   └── tenant.py          # Tenant (business) entity
│   ├── value_objects/
│   │   ├── email.py           # Email value object with validation
│   │   └── phone.py           # Phone value object with Colombian validation
│   └── repositories/
│       ├── user_repository.py      # User repository interface
│       ├── tenant_repository.py    # Tenant repository interface
│       └── oauth_account_repository.py
│
├── application/                # Use cases and services
│   ├── use_cases/
│   │   ├── register_business.py   # Business registration use case
│   │   ├── login_with_oauth.py    # OAuth login use case
│   │   ├── refresh_token.py       # Token refresh use case
│   │   └── logout.py              # Logout use case
│   └── services/
│       ├── oauth_service.py       # OAuth provider abstraction
│       └── token_service.py       # JWT token management
│
├── infrastructure/             # External dependencies
│   ├── persistence/
│   │   ├── models.py              # SQLAlchemy models
│   │   └── repositories/          # Repository implementations
│   ├── external/
│   │   ├── google_oauth.py        # Google OAuth implementation
│   │   ├── microsoft_oauth.py     # Microsoft OAuth implementation
│   │   └── linkedin_oauth.py      # LinkedIn OAuth implementation
│   └── cache/
│       └── redis_token_store.py   # Redis token blacklist
│
└── presentation/               # API layer
    ├── api/
    │   └── v1/
    │       └── auth.py            # Authentication endpoints
    ├── schemas/
    │   ├── auth.py                # Auth request/response schemas
    │   └── user.py                # User schemas
    └── dependencies.py            # FastAPI dependencies
```

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    tenant_id INTEGER REFERENCES tenants(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT check_role CHECK (role IN ('super_admin', 'business_owner', 'business_staff', 'customer'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_role ON users(role);
```

#### tenants
```sql
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    department VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Colombia',
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    currency VARCHAR(3) DEFAULT 'COP',
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT check_business_type CHECK (business_type IN (
        'barbershop', 'spa', 'local_store', 'restaurant', 
        'pharmacy', 'independent_worker', 'other'
    ))
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_business_type ON tenants(business_type);
```

#### oauth_accounts
```sql
CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    profile_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider ON oauth_accounts(provider);
```

#### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_expires_at CHECK (expires_at > created_at)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

## API Endpoints

### Base URL
`/api/v1/auth`

### Endpoints

#### 1. Initiate OAuth Login
```
GET /auth/{provider}/login
```

**Parameters:**
- `provider`: `google` | `microsoft` | `linkedin`
- `user_type`: `business` | `customer` (query parameter)

**Response:** `302 Redirect`
Redirects to OAuth provider's authorization page.

**Example:**
```
GET /api/v1/auth/google/login?user_type=business
```

---

#### 2. OAuth Callback
```
GET /auth/{provider}/callback
```

**Parameters:**
- `provider`: `google` | `microsoft` | `linkedin`
- `code`: Authorization code (query parameter)
- `state`: State parameter for CSRF protection (query parameter)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "oauth_data": {
      "provider": "google",
      "provider_user_id": "123456789",
      "email": "john@example.com",
      "name": "John Doe",
      "picture": "https://..."
    },
    "temp_token": "temporary_token_for_registration"
  }
}
```

**Note:** If user exists, returns full authentication tokens. If new user, returns temp token for registration completion.

---

#### 3. Register Business
```
POST /auth/register/business
```

**Request Body:**
```json
{
  "temp_token": "temporary_token_from_oauth",
  "name": "John's Barbershop",
  "business_type": "barbershop",
  "city": "Bogotá",
  "department": "Cundinamarca",
  "phone": "3001234567",
  "address": "Calle 123 #45-67",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!"
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `business_type`: Must be one of: `barbershop`, `spa`, `local_store`, `restaurant`, `pharmacy`, `independent_worker`
- `city`: Required, 2-100 characters
- `department`: Must be valid Colombian department
- `phone`: Must match regex `^\d{10}$` (10 digits)
- `address`: Optional, max 500 characters
- `password`: 
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- `confirm_password`: Must match `password`

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John's Barbershop",
      "role": "business_owner",
      "phone": "3001234567",
      "tenant_id": 1,
      "created_at": "2024-01-15T10:30:00Z"
    },
    "tenant": {
      "id": 1,
      "name": "John's Barbershop",
      "business_type": "barbershop",
      "slug": "johns-barbershop",
      "city": "Bogotá",
      "department": "Cundinamarca"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "expires_in": 900
    }
  },
  "message": "Registration completed successfully"
}
```

**Error Responses:**

`400 Bad Request` - Invalid temp_token
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired temporary token"
  }
}
```

`409 Conflict` - Email already registered
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "Email already registered"
  }
}
```

`422 Unprocessable Entity` - Validation error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "phone": "Phone must be 10 digits",
      "password": "Password must contain at least one uppercase letter"
    }
  }
}
```

---

#### 4. Refresh Token
```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900
  }
}
```

---

#### 5. Logout
```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### 6. Get Current User
```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John's Barbershop",
    "role": "business_owner",
    "phone": "3001234567",
    "tenant_id": 1,
    "is_verified": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## OAuth Flow

### Business Registration Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │  OAuth   │
│          │                │          │                │ Provider │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. Click "Google"         │                           │
     │ GET /auth/google/login    │                           │
     ├──────────────────────────▶│                           │
     │                           │                           │
     │ 2. Redirect to OAuth      │                           │
     │◀──────────────────────────┤                           │
     │                           │                           │
     │ 3. User authenticates     │                           │
     ├───────────────────────────────────────────────────────▶
     │                           │                           │
     │ 4. Authorization code     │                           │
     │◀───────────────────────────────────────────────────────┤
     │                           │                           │
     │ 5. GET /auth/google/callback?code=xxx                 │
     ├──────────────────────────▶│                           │
     │                           │                           │
     │                           │ 6. Exchange code for token│
     │                           ├───────────────────────────▶
     │                           │                           │
     │                           │ 7. User info              │
     │                           │◀───────────────────────────┤
     │                           │                           │
     │                           │ 8. Check if user exists   │
     │                           │                           │
     │ 9. Return oauth_data      │                           │
     │    + temp_token           │                           │
     │◀──────────────────────────┤                           │
     │                           │                           │
     │ 10. Show registration form│                           │
     │     (pre-filled)          │                           │
     │                           │                           │
     │ 11. POST /auth/register/business                      │
     │     (with temp_token)     │                           │
     ├──────────────────────────▶│                           │
     │                           │                           │
     │                           │ 12. Validate temp_token   │
     │                           │ 13. Create tenant         │
     │                           │ 14. Create user           │
     │                           │ 15. Link OAuth account    │
     │                           │ 16. Generate JWT tokens   │
     │                           │                           │
     │ 17. Return user + tokens  │                           │
     │◀──────────────────────────┤                           │
     │                           │                           │
```

## Domain Layer

### Entities

#### User Entity
```python
@dataclass
class User:
    id: Optional[int]
    email: str
    name: str
    role: UserRole
    phone: Optional[str]
    password_hash: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    is_verified: bool
    tenant_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    def is_business_owner(self) -> bool
    def can_access_tenant(self, tenant_id: int) -> bool
    def has_password(self) -> bool
```

#### Tenant Entity
```python
@dataclass
class Tenant:
    id: Optional[int]
    name: str
    business_type: BusinessType
    slug: str
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    department: Optional[str]
    country: str
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    def should_have_address(self) -> bool
```

### Value Objects

#### Email
```python
@dataclass(frozen=True)
class Email:
    value: str
    
    def __post_init__(self):
        # Validate email format
        if not self._is_valid(self.value):
            raise ValueError(f"Invalid email: {self.value}")
    
    @staticmethod
    def _is_valid(email: str) -> bool:
        # Email validation logic
```

#### Phone
```python
@dataclass(frozen=True)
class Phone:
    value: str
    
    def __post_init__(self):
        # Validate Colombian phone format (10 digits)
        if not re.match(r'^\d{10}$', self.value):
            raise ValueError(f"Invalid phone: {self.value}")
```

### Repository Interfaces

```python
class UserRepository(ABC):
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]
    
    @abstractmethod
    def create(self, user: User) -> User
    
    @abstractmethod
    def update(self, user: User) -> User

class TenantRepository(ABC):
    @abstractmethod
    def get_by_id(self, tenant_id: int) -> Optional[Tenant]
    
    @abstractmethod
    def get_by_slug(self, slug: str) -> Optional[Tenant]
    
    @abstractmethod
    def create(self, tenant: Tenant) -> Tenant
```

## Application Layer

### Use Cases

#### RegisterBusiness
```python
class RegisterBusiness:
    def __init__(
        self,
        user_repository: UserRepository,
        tenant_repository: TenantRepository,
        oauth_account_repository: OAuthAccountRepository,
        token_service: TokenService
    ):
        ...
    
    def execute(self, request: RegisterBusinessRequest) -> RegisterBusinessResponse:
        # 1. Validate temp_token and extract OAuth data
        # 2. Validate email doesn't exist
        # 3. Validate password strength
        # 4. Create tenant (business)
        # 5. Create user
        # 6. Link OAuth account
        # 7. Generate JWT tokens
        # 8. Return response
```

### Services

#### OAuthService
```python
class OAuthService(ABC):
    @abstractmethod
    def get_authorization_url(self, provider: str, state: str) -> str
    
    @abstractmethod
    def exchange_code_for_token(self, provider: str, code: str) -> OAuthTokens
    
    @abstractmethod
    def get_user_info(self, provider: str, access_token: str) -> OAuthUserData
```

#### TokenService
```python
class TokenService:
    def create_access_token(self, user: User) -> str
    
    def create_refresh_token(self, user: User) -> str
    
    def create_temp_token(self, oauth_data: OAuthUserData) -> str
    
    def verify_temp_token(self, token: str) -> Optional[OAuthUserData]
    
    def revoke_token(self, token: str) -> None
```

## Validation Rules

### Password Validation
```python
def validate_password(password: str) -> bool:
    """
    Password must:
    - Be at least 8 characters long
    - Contain at least one uppercase letter
    - Contain at least one lowercase letter
    - Contain at least one digit
    - Contain at least one special character (!@#$%^&*(),.?":{}|<>)
    """
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True
```

### Phone Validation (Colombian)
```python
def validate_colombian_phone(phone: str) -> bool:
    """
    Colombian phone must be exactly 10 digits.
    Format: 3001234567
    """
    return bool(re.match(r'^\d{10}$', phone))
```

### Business Type Validation
```python
VALID_BUSINESS_TYPES = [
    'barbershop',
    'spa',
    'local_store',
    'restaurant',
    'pharmacy',
    'independent_worker'
]
```

### Department Validation
```python
COLOMBIAN_DEPARTMENTS = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar',
    'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca',
    'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía',
    'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta',
    'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
    'Risaralda', 'San Andrés y Providencia', 'Santander',
    'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
]
```

## Security Considerations

### JWT Tokens
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 30 days expiration, stored in database
- **Temp Token**: 10 minutes expiration (for OAuth flow)
- All tokens include: user_id, email, role, tenant_id

### Token Blacklisting
- Use Redis for token blacklisting on logout
- Key format: `blacklist:token:{token_hash}`
- TTL: Same as token expiration

### Password Storage
- Use bcrypt with cost factor 12
- Never store plain text passwords
- Password is optional (OAuth-only users)

### Rate Limiting
- Login attempts: 5 per 15 minutes per IP
- Registration: 3 per hour per IP
- Token refresh: 10 per minute per user

### CSRF Protection
- Use state parameter in OAuth flow
- Validate state on callback

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "field": "error description"
    }
  }
}
```

### Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `AUTH_004`: Refresh token expired
- `AUTH_005`: User not found
- `AUTH_006`: Email already registered
- `AUTH_007`: OAuth provider error
- `AUTH_008`: Invalid temp token
- `VAL_001`: Missing required field
- `VAL_002`: Invalid field format
- `VAL_003`: Password too weak
- `VAL_004`: Phone format invalid

## Testing Strategy

### Unit Tests
- Domain entities business logic
- Value object validation
- Use case logic
- Service methods

### Integration Tests
- API endpoints
- Database operations
- OAuth flow
- Token generation/verification

### Test Cases

#### Registration
1. ✅ Successful business registration with valid data
2. ✅ Registration fails with duplicate email
3. ✅ Registration fails with invalid phone format
4. ✅ Registration fails with weak password
5. ✅ Registration fails with invalid department
6. ✅ Registration fails with expired temp_token
7. ✅ Registration fails with password mismatch

#### OAuth
1. ✅ Successful OAuth authorization URL generation
2. ✅ Successful OAuth callback with valid code
3. ✅ OAuth callback fails with invalid code
4. ✅ OAuth callback fails with invalid state

#### Tokens
1. ✅ Access token generation and verification
2. ✅ Refresh token generation and verification
3. ✅ Token refresh with valid refresh token
4. ✅ Token refresh fails with expired token
5. ✅ Token refresh fails with revoked token

## Implementation Checklist

### Phase 1: Domain Layer
- [ ] Create User entity
- [ ] Create Tenant entity
- [ ] Create Email value object
- [ ] Create Phone value object
- [ ] Create UserRepository interface
- [ ] Create TenantRepository interface
- [ ] Create OAuthAccountRepository interface

### Phase 2: Infrastructure Layer
- [ ] Create SQLAlchemy models (User, Tenant, OAuthAccount, RefreshToken)
- [ ] Implement UserRepository
- [ ] Implement TenantRepository
- [ ] Implement OAuthAccountRepository
- [ ] Implement GoogleOAuthService
- [ ] Implement MicrosoftOAuthService
- [ ] Implement LinkedInOAuthService
- [ ] Implement RedisTokenStore

### Phase 3: Application Layer
- [ ] Create TokenService
- [ ] Create OAuthService
- [ ] Implement RegisterBusiness use case
- [ ] Implement LoginWithOAuth use case
- [ ] Implement RefreshToken use case
- [ ] Implement Logout use case

### Phase 4: Presentation Layer
- [ ] Create Pydantic schemas (requests/responses)
- [ ] Implement OAuth login endpoint
- [ ] Implement OAuth callback endpoint
- [ ] Implement register business endpoint
- [ ] Implement refresh token endpoint
- [ ] Implement logout endpoint
- [ ] Implement get current user endpoint
- [ ] Create authentication dependencies

### Phase 5: Testing
- [ ] Write unit tests for domain entities
- [ ] Write unit tests for use cases
- [ ] Write integration tests for API endpoints
- [ ] Write integration tests for OAuth flow
- [ ] Write tests for token management

### Phase 6: Database Migrations
- [ ] Create Alembic migration for users table
- [ ] Create Alembic migration for tenants table
- [ ] Create Alembic migration for oauth_accounts table
- [ ] Create Alembic migration for refresh_tokens table

## Dependencies

### Python Packages
- `fastapi`: Web framework
- `sqlalchemy`: ORM
- `pydantic`: Data validation
- `python-jose`: JWT handling
- `passlib`: Password hashing
- `httpx`: HTTP client for OAuth
- `redis`: Token blacklisting
- `alembic`: Database migrations

### External Services
- Google OAuth API
- Microsoft OAuth API
- LinkedIn OAuth API
- PostgreSQL database
- Redis cache

## Configuration

### Environment Variables Required
```env
# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# OAuth - Microsoft
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_REDIRECT_URI=http://localhost:8000/api/v1/auth/microsoft/callback

# OAuth - LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:8000/api/v1/auth/linkedin/callback

# JWT
JWT_SECRET_KEY=your-super-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30
```

## Next Steps

1. Review and approve this design specification
2. Create detailed tasks.md file
3. Begin implementation starting with Domain Layer
4. Set up OAuth applications with providers
5. Create database migrations
6. Implement and test each layer sequentially

---

**Document Version**: 1.0
**Last Updated**: 2024
**Status**: Ready for Implementation
