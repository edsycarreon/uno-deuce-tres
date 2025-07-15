# API Migration Guide

This document outlines the migration from direct Firebase calls to API routes with React Query.

## Overview

The application has been refactored to use:

- **API Routes**: Server-side Firebase operations using Firebase Admin SDK
- **React Query**: Client-side data fetching and caching
- **Authentication**: Token-based auth with Firebase ID tokens

## New Architecture

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

## Environment Variables

Add these to your `.env.local` for Firebase Admin SDK:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

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

## Benefits

1. **Security**: Firebase credentials are server-side only
2. **Performance**: React Query provides caching and background updates
3. **Type Safety**: Full TypeScript support
4. **Error Handling**: Centralized error handling
5. **Optimistic Updates**: Better UX with immediate feedback

## Migration Steps

1. Install dependencies:

   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools firebase-admin
   ```

2. Set up Firebase Admin SDK credentials

3. Replace direct Firebase calls with API routes

4. Update components to use React Query hooks

5. Test authentication and data flow

## Troubleshooting

### Common Issues

1. **Firebase Admin SDK not initialized**: Check environment variables
2. **Authentication errors**: Ensure ID token is being sent correctly
3. **Type errors**: Verify timestamp types match Firestore Timestamp

### Debugging

- Use React Query DevTools for debugging queries
- Check browser network tab for API calls
- Verify Firebase Admin SDK logs in server console
