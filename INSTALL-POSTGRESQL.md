# Install PostgreSQL - Step by Step Guide

## Step 1: Install Homebrew

Homebrew is a package manager for macOS. Run this command in your terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Important:** After installation, Homebrew will show you commands to add it to your PATH. They will look like:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Run those commands** that Homebrew shows you!

---

## Step 2: Install PostgreSQL

After Homebrew is installed and in your PATH:

```bash
brew install postgresql@15
```

This will take a few minutes to download and install.

---

## Step 3: Start PostgreSQL Service

```bash
brew services start postgresql@15
```

---

## Step 4: Add PostgreSQL to PATH

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## Step 5: Create Database

```bash
createdb modular_saas
```

---

## Step 6: Verify Installation

```bash
psql -l
```

You should see a list of databases including `modular_saas`.

---

## Step 7: Install Python Dependencies

```bash
cd /Users/josecastellon/Documents/projects/my-saas/backend
source venv/bin/activate
pip install -r requirements.txt
```

---

## Step 8: Configure Environment

```bash
cp .env.example .env
```

Edit the `.env` file with:

```bash
DATABASE_URL=postgresql://$(whoami)@localhost:5432/modular_saas
SECRET_KEY=dev-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Step 9: Run Database Migrations

```bash
alembic upgrade head
```

---

## Step 10: Start Backend Server

```bash
uvicorn app.main:app --reload
```

✅ Backend should now be running at: http://localhost:8000

---

## Complete Command Sequence

Once Homebrew is installed, run all these commands in sequence:

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Create database
createdb modular_saas

# Navigate to backend
cd /Users/josecastellon/Documents/projects/my-saas/backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env file (use nano or your preferred editor)
nano .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

---

## Troubleshooting

### "brew: command not found" after installation
Run the commands that Homebrew showed you after installation to add it to PATH.

### "createdb: command not found"
Make sure you ran the PATH export command:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "psql: error: connection to server on socket"
PostgreSQL service is not running:
```bash
brew services start postgresql@15
```

### "database modular_saas already exists"
That's fine! It means the database was already created.

---

## Next Steps

After the backend is running:

1. Open a **new terminal** window
2. Navigate to frontend:
   ```bash
   cd /Users/josecastellon/Documents/projects/my-saas/frontend
   npm install
   npm run dev
   ```
3. Open http://localhost:3000 and test!

---

## Quick Reference

**Start PostgreSQL:**
```bash
brew services start postgresql@15
```

**Stop PostgreSQL:**
```bash
brew services stop postgresql@15
```

**Check PostgreSQL status:**
```bash
brew services list | grep postgresql
```

**Connect to database:**
```bash
psql modular_saas
```

**List all databases:**
```bash
psql -l
```

---

Ready to start? Run the Homebrew installation command first! 🚀
