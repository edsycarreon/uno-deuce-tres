import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { detectTimezone } from "@/lib/utils";
import { handleFirebaseError } from "@/lib/utils/errorHandler";

export async function POST(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    // Extract the token
    const idToken = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const body = await request.json();
    const { displayName, timezone } = body;

    // Validate required fields
    if (!displayName) {
      return NextResponse.json(
        { success: false, error: "Display name is required" },
        { status: 400 }
      );
    }

    // Auto-detect timezone if not provided
    const userTimezone = timezone || detectTimezone();

    // Create user profile in Firestore
    const userProfile = {
      id: decodedToken.uid,
      email: decodedToken.email,
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

    await adminDb.collection("users").doc(decodedToken.uid).set(userProfile);

    return NextResponse.json({
      success: true,
      user: { uid: decodedToken.uid, email: decodedToken.email },
    });
  } catch (error: unknown) {
    console.error("Signup error:", error);

    const errorInfo = handleFirebaseError(error);

    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: 400 }
    );
  }
}
