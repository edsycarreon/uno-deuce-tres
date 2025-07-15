import { useMutation } from "@tanstack/react-query";

// API functions
const signUpApi = async ({
  email,
  password,
  displayName,
  timezone,
}: {
  email: string;
  password: string;
  displayName: string;
  timezone?: string;
}) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      displayName,
      timezone,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Sign up failed");
  }

  return data;
};

const signInApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Sign in failed");
  }

  return data;
};

// React Query hooks
export const useSignUp = () => {
  return useMutation({
    mutationFn: signUpApi,
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signInApi,
  });
};
