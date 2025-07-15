import { useState, useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  AuthError,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { UserDocument } from "@/types";
import { COLLECTIONS } from "@/constants";
import { detectTimezone } from "@/lib/utils";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserDocument);
          }
        } catch (error: unknown) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        // Handle Firebase Auth specific errors
        const authError = error as AuthError;
        switch (authError.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email address";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection";
            break;
          default:
            errorMessage = error.message;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    timezone?: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Auto-detect timezone if not provided
      const userTimezone = timezone || detectTimezone();

      // Create user profile in Firestore
      const userProfile = {
        id: result.user.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        settings: {
          defaultPrivacy: true,
          notifications: true,
          timezone: userTimezone,
        },
        stats: {
          totalLogs: 0,
          publicLogs: 0,
          currentStreak: 0,
          longestStreak: 0,
          firstLogDate: null,
        },
        groups: [],
      };

      await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), userProfile);

      return { success: true, user: result.user };
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        // Handle Firebase Auth specific errors
        const authError = error as AuthError;
        switch (authError.code) {
          case "auth/email-already-in-use":
            errorMessage = "An account with this email already exists";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/weak-password":
            errorMessage =
              "Password is too weak. Please choose a stronger password";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection";
            break;
          default:
            errorMessage = error.message;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    isAuthenticated: !!user,
  };
};
