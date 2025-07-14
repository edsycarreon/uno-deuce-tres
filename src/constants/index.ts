// Application Configuration
export const APP_NAME = "Poop Tracker";
export const APP_DESCRIPTION =
  "Track your bathroom activities and compete with friends!";

// Database Configuration
export const MAX_GROUP_SIZE = 100;
export const MIN_GROUP_SIZE = 2;
export const DEFAULT_GROUP_SIZE = 20;

// User Limits
export const MAX_DISPLAY_NAME_LENGTH = 30;
export const MAX_GROUP_NAME_LENGTH = 50;
export const MAX_INVITE_CODE_LENGTH = 20;

// Time Periods for Leaderboards
export const LEADERBOARD_PERIODS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const;

export type LeaderboardPeriod =
  (typeof LEADERBOARD_PERIODS)[keyof typeof LEADERBOARD_PERIODS];

// Privacy Settings
export const DEFAULT_PRIVACY_SETTING = true;

// Error Messages
export const ERROR_MESSAGES = {
  AUTHENTICATION_FAILED: "Authentication failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  VALIDATION_ERROR: "Please check your input and try again.",
  DATABASE_ERROR: "Database error. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  GROUP_FULL: "This group is full.",
  GROUP_NOT_FOUND: "Group not found.",
  INVITE_CODE_INVALID: "Invalid invite code.",
  USER_NOT_FOUND: "User not found.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  POOP_LOGGED: "Poop logged successfully!",
  GROUP_CREATED: "Group created successfully!",
  GROUP_JOINED: "Successfully joined the group!",
  PROFILE_UPDATED: "Profile updated successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
} as const;

// Navigation Routes
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  GROUPS: "/groups",
  PROFILE: "/profile",
  LEADERBOARD: "/leaderboard",
} as const;

// Firebase Collections
export const COLLECTIONS = {
  USERS: "users",
  GROUPS: "groups",
  POOP_LOGS: "poopLogs",
  MEMBERS: "members",
  LEADERBOARDS: "leaderboards",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "poop-tracker-user-preferences",
  THEME: "poop-tracker-theme",
} as const;
