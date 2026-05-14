# API Overview

## Base URL

- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.yourdomain.com/api/v1`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Lifecycle

1. **Access Token**: Short-lived (15 minutes), used for API requests
2. **Refresh Token**: Long-lived (30 days), used to obtain new access tokens

### Obtaining Tokens

See [Authentication Endpoints](#authentication-endpoints) below.

## Request/Response Format

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <access_token>
Accept: application/json
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Pagination

List endpoints support pagination using query parameters:

```
GET /api/v1/products?page=1&page_size=20
```

**Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_items": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

## Filtering and Sorting

### Filtering

```
GET /api/v1/products?category=electronics&status=active
```

### Sorting

```
GET /api/v1/products?sort_by=created_at&order=desc
```

**Parameters:**
- `sort_by`: Field to sort by
- `order`: `asc` or `desc` (default: `asc`)

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated requests**: 100 requests per minute
- **Unauthenticated requests**: 20 requests per minute
- **Login attempts**: 5 attempts per 15 minutes

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Error Codes

### Authentication Errors

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Token invalid
- `AUTH_004`: Refresh token expired
- `AUTH_005`: User not found
- `AUTH_006`: Email already registered
- `AUTH_007`: OAuth provider error

### Validation Errors

- `VAL_001`: Missing required field
- `VAL_002`: Invalid field format
- `VAL_003`: Field value out of range
- `VAL_004`: Invalid enum value

### Permission Errors

- `PERM_001`: Insufficient permissions
- `PERM_002`: Resource not accessible
- `PERM_003`: Tenant mismatch

### Resource Errors

- `RES_001`: Resource not found
- `RES_002`: Resource already exists
- `RES_003`: Resource conflict

## Authentication Endpoints

### Register Business

Register a new business account.

**Endpoint:** `POST /auth/register/business`

**Request Body:**

```json
{
  "email": "john@example.com",
  "name": "John's Barbershop",
  "business_type": "barbershop",
  "city": "Bogotá",
  "department": "Cundinamarca",
  "phone": "3001234567",
  "address": "Calle 123 #45-67",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "oauth_provider": "google",
  "oauth_token": "google_oauth_token_here"
}
```

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
      "created_at": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "expires_in": 900
    }
  },
  "message": "Registration successful"
}
```

### OAuth Login

Initiate OAuth login flow.

**Endpoint:** `GET /auth/{provider}/login`

**Parameters:**
- `provider`: `google`, `microsoft`, or `linkedin`

**Response:** `302 Redirect`

Redirects to OAuth provider's authorization page.

### OAuth Callback

Handle OAuth callback and complete authentication.

**Endpoint:** `GET /auth/{provider}/callback`

**Query Parameters:**
- `code`: Authorization code from OAuth provider
- `state`: State parameter for CSRF protection

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "business_owner"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "expires_in": 900
    }
  }
}
```

### Refresh Token

Obtain a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

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

### Logout

Invalidate current tokens.

**Endpoint:** `POST /auth/logout`

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

### Get Current User

Get authenticated user information.

**Endpoint:** `GET /auth/me`

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
    "tenant_id": 123,
    "permissions": [
      "read:inventory",
      "write:inventory",
      "read:orders"
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

## Interactive Documentation

FastAPI provides interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Postman Collection

A Postman collection with all endpoints is available in the repository:

```
docs/api/postman/ModularSaaS.postman_collection.json
```

Import this collection into Postman for easy API testing.

## API Versioning

The API uses URL versioning:

- Current version: `v1`
- Base path: `/api/v1`

When breaking changes are introduced, a new version will be created (e.g., `/api/v2`).

## CORS Configuration

CORS is configured to allow requests from:

- `http://localhost:3000` (Frontend development)
- `http://localhost:19006` (Expo development)
- Production domains (configured in environment)

## Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Webhooks (Future)

Webhook support for real-time event notifications will be added in future versions.

## GraphQL (Future)

A GraphQL API layer may be added alongside the REST API for more flexible data querying.

## Module-Specific APIs

Detailed API documentation for each module:

- [Authentication API](./modules/authentication.md)
- [Business Profile API](./modules/business-profile.md)
- [Inventory API](./modules/inventory.md)
- [Orders API](./modules/orders.md)
- [Analytics API](./modules/analytics.md)

## Support

For API support:
- Check interactive documentation at `/docs`
- Review this documentation
- Contact the development team
