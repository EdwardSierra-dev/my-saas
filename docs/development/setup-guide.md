# Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Python 3.11+**: Backend development
- **Node.js 18+**: Frontend and mobile development
- **npm or yarn**: Package management
- **Docker & Docker Compose**: Containerization
- **Git**: Version control
- **PostgreSQL 15+**: Database (or use Docker)
- **Redis 7+**: Cache and sessions (or use Docker)

### Optional Tools

- **VS Code**: Recommended IDE
- **Postman or Insomnia**: API testing
- **pgAdmin or DBeaver**: Database management
- **Redis Commander**: Redis GUI

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-saas
```

### 2. Backend Setup (FastAPI)

#### Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

#### Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
```

#### Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Application
APP_NAME=ModularSaaS
APP_ENV=development
DEBUG=True
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/modular_saas
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30

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

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:19006

# File Storage
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Email (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Database Setup

```bash
# Create database
createdb modular_saas

# Run migrations
alembic upgrade head

# Seed initial data (optional)
python scripts/seed_data.py
```

#### Run Backend Server

```bash
# Development mode with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using the provided script
python -m app.main
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local
```

**Required Environment Variables:**

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# OAuth Redirect URLs
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google
NEXT_PUBLIC_MICROSOFT_REDIRECT_URI=http://localhost:3000/auth/callback/microsoft
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/callback/linkedin

# App Configuration
NEXT_PUBLIC_APP_NAME=ModularSaaS
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Run Frontend Server

```bash
npm run dev
# or
yarn dev
```

Frontend will be available at: `http://localhost:3000`

### 4. Mobile Setup (React Native + Expo)

```bash
cd mobile

# Install dependencies
npm install
# or
yarn install

# Copy environment file
cp .env.example .env

# Edit .env
nano .env
```

**Required Environment Variables:**

```env
# API
API_URL=http://localhost:8000/api/v1

# For physical device testing, use your computer's IP
# API_URL=http://192.168.1.100:8000/api/v1

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
MICROSOFT_CLIENT_ID=your-microsoft-client-id
LINKEDIN_CLIENT_ID=your-linkedin-client-id
```

#### Run Mobile App

```bash
# Start Expo development server
npm start
# or
yarn start

# Run on iOS simulator (macOS only)
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

Expo DevTools will open in your browser. Scan the QR code with:
- **iOS**: Camera app or Expo Go app
- **Android**: Expo Go app

### 5. Docker Setup (Recommended for Development)

#### Start All Services

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services Started:**
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050`

#### Docker Commands

```bash
# Rebuild containers
docker-compose up -d --build

# Run migrations
docker-compose exec backend alembic upgrade head

# Access backend shell
docker-compose exec backend bash

# Access database
docker-compose exec postgres psql -U postgres -d modular_saas

# View logs for specific service
docker-compose logs -f backend
```

## Development Workflow

### 1. Create a New Feature Branch

```bash
git checkout -b feature/auth-module
```

### 2. Make Changes

Follow the [Coding Standards](./coding-standards.md) document.

### 3. Run Tests

#### Backend Tests

```bash
cd backend
pytest

# With coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/unit/modules/auth/test_register.py
```

#### Frontend Tests

```bash
cd frontend
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### 4. Format and Lint Code

#### Backend

```bash
# Format with Black
black app/

# Sort imports
isort app/

# Lint with Flake8
flake8 app/

# Type check with mypy
mypy app/
```

#### Frontend

```bash
# Format with Prettier
npm run format

# Lint with ESLint
npm run lint

# Type check
npm run type-check
```

### 5. Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(auth): implement OAuth login flow"
```

### 6. Push and Create Pull Request

```bash
git push origin feature/auth-module
```

Then create a Pull Request on GitHub/GitLab.

## IDE Setup

### VS Code (Recommended)

#### Recommended Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-azuretools.vscode-docker",
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg"
  ]
}
```

#### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.workingDirectories": ["./frontend", "./mobile"],
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Troubleshooting

### Backend Issues

#### Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check connection
psql -h localhost -U postgres -d modular_saas

# Reset database
docker-compose down -v
docker-compose up -d postgres
alembic upgrade head
```

#### Redis Connection Error

```bash
# Check if Redis is running
docker-compose ps redis

# Test connection
redis-cli ping
```

#### Import Errors

```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

#### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Mobile Issues

#### Expo Not Starting

```bash
# Clear Expo cache
expo start -c

# Or
rm -rf node_modules .expo
npm install
```

#### Can't Connect to API

- Ensure you're using your computer's IP address, not `localhost`
- Check firewall settings
- Ensure backend is running and accessible

## Next Steps

1. Read [Project Structure](./project-structure.md)
2. Review [Coding Standards](./coding-standards.md)
3. Check [API Documentation](../api/api-overview.md)
4. Start building features!

## Useful Commands Reference

### Backend

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Run tests
pytest

# Run with coverage
pytest --cov=app

# Format code
black app/ && isort app/

# Lint
flake8 app/

# Type check
mypy app/
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Test
npm test

# Lint
npm run lint

# Format
npm run format
```

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service]

# Rebuild
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

## Support

For issues or questions:
1. Check this documentation
2. Search existing issues on GitHub
3. Ask in team chat
4. Create a new issue with detailed information
