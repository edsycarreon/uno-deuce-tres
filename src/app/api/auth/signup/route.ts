import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { detectTimezone } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, timezone } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create user with Firebase Admin
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    });

    // Auto-detect timezone if not provided
    const userTimezone = timezone || detectTimezone();

    // Create user profile in Firestore
    const userProfile = {
      id: userRecord.uid,
      email,
      displayName,
      createdAt: new Date(),
      lastActive: new Date(),
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

    await adminDb.collection("users").doc(userRecord.uid).set(userProfile);

    return NextResponse.json({
      success: true,
      user: { uid: userRecord.uid, email: userRecord.email },
    });
  } catch (error: unknown) {
    console.error("Signup error:", error);

    let errorMessage = "An unknown error occurred";

    if (error && typeof error === "object" && "code" in error) {
      const errorCode = error.code as string;
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (errorCode === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
