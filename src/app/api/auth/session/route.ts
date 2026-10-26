import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { connectToDatabase } from "@/lib/mongodb/client";
import { UserModel } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Verify token on the server
    const decoded = await verifyFirebaseIdToken(idToken);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const uid = decoded.uid;
    const email = decoded.email || "";

    // Check MongoDB for existing user
    let userExists = false;
    let onboardingCompleted = false;

    const db = await connectToDatabase();
    if (db) {
      const user = await UserModel.findOne({ firebaseUid: uid });
      if (user) {
        userExists = true;
        onboardingCompleted = Boolean(user.onboardingCompleted);
      }
    }

    const response = NextResponse.json({
      success: true,
      uid,
      email,
      userExists,
      onboardingCompleted,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "lb_session",
      value: idToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error establishing session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: "lb_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
