# Module Selection Flow

## General Requirements

- The module selection experience must follow modern UI/UX best practices focused on SaaS onboarding and customer conversion.

- The entire flow must support responsive behavior for both web and mobile devices.

- The onboarding process must feel simple, modern, lightweight, and easy to understand for small business owners.

---

# Initial Welcome Modal

## Introductory Slides

- After completing the business registration process, the system must display an onboarding modal containing 3 informational messages.

- The user must navigate between messages using a "Next" button.

### Messages

1. "Select the modules that best fit your business needs"

2. "Centralize your business operations in one place"

3. "Your business control at your fingertips"

---

## Slide Indicators

- The modal must display 3 progress indicator dots at the bottom.

- The indicators must visually represent:
  - Total number of slides
  - Current active slide

---

## Final Slide Behavior

- When the user reaches the final onboarding message:
  - The "Next" button text must change to:
    - "Let's Start!"

---

# Module Selection Modal

- After clicking "Let's Start!", the system must open a second modal containing the available platform modules.

- Modules must be displayed using checkbox selection cards or modern selectable components.

---

## Available Modules

### Chat Module — $5 USD/month

- When the user clicks or taps the "Chat" module title, the system must display a tooltip containing the following message:

> "The privacy and security of our customers is our top priority. Chat with your customers without sharing your personal phone number."

---

### Delivery Module — $6 USD/month

### Inventory Module — $6 USD/month

### Notifications Module — Included

### Promotions Module — $4 USD/month

### Recommendation Module — $5 USD/month

### Analytics Module — $7 USD/month

### Scheduling Module — $5 USD/month

### Reviews & Ratings Module — $3 USD/month

---

# Billing Rules

- The Subscription/Billing Module must be enabled by default for all business accounts.

- The Subscription/Billing Module must NOT appear inside the module selection modal.

---

# Pricing Summary

- The modal must display a real-time pricing summary label showing:
  - Total selected modules
  - Final monthly price calculation

- The total amount must update dynamically whenever a module is selected or removed.

---

# Trial Confirmation Modal

- After confirming the selected modules, the system must display a final confirmation modal.

- The modal must inform the business owner that:
  - They have access to a 15-day free trial period.
  - After the trial ends, the support team will contact them to confirm whether they want to renew or cancel the subscription.

---

# Mobile App Considerations

- The mobile application must preserve the same onboarding experience and functionality available in the web version.

- All modals and module cards must follow responsive and mobile-first design principles.