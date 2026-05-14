# Backend - Modular SaaS Platform

Backend API built with FastAPI, PostgreSQL, and Clean Architecture.

## 🚀 Quick Start

### 1. Set up Python environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Important**: Update these values in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET_KEY`: Generate a secure random key
- OAuth credentials (optional for now, can test without OAuth)

### 3. Set up database

```bash
# Create database
createdb modular_saas

# Or using psql
psql -U postgres -c "CREATE DATABASE modular_saas;"

# Run migrations
alembic upgrade head
```

### 4. Run the server

```bash
# Development mode with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Documentation

### Available Endpoints

#### Health Check
```bash
GET /health
GET /api/v1/auth/health
```

#### Authentication
```bash
POST /api/v1/auth/register/business
```

### Testing the API

#### 1. Create a temporary token (simulate OAuth)

For testing without OAuth, you can create a temp token manually:

```python
from app.modules.auth.application.services.token_service import TokenService, OAuthUserData

token_service = TokenService()
oauth_data = OAuthUserData(
    provider="google",
    provider_user_id="123456789",
    email="test@example.com",
    name="Test User",
    picture=None
)
temp_token = token_service.create_temp_token(oauth_data)
print(temp_token)
```

#### 2. Register a business

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register/business" \
  -H "Content-Type: application/json" \
  -d '{
    "temp_token": "YOUR_TEMP_TOKEN_HERE",
    "name": "Test Barbershop",
    "business_type": "barbershop",
    "city": "Bogotá",
    "department": "Cundinamarca",
    "phone": "3001234567",
    "password": "SecurePass123!",
    "confirm_password": "SecurePass123!",
    "address": "Calle 123 #45-67"
  }'
```

## 🗄️ Database Migrations

### Create a new migration

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "description of changes"

# Create empty migration
alembic revision -m "description"
```

### Apply migrations

```bash
# Upgrade to latest
alembic upgrade head

# Upgrade one version
alembic upgrade +1

# Downgrade one version
alembic downgrade -1

# Show current version
alembic current

# Show migration history
alembic history
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/unit/modules/auth/test_register_business.py

# Run with verbose output
pytest -v
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── core/                   # Core functionality
│   │   ├── config.py          # Configuration
│   │   ├── database.py        # Database setup
│   │   └── security.py        # Security utilities
│   ├── modules/               # Business modules
│   │   └── auth/              # Authentication module
│   │       ├── domain/        # Business logic
│   │       ├── application/   # Use cases
│   │       ├── infrastructure/# External dependencies
│   │       └── presentation/  # API layer
│   ├── shared/                # Shared utilities
│   ├── migrations/            # Database migrations
│   └── main.py               # Application entry point
├── tests/                     # Test suite
├── requirements.txt           # Dependencies
└── alembic.ini               # Alembic configuration
```

## 🔧 Development

### Code Quality

```bash
# Format code
black app/

# Sort imports
isort app/

# Lint
flake8 app/

# Type check
mypy app/
```

### Database

```bash
# Connect to database
psql -U postgres -d modular_saas

# Reset database (⚠️ DANGER: Deletes all data)
dropdb modular_saas
createdb modular_saas
alembic upgrade head
```

## 🐛 Troubleshooting

### Database connection error

```bash
# Check if PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d modular_saas -c "SELECT 1;"
```

### Import errors

```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Migration errors

```bash
# Check current migration state
alembic current

# Show pending migrations
alembic history

# Reset migrations (⚠️ DANGER)
alembic downgrade base
alembic upgrade head
```

## 📝 Environment Variables

Required variables in `.env`:

```env
# Application
APP_NAME=Modular SaaS Platform
APP_ENV=development
DEBUG=True

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/modular_saas

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

## 🚢 Deployment

### Using Docker

```bash
# Build image
docker build -t modular-saas-backend .

# Run container
docker run -p 8000:8000 --env-file .env modular-saas-backend
```

### Production checklist

- [ ] Set `DEBUG=False`
- [ ] Generate secure `JWT_SECRET_KEY`
- [ ] Configure production database
- [ ] Set up Redis for caching
- [ ] Configure OAuth credentials
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 📞 Support

For issues or questions:
- Check API documentation: http://localhost:8000/docs
- Review logs in console
- Check database connection
- Verify environment variables

## 🎯 Next Steps

1. ✅ Backend is running
2. Set up OAuth applications (Google, Microsoft, LinkedIn)
3. Implement frontend
4. Add more modules (inventory, orders, etc.)
5. Deploy to production

---

**Status**: ✅ Ready for development
**Version**: 1.0.0
