# Coding Standards

## Overview

This document defines the coding standards and best practices for the Modular SaaS Platform. Following these standards ensures consistency, maintainability, and quality across the codebase.

## General Principles

1. **Write Clean Code**: Code should be self-documenting and easy to understand
2. **KISS (Keep It Simple, Stupid)**: Avoid unnecessary complexity
3. **DRY (Don't Repeat Yourself)**: Eliminate code duplication
4. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
5. **SOLID Principles**: Follow object-oriented design principles
6. **Fail Fast**: Validate inputs early and throw meaningful errors

## Python (Backend)

### Code Style

Follow **PEP 8** with these specific guidelines:

#### Formatting
```python
# Use 4 spaces for indentation (no tabs)
# Maximum line length: 88 characters (Black formatter default)
# Use double quotes for strings
# Add trailing commas in multi-line structures

# Good
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "business_owner",
}

# Bad
user_data = {'name': 'John Doe', 'email': 'john@example.com', 'role': 'business_owner'}
```

#### Naming Conventions
```python
# Variables and functions: snake_case
user_name = "John"
def get_user_by_id(user_id: int) -> User:
    pass

# Classes: PascalCase
class UserRepository:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_LOGIN_ATTEMPTS = 5
DEFAULT_PAGE_SIZE = 20

# Private methods/attributes: _leading_underscore
class User:
    def __init__(self):
        self._password_hash = None
    
    def _validate_password(self, password: str) -> bool:
        pass
```

#### Type Hints
Always use type hints for function parameters and return values:

```python
from typing import Optional, List, Dict, Any
from datetime import datetime

# Good
def create_user(
    email: str,
    name: str,
    role: UserRole,
    created_at: Optional[datetime] = None
) -> User:
    pass

def get_users(
    skip: int = 0,
    limit: int = 100
) -> List[User]:
    pass

# Bad
def create_user(email, name, role, created_at=None):
    pass
```

#### Docstrings
Use Google-style docstrings:

```python
def register_business(
    email: str,
    name: str,
    business_type: str,
    oauth_provider: str
) -> User:
    """Register a new business account.
    
    Args:
        email: User's email address
        name: Business name
        business_type: Type of business (e.g., "restaurant", "barbershop")
        oauth_provider: OAuth provider used (e.g., "google", "microsoft")
    
    Returns:
        User: The created user object
    
    Raises:
        UserAlreadyExistsError: If email is already registered
        InvalidBusinessTypeError: If business_type is not valid
    """
    pass
```

#### Error Handling
```python
# Use specific exceptions
from app.shared.exceptions import UserNotFoundError, ValidationError

# Good
def get_user(user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise UserNotFoundError(f"User with id {user_id} not found")
    return user

# Bad
def get_user(user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found")
    return user
```

#### Imports
```python
# Order: standard library, third-party, local
# Use absolute imports
# Group imports logically

# Good
import os
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.domain.entities.user import User
from app.modules.auth.application.use_cases.register_business import RegisterBusiness

# Bad
from app.core.database import *
from app.modules.auth.domain.entities.user import *
```

### FastAPI Specific

#### Route Definitions
```python
from fastapi import APIRouter, Depends, status
from app.modules.auth.presentation.schemas.auth import RegisterRequest, RegisterResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new business account",
    description="Register a new business account using OAuth provider data"
)
async def register_business(
    request: RegisterRequest,
    db: Session = Depends(get_db)
) -> RegisterResponse:
    """Register a new business account."""
    # Implementation
    pass
```

#### Pydantic Models
```python
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    business_type: str
    phone: str = Field(..., regex=r"^\d{10}$")
    password: str = Field(..., min_length=8)
    
    @validator("business_type")
    def validate_business_type(cls, v):
        allowed_types = ["barbershop", "restaurant", "pharmacy", "local_store"]
        if v not in allowed_types:
            raise ValueError(f"business_type must be one of {allowed_types}")
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "email": "john@example.com",
                "name": "John's Barbershop",
                "business_type": "barbershop",
                "phone": "3001234567",
                "password": "SecurePass123!"
            }
        }
```

### SQLAlchemy Models
```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base

class UserRole(str, enum.Enum):
    BUSINESS_OWNER = "business_owner"
    CUSTOMER = "customer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
```

## TypeScript (Frontend & Mobile)

### Code Style

Follow **Airbnb TypeScript Style Guide** with these specifics:

#### Formatting
```typescript
// Use 2 spaces for indentation
// Maximum line length: 100 characters
// Use double quotes for strings
// Use semicolons
// Trailing commas in multi-line structures

// Good
const userData = {
  name: "John Doe",
  email: "john@example.com",
  role: "business_owner",
};

// Bad
const userData = {'name': 'John Doe', 'email': 'john@example.com', 'role': 'business_owner'}
```

#### Naming Conventions
```typescript
// Variables and functions: camelCase
const userName = "John";
function getUserById(userId: number): User {
  // ...
}

// Classes and Components: PascalCase
class UserRepository {}
function LoginForm() {}

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const API_BASE_URL = "https://api.example.com";

// Interfaces: PascalCase with 'I' prefix (optional)
interface User {
  id: number;
  email: string;
  name: string;
}

// Types: PascalCase
type UserRole = "business_owner" | "customer" | "admin";

// Enums: PascalCase
enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}
```

#### Type Definitions
```typescript
// Always use explicit types
// Avoid 'any' - use 'unknown' if type is truly unknown

// Good
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

async function login(request: LoginRequest): Promise<LoginResponse> {
  // ...
}

// Bad
async function login(request: any): Promise<any> {
  // ...
}
```

#### React Components
```typescript
// Use functional components with TypeScript
// Props interface should be defined

import { FC, useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm: FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error 
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
};
```

#### Custom Hooks
```typescript
import { useState, useEffect } from "react";

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

#### Error Handling
```typescript
// Use try-catch with specific error types

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Good
async function fetchUser(userId: number): Promise<User> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new Error(`User ${userId} not found`);
    }
    throw error;
  }
}
```

## Testing Standards

### Python Tests (pytest)

```python
import pytest
from app.modules.auth.application.use_cases.register_business import RegisterBusiness
from app.modules.auth.domain.entities.user import User

class TestRegisterBusiness:
    """Test suite for RegisterBusiness use case."""
    
    def test_register_business_success(self, db_session, mock_oauth_service):
        """Test successful business registration."""
        # Arrange
        use_case = RegisterBusiness(db_session, mock_oauth_service)
        email = "test@example.com"
        name = "Test Business"
        
        # Act
        user = use_case.execute(email, name, "restaurant", "google")
        
        # Assert
        assert user.email == email
        assert user.name == name
        assert user.role == "business_owner"
    
    def test_register_business_duplicate_email(self, db_session):
        """Test registration with duplicate email raises error."""
        # Arrange
        use_case = RegisterBusiness(db_session)
        email = "duplicate@example.com"
        
        # Create existing user
        use_case.execute(email, "First Business", "restaurant", "google")
        
        # Act & Assert
        with pytest.raises(UserAlreadyExistsError):
            use_case.execute(email, "Second Business", "barbershop", "microsoft")
```

### TypeScript Tests (Jest)

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("should render login form", () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should call onSubmit with email and password", async () => {
    const mockOnSubmit = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });
});
```

## Git Commit Standards

### Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```
feat(auth): add OAuth login with Google

Implement OAuth 2.0 authentication flow for Google login.
Users can now register and login using their Google account.

Closes #123

---

fix(inventory): correct product quantity calculation

The quantity was being calculated incorrectly when multiple
warehouses were involved.

---

docs(api): update authentication endpoint documentation

Add examples for OAuth callback endpoints.
```

## Code Review Checklist

### General
- [ ] Code follows project coding standards
- [ ] No commented-out code
- [ ] No console.log or print statements (use proper logging)
- [ ] Error handling is appropriate
- [ ] Code is self-documenting or has necessary comments

### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] No obvious bugs or logic errors

### Testing
- [ ] Unit tests are included
- [ ] Tests cover happy path and edge cases
- [ ] All tests pass

### Security
- [ ] No sensitive data in code
- [ ] Input validation is present
- [ ] SQL injection prevention
- [ ] XSS prevention

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] Proper indexing is used

## Tools

### Python
- **Formatter**: Black
- **Linter**: Flake8, Pylint
- **Type Checker**: mypy
- **Import Sorter**: isort

### TypeScript
- **Formatter**: Prettier
- **Linter**: ESLint
- **Type Checker**: TypeScript compiler

### Pre-commit Hooks
Configure pre-commit hooks to run formatters and linters automatically.

## Resources

- [PEP 8 Style Guide](https://pep8.org/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
