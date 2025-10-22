# AddTherapist Wizard Component Structure

## Overview
The AddTherapistWizard component has been refactored into a modular structure for better maintainability and code organization.

## Directory Structure
```
forms/
├── AddTherapistWizard.js          # Main wizard component (orchestrator)
├── components/                    # Reusable components
│   ├── FormField.js              # Generic form field component
│   ├── ModalWrapper.js           # Modal container with animations
│   └── StepIndicators.js         # Progress step indicators
├── steps/                        # Individual wizard steps
│   ├── IdentitySelectionStep.js  # Step 1: Choose user type
│   ├── TherapistRegistrationStep.js # Step 2: Therapist form
│   ├── UserRecommendationStep.js # Step 2: User recommendation form
│   ├── IdentityChoiceStep.js    # Step 3: Anonymous vs registered
│   └── ReviewStep.js            # Step 4: Leave review
└── hooks/                        # Custom React hooks
    └── useFormValidation.js     # Form validation logic

```

## Component Responsibilities

### Main Component (AddTherapistWizard.js)
- State management for the entire wizard
- Navigation between steps
- Form submission handling
- Orchestrates all sub-components

### Step Components
Each step component is responsible for:
- Rendering its specific UI
- Handling user input through props
- No internal state management (controlled by parent)

### Utility Components
- **FormField**: Reusable input component supporting text, textarea, and select
- **ModalWrapper**: Handles modal animations and overlay
- **StepIndicators**: Visual progress indicator

### Custom Hooks
- **useFormValidation**: Contains all validation logic and button state management

## Usage
The component is used the same way as before:
```jsx
<AddTherapistWizard isOpen={isOpen} onClose={handleClose} />
```

## Benefits of New Structure
1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Form fields and modal wrapper can be reused
3. **Testability**: Smaller components are easier to test
4. **Performance**: Smaller file sizes and potential for code splitting
5. **Collaboration**: Multiple developers can work on different steps