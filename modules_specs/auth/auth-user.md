# Customer Authentication & Customer Experience Module

## Customer Registration

### Supported Authentication Providers

Customers must be able to register and authenticate using:

- Google
- Microsoft Outlook
- LinkedIn

---

# Traditional Registration Form

- The system must also provide a traditional registration form for users who do not want to use OAuth providers.

---

## Registration Form Requirements

The customer registration form must include:

- Full Name
- Email
- Password
- Confirm Password

---

# User Preferences & Interests

- During the registration process, the system must ask customers about their interests and consumption preferences.

- These preferences will later be used for:
  - Recommendations
  - Promotions
  - Personalized business discovery

---

## Available Preference Categories

- Beauty & Aesthetics
- Fast Food
- Pharmacy
- Specialists
  - Independent workers offering services

---

# Business & Specialist Search

- Customers must be able to search businesses and specialists by:
  - Name
  - Business type/category

---

# Business Categories

- The business categories visible to customers must reuse the same category list defined during business registration.

Examples:
- Barbershop / Hair Salon
- Spa
- Restaurant
- Pharmacy
- Independent Worker
- Local Store

---

# Favorites System

- Customers may save favorite:
  - Businesses
  - Specialists

- Maximum allowed favorites:
  - 10 total items

---

# Favorites Management

- Customers must be able to:
  - Add favorites
  - Remove favorites
  - Edit and manage the favorites list

---

# Purchase History

- Customers must be able to view their purchase history.

- The purchase history must display:
  - Business name
  - Purchased products/services
  - Date
  - Delivery/service status
  - Total amount

---

# Customer Chat System

- Customers must be able to chat with:
  - Businesses
  - Specialists

- Chat access must follow the active service/order rules defined in the Chat Module.

- Chats must disappear from the UI after the configured expiration period.

- Chat records must remain stored securely on the server.

---

# Delivery Tracking

- If the order includes delivery:
  - Customers must be able to track the delivery status in real time.

---

## Supported Delivery Statuses

- Received
- In Progress
- Delivered
- Returned

---

# Customer Operations Menu

## Hamburger Menu Options

The customer interface must contain a hamburger menu including:

- Logout
- Change Profile Photo
- Change Password
- Contact Support

---

# Products & Services Browsing

- Customers must be able to:
  - View products
  - View services
  - Browse business catalogs
  - Access specialist services

---

# Reviews & Ratings

- Customers must be able to:
  - Leave comments
  - Rate businesses
  - Rate specialists
  - Rate completed services

---

# Service Rating Rules

- Customers may rate a service after it has been completed.

- Service ratings must contribute to:
  - Business overall rating
  - Specialist overall rating

---

# Recommendation System Integration

- Customer preferences, favorites, purchases, and ratings must be used to improve:
  - Personalized recommendations
  - Suggested businesses
  - Suggested services
  - Suggested promotions

---

# Security Requirements

The customer authentication and interaction systems must include protection against:

- SQL Injection
- XSS attacks
- CSRF attacks
- Brute force attacks
- Unauthorized access
- Malicious input injection

---

# Mobile App Considerations

- The mobile application must preserve the same customer features and operational flows available in the web version.

- The interface must follow responsive and mobile-first design principles.