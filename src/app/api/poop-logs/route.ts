import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { logPoopWithUpdates } from "@/lib/firebase/poopLogger";
import { PoopLogDocument } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    // Extract the Firebase ID token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Parse the request body
    const body = await request.json();
    const { logData }: { logData: Omit<PoopLogDocument, "id"> } = body;

    if (!logData) {
      return NextResponse.json({ error: "Missing log data" }, { status: 400 });
    }

    // Log the poop using the existing Firebase function
    await logPoopWithUpdates(adminDb, userId, logData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging poop:", error);
    return NextResponse.json({ error: "Failed to log poop" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    // Extract the Firebase ID token
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    // Use admin SDK for Firestore operations
    const logsRef = adminDb.collection(`users/${userId}/poopLogs`);
    const snapshot = await logsRef
      .orderBy("timestamp", "desc")
      .limit(limit)
      .get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching poop logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch poop logs" },
      { status: 500 }
    );
  }
}
