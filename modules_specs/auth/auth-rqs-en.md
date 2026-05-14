# Authentication Module

## Registration Flow / Business / Customers

### General Requirements

- The authentication and registration experience must follow modern UI/UX best practices focused on SaaS platforms and customer engagement applications.

- The authentication module must support responsive behavior across web and mobile devices while maintaining the same core functionality.

---

## Initial Access Screen

### Web & Mobile

- When opening the application, the system must display two primary rounded buttons:
  - Business / Store
  - Customer

- Below the buttons, the system must display a link with the text:
  - "Already have an account?"

- Near the bottom section of the login screen (before the footer area), the application logo must be displayed in SVG format.

- Below the logo, a smaller text label must display the developer name:
  - "eJSc"

---

## Business Registration Flow

- When the user clicks the "Business / Store" button, the system must display authentication provider options vertically stacked.

### Supported Authentication Providers

- Google
- Microsoft
- LinkedIn

- After selecting an authentication provider, the system must open the registration form and automatically preload the available user data retrieved from the selected provider.

---

## Registration Form

The registration form must contain the following fields:

### Required Fields

- Email
  - Automatically retrieved from the OAuth provider when available.

- Name
  - Retrieved from the OAuth provider.
  - The user must be allowed to edit this field.

- Business Type
  - Select dropdown with predefined options:
    - Barbershop / Hair Salon
    - Spa
    - Local Store
    - Restaurant
    - Pharmacy
    - Independent Worker

- City
  - Text input field.

- Department / State
  - Dropdown list containing all Colombia departments.

- Phone Number
  - Must validate a 10-digit Colombian phone number format.

- Password
- Confirm Password
  - Must follow standard security requirements:
    - Minimum length
    - Uppercase letters
    - Lowercase letters
    - Numbers
    - Special characters

### Optional Fields

- Address
  - Optional field.
  - The system should recommend adding an address when the business offers on-site or delivery services.

---

## Registration Success Flow

- After successful registration, the system must display a confirmation modal with the message:
  - "Registration completed successfully"

- The modal must:
  - Include a visible 5-second countdown timer.
  - Allow manual closing before the timer ends.

---

## Mobile App Considerations

- Mobile screens must preserve the same features and flows available in the web version.

- The interface must be adapted using responsive and mobile-first design principles.