# Firestore Database Schema - Poop Tracker App

## Overview

This schema is optimized for Firestore's NoSQL structure, focusing on efficient queries, real-time updates, and scalability while maintaining data consistency.

## Core Principles

- **Denormalization**: Store data in a way that supports efficient reads
- **Query Optimization**: Structure data to minimize query complexity
- **Real-time Updates**: Design for efficient listeners and subscriptions
- **Scalability**: Handle growth in users and data volume
- **Security**: Enable granular security rules

## Collection Structure

### 1. Users Collection

**Path**: `/users/{userId}`

```typescript
interface UserDocument {
  id: string; // Document ID (matches Firebase Auth UID)
  email: string; // User's email address
  displayName: string; // User's chosen display name
  createdAt: Timestamp; // Account creation timestamp
  lastActive: Timestamp; // Last app activity
  settings: {
    defaultPrivacy: boolean; // Default privacy for new logs (true = private)
    notifications: boolean; // Enable/disable notifications
    timezone: string; // User's timezone (e.g., "America/New_York")
  };
  stats: {
    totalLogs: number; // Total number of poop logs
    publicLogs: number; // Number of public logs
    currentStreak: number; // Current consecutive days with logs
    longestStreak: number; // Longest streak achieved
    firstLogDate: Timestamp; // Date of first log (for anniversary features)
  };
  groups: string[]; // Array of group IDs user belongs to
}
```

### 2. Poop Logs Subcollection

**Path**: `/users/{userId}/poopLogs/{logId}`

```typescript
interface PoopLogDocument {
  id: string; // Auto-generated document ID
  userId: string; // Owner's user ID (denormalized for queries)
  timestamp: Timestamp; // When the poop happened
  isPublic: boolean; // Privacy setting for this log
  createdAt: Timestamp; // When the log was created in the app
  dayKey: string; // Format: "YYYY-MM-DD" for daily aggregations
  weekKey: string; // Format: "YYYY-W##" for weekly aggregations
  monthKey: string; // Format: "YYYY-MM" for monthly aggregations
  groups: string[]; // Groups this log contributes to (snapshot at creation)
}
```

### 3. Groups Collection

**Path**: `/groups/{groupId}`

```typescript
interface GroupDocument {
  id: string; // Auto-generated document ID
  name: string; // Group display name
  description?: string; // Optional group description
  createdBy: string; // User ID of creator
  createdAt: Timestamp; // Group creation timestamp
  inviteCode: string; // Unique 6-character invite code
  settings: {
    maxMembers: number; // Maximum allowed members (default: 20)
    isPrivate: boolean; // Whether group is invite-only
    allowSelfJoin: boolean; // Can users join without invite
  };
  stats: {
    memberCount: number; // Current number of members
    totalLogs: number; // Total public logs in group
    lastActivity: Timestamp; // Last log timestamp in group
  };
  memberIds: string[]; // Array of member user IDs (for quick membership checks)
}
```

### 4. Group Members Subcollection

**Path**: `/groups/{groupId}/members/{userId}`

```typescript
interface GroupMemberDocument {
  userId: string; // User ID
  displayName: string; // User's display name (denormalized)
  role: "admin" | "member"; // User's role in group
  joinedAt: Timestamp; // When user joined the group
  lastActivity: Timestamp; // Last log in this group
  stats: {
    totalLogs: number; // Total public logs in this group
    currentStreak: number; // Current streak in this group
    longestStreak: number; // Longest streak in this group
  };
}
```

### 5. Daily Aggregations Collection

**Path**: `/dailyAggregations/{dateKey}`

```typescript
interface DailyAggregationDocument {
  date: string; // Format: "YYYY-MM-DD"
  timestamp: Timestamp; // Start of day timestamp
  globalStats: {
    totalLogs: number; // Total logs across all users
    activeUsers: number; // Number of users who logged
    totalUsers: number; // Total registered users
  };
  groupStats: {
    [groupId: string]: {
      totalLogs: number; // Total logs in group
      activeMembers: number; // Members who logged today
      leaderboard: {
        userId: string;
        displayName: string;
        count: number;
      }[];
    };
  };
}
```

### 6. User Daily Stats Subcollection

**Path**: `/users/{userId}/dailyStats/{dateKey}`

```typescript
interface UserDailyStatsDocument {
  date: string; // Format: "YYYY-MM-DD"
  userId: string; // User ID
  totalLogs: number; // Total logs for this day
  publicLogs: number; // Public logs for this day
  groups: {
    [groupId: string]: {
      logs: number; // Logs contributed to this group
    };
  };
  timestamps: Timestamp[]; // Array of log timestamps for the day
}
```

### 7. Invite Codes Collection

**Path**: `/inviteCodes/{inviteCode}`

```typescript
interface InviteCodeDocument {
  code: string; // 6-character invite code
  groupId: string; // Associated group ID
  createdAt: Timestamp; // When code was generated
  expiresAt?: Timestamp; // Optional expiration date
  maxUses?: number; // Optional usage limit
  currentUses: number; // How many times code has been used
  isActive: boolean; // Whether code is still valid
}
```

## Indexes Required

### Composite Indexes

```javascript
// For user poop logs queries
users/{userId}/poopLogs: [isPublic, timestamp]
users/{userId}/poopLogs: [dayKey, timestamp]
users/{userId}/poopLogs: [groups, timestamp]

// For group member queries
groups/{groupId}/members: [lastActivity]
groups/{groupId}/members: [stats.totalLogs]

// For daily aggregations
dailyAggregations: [timestamp]

// For user daily stats
users/{userId}/dailyStats: [date]
```

### Single Field Indexes

```javascript
// Auto-created by Firestore for most queries
users: [groups]; // Array contains queries
groups: [memberIds]; // Array contains queries
inviteCodes: [groupId];
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // User's poop logs
      match /poopLogs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        // Group members can read public logs
        allow read: if request.auth != null &&
                   resource.data.isPublic == true &&
                   request.auth.uid in resource.data.groups;
      }

      // User's daily stats
      match /dailyStats/{dateKey} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Groups
    match /groups/{groupId} {
      // Group members can read group data
      allow read: if request.auth != null &&
                 request.auth.uid in resource.data.memberIds;
      // Only admins can write group data
      allow write: if request.auth != null &&
                  request.auth.uid == resource.data.createdBy;

      // Group members
      match /members/{userId} {
        allow read: if request.auth != null &&
                   request.auth.uid in get(/databases/$(database)/documents/groups/$(groupId)).data.memberIds;
        allow write: if request.auth != null &&
                    (request.auth.uid == userId ||
                     request.auth.uid == get(/databases/$(database)/documents/groups/$(groupId)).data.createdBy);
      }
    }

    // Daily aggregations (read-only for authenticated users)
    match /dailyAggregations/{dateKey} {
      allow read: if request.auth != null;
    }

    // Invite codes (read-only for authenticated users)
    match /inviteCodes/{inviteCode} {
      allow read: if request.auth != null;
    }
  }
}
```

## Query Patterns

### Common Queries

```typescript
// Get user's recent poop logs
const getUserRecentLogs = (userId: string, limit: number) => {
  return query(
    collection(db, `users/${userId}/poopLogs`),
    orderBy("timestamp", "desc"),
    limit(limit)
  );
};

// Get user's public logs for a specific group
const getUserGroupLogs = (userId: string, groupId: string) => {
  return query(
    collection(db, `users/${userId}/poopLogs`),
    where("groups", "array-contains", groupId),
    where("isPublic", "==", true),
    orderBy("timestamp", "desc")
  );
};

// Get daily leaderboard for a group
const getGroupDailyLeaderboard = (groupId: string, date: string) => {
  return doc(db, `dailyAggregations/${date}`);
};

// Get user's groups
const getUserGroups = (groupIds: string[]) => {
  return query(collection(db, "groups"), where(documentId(), "in", groupIds));
};
```

### Real-time Subscriptions

```typescript
// Listen to user's poop logs
const subscribeToUserLogs = (userId: string, callback: Function) => {
  return onSnapshot(
    query(
      collection(db, `users/${userId}/poopLogs`),
      orderBy("timestamp", "desc"),
      limit(50)
    ),
    callback
  );
};

// Listen to group member updates
const subscribeToGroupMembers = (groupId: string, callback: Function) => {
  return onSnapshot(collection(db, `groups/${groupId}/members`), callback);
};
```

## Data Consistency Strategies

### Atomic Operations

```typescript
// Use transactions for operations that affect multiple documents
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

  // Update daily stats
  const dailyStatsRef = doc(db, `users/${userId}/dailyStats/${logData.dayKey}`);
  batch.set(
    dailyStatsRef,
    {
      totalLogs: increment(1),
      publicLogs: increment(logData.isPublic ? 1 : 0),
    },
    { merge: true }
  );

  await batch.commit();
};
```

### Background Functions (Cloud Functions)

```typescript
// Update daily aggregations (triggered by poop log creation)
// Update group member stats (triggered by poop log creation)
// Clean up expired invite codes (scheduled function)
// Calculate streaks (scheduled daily function)
```

## Performance Optimizations

### Denormalization Strategy

- Store user display names in group members for quick access
- Cache group IDs in user documents for faster group queries
- Pre-calculate statistics in user and group documents

### Pagination

```typescript
// Use cursor-based pagination for large datasets
const getNextPageOfLogs = (userId: string, lastDocument: DocumentSnapshot) => {
  return query(
    collection(db, `users/${userId}/poopLogs`),
    orderBy("timestamp", "desc"),
    startAfter(lastDocument),
    limit(20)
  );
};
```

### Caching Strategy

- Cache user profiles and group data in local state
- Use Firestore's offline persistence for better performance
- Implement optimistic updates with rollback on failure

This schema provides a solid foundation for your poop tracking app with efficient queries, real-time capabilities, and room for future feature expansion.
