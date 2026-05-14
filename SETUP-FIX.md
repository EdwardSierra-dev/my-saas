# Setup Fix - PostgreSQL Installation

## Issue
The backend requires PostgreSQL, but it's not installed on your system.

## Solution Options

### Option 1: Install PostgreSQL (Recommended)

#### Using Homebrew (Easiest)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Add PostgreSQL to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Create database
createdb modular_saas
```

#### After PostgreSQL is installed:
```bash
cd /Users/josecastellon/Documents/projects/my-saas/backend
source venv/bin/activate
pip install -r requirements.txt
```

---

### Option 2: Use SQLite (Quick Testing)

If you want to test quickly without PostgreSQL, we can use SQLite:

#### 1. Update requirements.txt
Remove `psycopg2-binary` and use SQLite (no additional driver needed)

#### 2. Update database configuration
Change DATABASE_URL to use SQLite

I can make these changes for you if you prefer this option.

---

### Option 3: Use Docker PostgreSQL

```bash
# Install Docker Desktop for Mac from https://www.docker.com/products/docker-desktop

# Run PostgreSQL in Docker
docker run --name postgres-saas \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=modular_saas \
  -p 5432:5432 \
  -d postgres:15

# Database will be available at:
# postgresql://postgres:postgres@localhost:5432/modular_saas
```

---

## Recommended: Option 1 (Homebrew)

This is the best option for development on macOS. Here's the complete setup:

```bash
# 1. Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# 2. Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 3. Create database
createdb modular_saas

# 4. Install Python dependencies
cd /Users/josecastellon/Documents/projects/my-saas/backend
source venv/bin/activate
pip install -r requirements.txt

# 5. Create .env file
cp .env.example .env

# 6. Edit .env with:
# DATABASE_URL=postgresql://$(whoami)@localhost:5432/modular_saas
# SECRET_KEY=your-secret-key-here-change-in-production

# 7. Run migrations
alembic upgrade head

# 8. Start server
uvicorn app.main:app --reload
```

---

## Quick Test with SQLite (No PostgreSQL needed)

If you want to test immediately without installing PostgreSQL:

**Tell me and I'll:**
1. Create a SQLite-compatible requirements.txt
2. Update the database configuration
3. You can start testing in 2 minutes

**Note:** SQLite is fine for testing but PostgreSQL is recommended for production.

---

## Which Option Do You Prefer?

1. **Install PostgreSQL** (recommended for production-like environment)
2. **Use SQLite** (quick testing, I'll configure it for you)
3. **Use Docker** (if you have Docker installed)

Let me know and I'll help you proceed!
