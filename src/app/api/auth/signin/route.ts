import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // For sign in, we'll verify the user exists
    const userRecord = await adminAuth.getUserByEmail(email);

    return NextResponse.json({
      success: true,
      user: { uid: userRecord.uid, email: userRecord.email },
    });
  } catch (error: unknown) {
    console.error("Signin error:", error);

    let errorMessage = "An unknown error occurred";

    if (error && typeof error === "object" && "code" in error) {
      const errorCode = error.code as string;
      if (errorCode === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Invalid email address";
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
