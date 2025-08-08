"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { useAuth } from "./useAuth";
import type { UserDocument } from "../types";

// Custom hook for managing user profile with React Query
export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async (): Promise<UserDocument | null> => {
      if (!user?.uid) return null;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          return userDoc.data() as UserDocument;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    },
    enabled: !!user?.uid,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Helper function to refresh user profile
  const refreshUserProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
  };

  return {
    userProfile,
    isLoading,
    error,
    refetch,
    refreshUserProfile,
  };
};
