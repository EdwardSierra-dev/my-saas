# 🚀 START HERE - Quick Installation Guide

## Option A: Automated Installation (Recommended) ⚡

### Step 1: Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Important:** After installation, run the commands Homebrew shows you to add it to PATH!

### Step 2: Run the Installation Script
```bash
cd /Users/josecastellon/Documents/projects/my-saas
./install.sh
```

This script will:
- ✅ Install PostgreSQL
- ✅ Start PostgreSQL service
- ✅ Create database
- ✅ Install Python dependencies
- ✅ Run database migrations

### Step 3: Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Step 4: Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Test!
Open http://localhost:3000 🎉

---

## Option B: Manual Installation

Follow the detailed guide in: `INSTALL-POSTGRESQL.md`

---

## Quick Commands Reference

### Start Backend
```bash
cd /Users/josecastellon/Documents/projects/my-saas/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Start Frontend
```bash
cd /Users/josecastellon/Documents/projects/my-saas/frontend
npm run dev
```

### Check PostgreSQL Status
```bash
brew services list | grep postgresql
```

### Start PostgreSQL (if stopped)
```bash
brew services start postgresql@15
```

---

## Test Data

Use this data when testing the registration form:

```
Name: Mi Barbería Test
Business Type: Barbería / Peluquería
City: Bogotá
Department: Cundinamarca
Phone: 3001234567
Password: Test123!@#
Confirm Password: Test123!@#
```

---

## Troubleshooting

### "brew: command not found"
Install Homebrew first (see Step 1 above)

### "createdb: command not found"
Add PostgreSQL to PATH:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "Connection refused" error
Start PostgreSQL:
```bash
brew services start postgresql@15
```

### Backend won't start
1. Check if virtual environment is activated: `source venv/bin/activate`
2. Check if dependencies are installed: `pip list`
3. Check if database exists: `psql -l | grep modular_saas`

---

## What's Next?

After testing:
1. ✅ Show the working app to your client
2. 🔐 Configure real OAuth providers
3. 👥 Implement customer registration
4. 🔑 Add login page
5. 📧 Add email verification

---

## Files Created for You

- ✅ `backend/.env` - Backend configuration (ready to use)
- ✅ `frontend/.env.local` - Frontend configuration (ready to use)
- ✅ `install.sh` - Automated installation script
- ✅ `INSTALL-POSTGRESQL.md` - Detailed manual installation guide
- ✅ `TESTING-GUIDE.md` - Complete testing guide
- ✅ `PROJECT-STATUS.md` - Project status overview
- ✅ `QUICK-START.md` - Quick start commands

---

## Need Help?

1. Check `INSTALL-POSTGRESQL.md` for detailed steps
2. Check `TESTING-GUIDE.md` for testing instructions
3. Check `SETUP-FIX.md` for alternative solutions

---

**Ready to start? Run the installation script!** 🚀

```bash
cd /Users/josecastellon/Documents/projects/my-saas
./install.sh
```
