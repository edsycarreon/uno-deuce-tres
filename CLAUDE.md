# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Core Architecture

This is a **social poop tracking app** built with Next.js 15 App Router, Firebase, and a "neobrutalism" design system. Users log bathroom activities and compete in group leaderboards.

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS with neobrutalism design system
- **Form Management**: React Hook Form + Zod validation
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Auth
- **State Management**: TanStack React Query
- **Error Handling**: React Context + Custom hooks

### Key Architectural Patterns

**Firebase Integration**: The app uses both client-side Firebase SDK and Firebase Admin SDK:

- Client SDK (`src/lib/firebase/config.ts`) for real-time auth/data in components
- Admin SDK (`src/lib/firebase/admin.ts`) for server-side operations in API routes
- All API routes (`src/app/api/`) require Firebase ID token authentication

**Data Architecture**: Firestore collections follow a denormalized structure optimized for reads:

- `users/{userId}` - User profiles and settings
- `users/{userId}/poopLogs/{logId}` - Individual logs (subcollection)
- `users/{userId}/dailyStats/{dateKey}` - Pre-calculated daily statistics
- `groups/{groupId}` - Group metadata with memberIds array for quick lookups
- `groups/{groupId}/members/{userId}` - Detailed member data
- `dailyAggregations/{dateKey}` - Global and per-group statistics
- `inviteCodes/{inviteCode}` - Group invite codes with validation data

**Core Data Types**:

```typescript
interface UserDocument {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  settings: {
    defaultPrivacy: boolean;
    notifications: boolean;
    timezone: string;
  };
  stats: {
    totalLogs: number;
    publicLogs: number;
    currentStreak: number;
    longestStreak: number;
  };
  groups: string[];
}

interface PoopLogDocument {
  id: string;
  userId: string;
  timestamp: Timestamp;
  isPublic: boolean;
  createdAt: Timestamp;
  dayKey: string; // "YYYY-MM-DD"
  weekKey: string; // "YYYY-W##"
  monthKey: string; // "YYYY-MM"
  groups: string[];
}

interface GroupDocument {
  id: string;
  name: string;
  createdBy: string;
  inviteCode: string;
  stats: {
    memberCount: number;
    totalLogs: number;
    lastActivity: Timestamp;
  };
  memberIds: string[];
}
```

**State Management**:

- TanStack React Query for server state, caching, and optimistic updates
- Custom hooks (`src/hooks/`) encapsulate business logic and Firebase operations
- Error handling via React Context (`src/contexts/ErrorContext.tsx`)

**Component Architecture**:

- Shadcn/ui base components in `src/components/ui/`
- Feature-specific components organized by domain (`groups/`, `forms/`, `layout/`)
- All forms use React Hook Form + Zod validation schemas from `src/lib/validations/schemas.ts`

### Critical Design Constraints

**Neobrutalism Design System**: All styling must use CSS custom properties from `src/app/globals.css`. Never use hardcoded colors - always reference design tokens like `var(--color-main)`, `var(--color-border)`, `var(--shadow-shadow)`. The visual style emphasizes bold colors, strong borders, and playful, accessible UI components.

**Privacy Model**: Logs have `isPublic` boolean. Private logs are only visible to the owner; public logs are visible to group members. This affects all queries and security rules.

**Real-time Updates**: The app uses Firestore real-time listeners extensively. Use the existing patterns in custom hooks rather than direct Firestore calls.

**Code Organization**:
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── firebase/         # Firebase configuration and helpers
│   ├── validations/      # Zod schemas
│   └── utils/           # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

**Naming Conventions**:
- Files: kebab-case (`user-profile.tsx`)
- Components: PascalCase (`UserProfile`)  
- Functions/Variables: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`MAX_GROUP_SIZE`)
- Types/Interfaces: PascalCase (`UserDocument`, `PoopLogDocument`)

### Data Flow Patterns

**Poop Logging**:

1. `useLogPoop` hook from `src/hooks/usePoopLogs.ts` handles optimistic updates
2. Calls API route `/api/poop-logs` with Firebase ID token
3. Server uses `logPoopWithUpdates` from `src/lib/firebase/poopLogger.ts` for atomic operations
4. Updates user stats, daily stats, and group aggregations in single transaction

**Group Operations**:

1. `useGroups` hook manages all group CRUD operations
2. Invite codes are 6-character strings stored in separate collection for validation
3. Group membership affects which logs are visible and counted in leaderboards

**Authentication Flow**:

1. `useAuth` hook manages Firebase Auth state and user profile sync
2. Route protection via middleware checking auth state
3. User profiles auto-created in Firestore on signup with timezone detection

### Security Rules

Security rules enforce the privacy model:

- Users can only read/write their own data
- Group members can read group info and public logs from other members
- Daily aggregations are read-only for all authenticated users
- Invite codes are read-only for validation

### Performance Optimizations

**Database Strategy**:
- Denormalized data for fast reads (user displayName in group members)
- Composite indexes for efficient queries
- Pagination for large datasets using cursor-based pagination
- Real-time listeners used judiciously

**Frontend Strategy**:  
- React.memo for expensive components
- useCallback and useMemo appropriately
- Proper loading states and Suspense for code splitting
- Optimistic updates with rollback scenarios

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

### Key Utilities & Development Standards

**Date/Time Keys**: `src/lib/utils/poopLogKeys.ts` generates consistent date keys (`dayKey`, `weekKey`, `monthKey`) for aggregations and queries. Always use these for consistency.

**Error Handling**: `src/lib/utils/errorHandler.ts` provides Firebase-specific error parsing. Use with `useErrorHandler` hook for user-friendly error messages.

**TypeScript Types**: All Firestore document interfaces defined in `src/types/index.ts`. Use these types consistently across the app.

**Code Quality Standards**:
- TypeScript strict mode enabled
- ESLint with recommended rules
- Prettier for code formatting
- Pre-commit hooks for quality checks

**Form Validation Pattern**:
```typescript
const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(50),
  isPrivate: z.boolean().default(false),
  maxMembers: z.number().min(2).max(100).default(20),
});
```

**Component Guidelines**:
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow single responsibility principle
- Use composition over inheritance
- Implement proper error boundaries

## API Architecture

The application uses API routes with React Query for data management:

- **API Routes**: Server-side Firebase operations using Firebase Admin SDK
- **React Query**: Client-side data fetching and caching  
- **Authentication**: Token-based auth with Firebase ID tokens

### API Routes

#### `/api/poop-logs`

- `POST`: Log a new poop entry
- `GET`: Fetch user's poop logs

#### `/api/auth/signup`

- `POST`: Handle user registration

#### `/api/auth/signin`

- `POST`: Handle user authentication

### React Query Hooks

#### `usePoopLogs(limit)`

- Fetches user's poop logs
- Automatically handles caching and refetching
- Requires authentication

#### `useLogPoop()`

- Mutation hook for logging poops
- Automatically invalidates related queries on success
- Handles optimistic updates

#### `useSignUp()` and `useSignIn()`

- Mutation hooks for authentication
- Handle API calls to `/api/auth/signup` and `/api/auth/signin`


## Usage Examples

### Logging a Poop

```tsx
import { useLogPoop } from "@/hooks/usePoopLogs";
import { Timestamp } from "firebase/firestore";

const { mutate: logPoop, isPending } = useLogPoop();

const handleLogPoop = () => {
  const logData = {
    userId: user.uid,
    timestamp: Timestamp.fromDate(new Date()),
    isPublic: false,
    createdAt: Timestamp.fromDate(new Date()),
    dayKey: "2024-01-15",
    weekKey: "2024-W03",
    monthKey: "2024-01",
    groups: [],
  };

  logPoop(logData, {
    onSuccess: () => {
      toast.success("Poop logged successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
```

### Fetching Poop Logs

```tsx
import { usePoopLogs } from "@/hooks/usePoopLogs";

const { data, isLoading, error } = usePoopLogs(10);

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    {data?.logs?.map((log) => (
      <div key={log.id}>
        {new Date(log.timestamp.seconds * 1000).toLocaleString()}
      </div>
    ))}
  </div>
);
```

### Benefits

1. **Security**: Firebase credentials are server-side only
2. **Performance**: React Query provides caching and background updates
3. **Type Safety**: Full TypeScript support
4. **Error Handling**: Centralized error handling
5. **Optimistic Updates**: Better UX with immediate feedback

### Troubleshooting

**Common Issues:**
1. **Firebase Admin SDK not initialized**: Check environment variables
2. **Authentication errors**: Ensure ID token is being sent correctly
3. **Type errors**: Verify timestamp types match Firestore Timestamp

**Debugging:**
- Use React Query DevTools for debugging queries
- Check browser network tab for API calls
- Verify Firebase Admin SDK logs in server console

## Environment Variables

Add these to your `.env.local` for Firebase configuration:

```env
# Firebase Admin SDK (server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# Firebase Client SDK (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Development Guidelines

### Feature Development Pattern

When adding new features, follow these established patterns:

1. Define types in `src/types/index.ts`
2. Add Zod validation schemas in `src/lib/validations/schemas.ts`
3. Create custom hooks for data operations
4. Use existing error handling and loading patterns
5. Follow the neobrutalism design system constraints
6. Use API routes with Firebase Admin SDK for server-side operations
7. Implement React Query hooks for data fetching and caching
8. Handle rollback scenarios for optimistic updates

### Atomic Operations Pattern

Use transactions for operations affecting multiple documents:

```typescript
const logPoopWithUpdates = async (userId: string, logData: PoopLogData) => {
  const batch = writeBatch(db);
  
  // Add the log
  const logRef = doc(collection(db, `users/${userId}/poopLogs`));
  batch.set(logRef, logData);
  
  // Update user stats
  const userRef = doc(db, `users/${userId}`);
  batch.update(userRef, {
    "stats.totalLogs": increment(1),
    "stats.publicLogs": increment(logData.isPublic ? 1 : 0),
    lastActive: serverTimestamp(),
  });
  
  await batch.commit();
};
```
