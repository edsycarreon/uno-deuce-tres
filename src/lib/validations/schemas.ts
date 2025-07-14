import { z } from "zod";

// User Profile Validation
export const userProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(30, "Display name must be 30 characters or less"),
  defaultPrivacy: z.boolean().default(true),
  timezone: z.string().min(1, "Timezone is required"),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// Group Creation Validation
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be 50 characters or less"),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
  isPrivate: z.boolean().default(false),
  allowSelfJoin: z.boolean().default(true),
  maxMembers: z
    .number()
    .min(2, "Minimum 2 members")
    .max(100, "Maximum 100 members")
    .default(20),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

// Join Group Validation
export const joinGroupSchema = z.object({
  inviteCode: z
    .string()
    .min(1, "Invite code is required")
    .max(20, "Invalid invite code"),
});

export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;

// Invite Code Creation Validation
export const inviteCodeSchema = z.object({
  groupId: z.string().min(1, "Group ID is required"),
  expiresAt: z.date().optional(),
  maxUses: z.number().min(1, "At least 1 use required").optional(),
});

export type InviteCodeFormData = z.infer<typeof inviteCodeSchema>;

// Authentication Validation
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(30, "Display name must be 30 characters or less"),
  timezone: z.string().min(1, "Timezone is required"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Poop Logging Validation
export const poopLogSchema = z.object({
  isPublic: z.boolean().default(false),
  dayKey: z.string().min(1, "Day key is required"),
  weekKey: z.string().min(1, "Week key is required"),
  monthKey: z.string().min(1, "Month key is required"),
  groups: z.array(z.string()).default([]),
});

export type PoopLogFormData = z.infer<typeof poopLogSchema>;
