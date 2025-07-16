import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { handleFirebaseError } from "@/lib/utils/errorHandler";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    return NextResponse.json({
      success: true,
      user: { uid: userRecord.uid, email: userRecord.email },
    });
  } catch (error: unknown) {
    console.error("Signin error:", error);

    const errorInfo = handleFirebaseError(error);

    return NextResponse.json(
      { success: false, error: errorInfo.message },
      { status: 400 }
    );
  }
}
