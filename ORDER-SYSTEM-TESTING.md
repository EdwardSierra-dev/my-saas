# Order System Testing Guide

## Quick Start

This guide will help you test the newly implemented order and checkout system.

---

## Prerequisites

1. Backend server running on `http://localhost:8000`
2. Frontend server running on `http://localhost:3000`
3. Customer account created and logged in
4. At least one business registered in the system

---

## Test Scenarios

### Scenario 1: Favorites Integration in Discovery

#### Test 1.1: View Heart Icons
1. Navigate to `http://localhost:3000/customer/search`
2. Verify each business card has a heart icon in the top-right corner
3. Heart should be empty (gray outline) for non-favorited businesses

**Expected Result**: ✅ Heart icons visible on all cards

#### Test 1.2: Add to Favorites
1. Click the heart icon on any business card
2. Heart should fill with red color immediately
3. Check favorites page (`/customer/favorites`)
4. Business should appear in favorites list

**Expected Result**: ✅ Business added to favorites, heart turns red

#### Test 1.3: Remove from Favorites
1. Click the filled red heart icon
2. Heart should return to empty gray state
3. Check favorites page
4. Business should be removed from list

**Expected Result**: ✅ Business removed from favorites, heart turns gray

#### Test 1.4: Favorites Limit
1. Add 10 businesses to favorites
2. Try to add an 11th business
3. Should see alert: "Maximum 10 favorites allowed"

**Expected Result**: ✅ Cannot exceed 10 favorites

#### Test 1.5: Heart Click Doesn't Navigate
1. Click heart icon on business card
2. Should NOT navigate to business detail page
3. Should only toggle favorite status

**Expected Result**: ✅ Stays on search page, only toggles favorite

---

### Scenario 2: Business Detail Page

#### Test 2.1: Navigate to Business Detail
1. From search page, click anywhere on business card (except heart)
2. Should navigate to `/customer/business/{id}`
3. Business information should display

**Expected Result**: ✅ Business detail page loads

#### Test 2.2: Business Information Display
Verify the following information displays:
- [ ] Business name
- [ ] Business type
- [ ] Logo or placeholder icon
- [ ] City and department
- [ ] Phone number (if available)
- [ ] Email (if available)
- [ ] Address (if available)

**Expected Result**: ✅ All available information displays correctly

#### Test 2.3: Favorite Button in Header
1. Check top-right of page for favorite button
2. Should show current favorite status
3. Click to toggle favorite
4. Button text should update

**Expected Result**: ✅ Favorite button works, text updates

#### Test 2.4: Products/Services Display
1. Scroll to "Products & Services" section
2. Verify products display in grid layout
3. Each product should show:
   - Name
   - Description
   - Price (formatted currency)
   - "Service" badge (if applicable)
   - "Add to Order" button

**Expected Result**: ✅ Products display correctly

#### Test 2.5: Place Order Button
1. Locate "Place Order" button below business info
2. Should be prominent and easy to find
3. Click button
4. Order modal should open

**Expected Result**: ✅ Order modal opens

---

### Scenario 3: Order Creation

#### Test 3.1: Open Order Modal
1. Click "Place Order" button
2. Modal should appear with backdrop
3. Should show "Your Order" title
4. Should show "0/20 items • $0.00"

**Expected Result**: ✅ Order modal opens with empty state

#### Test 3.2: Add Items to Order
1. Close modal (click X or backdrop)
2. Click "Add to Order" on any product
3. Modal should open with item added
4. Item should appear in order list

**Expected Result**: ✅ Item added to order

#### Test 3.3: Add Multiple Items
1. Add 3-4 different products to order
2. Each should appear in order list
3. Counter should update (e.g., "4/20 items")

**Expected Result**: ✅ Multiple items can be added

#### Test 3.4: Adjust Quantity
1. Find quantity controls (+/- buttons)
2. Click + to increase quantity
3. Click - to decrease quantity
4. Number should update
5. Line total should recalculate

**Expected Result**: ✅ Quantity adjusts, totals update

#### Test 3.5: Remove Item
1. Click red X button on any item
2. Item should be removed from order
3. Total should recalculate
4. Counter should update

**Expected Result**: ✅ Item removed, totals update

#### Test 3.6: Maximum Items Limit
1. Try to add 21 items to order
2. Should see alert: "Maximum 20 items per order"
3. Order should remain at 20 items

**Expected Result**: ✅ Cannot exceed 20 items

#### Test 3.7: Real-time Total Calculation
1. Add item with price $25.00
2. Set quantity to 3
3. Line total should show $75.00
4. Grand total should update
5. Change quantity to 5
6. Totals should update immediately

**Expected Result**: ✅ Totals calculate correctly in real-time

#### Test 3.8: Empty Order State
1. Remove all items from order
2. Should see empty state:
   - 🛒 icon
   - "Your order is empty"
   - "Add products or services to continue"

**Expected Result**: ✅ Empty state displays

---

### Scenario 4: Checkout Flow

#### Test 4.1: Open Checkout
1. Add items to order
2. Click "Complete Purchase" button
3. Checkout modal should open
4. Order modal should close

**Expected Result**: ✅ Checkout modal opens

#### Test 4.2: Order Summary Display
Verify checkout shows:
- [ ] "Order Summary" section
- [ ] Each item with quantity
- [ ] Line totals for each item
- [ ] Grand total (prominent)

**Expected Result**: ✅ Order summary displays correctly

#### Test 4.3: Payment Method Selection
1. Locate "Payment Method" section
2. Should see two options:
   - Credit/Debit Card (radio button)
   - Cash on Delivery/Service (checkbox)

**Expected Result**: ✅ Payment options visible

#### Test 4.4: Select Card Payment
1. Click "Credit/Debit Card" radio button
2. Should be selected
3. Cash checkbox should be unchecked

**Expected Result**: ✅ Card payment selected

#### Test 4.5: Select Cash Payment
1. Click "Cash on Delivery/Service" checkbox
2. Should be checked
3. Card radio should be unselected
4. Description should explain: "Pay in person after receiving the service or delivery"

**Expected Result**: ✅ Cash payment selected, card unselected

#### Test 4.6: Payment Validation
1. Unselect all payment methods
2. Click "Complete Purchase"
3. Should see alert: "Please select a payment method"
4. Purchase should not complete

**Expected Result**: ✅ Validation prevents purchase without payment method

#### Test 4.7: Complete Purchase
1. Select a payment method
2. Click "Complete Purchase"
3. Should see confirmation alert with:
   - "Order placed successfully!"
   - Total amount
   - Payment method
4. All modals should close
5. Order should reset

**Expected Result**: ✅ Purchase completes, order resets

---

### Scenario 5: Mobile Responsiveness

#### Test 5.1: Business Search on Mobile
1. Resize browser to mobile width (<768px)
2. Business cards should stack vertically
3. Heart icons should remain visible
4. Touch targets should be large enough

**Expected Result**: ✅ Search page responsive

#### Test 5.2: Business Detail on Mobile
1. Open business detail on mobile
2. Layout should be single column
3. Products should stack vertically
4. "Place Order" button should be full width

**Expected Result**: ✅ Detail page responsive

#### Test 5.3: Order Modal on Mobile
1. Open order modal on mobile
2. Modal should fit screen
3. Buttons should be easily tappable
4. Quantity controls should be large enough

**Expected Result**: ✅ Order modal responsive

#### Test 5.4: Checkout Modal on Mobile
1. Open checkout on mobile
2. Payment options should be easily selectable
3. "Complete Purchase" button should be full width
4. Text should be readable

**Expected Result**: ✅ Checkout modal responsive

---

### Scenario 6: Favorites Synchronization

#### Test 6.1: Add Favorite from Search
1. Add favorite from search page
2. Navigate to business detail page
3. Favorite button should show "Remove from Favorites"

**Expected Result**: ✅ Favorite status synced

#### Test 6.2: Remove Favorite from Detail
1. Remove favorite from business detail page
2. Navigate back to search page
3. Heart icon should be empty (gray)

**Expected Result**: ✅ Favorite status synced

#### Test 6.3: Check Favorites Page
1. Add favorite from search
2. Navigate to `/customer/favorites`
3. Business should appear in list
4. Remove from favorites page
5. Go back to search
6. Heart should be empty

**Expected Result**: ✅ Favorites sync across all pages

---

### Scenario 7: Edge Cases

#### Test 7.1: Rapid Favorite Toggling
1. Quickly click heart icon multiple times
2. Should handle gracefully
3. Final state should be correct

**Expected Result**: ✅ Handles rapid clicks

#### Test 7.2: Order with Single Item
1. Add only one item to order
2. Complete checkout
3. Should work normally

**Expected Result**: ✅ Single item orders work

#### Test 7.3: Order with Maximum Items
1. Add exactly 20 items
2. Complete checkout
3. Should work normally

**Expected Result**: ✅ Maximum items orders work

#### Test 7.4: Close Modal with Backdrop
1. Open order modal
2. Click outside modal (on backdrop)
3. Modal should close
4. Order should be preserved

**Expected Result**: ✅ Backdrop closes modal, preserves order

#### Test 7.5: Close Modal with X Button
1. Open order modal
2. Click X button in top-right
3. Modal should close
4. Order should be preserved

**Expected Result**: ✅ X button closes modal, preserves order

---

## Browser Testing

Test on multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## Device Testing

Test on multiple devices:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large Mobile (414x896)

---

## Performance Testing

### Load Time
- [ ] Business search page loads < 2s
- [ ] Business detail page loads < 2s
- [ ] Modals open instantly
- [ ] Favorites toggle responds < 500ms

### Smooth Interactions
- [ ] No lag when adding items
- [ ] Quantity updates instantly
- [ ] Total calculations instant
- [ ] Modal animations smooth

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Can activate buttons with Enter/Space
- [ ] Can close modals with Escape
- [ ] Focus indicators visible

### Screen Reader
- [ ] Business cards announced correctly
- [ ] Favorite status announced
- [ ] Order items announced
- [ ] Totals announced

---

## Common Issues & Solutions

### Issue: Heart Icon Not Changing Color
**Solution:**
- Check if favorites API is responding
- Verify token is valid
- Check browser console for errors

### Issue: Order Modal Not Opening
**Solution:**
- Check browser console for errors
- Verify React state is updating
- Try hard refresh (Cmd+Shift+R)

### Issue: Total Not Calculating
**Solution:**
- Check if prices are numbers
- Verify quantity is a number
- Check calculation logic

### Issue: Checkout Not Working
**Solution:**
- Verify payment method is selected
- Check validation logic
- Look for console errors

---

## Test Data

### Sample Business
```json
{
  "id": 1,
  "name": "Test Barbershop",
  "business_type": "barbershop",
  "city": "Bogotá",
  "department": "Cundinamarca",
  "phone": "+57 300 123 4567",
  "email": "test@barbershop.com"
}
```

### Sample Products
```json
[
  {
    "id": 1,
    "name": "Haircut",
    "description": "Professional haircut",
    "price": 2500,
    "is_service": true
  },
  {
    "id": 2,
    "name": "Hair Coloring",
    "description": "Full hair coloring",
    "price": 5000,
    "is_service": true
  }
]
```

---

## Success Criteria

All tests pass when:

✅ Heart icons appear and function correctly  
✅ Favorites sync across all pages  
✅ Business detail page displays correctly  
✅ Order modal opens and functions  
✅ Items can be added/removed  
✅ Quantities adjust correctly  
✅ Totals calculate accurately  
✅ Checkout flow works end-to-end  
✅ Payment methods selectable  
✅ Cash payment option works  
✅ All features work on mobile  
✅ No console errors  
✅ Performance is acceptable  
✅ Accessibility requirements met  

---

## Reporting Issues

When reporting issues, include:
1. Test scenario number
2. Steps to reproduce
3. Expected result
4. Actual result
5. Browser and device
6. Screenshots (if applicable)
7. Console errors (if any)

---

**Testing Date**: May 26, 2024  
**Version**: 1.0.0  
**Status**: Ready for Testing
