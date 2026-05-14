# Authentication Module - Implementation Tasks

## Overview
Implementation tasks for the Authentication Module based on `auth-design.md` specification.

---

## Phase 1: Domain Layer

### Task 1.1: Create Value Objects
**Description**: Implement Email and Phone value objects with validation
**Files**:
- `app/modules/auth/domain/value_objects/email.py`
- `app/modules/auth/domain/value_objects/phone.py`

**Acceptance Criteria**:
- Email value object validates email format
- Phone value object validates 10-digit Colombian phone format
- Both are immutable (frozen dataclasses)
- Raise ValueError for invalid inputs

---

### Task 1.2: Create User Entity
**Description**: Implement User domain entity
**Files**:
- `app/modules/auth/domain/entities/user.py`

**Acceptance Criteria**:
- User entity with all required fields
- Methods: `is_business_owner()`, `is_customer()`, `is_admin()`, `can_access_tenant()`, `has_password()`
- Uses UserRole enum from shared constants
- No database dependencies

---

### Task 1.3: Create Tenant Entity
**Description**: Implement Tenant domain entity
**Files**:
- `app/modules/auth/domain/entities/tenant.py`

**Acceptance Criteria**:
- Tenant entity with all required fields
- Methods: `should_have_address()`, `is_service_business()`
- Uses BusinessType enum from shared constants
- No database dependencies

---

### Task 1.4: Create Repository Interfaces
**Description**: Define repository interfaces for data access
**Files**:
- `app/modules/auth/domain/repositories/user_repository.py`
- `app/modules/auth/domain/repositories/tenant_repository.py`
- `app/modules/auth/domain/repositories/oauth_account_repository.py`

**Acceptance Criteria**:
- Abstract base classes with @abstractmethod decorators
- UserRepository: `get_by_id()`, `get_by_email()`, `create()`, `update()`
- TenantRepository: `get_by_id()`, `get_by_slug()`, `create()`, `update()`
- OAuthAccountRepository: `get_by_user_and_provider()`, `create()`, `update()`

---

## Phase 2: Infrastructure Layer - Database

### Task 2.1: Create SQLAlchemy Models
**Description**: Implement database models
**Files**:
- `app/modules/auth/infrastructure/persistence/models.py`

**Acceptance Criteria**:
- UserModel with all fields from design
- TenantModel with all fields from design
- OAuthAccountModel with all fields from design
- RefreshTokenModel with all fields from design
- Proper relationships between models
- Indexes on frequently queried fields

---

### Task 2.2: Implement Repository Implementations
**Description**: Implement concrete repository classes
**Files**:
- `app/modules/auth/infrastructure/persistence/repositories/user_repository_impl.py`
- `app/modules/auth/infrastructure/persistence/repositories/tenant_repository_impl.py`
- `app/modules/auth/infrastructure/persistence/repositories/oauth_account_repository_impl.py`

**Acceptance Criteria**:
- Implement all methods from repository interfaces
- Convert between SQLAlchemy models and domain entities
- Handle database sessions properly
- Raise appropriate exceptions for errors

---

### Task 2.3: Create Database Migrations
**Description**: Create Alembic migrations for all tables
**Files**:
- `app/migrations/versions/001_create_users_table.py`
- `app/migrations/versions/002_create_tenants_table.py`
- `app/migrations/versions/003_create_oauth_accounts_table.py`
- `app/migrations/versions/004_create_refresh_tokens_table.py`

**Acceptance Criteria**:
- Migrations create all tables with correct schema
- Indexes are created
- Foreign key constraints are set
- Migrations are reversible (downgrade works)

---

## Phase 3: Infrastructure Layer - OAuth

### Task 3.1: Implement Google OAuth Service
**Description**: Implement Google OAuth integration
**Files**:
- `app/modules/auth/infrastructure/external/google_oauth.py`

**Acceptance Criteria**:
- Generate authorization URL
- Exchange authorization code for access token
- Retrieve user info from Google API
- Handle errors gracefully
- Return OAuthUserData object

---

### Task 3.2: Implement Microsoft OAuth Service
**Description**: Implement Microsoft OAuth integration
**Files**:
- `app/modules/auth/infrastructure/external/microsoft_oauth.py`

**Acceptance Criteria**:
- Generate authorization URL
- Exchange authorization code for access token
- Retrieve user info from Microsoft API
- Handle errors gracefully
- Return OAuthUserData object

---

### Task 3.3: Implement LinkedIn OAuth Service
**Description**: Implement LinkedIn OAuth integration
**Files**:
- `app/modules/auth/infrastructure/external/linkedin_oauth.py`

**Acceptance Criteria**:
- Generate authorization URL
- Exchange authorization code for access token
- Retrieve user info from LinkedIn API
- Handle errors gracefully
- Return OAuthUserData object

---

### Task 3.4: Implement OAuth Service Factory
**Description**: Create factory to get OAuth service by provider
**Files**:
- `app/modules/auth/infrastructure/external/oauth_factory.py`

**Acceptance Criteria**:
- Factory function that returns appropriate OAuth service
- Support for google, microsoft, linkedin providers
- Raise error for unsupported providers

---

## Phase 4: Infrastructure Layer - Cache

### Task 4.1: Implement Redis Token Store
**Description**: Implement token blacklisting with Redis
**Files**:
- `app/modules/auth/infrastructure/cache/redis_token_store.py`

**Acceptance Criteria**:
- Add token to blacklist with TTL
- Check if token is blacklisted
- Remove token from blacklist
- Handle Redis connection errors

---

## Phase 5: Application Layer - Services

### Task 5.1: Implement Token Service
**Description**: Create service for JWT token management
**Files**:
- `app/modules/auth/application/services/token_service.py`

**Acceptance Criteria**:
- `create_access_token()` - generates 15-minute JWT
- `create_refresh_token()` - generates 30-day JWT
- `create_temp_token()` - generates 10-minute temp token for OAuth
- `verify_token()` - validates and decodes JWT
- `verify_temp_token()` - validates temp token and extracts OAuth data
- `revoke_token()` - adds token to blacklist
- Include user_id, email, role, tenant_id in token payload

---

### Task 5.2: Implement OAuth Service
**Description**: Create OAuth service abstraction
**Files**:
- `app/modules/auth/application/services/oauth_service.py`

**Acceptance Criteria**:
- `get_authorization_url()` - returns OAuth URL for provider
- `handle_callback()` - exchanges code for user info
- Uses OAuth factory to get provider-specific service
- Returns standardized OAuthUserData

---

## Phase 6: Application Layer - Use Cases

### Task 6.1: Implement RegisterBusiness Use Case
**Description**: Implement business registration logic
**Files**:
- `app/modules/auth/application/use_cases/register_business.py`

**Acceptance Criteria**:
- Validate temp_token and extract OAuth data
- Check if email already exists (raise ConflictError)
- Validate password strength
- Validate phone format (10 digits)
- Validate department is valid Colombian department
- Create tenant with generated slug
- Create user with hashed password
- Link OAuth account
- Generate access and refresh tokens
- Return RegisterBusinessResponse

---

### Task 6.2: Implement InitiateOAuthLogin Use Case
**Description**: Implement OAuth login initiation
**Files**:
- `app/modules/auth/application/use_cases/initiate_oauth_login.py`

**Acceptance Criteria**:
- Generate state parameter for CSRF protection
- Store state in Redis with 10-minute TTL
- Get authorization URL from OAuth service
- Return authorization URL

---

### Task 6.3: Implement HandleOAuthCallback Use Case
**Description**: Implement OAuth callback handling
**Files**:
- `app/modules/auth/application/use_cases/handle_oauth_callback.py`

**Acceptance Criteria**:
- Validate state parameter (CSRF protection)
- Exchange code for user info via OAuth service
- Check if user exists by email
- If user exists: generate tokens and return
- If new user: generate temp_token with OAuth data
- Return appropriate response

---

### Task 6.4: Implement RefreshToken Use Case
**Description**: Implement token refresh logic
**Files**:
- `app/modules/auth/application/use_cases/refresh_token.py`

**Acceptance Criteria**:
- Verify refresh token
- Check if token is blacklisted
- Check if token exists in database and not revoked
- Generate new access token
- Generate new refresh token (rotation)
- Revoke old refresh token
- Return new tokens

---

### Task 6.5: Implement Logout Use Case
**Description**: Implement logout logic
**Files**:
- `app/modules/auth/application/use_cases/logout.py`

**Acceptance Criteria**:
- Add access token to blacklist
- Revoke refresh token in database
- Add refresh token to blacklist
- Return success response

---

## Phase 7: Presentation Layer - Schemas

### Task 7.1: Create Request/Response Schemas
**Description**: Create Pydantic schemas for API
**Files**:
- `app/modules/auth/presentation/schemas/auth.py`
- `app/modules/auth/presentation/schemas/user.py`

**Acceptance Criteria**:
- RegisterBusinessRequest schema with all validations
- RegisterBusinessResponse schema
- OAuthCallbackResponse schema
- TokenResponse schema
- UserResponse schema
- All schemas have examples in Config

---

## Phase 8: Presentation Layer - API Routes

### Task 8.1: Implement OAuth Login Endpoint
**Description**: Create endpoint to initiate OAuth login
**Files**:
- `app/modules/auth/presentation/api/v1/auth.py`

**Endpoint**: `GET /api/v1/auth/{provider}/login`

**Acceptance Criteria**:
- Accepts provider parameter (google, microsoft, linkedin)
- Accepts user_type query parameter (business, customer)
- Returns 302 redirect to OAuth provider
- Handles invalid provider error

---

### Task 8.2: Implement OAuth Callback Endpoint
**Description**: Create endpoint to handle OAuth callback
**Files**:
- `app/modules/auth/presentation/api/v1/auth.py`

**Endpoint**: `GET /api/v1/auth/{provider}/callback`

**Acceptance Criteria**:
- Accepts code and state query parameters
- Validates state (CSRF protection)
- Returns OAuth data + temp_token for new users
- Returns full tokens for existing users
- Handles OAuth errors

---

### Task 8.3: Implement Register Business Endpoint
**Description**: Create endpoint for business registration
**Files**:
- `app/modules/auth/presentation/api/v1/auth.py`

**Endpoint**: `POST /api/v1/auth/register/business`

**Acceptance Criteria**:
- Validates all request fields
- Returns 201 Created on success
- Returns user, tenant, and tokens
- Returns 400 for invalid temp_token
- Returns 409 for duplicate email
- Returns 422 for validation errors

---

### Task 8.4: Implement Refresh Token Endpoint
**Description**: Create endpoint to refresh access token
**Files**:
- `app/modules/auth/presentation/api/v1/auth.py`

**Endpoint**: `POST /api/v1/auth/refresh`

**Acceptance Criteria**:
- Accepts refresh_token in body
- Returns new access and refresh tokens
- Returns 401 for invalid/expired token

---

### Task 8.5: Implement Logout Endpoint
**Description**: Create endpoint for logout
**Files**:
- `app/modules/auth/presentation/api/v1/auth.py`

**Endpoint**: `POST /api/v1/auth/logout`

**Acceptance Criteria**:
- Requires authentication (Bearer token)
- Accepts refresh_token in body
- Revokes both tokens
- Returns success message

---

### Task 8.6: Implement Get Current User Endpoint
**Description**: Create endpoint to get authenticated user info
**Files**:
- `app/modules/auth/presentation/api/v1/auth.py`

**Endpoint**: `GET /api/v1/auth/me`

**Acceptance Criteria**:
- Requires authentication (Bearer token)
- Returns current user information
- Returns 401 for invalid token

---

## Phase 9: Presentation Layer - Dependencies

### Task 9.1: Create Authentication Dependencies
**Description**: Create FastAPI dependencies for authentication
**Files**:
- `app/modules/auth/presentation/dependencies.py`

**Acceptance Criteria**:
- `get_current_user()` - extracts and validates JWT, returns User
- `get_current_active_user()` - ensures user is active
- `require_role()` - checks user has required role
- Handle token validation errors

---

## Phase 10: Main Application Integration

### Task 10.1: Integrate Auth Router
**Description**: Add auth router to main FastAPI application
**Files**:
- `app/main.py`

**Acceptance Criteria**:
- Create FastAPI application
- Add CORS middleware
- Add exception handlers
- Include auth router with /api/v1 prefix
- Add health check endpoint

---

### Task 10.2: Create Exception Handlers
**Description**: Add global exception handlers
**Files**:
- `app/core/middleware.py`

**Acceptance Criteria**:
- Handle AppException and return proper JSON response
- Handle validation errors
- Handle 404 errors
- Handle 500 errors
- Log errors appropriately

---

## Phase 11: Testing

### Task 11.1: Write Domain Layer Tests
**Description**: Unit tests for domain entities and value objects
**Files**:
- `tests/unit/modules/auth/domain/test_user_entity.py`
- `tests/unit/modules/auth/domain/test_tenant_entity.py`
- `tests/unit/modules/auth/domain/test_email_value_object.py`
- `tests/unit/modules/auth/domain/test_phone_value_object.py`

**Acceptance Criteria**:
- Test entity methods
- Test value object validation
- Test edge cases
- 100% code coverage for domain layer

---

### Task 11.2: Write Use Case Tests
**Description**: Unit tests for use cases
**Files**:
- `tests/unit/modules/auth/application/test_register_business.py`
- `tests/unit/modules/auth/application/test_handle_oauth_callback.py`
- `tests/unit/modules/auth/application/test_refresh_token.py`
- `tests/unit/modules/auth/application/test_logout.py`

**Acceptance Criteria**:
- Use mocks for repositories and services
- Test success scenarios
- Test error scenarios
- Test validation logic

---

### Task 11.3: Write API Integration Tests
**Description**: Integration tests for API endpoints
**Files**:
- `tests/integration/modules/auth/test_auth_api.py`

**Acceptance Criteria**:
- Test all endpoints with real database (test DB)
- Test OAuth flow (mocked OAuth providers)
- Test token generation and validation
- Test error responses
- Use TestClient from FastAPI

---

### Task 11.4: Write OAuth Integration Tests
**Description**: Integration tests for OAuth services
**Files**:
- `tests/integration/modules/auth/test_oauth_services.py`

**Acceptance Criteria**:
- Mock external OAuth API calls
- Test authorization URL generation
- Test token exchange
- Test user info retrieval
- Test error handling

---

## Phase 12: Documentation

### Task 12.1: Create API Documentation
**Description**: Document API endpoints with examples
**Files**:
- Update `docs/api/api-overview.md`
- Add OpenAPI examples to endpoints

**Acceptance Criteria**:
- All endpoints documented
- Request/response examples provided
- Error responses documented
- Authentication requirements specified

---

### Task 12.2: Create Setup Instructions
**Description**: Document how to set up OAuth providers
**Files**:
- `docs/development/oauth-setup.md`

**Acceptance Criteria**:
- Step-by-step guide for Google OAuth setup
- Step-by-step guide for Microsoft OAuth setup
- Step-by-step guide for LinkedIn OAuth setup
- Environment variable configuration

---

## Phase 13: Deployment Preparation

### Task 13.1: Create Docker Configuration
**Description**: Add authentication module to Docker setup
**Files**:
- Update `docker-compose.yml`

**Acceptance Criteria**:
- Backend service configured
- PostgreSQL service configured
- Redis service configured
- Environment variables passed correctly

---

### Task 13.2: Create Alembic Configuration
**Description**: Set up Alembic for database migrations
**Files**:
- `backend/alembic.ini`
- `backend/app/migrations/env.py`

**Acceptance Criteria**:
- Alembic configured to use app database URL
- Can run migrations: `alembic upgrade head`
- Can rollback migrations: `alembic downgrade -1`

---

## Dependencies Between Tasks

```
Phase 1 (Domain) → Phase 2 (Infrastructure DB) → Phase 5 (Services) → Phase 6 (Use Cases) → Phase 8 (API)
                ↓
Phase 3 (OAuth) → Phase 5 (Services)
                ↓
Phase 4 (Cache) → Phase 5 (Services)
                ↓
Phase 7 (Schemas) → Phase 8 (API)
                ↓
Phase 9 (Dependencies) → Phase 8 (API)
                ↓
Phase 10 (Integration)
                ↓
Phase 11 (Testing)
                ↓
Phase 12 (Documentation)
                ↓
Phase 13 (Deployment)
```

## Estimated Timeline

- **Phase 1**: 4 hours
- **Phase 2**: 6 hours
- **Phase 3**: 6 hours
- **Phase 4**: 2 hours
- **Phase 5**: 4 hours
- **Phase 6**: 8 hours
- **Phase 7**: 3 hours
- **Phase 8**: 6 hours
- **Phase 9**: 2 hours
- **Phase 10**: 2 hours
- **Phase 11**: 8 hours
- **Phase 12**: 2 hours
- **Phase 13**: 2 hours

**Total**: ~55 hours (approximately 7 working days)

---

**Status**: Ready for Implementation
**Next Step**: Begin Phase 1 - Domain Layer
