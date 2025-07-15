import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase/config";
import { PoopLogDocument } from "@/types";

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return await user.getIdToken();
};

// API functions
const fetchPoopLogs = async (limit: number = 50) => {
  const token = await getAuthToken();
  const response = await fetch(`/api/poop-logs?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch poop logs");
  }

  return response.json();
};

const logPoop = async (logData: Omit<PoopLogDocument, "id">) => {
  const token = await getAuthToken();
  const response = await fetch("/api/poop-logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ logData }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to log poop");
  }

  return response.json();
};

// React Query hooks
export const usePoopLogs = (limit: number = 50) => {
  return useQuery({
    queryKey: ["poopLogs", limit],
    queryFn: () => fetchPoopLogs(limit),
    enabled: !!auth.currentUser,
  });
};

export const useLogPoop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logPoop,
    onSuccess: () => {
      // Invalidate and refetch poop logs
      queryClient.invalidateQueries({ queryKey: ["poopLogs"] });
      // You might also want to invalidate user stats queries here
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Error logging poop:", error);
    },
  });
};
