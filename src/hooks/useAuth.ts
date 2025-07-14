import { useState, useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { UserProfile } from "@/types";
import { COLLECTIONS } from "@/constants";
import { Timestamp } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
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
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: result.user.uid,
        displayName,
        email,
        createdAt: Timestamp.now(),
        settings: {
          defaultPrivacy: true,
          notifications: true,
        },
      };

      await setDoc(doc(db, COLLECTIONS.USERS, result.user.uid), userProfile);

      return { success: true, user: result.user };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
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
