"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGroup,
  joinGroupByInviteCode,
  leaveGroup,
  getUserGroups,
  getGroupMembers,
  getGroupByInviteCode,
  generateNewInviteCode,
  deleteGroup,
  cleanupUserGroupReferences,
} from "../lib/firebase/groups";
import { useUserProfile } from "./useUserProfile";
import type {
  GroupDocument,
  GroupMemberDocument,
  InviteCodeDocument,
} from "../types";
import type { CreateGroupFormData } from "../lib/validations/schemas";

// Custom hook for managing user's groups
export const useGroups = () => {
  const { userProfile } = useUserProfile();
  const queryClient = useQueryClient();

  // Query to get user's groups
  const {
    data: groups = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["groups", userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.groups || userProfile.groups.length === 0) return [];
      try {
        const groups = await getUserGroups(userProfile.groups);

        // If we got fewer groups than expected, clean up the user's group references
        if (groups.length < userProfile.groups.length) {
          const validGroupIds = groups.map((group) => group.id);
          // Clean up stale group references in the background
          cleanupUserGroupReferences(
            userProfile.id,
            userProfile.groups,
            validGroupIds
          );
        }

        return groups;
      } catch (error) {
        console.error("Error fetching groups:", error);
        // If there's an error fetching groups (e.g., group doesn't exist anymore),
        // return empty array to avoid showing error state
        return [];
      }
    },
    enabled: !!userProfile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Retry failed requests to handle temporary network issues
    retry: (failureCount, error) => {
      // Don't retry if it's a Firestore "not found" error
      if (
        error?.message?.includes("not found") ||
        error?.message?.includes("does not exist")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Mutation to create a new group
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: CreateGroupFormData) => {
      if (!userProfile) throw new Error("User not authenticated");

      // Transform CreateGroupFormData to match expected GroupDocument structure
      const groupDocData = {
        ...groupData,
        createdBy: userProfile.id,
        settings: {
          maxMembers: groupData.maxMembers,
          isPrivate: groupData.isPrivate,
          allowSelfJoin: groupData.allowSelfJoin,
        },
      };

      return createGroup(groupDocData, userProfile);
    },
    onSuccess: async () => {
      // Invalidate both user and groups queries
      await queryClient.invalidateQueries({
        queryKey: ["user", userProfile?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["groups", userProfile?.id],
      });

      // Refetch both queries to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ["user", userProfile?.id] });
      await queryClient.refetchQueries({
        queryKey: ["groups", userProfile?.id],
      });

      toast.success("Group created successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to create group:", error);
      toast.error(error.message || "Failed to create group");
    },
  });

  // Mutation to join a group
  const joinGroupMutation = useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!userProfile) throw new Error("User not authenticated");
      return joinGroupByInviteCode(inviteCode, userProfile);
    },
    onSuccess: async () => {
      // Invalidate both user and groups queries
      await queryClient.invalidateQueries({
        queryKey: ["user", userProfile?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["groups", userProfile?.id],
      });

      // Refetch both queries to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ["user", userProfile?.id] });
      await queryClient.refetchQueries({
        queryKey: ["groups", userProfile?.id],
      });

      toast.success("Successfully joined group!");
    },
    onError: (error: Error) => {
      console.error("Failed to join group:", error);
      toast.error(error.message || "Failed to join group");
    },
  });

  // Mutation to leave a group
  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!userProfile) throw new Error("User not authenticated");
      return leaveGroup(groupId, userProfile.id);
    },
    onSuccess: async () => {
      // Invalidate both user and groups queries
      await queryClient.invalidateQueries({
        queryKey: ["user", userProfile?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["groups", userProfile?.id],
      });

      // Refetch both queries to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ["user", userProfile?.id] });
      await queryClient.refetchQueries({
        queryKey: ["groups", userProfile?.id],
      });

      toast.success("Left group successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to leave group:", error);
      toast.error(error.message || "Failed to leave group");
    },
  });

  // Mutation to delete a group
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!userProfile) throw new Error("User not authenticated");
      return deleteGroup(groupId, userProfile.id);
    },
    onSuccess: async () => {
      // Invalidate both user and groups queries
      await queryClient.invalidateQueries({
        queryKey: ["user", userProfile?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["groups", userProfile?.id],
      });

      // Refetch both queries to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ["user", userProfile?.id] });
      await queryClient.refetchQueries({
        queryKey: ["groups", userProfile?.id],
      });

      toast.success("Group deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete group:", error);
      toast.error(error.message || "Failed to delete group");
    },
  });

  return {
    groups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    joinGroup: joinGroupMutation.mutate,
    leaveGroup: leaveGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isJoining: joinGroupMutation.isPending,
    isLeaving: leaveGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};

// Custom hook for managing group members
export const useGroupMembers = (groupId: string | null) => {
  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => getGroupMembers(groupId!),
    enabled: !!groupId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    members,
    isLoading,
    error,
    refetch,
  };
};

// Custom hook for invite code operations
export const useInviteCode = () => {
  const { userProfile } = useUserProfile();
  const queryClient = useQueryClient();
  const [previewData, setPreviewData] = useState<{
    group: GroupDocument;
    inviteCodeData: InviteCodeDocument;
  } | null>(null);

  // Function to preview a group by invite code
  const previewGroupByInviteCode = async (inviteCode: string) => {
    try {
      const result = await getGroupByInviteCode(inviteCode);
      setPreviewData(result);
      return result;
    } catch (error) {
      console.error("Failed to preview group:", error);
      toast.error("Invalid invite code");
      return null;
    }
  };

  // Mutation to generate new invite code
  const generateInviteCodeMutation = useMutation({
    mutationFn: async (groupId: string) => {
      if (!userProfile) throw new Error("User not authenticated");
      return generateNewInviteCode(groupId, userProfile.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", userProfile?.id] });
      toast.success("New invite code generated!");
    },
    onError: (error: Error) => {
      console.error("Failed to generate invite code:", error);
      toast.error(error.message || "Failed to generate invite code");
    },
  });

  const clearPreview = () => setPreviewData(null);

  return {
    previewData,
    previewGroupByInviteCode,
    clearPreview,
    generateNewInviteCode: generateInviteCodeMutation.mutate,
    isGenerating: generateInviteCodeMutation.isPending,
  };
};

// Custom hook to get group leaderboard data
export const useGroupLeaderboard = (groupId: string | null) => {
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["group-leaderboard", groupId],
    queryFn: () => getGroupMembers(groupId!),
    enabled: !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minute
    select: (members: GroupMemberDocument[]) => {
      // Sort members by total logs in descending order
      return [...members].sort((a, b) => b.stats.totalLogs - a.stats.totalLogs);
    },
  });

  return {
    leaderboard: members,
    isLoading,
    error,
  };
};

// Utility function to check if user is admin of a group
export const useIsGroupAdmin = (group: GroupDocument | null) => {
  const { userProfile } = useUserProfile();

  if (!userProfile || !group) return false;

  return group.createdBy === userProfile.id;
};

// Custom hook to get user's role in a specific group
export const useUserGroupRole = (groupId: string | null) => {
  const { userProfile } = useUserProfile();

  const { data: role, isLoading } = useQuery({
    queryKey: ["user-group-role", groupId, userProfile?.id],
    queryFn: async () => {
      if (!groupId || !userProfile) return null;

      const members = await getGroupMembers(groupId);
      const userMember = members.find(
        (member) => member.userId === userProfile.id
      );

      return userMember?.role || null;
    },
    enabled: !!groupId && !!userProfile?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    role,
    isLoading,
    isAdmin: role === "admin",
    isMember: role === "member",
  };
};
