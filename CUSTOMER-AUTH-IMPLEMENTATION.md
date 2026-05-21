# Customer Authentication Implementation

## Overview

This document describes the implementation of the customer authentication and registration system based on the requirements in `modules_specs/auth/auth-user.md`.

## Implemented Features ✅

### Backend

#### 1. Customer Registration (Email/Password)
- **Endpoint**: `POST /api/v1/customer/register`
- **Features**:
  - Full name, email, password validation
  - Strong password requirements (8+ chars, uppercase, lowercase, digit, special char)
  - Password confirmation matching
  - Customer preference categories selection
  - Duplicate email detection
  - JWT token generation

#### 2. Customer Registration (OAuth)
- **Endpoint**: `POST /api/v1/customer/register/oauth`
- **Features**:
  - OAuth provider support (Google, Microsoft, LinkedIn)
  - Temporary token verification
  - Automatic email verification for OAuth users
  - Customer preference categories selection
  - OAuth account linking

#### 3. Customer Login
- **Endpoint**: `POST /api/v1/customer/login`
- **Features**:
  - Email and password authentication
  - Account type validation (customer only)
  - OAuth account detection
  - Inactive account detection
  - JWT token generation

#### 4. Customer Preferences System
- **Categories**:
  - Beauty & Aesthetics (`beauty_aesthetics`)
  - Fast Food (`fast_food`)
  - Pharmacy (`pharmacy`)
  - Specialists (`specialists`)
- **Purpose**: Used for personalized recommendations and business discovery

#### 5. Domain Entities
- **CustomerPreferences**: Entity for managing customer preference categories
- **User**: Extended to support customer role with preferences

#### 6. Use Cases
- **RegisterCustomer**: Handles traditional email/password registration
- **RegisterCustomerOAuth**: Handles OAuth-based registration
- **LoginCustomer**: Handles customer authentication

### Frontend

#### 1. Customer Registration Page
- **Route**: `/customer/register`
- **Features**:
  - Full name, email, password fields
  - Password strength validation with real-time feedback
  - Password confirmation matching
  - Preference category selection (4 categories with icons)
  - OAuth provider buttons (Google, Microsoft, LinkedIn)
  - Link to login page
  - Link to business registration
  - Responsive design with gradient background

#### 2. Customer Login Page
- **Route**: `/customer/login`
- **Features**:
  - Email and password fields
  - "Forgot password?" link
  - OAuth provider buttons
  - Link to registration page
  - Link to business login
  - Error handling for invalid credentials, OAuth accounts, inactive accounts
  - Responsive design

#### 3. Customer Dashboard (Placeholder)
- **Route**: `/customer/dashboard`
- **Features**:
  - Welcome message with user name
  - User information display (name, email, verification status, preferences)
  - Logout functionality
  - Coming soon cards for future features:
    - Search Businesses
    - Favorites
    - Purchase History
    - Messages
    - Track Deliveries
    - Reviews & Ratings

## Technical Implementation

### Backend Architecture

```
backend/app/modules/auth/
├── domain/
│   └── entities/
│       ├── user.py (extended with customer support)
│       └── customer_preferences.py (new)
├── application/
│   └── use_cases/
│       ├── register_customer.py (new)
│       └── login_customer.py (new)
├── infrastructure/
│   └── persistence/
│       └── repositories/ (reusing existing)
└── presentation/
    ├── api/v1/
    │   └── customer.py (new)
    └── schemas/
        └── customer.py (new)
```

### Frontend Architecture

```
frontend/src/app/customer/
├── register/
│   └── page.tsx (new)
├── login/
│   └── page.tsx (new)
└── dashboard/
    └── page.tsx (new)
```

### Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Strong password validation
- ✅ Email format validation
- ✅ Duplicate email prevention
- ✅ Account type validation
- ✅ OAuth account detection
- ✅ Inactive account detection

### Data Flow

1. **Registration Flow**:
   ```
   User fills form → Frontend validation → API call → Backend validation
   → Check email exists → Hash password → Create user → Save to DB
   → Generate JWT tokens → Return user + tokens → Store in localStorage
   → Redirect to dashboard
   ```

2. **Login Flow**:
   ```
   User enters credentials → Frontend validation → API call
   → Find user by email → Verify password → Check account status
   → Generate JWT tokens → Return user + tokens → Store in localStorage
   → Redirect to dashboard
   ```

3. **OAuth Flow** (Simulated):
   ```
   User clicks OAuth button → OAuth provider authentication
   → Receive temp token → Complete registration with preferences
   → Create user + link OAuth account → Generate JWT tokens
   → Redirect to dashboard
   ```

## Pending Features 🚧

Based on `modules_specs/auth/auth-user.md`, the following features are still pending:

### High Priority
1. **Business & Specialist Search**
   - Search by name
   - Search by business type/category
   - Filter by location

2. **Favorites System**
   - Add/remove favorites
   - Maximum 10 favorites
   - Manage favorites list

3. **Purchase History**
   - View past orders
   - Display business name, products/services, date, status, amount
   - Filter and search history

4. **Customer Chat System**
   - Chat with businesses and specialists
   - Follow Chat Module rules (72-hour retention)
   - Real-time messaging

5. **Delivery Tracking**
   - Real-time status updates
   - Track orders (Received, In Progress, Delivered, Returned)

6. **Reviews & Ratings**
   - Leave comments
   - Rate businesses and specialists
   - Rate completed services
   - Contribute to overall ratings

### Medium Priority
7. **Customer Profile Management**
   - Change profile photo
   - Change password
   - Update preferences
   - Contact support

8. **Recommendation System Integration**
   - Use preferences for personalized recommendations
   - Suggest businesses based on history
   - Suggest promotions

### Low Priority
9. **Real OAuth Integration**
   - Replace simulated OAuth flow
   - Implement Google OAuth
   - Implement Microsoft OAuth
   - Implement LinkedIn OAuth

10. **Email Verification**
    - Send verification email
    - Verify email link
    - Resend verification

11. **Password Reset**
    - Forgot password flow
    - Reset password link
    - Update password

## API Endpoints

### Customer Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/customer/register` | Register with email/password | No |
| POST | `/api/v1/customer/register/oauth` | Register with OAuth | No |
| POST | `/api/v1/customer/login` | Login with email/password | No |
| GET | `/api/v1/customer/health` | Health check | No |

### Request/Response Examples

#### Register Customer
```json
// Request
POST /api/v1/customer/register
{
  "full_name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "preferences": ["beauty_aesthetics", "pharmacy"]
}

// Response (201 Created)
{
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "avatar_url": null,
    "is_active": true,
    "is_verified": false,
    "preferences": ["beauty_aesthetics", "pharmacy"],
    "created_at": "2024-01-15T10:30:00"
  },
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

#### Login Customer
```json
// Request
POST /api/v1/customer/login
{
  "email": "juan@example.com",
  "password": "SecurePass123!"
}

// Response (200 OK)
{
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "avatar_url": null,
    "is_active": true,
    "is_verified": false,
    "preferences": [],
    "created_at": "2024-01-15T10:30:00"
  },
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

## Testing

### Manual Testing Steps

1. **Test Customer Registration**:
   ```bash
   # Start backend
   cd backend
   uvicorn app.main:app --reload
   
   # Start frontend
   cd frontend
   npm run dev
   
   # Navigate to http://localhost:3000/customer/register
   # Fill form and submit
   ```

2. **Test Customer Login**:
   ```bash
   # Navigate to http://localhost:3000/customer/login
   # Enter credentials and submit
   ```

3. **Test API Directly**:
   ```bash
   # Register
   curl -X POST http://localhost:8000/api/v1/customer/register \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "Test User",
       "email": "test@example.com",
       "password": "TestPass123!",
       "confirm_password": "TestPass123!",
       "preferences": ["beauty_aesthetics"]
     }'
   
   # Login
   curl -X POST http://localhost:8000/api/v1/customer/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPass123!"
     }'
   ```

## Database Schema

### Users Table (Extended)
```sql
-- Existing users table supports customers with role='customer'
-- No schema changes required
```

### Customer Preferences Table (To be created)
```sql
CREATE TABLE customer_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    categories TEXT NOT NULL,  -- JSON array of preference categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Next Steps

1. **Implement Customer Preferences Repository**
   - Create repository interface
   - Implement SQLite repository
   - Add database migration

2. **Implement Business Search**
   - Create search endpoint
   - Add filters (name, category, location)
   - Implement pagination

3. **Implement Favorites System**
   - Create favorites table
   - Add/remove favorites endpoints
   - Enforce 10-item limit

4. **Implement Purchase History**
   - Create orders view for customers
   - Add filtering and sorting
   - Display order details

5. **Integrate with Chat Module**
   - Enable customer-business chat
   - Follow 72-hour retention rules
   - Real-time messaging

6. **Implement Reviews & Ratings**
   - Create reviews table
   - Add rating endpoints
   - Calculate average ratings

## Notes

- All customer authentication endpoints are prefixed with `/api/v1/customer/`
- Customer role is `UserRole.CUSTOMER` in the database
- Customers don't have a `tenant_id` (it's `null`)
- OAuth users don't have passwords (`password_hash` is `null`)
- Customer preferences are stored as a list of category strings
- Frontend uses localStorage for token storage (should be moved to httpOnly cookies in production)

---

**Implementation Date**: January 2024  
**Status**: ✅ Phase 1 Complete - Registration and Login  
**Next Phase**: Customer Features (Search, Favorites, History, Chat, Reviews)
