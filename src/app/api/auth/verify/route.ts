import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
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

    // Get user record for additional info
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error: unknown) {
    console.error("Token verification error:", error);

    const errorInfo = handleFirebaseError(error);

    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: 401 }
    );
  }
}
