# Quick Reference - Customer Features

## 🚀 Quick Start

```bash
# 1. Apply migration
cd backend && alembic upgrade head

# 2. Restart servers
# Backend: uvicorn app.main:app --reload
# Frontend: npm run dev

# 3. Test at http://localhost:3000/customer/dashboard
```

---

## 📍 Routes

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/customer/dashboard` | Home with discovery cards |
| Profile | `/customer/profile` | Edit customer name |
| Favorites | `/customer/favorites` | View/manage favorites (max 10) |
| Purchases | `/customer/history` | Purchase history (15/page) |
| Reviews | `/customer/reviews` | Review history (20/page) |

---

## 🔌 API Endpoints

```bash
# Profile
GET    /api/v1/customers/profile
PUT    /api/v1/customers/profile

# Favorites
GET    /api/v1/customers/favorites
POST   /api/v1/customers/favorites
DELETE /api/v1/customers/favorites/{id}

# History
GET    /api/v1/customers/purchases?page=1&limit=15
GET    /api/v1/customers/reviews?page=1&limit=20
```

---

## 🗄️ Database Tables

```sql
customer_preferences  -- Customer preference categories
customer_favorites    -- Favorite businesses (max 10)
customer_purchases    -- Purchase history
customer_reviews      -- Reviews and ratings (1-5 stars)
```

---

## ✅ Features Implemented

- [x] Mobile menu fix (right-aligned on mobile)
- [x] Discovery cards update (Local Stores, Services)
- [x] Edit profile (name only)
- [x] Favorites system (max 10)
- [x] Purchase history (paginated)
- [x] Review history (paginated)

---

## 🧪 Quick Test

```bash
# Get your token after login
TOKEN="your_jwt_token"

# Test profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/customers/profile

# Test favorites
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/customers/favorites
```

---

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Verify hamburger menu on **right side**
5. Test all pages for responsiveness

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Login again to get fresh token |
| Migration fails | Run `alembic current` to check status |
| Menu not right-aligned | Clear cache, hard refresh |
| Empty data | Add test data or wait for real data |

---

## 📚 Full Documentation

- **Implementation**: `CUSTOMER-FEATURES-IMPLEMENTATION.md`
- **Testing Guide**: `CUSTOMER-FEATURES-TESTING.md`
- **Status**: `IMPLEMENTATION-STATUS.md`
- **Requirements**: `user-home.md`

---

## 🎯 Key Points

- ✅ All features complete and ready
- ✅ Mobile-first responsive design
- ✅ Secure authentication required
- ✅ Pagination for large datasets
- ✅ Empty states with CTAs
- ✅ Modern SaaS UI/UX

---

**Status**: ✅ Ready for Testing  
**Date**: May 26, 2024
