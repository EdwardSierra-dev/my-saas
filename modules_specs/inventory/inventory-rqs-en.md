# Inventory Module

## Operations Screen

### General Requirements

- The Operations Screen must display the module title:
  - "Products / Services"

- The Inventory Module must allow businesses to manage both:
  - Physical products
  - Intangible services

- The UI must follow modern SaaS UI/UX best practices focused on simplicity, speed, and usability.

---

# Inventory Table

The system must display a data table containing the following columns:

- Name
- Price
- Type
- Cost
- Stock

---

# Product Pricing Recommendation

- The system may optionally recommend a selling price based on the product cost.

- Recommended pricing logic:
  - Between 20% and 35% profit margin above cost.

- The recommendation must not automatically overwrite the user-defined price.

---

# Product Details Modal

- Clicking on a product or service row must open a details modal.

- The modal must display:
  - Product/service information
  - Uploaded image/photo
  - Current stock
  - Pricing information

---

# Product Images

- Businesses must be able to upload product/service images from:
  - Product creation form
  - Product details modal

- Uploaded images must be:
  - Optimized
  - Compressed
  - Storage-efficient

---

# Product Deletion Protection

- Product deletion must require double confirmation.

- When attempting to delete a product/service:
  - The system must display a confirmation modal.

- The modal must require the user to type:
  - "delete"

- The product/service may only be deleted if the typed value matches the required confirmation text.

---

# Product Creation Form

## Create Button

- A button must appear next to the module title inside the Operations Screen.

### Button Text

- "+ Create"

---

# Product Creation Modal

- Clicking the "+ Create" button must open a modal containing the product/service creation form.

---

## Modal Title

- "Product / Service Creation Form"

---

# Form Fields

## Required Fields

- Name
- Price

---

## Optional Fields

- Cost
- Quantity / Stock

---

# Minimum Stock Alert

- The form must contain a checkbox option:
  - "Enable minimum stock alert"

- When enabled:
  - The system must display an additional input field allowing the business owner to define the minimum stock threshold.

---

# Stock Alert Behavior

The minimum stock alert must trigger when:

- A sale reduces the stock to the configured minimum value.

- The business owner enters the Inventory Module and there are products close to running out of stock.

- The business owner logs into the platform.

---

# Low Stock Alerts Modal

- When low-stock products exist:
  - The system must display a modal listing all products approaching depletion.

- The modal should display:
  - Product name
  - Current stock
  - Minimum configured threshold

---

# Form Submission

- The creation modal must contain a final action button:

### Button Text

- "Create"

---

# Mobile App Considerations

- The mobile version must preserve the same inventory management capabilities available in the web version.

- All forms, tables, and modals must follow responsive and mobile-first design principles.