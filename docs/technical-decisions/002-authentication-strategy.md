# ADR 002: Authentication Strategy

## Status
Accepted

## Context

The platform requires a secure, user-friendly authentication system that:
- Supports multiple user types (Business owners, Customers, Admins)
- Provides social login (Google, Microsoft, LinkedIn)
- Works across web and mobile applications
- Scales efficiently
- Maintains security best practices
- Provides good UX with minimal friction

## Decision

### OAuth 2.0 + JWT Hybrid Approach

We will implement a hybrid authentication strategy:

1. **OAuth 2.0** for social login (Google, Microsoft, LinkedIn)
2. **JWT (JSON Web Tokens)** for API authentication
3. **Refresh Token Rotation** for enhanced security
4. **Role-Based Access Control (RBAC)** for authorization

### Authentication Flow

#### Initial Registration/Login

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │  OAuth   │
│          │                │          │                │ Provider │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. Click "Login with X"   │                           │
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
     │ 5. Send code to backend   │                           │
     ├──────────────────────────▶│                           │
     │                           │                           │
     │                           │ 6. Exchange code for token│
     │                           ├───────────────────────────▶
     │                           │                           │
     │                           │ 7. User info              │
     │                           │◀───────────────────────────┤
     │                           │                           │
     │                           │ 8. Create/update user     │
     │                           │    in database            │
     │                           │                           │
     │ 9. JWT tokens             │                           │
     │   (access + refresh)      │                           │
     │◀──────────────────────────┤                           │
     │                           │                           │
```

#### Subsequent API Requests

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  Client  │                │  Backend │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. API request            │                           │
     │    + JWT in header        │                           │
     ├──────────────────────────▶│                           │
     │                           │                           │
     │                           │ 2. Verify JWT signature   │
     │                           │    and expiration         │
     │                           │                           │
     │                           │ 3. Extract user_id        │
     │                           │    and permissions        │
     │                           │                           │
     │                           │ 4. Query data             │
     │                           ├───────────────────────────▶
     │                           │                           │
     │                           │ 5. Results                │
     │                           │◀───────────────────────────┤
     │                           │                           │
     │ 6. Response               │                           │
     │◀──────────────────────────┤                           │
     │                           │                           │
```

### Token Structure

#### Access Token (JWT)
- **Purpose**: Authenticate API requests
- **Lifetime**: 15 minutes
- **Storage**: Memory (web), Secure storage (mobile)
- **Payload**:
  ```json
  {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "business_owner",
    "tenant_id": "business_123",
    "permissions": ["read:inventory", "write:inventory"],
    "exp": 1234567890,
    "iat": 1234567000,
    "jti": "unique_token_id"
  }
  ```

#### Refresh Token
- **Purpose**: Obtain new access tokens
- **Lifetime**: 30 days
- **Storage**: HttpOnly cookie (web), Secure storage (mobile)
- **Rotation**: New refresh token issued with each use
- **Database**: Stored hash in database for revocation

### Security Measures

#### Token Security
1. **Short-lived access tokens** (15 minutes)
2. **Refresh token rotation** (new token on each refresh)
3. **Token blacklisting** (Redis) for logout
4. **Secure storage**:
   - Web: HttpOnly cookies for refresh, memory for access
   - Mobile: Expo SecureStore / Keychain

#### Password Security (if implemented later)
1. **bcrypt** for password hashing (cost factor: 12)
2. **Password requirements**:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 number
   - At least 1 special character
3. **Password reset** via email with time-limited tokens

#### API Security
1. **Rate limiting** (Redis):
   - Login attempts: 5 per 15 minutes per IP
   - API requests: 100 per minute per user
2. **CORS** configuration for allowed origins
3. **HTTPS only** in production
4. **CSRF protection** for state-changing operations

### Authorization (RBAC)

#### User Roles
```python
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"      # Platform administrators
    BUSINESS_OWNER = "business_owner" # Business account owners
    BUSINESS_STAFF = "business_staff" # Business employees
    CUSTOMER = "customer"             # End customers
```

#### Permission Model
```python
# Example permissions
permissions = {
    "super_admin": ["*"],  # All permissions
    "business_owner": [
        "read:business_profile",
        "write:business_profile",
        "read:inventory",
        "write:inventory",
        "read:orders",
        "write:orders",
        "read:analytics",
        "manage:staff"
    ],
    "business_staff": [
        "read:business_profile",
        "read:inventory",
        "write:inventory",
        "read:orders",
        "write:orders"
    ],
    "customer": [
        "read:business_profile",
        "read:inventory",
        "write:orders",
        "read:own_orders"
    ]
}
```

#### Permission Checking
```python
# Decorator for route protection
@router.get("/inventory")
@require_permissions(["read:inventory"])
async def get_inventory(current_user: User = Depends(get_current_user)):
    # Only users with read:inventory permission can access
    pass
```

### Multi-Tenancy

#### Tenant Isolation
- Each business is a separate tenant
- `tenant_id` in JWT payload
- All database queries filtered by `tenant_id`
- Row-Level Security (RLS) in PostgreSQL

#### Tenant Context
```python
# Automatic tenant filtering
@router.get("/products")
async def get_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Automatically filtered by current_user.tenant_id
    products = db.query(Product).filter(
        Product.tenant_id == current_user.tenant_id
    ).all()
    return products
```

### OAuth Provider Configuration

#### Google OAuth
- **Scopes**: `openid`, `email`, `profile`
- **Redirect URI**: `https://api.example.com/auth/google/callback`
- **User Info**: Email, name, profile picture

#### Microsoft OAuth
- **Scopes**: `openid`, `email`, `profile`
- **Redirect URI**: `https://api.example.com/auth/microsoft/callback`
- **User Info**: Email, name, profile picture

#### LinkedIn OAuth
- **Scopes**: `r_liteprofile`, `r_emailaddress`
- **Redirect URI**: `https://api.example.com/auth/linkedin/callback`
- **User Info**: Email, name, profile picture

### Implementation Details

#### Backend (FastAPI)
```python
# Dependencies
- python-jose[cryptography]  # JWT handling
- passlib[bcrypt]            # Password hashing
- httpx                      # OAuth HTTP client
- python-multipart           # Form data
```

#### Frontend (Next.js)
```typescript
// Libraries
- next-auth                  // Authentication
- @tanstack/react-query      // API state management
- axios                      // HTTP client
```

#### Mobile (React Native)
```typescript
// Libraries
- expo-auth-session          // OAuth flow
- expo-secure-store          // Secure token storage
- axios                      // HTTP client
```

## Consequences

### Positive
- **User Experience**: Social login reduces friction
- **Security**: Industry-standard OAuth 2.0 + JWT
- **Scalability**: Stateless JWT authentication
- **Flexibility**: Easy to add more OAuth providers
- **Mobile-Friendly**: Works well with mobile apps

### Negative
- **Complexity**: More complex than simple session-based auth
- **Token Management**: Need to handle token refresh logic
- **Revocation**: Requires Redis for token blacklisting
- **OAuth Dependencies**: Relies on third-party providers

### Neutral
- **No Password Management**: Reduces security burden (no password resets)
- **Provider Lock-in**: Users tied to OAuth providers (can add email/password later)

## Alternatives Considered

### Session-Based Authentication
- **Pros**: Simpler, easier to revoke
- **Cons**: Requires sticky sessions, harder to scale, not ideal for mobile

### Auth0 / Clerk
- **Pros**: Managed service, less code to maintain
- **Cons**: Monthly cost, vendor lock-in, less control

### Magic Links (Email)
- **Pros**: No password, good UX
- **Cons**: Requires email infrastructure, slower login

### Passwordless (SMS)
- **Pros**: No password, mobile-friendly
- **Cons**: SMS costs, not reliable in all regions

## Implementation Checklist

- [ ] Set up OAuth applications (Google, Microsoft, LinkedIn)
- [ ] Implement JWT generation and verification
- [ ] Create user registration flow
- [ ] Implement token refresh mechanism
- [ ] Set up Redis for token blacklisting
- [ ] Implement rate limiting
- [ ] Create RBAC permission system
- [ ] Add tenant isolation middleware
- [ ] Implement logout (token revocation)
- [ ] Add security headers (CORS, CSP, etc.)
- [ ] Write authentication tests
- [ ] Document API authentication for developers

## References
- [OAuth 2.0 RFC](https://datatracker.ietf.org/doc/html/rfc6749)
- [JWT RFC](https://datatracker.ietf.org/doc/html/rfc7519)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
