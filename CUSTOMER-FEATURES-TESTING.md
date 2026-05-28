# Customer Features Testing Guide

## Quick Start

This guide will help you test the newly implemented customer features.

---

## Prerequisites

1. Backend server running on `http://localhost:8000`
2. Frontend server running on `http://localhost:3000`
3. Database with migrations applied
4. At least one customer account created
5. At least one business registered in the system

---

## Step 1: Apply Database Migration

Run the migration to create the new customer features tables:

```bash
cd backend

# If using Docker
docker-compose exec backend alembic upgrade head

# If running locally
alembic upgrade head
```

This will create the following tables:
- `customer_preferences`
- `customer_favorites`
- `customer_purchases`
- `customer_reviews`

---

## Step 2: Start the Servers

### Backend
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## Step 3: Login as Customer

1. Navigate to `http://localhost:3000/customer/login`
2. Login with your customer credentials
3. You should be redirected to `http://localhost:3000/customer/dashboard`

---

## Step 4: Test Discovery Section Updates

### Verify Updated Cards

On the dashboard, you should see three discovery cards:

1. **Fast Food** (single card with 🍔 icon)
2. **Local Stores** (single card with 🏪 icon) - **NEW**
3. **Services** (single card with ✂️ icon) - **NEW**

**Expected Behavior:**
- Each card should be clickable
- Clicking redirects to search page with appropriate filters
- Cards should have hover effects (scale and border color change)

---

## Step 5: Test Mobile Menu Alignment

### Desktop View
1. Open dashboard on desktop browser
2. Hamburger menu should appear on the **left side** of header
3. Click hamburger menu
4. Sidebar should slide in from the **left**

### Mobile View
1. Resize browser to mobile width (< 1024px) or use mobile device
2. Hamburger menu should appear on the **right side** of header
3. Click hamburger menu
4. Sidebar should slide in from the **right** - **FIXED**

**Menu Options Should Include:**
- Edit Profile Information
- Favorites
- Purchase History
- Product Review History
- Logout

---

## Step 6: Test Edit Profile Information

### Access Profile Page
1. Click hamburger menu
2. Click "Edit Profile Information"
3. Should navigate to `/customer/profile`

### Test Editable Fields
1. Click "Edit Profile" button
2. Change your name
3. Click "Save Changes"
4. Should see success message
5. Name should update in header/menu

### Test Non-Editable Fields
1. Verify email field shows "Non-editable" badge
2. Verify email cannot be changed
3. If OAuth user, verify auth provider shows "Non-editable" badge

### Test Validation
1. Try to save empty name - should show error
2. Try to save very long name (>100 chars) - should show error
3. Click "Cancel" - should revert changes

---

## Step 7: Test Favorites System

### Access Favorites Page
1. Click hamburger menu
2. Click "Favorites"
3. Should navigate to `/customer/favorites`

### Test Empty State
If no favorites exist:
- Should see empty state with 💔 icon
- Should see "No favorites yet" message
- Should see "Discover Businesses" button

### Test Adding Favorites
1. Go back to dashboard
2. Search for a business
3. Click on business to view details
4. Click "Add to Favorites" button (if implemented in business detail page)
5. Go to Favorites page
6. Should see the business card

### Test Favorites Display
Each favorite card should show:
- Business image or icon
- Business name
- Business type
- "View Details" button
- "Remove" button (X icon)

### Test Removing Favorites
1. Click the X button on a favorite card
2. Should see confirmation dialog
3. Confirm removal
4. Card should disappear
5. Should see success message

### Test Favorites Limit
1. Try to add more than 10 favorites
2. Should see error message: "Maximum 10 favorites allowed"
3. Counter should show "X/10" at top of page

---

## Step 8: Test Purchase History

### Access Purchase History Page
1. Click hamburger menu
2. Click "Purchase History"
3. Should navigate to `/customer/history`

### Test Empty State
If no purchases exist:
- Should see empty state with 🛍️ icon
- Should see "No purchases yet" message
- Should see "Start Shopping" button

### Test Purchase Display (Desktop)
If purchases exist:
- Should see table with columns:
  - Business
  - Product/Service
  - Date
  - Status
  - Total
- Status badges should have colors:
  - Completed/Delivered: Green
  - Pending: Yellow
  - Cancelled: Red

### Test Purchase Display (Mobile)
1. Resize to mobile width
2. Table should convert to cards
3. Each card should show all purchase info

### Test Pagination
If more than 15 purchases:
1. Should see pagination controls at bottom
2. Should show "Page X of Y"
3. Click "Next" - should load next page
4. Click "Previous" - should go back
5. First page should disable "Previous"
6. Last page should disable "Next"

---

## Step 9: Test Review History

### Access Review History Page
1. Click hamburger menu
2. Click "Product Review History"
3. Should navigate to `/customer/reviews`

### Test Empty State
If no reviews exist:
- Should see empty state with ⭐ icon
- Should see "No reviews yet" message
- Should see "Explore Businesses" button

### Test Review Display
If reviews exist, each card should show:
- Business name
- Product/service name (if applicable)
- Star rating (1-5 stars, filled in yellow)
- Comment text
- Review date

### Test Star Rating Display
- Filled stars should be yellow
- Empty stars should be gray
- Should show exactly 5 stars total

### Test Pagination
If more than 20 reviews:
1. Should see pagination controls at bottom
2. Should show "Page X of Y"
3. Test next/previous navigation
4. Verify page numbers update correctly

---

## Step 10: Test Responsive Design

### Test on Different Screen Sizes

#### Desktop (>1024px)
- Hamburger menu on left
- Full table layouts
- Sidebar slides from left
- All features fully visible

#### Tablet (768px - 1024px)
- Hamburger menu on right
- Table/card hybrid layouts
- Sidebar slides from right
- Touch-friendly buttons

#### Mobile (<768px)
- Hamburger menu on right
- Card layouts only
- Sidebar slides from right
- Large touch targets
- Optimized spacing

---

## Step 11: Test API Endpoints Directly

### Get Profile
```bash
TOKEN="your_jwt_token_here"

curl -X GET "http://localhost:8000/api/v1/customers/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### Update Profile
```bash
curl -X PUT "http://localhost:8000/api/v1/customers/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

### Get Favorites
```bash
curl -X GET "http://localhost:8000/api/v1/customers/favorites" \
  -H "Authorization: Bearer $TOKEN"
```

### Add Favorite
```bash
curl -X POST "http://localhost:8000/api/v1/customers/favorites" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"business_id":1}'
```

### Remove Favorite
```bash
curl -X DELETE "http://localhost:8000/api/v1/customers/favorites/1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Purchases
```bash
curl -X GET "http://localhost:8000/api/v1/customers/purchases?page=1&limit=15" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Reviews
```bash
curl -X GET "http://localhost:8000/api/v1/customers/reviews?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Step 12: Test Error Handling

### Test Authentication Errors
1. Try accessing endpoints without token
2. Should get 401 Unauthorized

### Test Authorization Errors
1. Try accessing with business user token
2. Should get 403 Forbidden

### Test Validation Errors
1. Try to update profile with empty name
2. Try to add favorite with invalid business_id
3. Should get 422 Unprocessable Entity

### Test Conflict Errors
1. Try to add same favorite twice
2. Should get 409 Conflict

### Test Not Found Errors
1. Try to remove non-existent favorite
2. Should get 404 Not Found

---

## Common Issues & Solutions

### Issue: Migration Fails
**Solution:**
```bash
# Check current migration status
alembic current

# If needed, downgrade and upgrade
alembic downgrade -1
alembic upgrade head
```

### Issue: API Returns 401
**Solution:**
- Check if token is valid
- Check if token is expired
- Login again to get fresh token

### Issue: Favorites Not Showing
**Solution:**
- Check if customer_favorites table exists
- Check if foreign keys are correct
- Verify business_id exists in tenants table

### Issue: Mobile Menu Not Right-Aligned
**Solution:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check CSS classes in dashboard page

### Issue: Pagination Not Working
**Solution:**
- Check if total count is correct
- Verify page parameter is being sent
- Check browser console for errors

---

## Test Data Setup (Optional)

If you need test data, you can insert some manually:

### Add Test Purchases
```sql
INSERT INTO customer_purchases (customer_id, business_id, product_name, purchase_date, status, total_amount)
VALUES 
  (1, 1, 'Haircut Service', '2024-05-20 10:00:00', 'completed', 2500),
  (1, 2, 'Pizza Margherita', '2024-05-21 12:30:00', 'delivered', 1500),
  (1, 1, 'Hair Coloring', '2024-05-22 14:00:00', 'pending', 5000);
```

### Add Test Reviews
```sql
INSERT INTO customer_reviews (customer_id, business_id, product_name, comment, rating, review_date)
VALUES 
  (1, 1, 'Haircut Service', 'Excellent service! Very professional.', 5, '2024-05-20 11:00:00'),
  (1, 2, 'Pizza Margherita', 'Delicious pizza, fast delivery.', 4, '2024-05-21 13:00:00');
```

### Add Test Favorites
```sql
INSERT INTO customer_favorites (customer_id, business_id)
VALUES 
  (1, 1),
  (1, 2);
```

---

## Success Criteria

All features are working correctly if:

✅ Mobile menu appears on right side on mobile devices
✅ Discovery cards show "Local Stores" and "Services"
✅ Profile page allows editing name only
✅ Favorites can be added/removed (max 10)
✅ Purchase history displays with pagination (15 per page)
✅ Review history displays with pagination (20 per page)
✅ All pages are responsive and mobile-friendly
✅ API endpoints return correct data
✅ Error handling works properly
✅ Authentication and authorization work correctly

---

## Next Steps After Testing

1. Report any bugs found
2. Suggest UI/UX improvements
3. Test on real mobile devices
4. Perform load testing with many records
5. Test with different browsers
6. Verify accessibility compliance

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify database tables were created
4. Ensure all dependencies are installed
5. Try clearing browser cache and localStorage

**Happy Testing! 🎉**
