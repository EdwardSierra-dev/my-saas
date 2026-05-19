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

# Modules Selection / Modules Configuration

## General

After a store or business completes the registration process successfully and the success/welcome modal is displayed, the system must start the onboarding flow for module configuration.

The onboarding experience must follow modern SaaS UI/UX best practices, providing a clean, intuitive, and visually guided experience for the user.

---

# Step 1 - Introduction / Welcome Slides

## Behavior

After the successful registration modal closes (or continues), the system must display a new modal component.

The existing modal component can be reused if applicable.

This modal will work as a guided onboarding carousel containing informational messages.

---

## Slides Content

The modal must display the following messages in order:

1. "Select the modules that best fit your business."
2. "Centralize your business operations in one place."
3. "Take control of your business operations from anywhere."

---

## Navigation

- A `Next` button must appear at the bottom-right corner of the modal.
- Users can navigate through the onboarding messages sequentially.
- The modal must include progress indicators (dots/pagination indicators).
- The active indicator must visually represent the current slide position.
- The indicators must update dynamically as the user advances.

---

## Final Slide Behavior

When the user reaches the last onboarding message:

- The `Next` button label must change to:
  - `Let's Start!`

---

# Step 2 - Modules Configuration Modal

## Behavior

After the user presses `Let's Start!`, the system must display a new modal containing the available business modules.

This modal represents the module configuration step for the business.

---

## Available Modules

The following modules must be displayed as selectable checkbox options:

| Module | Monthly Price |
|---|---|
| Inventory Module | $6 USD/month |
| Promotions Module | $4 USD/month |
| Scheduling Module | $5 USD/month |
| Delivery Module | $6 USD/month |
| Reviews & Ratings Module | $3 USD/month |
| Recommendation Module | $5 USD/month |
| Analytics Module | $7 USD/month |
| Chat Module | $5 USD/month |

## Chat Module Additional Information

When the user selects or hovers the `Chat Module` checkbox option, the system must display an informational tooltip, helper message, or contextual information block.

The tooltip/message must appear directly below or near the Chat Module option inside the modules selection section.

### Tooltip Content

```txt
The privacy of your personal information is what matters most to us...
```

### UI/UX Requirements

- The tooltip should appear with a smooth transition or fade animation.
- It should feel lightweight and non-intrusive.
- The message should visually communicate trust and security.
- Recommended styles:
  - Soft background
  - Rounded borders
  - Small informational icon
  - Subtle shadow
  - Smaller secondary text

### Behavior

- The tooltip may appear:
  - On checkbox selection
  - On hover
  - Or both
- The tooltip should disappear when:
  - The module is unselected
  - The user leaves the hover state (if hover behavior is implemented)

### Technical Recommendation

The tooltip should be implemented as a reusable component to support future module-specific informational messages.

---

## UI/UX Requirements

### Modules List

- Each module must display:
  - Module name
  - Monthly pricing
  - Checkbox selector

- The UI must feel modern, modular, and scalable.
- Module cards or grouped checkbox containers are recommended.

---

## Pricing Summary

At the bottom of the modal, the system must display:

### Total Price

A dynamic total price label showing:

- The accumulated monthly cost based on selected modules.
- The total must update automatically when modules are selected or unselected.

Example:
```txt
Total: $18 USD/month
```

### Continue Action

A Continue button must appear at the bottom section of the modal.

#### Continue Button Rules
The button should remain disabled until at least one module is selected.
Once enabled, clicking the button proceeds to the confirmation step.

## Step 3 - Configuration Confirmation Modal
### Behavior

After pressing Continue, the system must display a final confirmation modal summarizing the selected configuration.

### Confirmation Information

The modal must display:

### Selected Plan Summary
- Selected modules
- Total monthly cost

### Trial Information Message

The modal must include the following informational message:

```txt
You will have 15 days of completely free trial access. After this period, the services will be temporarily unavailable and our team will contact you via email.
```

## Additional Recommendations

### UX Recommendations

- Smooth transitions between onboarding steps.
- Modern animations for modal changes.
- Maintain consistent spacing and typography.
- Mobile-first responsive behavior.
- Clear CTA hierarchy.

### Technical Recommendations

- Design the onboarding flow as reusable components.
- Keep modules configuration data centralized and configurable.
- Prepare the structure for future dynamic modules from backend/API.
- Avoid hardcoded UI duplication.

### Suggested Component Architecture
/components
    /onboarding
        IntroCarouselModal
        ModulesSelectionModal
        ModulesConfirmationModal
        ProgressIndicators
        ModuleCard

### Suggested Future Improvements

- Module previews
- Feature comparison
- Dynamic pricing plans
- Saved onboarding progress