# Global Error Handling System

This document describes the global error handling system implemented in the Poop Tracker application.

## Overview

The error handling system provides:

- **Global Error Modal**: A centralized modal for displaying errors
- **Error Context**: React context for managing error state
- **Error Handler Hook**: Custom hook for easy error handling
- **Error Utilities**: Utility functions for different error types

## Components

### 1. Error Context (`src/contexts/ErrorContext.tsx`)

Provides global error state management:

```tsx
import { useError } from "@/contexts/ErrorContext";

const { showError, hideError, currentError, isErrorModalOpen } = useError();
```

### 2. Error Modal (`src/components/ui/error-modal.tsx`)

Displays errors with different types and styling:

- **Error**: Red styling with X icon
- **Warning**: Yellow styling with triangle icon
- **Info**: Blue styling with info icon

### 3. Error Handler Hook (`src/hooks/useErrorHandler.ts`)

Provides easy-to-use error handling methods:

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

const {
  handleError,
  handleFirebaseErrorWithModal,
  handleNetworkErrorWithModal,
  handleValidationErrorWithModal,
  showCustomError,
} = useErrorHandler();
```

### 4. Error Utilities (`src/lib/utils/errorHandler.ts`)

Utility functions for handling different error types:

- `handleFirebaseError()`: Handles Firebase authentication and Firestore errors
- `handleNetworkError()`: Handles network connectivity errors
- `handleValidationError()`: Handles form validation errors
- `createError()`: Creates custom error objects

## Usage Examples

### Basic Error Handling

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { handleError } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      // Some async operation
      await someApiCall();
    } catch (error) {
      handleError(error, "Custom error message");
    }
  };
}
```

### Firebase Error Handling

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function AuthComponent() {
  const { handleFirebaseErrorWithModal } = useErrorHandler();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      handleFirebaseErrorWithModal(error);
    }
  };
}
```

### Custom Error Messages

```tsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

function MyComponent() {
  const { showCustomError } = useErrorHandler();

  const showWarning = () => {
    showCustomError("This is a warning message", "Warning", "warning");
  };

  const showInfo = () => {
    showCustomError("This is an informational message", "Information", "info");
  };
}
```

### API Route Error Handling

```tsx
import { handleFirebaseError } from "@/lib/utils/errorHandler";

export async function POST(request: NextRequest) {
  try {
    // API logic
  } catch (error: unknown) {
    const errorInfo = handleFirebaseError(error);

    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: 400 }
    );
  }
}
```

## Error Types

### Firebase Errors

The system automatically handles common Firebase errors:

- `auth/user-not-found`: "No account found with this email address"
- `auth/wrong-password`: "Incorrect password. Please try again."
- `auth/invalid-email`: "Please enter a valid email address"
- `auth/email-already-in-use`: "An account with this email already exists"
- `auth/weak-password`: "Password is too weak. Please choose a stronger password"
- `auth/too-many-requests`: "Too many failed attempts. Please try again later"
- `auth/network-request-failed`: "Network error. Please check your connection"

### Firestore Errors

- `permission-denied`: "You are not authorized to perform this action"
- `not-found`: "User not found"
- `already-exists`: "This resource already exists"

### Network Errors

Automatically detected and handled with appropriate messaging.

### Validation Errors

Form validation errors are handled with warning styling.

## Setup

The error handling system is automatically set up in the root layout:

```tsx
// src/app/layout.tsx
<ErrorProvider>
  {children}
  <Toaster />
  <GlobalErrorModal />
</ErrorProvider>
```

## Best Practices

1. **Use the appropriate error handler** for different error types
2. **Provide custom messages** when the default ones aren't sufficient
3. **Handle errors at the appropriate level** - component level for UI errors, API level for server errors
4. **Use error types appropriately** - "error" for actual errors, "warning" for recoverable issues, "info" for informational messages
5. **Keep error messages user-friendly** and actionable

## Demo

See `src/components/debug/ErrorDemo.tsx` for examples of all error types in action.
