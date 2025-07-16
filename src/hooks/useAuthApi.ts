import { useMutation } from "@tanstack/react-query";

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
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  const { auth } = await import("@/lib/firebase/config");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const idToken = await userCredential.user.getIdToken();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        displayName,
        timezone,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Profile creation failed");
    }

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      },
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const errorCode = error.code as string;
      switch (errorCode) {
        case "auth/email-already-in-use":
          throw new Error("An account with this email already exists");
        case "auth/invalid-email":
          throw new Error("Please enter a valid email address");
        case "auth/weak-password":
          throw new Error(
            "Password is too weak. Please choose a stronger password"
          );
        case "auth/network-request-failed":
          throw new Error("Network error. Please check your connection");
        default:
          throw new Error("Sign up failed");
      }
    }
    throw error;
  }
};

const signInApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const { auth } = await import("@/lib/firebase/config");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const idToken = await userCredential.user.getIdToken();

    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Authentication verification failed");
    }

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      },
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const errorCode = error.code as string;
      switch (errorCode) {
        case "auth/user-not-found":
          throw new Error("No account found with this email address");
        case "auth/wrong-password":
          throw new Error("Incorrect password. Please try again.");
        case "auth/invalid-email":
          throw new Error("Please enter a valid email address");
        case "auth/too-many-requests":
          throw new Error("Too many failed attempts. Please try again later");
        case "auth/network-request-failed":
          throw new Error("Network error. Please check your connection");
        default:
          throw new Error("Sign in failed");
      }
    }
    throw error;
  }
};

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
