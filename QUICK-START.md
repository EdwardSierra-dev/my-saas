# Quick Start Guide

## 🚀 Start the Application in 5 Minutes

### Step 1: Start Backend (Terminal 1)
```bash
cd /Users/josecastellon/Documents/projects/my-saas/backend

# Create and activate virtual environment (first time only)
python3 -m venv venv
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Setup database (first time only)
# Make sure PostgreSQL is running and create database:
# createdb modular_saas

# Create .env file (first time only)
cp .env.example .env
# Edit .env with your database credentials

# Run migrations (first time only)
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

**Backend running at**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

---

### Step 2: Start Frontend (Terminal 2)
```bash
cd /Users/josecastellon/Documents/projects/my-saas/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Frontend running at**: http://localhost:3000

---

### Step 3: Test the Flow

1. **Open**: http://localhost:3000
2. **Click**: "Negocio / Tienda"
3. **Select**: Any OAuth provider (Google, Microsoft, or LinkedIn)
4. **Fill the form**:
   - Name: Mi Barbería Test
   - Business Type: Barbería / Peluquería
   - City: Bogotá
   - Department: Cundinamarca
   - Phone: 3001234567
   - Password: Test123!@#
   - Confirm Password: Test123!@#
5. **Click**: "Completar Registro"
6. **Watch**: Success modal with countdown
7. **Arrive**: Dashboard

---

## 🔄 Subsequent Runs

### Backend
```bash
cd /Users/josecastellon/Documents/projects/my-saas/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend
```bash
cd /Users/josecastellon/Documents/projects/my-saas/frontend
npm run dev
```

---

## 🛑 Stop Servers

Press `Ctrl + C` in each terminal to stop the servers.

---

## 📝 Test Data

Use this data for testing:

| Field | Value |
|-------|-------|
| Name | Mi Barbería Test |
| Business Type | Barbería / Peluquería |
| City | Bogotá |
| Department | Cundinamarca |
| Phone | 3001234567 |
| Address | Calle 123 #45-67 (optional) |
| Password | Test123!@# |

---

## ✅ What to Verify

- [ ] Initial page loads with two buttons
- [ ] OAuth selection page shows 3 providers
- [ ] Registration form pre-fills email and name
- [ ] All form validations work
- [ ] Success modal shows countdown
- [ ] Dashboard loads after registration
- [ ] Backend API responds correctly
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check if PostgreSQL is running
- Verify database exists: `psql -l | grep modular_saas`
- Check .env file has correct DATABASE_URL

**Frontend won't start:**
- Delete node_modules and .next folders
- Run `npm install` again
- Check if port 3000 is available

**Can't connect to API:**
- Verify backend is running on port 8000
- Check .env.local has correct NEXT_PUBLIC_API_URL
- Check browser console for CORS errors

---

## 📚 More Information

- **Full Testing Guide**: See `TESTING-GUIDE.md`
- **Project Status**: See `PROJECT-STATUS.md`
- **Backend Details**: See `backend/README.md`
- **Frontend Details**: See `frontend/README.md`
- **API Documentation**: http://localhost:8000/docs (when backend is running)

---

**Developer**: eJSc  
**Ready to Demo**: ✅ Yes!
