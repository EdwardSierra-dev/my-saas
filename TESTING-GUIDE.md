# Testing Guide - Authentication Flow

## Overview
This guide will help you test the complete authentication flow from the initial page to the dashboard.

## Prerequisites
- Python 3.9+ installed
- Node.js 18+ and npm installed
- PostgreSQL running

---

## Backend Setup

### 1. Navigate to backend directory
```bash
cd /Users/josecastellon/Documents/projects/my-saas/backend
```

### 2. Create virtual environment (if not exists)
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL=postgresql://user:password@localhost:5432/modular_saas
SECRET_KEY=your-secret-key-here
```

### 5. Run database migrations
```bash
alembic upgrade head
```

### 6. Start the backend server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: http://localhost:8000
API documentation at: http://localhost:8000/docs

---

## Frontend Setup

### 1. Navigate to frontend directory (in a new terminal)
```bash
cd /Users/josecastellon/Documents/projects/my-saas/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Verify environment variables
The `.env.local` file has been created with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Modular SaaS
```

### 4. Start the development server
```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

---

## Testing the Complete Flow

### Step 1: Initial Page
1. Open http://localhost:3000
2. You should see:
   - Welcome message
   - Two buttons: "Negocio / Tienda" and "Cliente"
   - "¿Ya tienes una cuenta?" link
   - Logo and "eJSc" developer credit at the bottom

### Step 2: Business Authentication
1. Click "Negocio / Tienda" button
2. You should see three OAuth provider buttons:
   - Google
   - Microsoft
   - LinkedIn
3. Click any provider (currently simulated)

### Step 3: Registration Form
1. After selecting a provider, you'll be redirected to the registration form
2. The form should show:
   - Pre-filled email (from simulated OAuth)
   - Pre-filled name (editable)
   - Business type dropdown (6 options)
   - City input
   - Department dropdown (32 Colombian departments)
   - Phone input (10 digits)
   - Address input (optional)
   - Password input
   - Confirm password input

### Step 4: Fill the Form
Fill in the form with test data:
- **Name**: Mi Barbería Test
- **Business Type**: Barbería / Peluquería
- **City**: Bogotá
- **Department**: Cundinamarca
- **Phone**: 3001234567
- **Address**: Calle 123 #45-67 (optional)
- **Password**: Test123!@#
- **Confirm Password**: Test123!@#

### Step 5: Submit Registration
1. Click "Completar Registro"
2. The form will validate:
   - Name (min 2 characters)
   - Phone (exactly 10 digits)
   - Password (8+ chars, uppercase, lowercase, digit, special char)
   - Password confirmation match
3. If validation passes, it will call the backend API

### Step 6: Success Modal
1. After successful registration, you'll see:
   - Success icon (green checkmark)
   - "¡Registro Completado!" message
   - 5-second countdown timer
   - "Ir al Dashboard Ahora" button
2. You can either wait for the countdown or click the button

### Step 7: Dashboard
1. You'll be redirected to the dashboard
2. You should see:
   - Header with "Dashboard" title and "Cerrar Sesión" button
   - Welcome message
   - Three cards: Perfil, Inventario, Órdenes

---

## Current Limitations (Simulated Features)

### OAuth Flow
Currently, the OAuth flow is **simulated**. When you click an OAuth provider:
- It generates mock user data (email: test@example.com, name: Test User)
- Stores it in sessionStorage
- Redirects to the registration form

**To implement real OAuth:**
1. Configure OAuth credentials in backend
2. Update frontend to redirect to backend OAuth endpoints
3. Backend will handle OAuth callback and generate temp_token
4. Frontend receives temp_token and proceeds to registration

### Temp Token Generation
The registration form generates a simulated temp_token by encoding the OAuth data.

**In production:**
- Backend generates the temp_token after OAuth callback
- Frontend receives it as a URL parameter
- Frontend uses it to complete registration

---

## API Endpoints Available

### POST /api/v1/auth/register/business
Register a new business account.

**Request:**
```json
{
  "temp_token": "base64_encoded_oauth_data",
  "name": "Mi Barbería",
  "business_type": "barbershop",
  "city": "Bogotá",
  "department": "Cundinamarca",
  "phone": "3001234567",
  "password": "Test123!@#",
  "confirm_password": "Test123!@#",
  "address": "Calle 123 #45-67"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "role": "owner",
    "is_active": true,
    "is_verified": false
  },
  "tenant": {
    "id": 1,
    "name": "Mi Barbería",
    "business_type": "barbershop",
    "slug": "mi-barberia",
    "city": "Bogotá",
    "department": "Cundinamarca"
  },
  "tokens": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

---

## Troubleshooting

### Backend Issues

**Database connection error:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists: `createdb modular_saas`

**Import errors:**
- Activate virtual environment: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

**Port already in use:**
- Change port: `uvicorn app.main:app --reload --port 8001`
- Update frontend `.env.local` accordingly

### Frontend Issues

**Module not found:**
- Run `npm install` again
- Delete `node_modules` and `.next`, then reinstall

**API connection error:**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Check browser console for CORS errors

**Page not found:**
- Restart Next.js dev server
- Clear browser cache

---

## Next Steps

### Immediate Improvements
1. **Real OAuth Integration**: Configure Google, Microsoft, and LinkedIn OAuth
2. **Customer Registration Flow**: Implement customer registration (similar to business)
3. **Login Page**: Create login page for existing users
4. **Email Verification**: Add email verification flow
5. **Password Reset**: Implement forgot password functionality

### Future Enhancements
1. **Profile Management**: Allow users to edit their profile
2. **Multi-tenant Dashboard**: Show tenant-specific data
3. **Role-based Access**: Implement permissions system
4. **Mobile Responsive**: Optimize for mobile devices
5. **Internationalization**: Add support for multiple languages

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Initial page loads correctly
- [ ] Business auth page shows OAuth providers
- [ ] Registration form pre-fills OAuth data
- [ ] Form validation works for all fields
- [ ] Colombian departments dropdown has 32 options
- [ ] Business types dropdown has 6 options
- [ ] Phone validation requires exactly 10 digits
- [ ] Password validation enforces complexity rules
- [ ] Success modal shows countdown timer
- [ ] Dashboard loads after registration
- [ ] Tokens are stored in localStorage
- [ ] Logout clears tokens and redirects to home

---

## Support

For issues or questions:
1. Check backend logs in terminal
2. Check frontend console in browser DevTools
3. Review API documentation at http://localhost:8000/docs
4. Check database records to verify data was saved

---

**Developer**: eJSc
**Last Updated**: 2026-05-14
