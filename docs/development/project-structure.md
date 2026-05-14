# Project Structure

## Overview

This document describes the complete folder structure for the Modular SaaS Platform, including backend, frontend web, and mobile applications.

## Root Structure

```
my-saas/
├── backend/                 # FastAPI backend application
├── frontend/                # Next.js web application
├── mobile/                  # React Native mobile application
├── docs/                    # Project documentation
├── scripts/                 # Utility scripts
├── .github/                 # GitHub workflows and templates
├── docker-compose.yml       # Local development setup
├── docker-compose.prod.yml  # Production setup
├── .gitignore
└── README.md
```

## Backend Structure (FastAPI)

```
backend/
├── app/
│   ├── core/                           # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py                   # Configuration management
│   │   ├── security.py                 # Security utilities (JWT, hashing)
│   │   ├── database.py                 # Database connection and session
│   │   ├── dependencies.py             # FastAPI dependencies
│   │   ├── exceptions.py               # Custom exceptions
│   │   └── middleware.py               # Custom middleware
│   │
│   ├── modules/                        # Business modules
│   │   ├── __init__.py
│   │   │
│   │   ├── auth/                       # Authentication module
│   │   │   ├── __init__.py
│   │   │   ├── domain/                 # Domain layer
│   │   │   │   ├── __init__.py
│   │   │   │   ├── entities/           # Business entities
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   └── user.py
│   │   │   │   ├── value_objects/      # Value objects
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   └── email.py
│   │   │   │   └── repositories/       # Repository interfaces
│   │   │   │       ├── __init__.py
│   │   │   │       └── user_repository.py
│   │   │   │
│   │   │   ├── application/            # Application layer
│   │   │   │   ├── __init__.py
│   │   │   │   ├── use_cases/          # Business use cases
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── register_business.py
│   │   │   │   │   ├── login_with_oauth.py
│   │   │   │   │   └── refresh_token.py
│   │   │   │   └── services/           # Application services
│   │   │   │       ├── __init__.py
│   │   │   │       ├── oauth_service.py
│   │   │   │       └── token_service.py
│   │   │   │
│   │   │   ├── infrastructure/         # Infrastructure layer
│   │   │   │   ├── __init__.py
│   │   │   │   ├── persistence/        # Database implementations
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── models.py       # SQLAlchemy models
│   │   │   │   │   └── user_repository_impl.py
│   │   │   │   ├── external/           # External service integrations
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── google_oauth.py
│   │   │   │   │   ├── microsoft_oauth.py
│   │   │   │   │   └── linkedin_oauth.py
│   │   │   │   └── cache/              # Caching implementations
│   │   │   │       ├── __init__.py
│   │   │   │       └── redis_cache.py
│   │   │   │
│   │   │   └── presentation/           # Presentation layer
│   │   │       ├── __init__.py
│   │   │       ├── api/                # API routes
│   │   │       │   ├── __init__.py
│   │   │       │   ├── v1/
│   │   │       │   │   ├── __init__.py
│   │   │       │   │   ├── auth.py     # Auth endpoints
│   │   │       │   │   └── users.py    # User endpoints
│   │   │       ├── schemas/            # Pydantic schemas
│   │   │       │   ├── __init__.py
│   │   │       │   ├── auth.py         # Auth request/response models
│   │   │       │   └── user.py         # User request/response models
│   │   │       └── dependencies.py     # Route-specific dependencies
│   │   │
│   │   ├── business_profile/           # Business profile module
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── inventory/                  # Inventory module
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── billing/                    # Billing module
│   │   ├── notifications/              # Notifications module
│   │   ├── analytics/                  # Analytics module
│   │   ├── chat/                       # Chat module
│   │   └── ...                         # Other modules
│   │
│   ├── shared/                         # Shared utilities
│   │   ├── __init__.py
│   │   ├── schemas/                    # Common Pydantic models
│   │   │   ├── __init__.py
│   │   │   ├── base.py                 # Base schemas
│   │   │   └── pagination.py           # Pagination schemas
│   │   ├── exceptions/                 # Custom exceptions
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   └── http.py
│   │   ├── utils/                      # Helper functions
│   │   │   ├── __init__.py
│   │   │   ├── datetime.py
│   │   │   ├── validators.py
│   │   │   └── formatters.py
│   │   └── constants/                  # Application constants
│   │       ├── __init__.py
│   │       └── enums.py
│   │
│   ├── migrations/                     # Alembic migrations
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   │
│   └── main.py                         # Application entry point
│
├── tests/                              # Test suite
│   ├── __init__.py
│   ├── conftest.py                     # Pytest configuration
│   ├── unit/                           # Unit tests
│   │   ├── modules/
│   │   │   └── auth/
│   │   │       ├── test_use_cases.py
│   │   │       └── test_services.py
│   ├── integration/                    # Integration tests
│   │   └── modules/
│   │       └── auth/
│   │           └── test_auth_api.py
│   └── e2e/                            # End-to-end tests
│
├── alembic.ini                         # Alembic configuration
├── requirements.txt                    # Python dependencies
├── requirements-dev.txt                # Development dependencies
├── pyproject.toml                      # Python project configuration
├── Dockerfile
├── .env.example
└── README.md
```

## Frontend Structure (Next.js)

```
frontend/
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── (auth)/                     # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/                # Dashboard route group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── orders/
│   │   │   ├── analytics/
│   │   │   └── layout.tsx              # Dashboard layout with sidebar
│   │   │
│   │   ├── api/                        # API routes (if needed)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Home page
│   │   └── globals.css                 # Global styles
│   │
│   ├── components/                     # React components
│   │   ├── ui/                         # UI components (shadcn/ui style)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/                       # Auth-specific components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OAuthButtons.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── layout/                     # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   └── modules/                    # Module-specific components
│   │       ├── inventory/
│   │       │   ├── ProductList.tsx
│   │       │   ├── ProductCard.tsx
│   │       │   └── ProductForm.tsx
│   │       └── ...
│   │
│   ├── lib/                            # Utility libraries
│   │   ├── api/                        # API client
│   │   │   ├── client.ts               # Axios instance
│   │   │   ├── auth.ts                 # Auth API calls
│   │   │   └── inventory.ts            # Inventory API calls
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   └── useDebounce.ts
│   │   │
│   │   ├── utils/                      # Helper functions
│   │   │   ├── cn.ts                   # Class name utility
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │
│   │   └── constants/                  # Constants
│   │       ├── routes.ts
│   │       └── config.ts
│   │
│   ├── types/                          # TypeScript types
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── context/                        # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   └── styles/                         # Additional styles
│       └── modules/
│
├── public/                             # Static assets
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
└── README.md
```

## Mobile Structure (React Native + Expo)

```
mobile/
├── src/
│   ├── screens/                        # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   │
│   │   └── modules/
│   │       ├── inventory/
│   │       │   ├── InventoryListScreen.tsx
│   │       │   └── ProductDetailScreen.tsx
│   │       └── ...
│   │
│   ├── components/                     # Reusable components
│   │   ├── ui/                         # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/
│   │   │   ├── OAuthButtons.tsx
│   │   │   └── AuthForm.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── TabBar.tsx
│   │
│   ├── navigation/                     # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── DashboardNavigator.tsx
│   │
│   ├── services/                       # API services
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   └── inventory.ts
│   │   │
│   │   └── storage/
│   │       └── secureStorage.ts        # Secure token storage
│   │
│   ├── hooks/                          # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useTheme.ts
│   │
│   ├── context/                        # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── types/                          # TypeScript types
│   │   ├── auth.ts
│   │   ├── navigation.ts
│   │   └── index.ts
│   │
│   ├── utils/                          # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── constants/                      # Constants
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   └── routes.ts
│   │
│   └── theme/                          # Theme configuration
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
│
├── assets/                             # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── app.json                            # Expo configuration
├── App.tsx                             # App entry point
├── babel.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Shared Resources

### Scripts Directory

```
scripts/
├── setup/
│   ├── init-db.sh                      # Initialize database
│   └── seed-data.py                    # Seed initial data
├── deploy/
│   ├── deploy-backend.sh
│   └── deploy-frontend.sh
└── utils/
    ├── backup-db.sh
    └── restore-db.sh
```

### Documentation Directory

```
docs/
├── README.md
├── architecture/
│   ├── system-architecture.md
│   ├── modular-monolith.md
│   ├── clean-architecture.md
│   └── database-schema.md
├── technical-decisions/
│   ├── 001-tech-stack.md
│   ├── 002-authentication-strategy.md
│   └── ...
├── development/
│   ├── setup-guide.md
│   ├── coding-standards.md
│   └── project-structure.md
├── api/
│   └── api-overview.md
└── deployment/
    └── deployment-guide.md
```

## Key Principles

### Backend
- **Clean Architecture**: Clear separation of concerns
- **Module Independence**: Each module is self-contained
- **Dependency Injection**: Use FastAPI's dependency system
- **Type Safety**: Use Pydantic for validation

### Frontend
- **Component Reusability**: Build generic UI components
- **Type Safety**: Strong TypeScript typing
- **Server Components**: Use Next.js server components where possible
- **Code Splitting**: Automatic with Next.js App Router

### Mobile
- **Cross-Platform**: Single codebase for iOS and Android
- **Native Feel**: Use platform-specific components when needed
- **Offline Support**: Handle offline scenarios gracefully
- **Performance**: Optimize for mobile devices

## Naming Conventions

### Files
- **Python**: `snake_case.py`
- **TypeScript/React**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Tests**: `test_*.py` or `*.test.ts`

### Directories
- **All**: `kebab-case` or `snake_case`

### Code
- **Python**: `snake_case` for functions/variables, `PascalCase` for classes
- **TypeScript**: `camelCase` for functions/variables, `PascalCase` for classes/components
- **Constants**: `UPPER_SNAKE_CASE`

## Next Steps

1. Initialize backend project structure
2. Initialize frontend project structure
3. Initialize mobile project structure
4. Set up Docker Compose for local development
5. Configure CI/CD pipelines
