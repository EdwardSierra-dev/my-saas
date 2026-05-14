# System Architecture

## Overview

This document describes the overall architecture of the Modular SaaS Platform, a multi-tenant system designed to connect local businesses with customers through a flexible, module-based approach.

## Architecture Style

### Modular Monolith

The system follows a **Modular Monolith** architecture pattern, which provides:

- **Single Deployment Unit** - Simplified deployment and operations
- **Module Isolation** - Clear boundaries between business domains
- **Shared Infrastructure** - Efficient resource utilization
- **Future Microservices Path** - Modules can be extracted if needed

### Clean Architecture

Each module implements **Clean Architecture** principles:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (API Routes, Controllers, Schemas)     │
├─────────────────────────────────────────┤
│          Application Layer              │
│    (Use Cases, Business Logic)          │
├─────────────────────────────────────────┤
│            Domain Layer                 │
│   (Entities, Value Objects, Rules)      │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │
│  (Database, External APIs, Cache)       │
└─────────────────────────────────────────┘
```

**Dependency Rule**: Dependencies point inward. Inner layers know nothing about outer layers.

## System Components

### Frontend Applications

#### Web Application (Next.js)
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context + Server Components
- **Authentication**: NextAuth.js
- **API Communication**: Fetch API with custom hooks

#### Mobile Application (React Native)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context + Zustand
- **Authentication**: Expo AuthSession
- **API Communication**: Axios with interceptors

### Backend API (FastAPI)

#### Core Structure
```
backend/
├── app/
│   ├── core/              # Core functionality
│   │   ├── config.py      # Configuration management
│   │   ├── security.py    # Security utilities
│   │   ├── database.py    # Database connection
│   │   └── dependencies.py # Dependency injection
│   ├── modules/           # Business modules
│   │   ├── auth/
│   │   ├── business_profile/
│   │   ├── inventory/
│   │   └── ...
│   ├── shared/            # Shared utilities
│   │   ├── schemas/       # Common Pydantic models
│   │   ├── exceptions/    # Custom exceptions
│   │   └── utils/         # Helper functions
│   └── main.py            # Application entry point
```

#### Module Structure (Example: Auth)
```
modules/auth/
├── domain/
│   ├── entities/          # Business entities
│   ├── value_objects/     # Value objects
│   └── repositories/      # Repository interfaces
├── application/
│   ├── use_cases/         # Business use cases
│   └── services/          # Application services
├── infrastructure/
│   ├── persistence/       # Database implementations
│   ├── external/          # External service integrations
│   └── cache/             # Caching implementations
└── presentation/
    ├── api/               # API routes
    ├── schemas/           # Request/Response models
    └── dependencies.py    # Route dependencies
```

### Database (PostgreSQL)

#### Multi-Tenancy Strategy
- **Shared Database, Shared Schema** with tenant_id column
- Row-Level Security (RLS) for data isolation
- Tenant context in all queries

#### Key Design Principles
- Normalized schema design
- Proper indexing strategy
- Foreign key constraints
- Audit columns (created_at, updated_at, deleted_at)
- Soft deletes for critical data

### Cache Layer (Redis)

#### Use Cases
- Session storage
- Rate limiting
- Temporary data (OTP, tokens)
- Query result caching
- Real-time features (pub/sub)

### Background Jobs (Celery)

#### Task Categories
- Email notifications
- Report generation
- Data synchronization
- Scheduled tasks
- Webhook processing

### Infrastructure

#### Containerization (Docker)
```
docker-compose.yml
├── backend (FastAPI)
├── frontend (Next.js)
├── postgres
├── redis
├── celery-worker
└── nginx
```

#### Reverse Proxy (Nginx)
- SSL termination
- Load balancing
- Static file serving
- Request routing

## Data Flow

### Request Flow (Web/Mobile → Backend)

```
┌─────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│ Client  │─────▶│  Nginx  │─────▶│  FastAPI │─────▶│   DB     │
└─────────┘      └─────────┘      └──────────┘      └──────────┘
     │                                   │                 │
     │                                   ▼                 │
     │                            ┌──────────┐            │
     │                            │  Redis   │            │
     │                            └──────────┘            │
     │                                                     │
     └─────────────────────────────────────────────────────┘
                    Response
```

### Authentication Flow

```
1. User clicks OAuth provider (Google/Microsoft/LinkedIn)
2. Frontend redirects to OAuth provider
3. Provider authenticates and returns authorization code
4. Frontend sends code to backend /auth/callback
5. Backend exchanges code for user info
6. Backend creates/updates user in database
7. Backend generates JWT tokens (access + refresh)
8. Frontend stores tokens securely
9. Subsequent requests include JWT in Authorization header
```

## Module Communication

### Inter-Module Communication Rules

1. **No Direct Dependencies** - Modules don't import from each other
2. **Event-Driven** - Use domain events for cross-module communication
3. **Shared Kernel** - Common types in shared/ directory
4. **API Gateway Pattern** - Frontend only talks to API layer

### Event Bus (Future Enhancement)
```python
# Example: Business profile updated
event_bus.publish(
    event="business_profile.updated",
    data={"business_id": "123", "fields": ["name", "address"]}
)

# Inventory module subscribes
@event_bus.subscribe("business_profile.updated")
def handle_business_updated(data):
    # Update inventory business reference
    pass
```

## Security Architecture

### Authentication
- OAuth 2.0 for social login
- JWT for API authentication
- Refresh token rotation
- Token blacklisting on logout

### Authorization
- Role-Based Access Control (RBAC)
- Resource-level permissions
- Tenant isolation enforcement
- API rate limiting

### Data Protection
- Passwords hashed with bcrypt
- Sensitive data encrypted at rest
- HTTPS/TLS for data in transit
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Session data in Redis
- Database connection pooling
- CDN for static assets

### Performance Optimization
- Database query optimization
- Caching strategy (Redis)
- Lazy loading
- Pagination for large datasets
- Background job processing

### Monitoring & Observability
- Application logs (structured JSON)
- Performance metrics
- Error tracking
- Health check endpoints
- Database query monitoring

## Technology Decisions

See [Technical Decisions](../technical-decisions/) for detailed ADRs on:
- Technology stack selection
- Authentication strategy
- Module architecture
- Frontend architecture
- Database design

## Future Considerations

### Potential Microservices Extraction
Modules that may become microservices:
- Notifications (high volume, independent)
- Analytics (compute-intensive)
- Chat (real-time, WebSocket)

### Advanced Features
- GraphQL API layer
- Event sourcing for audit trail
- CQRS for read-heavy modules
- Multi-region deployment
- Advanced caching (CDN, edge computing)
