import { Timestamp } from "firebase/firestore";

// User Document
export interface UserDocument {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
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
    firstLogDate: Timestamp;
  };
  groups: string[];
}

// Poop Log Document
export interface PoopLogDocument {
  id: string;
  userId: string;
  timestamp: Timestamp;
  isPublic: boolean;
  createdAt: Timestamp;
  dayKey: string;
  weekKey: string;
  monthKey: string;
  groups: string[];
}

// Group Document
export interface GroupDocument {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Timestamp;
  inviteCode: string;
  settings: {
    maxMembers: number;
    isPrivate: boolean;
    allowSelfJoin: boolean;
  };
  stats: {
    memberCount: number;
    totalLogs: number;
    lastActivity: Timestamp;
  };
  memberIds: string[];
}

// Group Member Document
export interface GroupMemberDocument {
  userId: string;
  displayName: string;
  role: "admin" | "member";
  joinedAt: Timestamp;
  lastActivity: Timestamp;
  stats: {
    totalLogs: number;
    currentStreak: number;
    longestStreak: number;
  };
}

// Daily Aggregation Document
export interface DailyAggregationDocument {
  date: string;
  timestamp: Timestamp;
  globalStats: {
    totalLogs: number;
    activeUsers: number;
    totalUsers: number;
  };
  groupStats: {
    [groupId: string]: {
      totalLogs: number;
      activeMembers: number;
      leaderboard: {
        userId: string;
        displayName: string;
        count: number;
      }[];
    };
  };
}

// User Daily Stats Document
export interface UserDailyStatsDocument {
  date: string;
  userId: string;
  totalLogs: number;
  publicLogs: number;
  groups: {
    [groupId: string]: {
      logs: number;
    };
  };
  timestamps: Timestamp[];
}

// Invite Code Document
export interface InviteCodeDocument {
  code: string;
  groupId: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
}
