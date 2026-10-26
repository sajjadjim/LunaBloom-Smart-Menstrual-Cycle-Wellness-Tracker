import { NextRequest } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { connectToDatabase } from "@/lib/mongodb/client";
import { UserModel } from "@/models/User";
import { IUser } from "@/types";

export interface AuthenticatedSession {
  uid: string;
  email: string;
  user?: IUser | null;
}

// In-memory fallback cache for development/demo when MongoDB is not connected
const memoryUsers = new Map<string, IUser>();

export async function getSessionUser(req: NextRequest): Promise<AuthenticatedSession | null> {
  let token: string | null = null;

  const authHeader = req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const raw = authHeader.substring(7).trim();
    if (raw && raw !== "null" && raw !== "undefined") {
      token = raw;
    }
  }

  if (!token) {
    const cookieToken = req.cookies.get("lb_session")?.value?.trim();
    if (cookieToken && cookieToken !== "null" && cookieToken !== "undefined") {
      token = cookieToken;
    }
  }

  if (!token) {
    return null;
  }

  const decoded = await verifyFirebaseIdToken(token);
  if (!decoded) {
    return null;
  }

  const uid = decoded.uid;
  const email = decoded.email || `${uid}@lunabloom.test`;

  let user: IUser | null = null;
  try {
    const db = await connectToDatabase();
    if (db) {
      const userDoc = await UserModel.findOne({ firebaseUid: uid });
      if (userDoc) {
        user = (userDoc.toObject() as unknown) as IUser;
      }
    } else {
      user = memoryUsers.get(uid) || null;
    }
  } catch (error) {
    console.error("Error fetching user profile in session:", error);
    user = memoryUsers.get(uid) || null;
  }

  return {
    uid,
    email,
    user,
  };
}

export function saveMemoryUser(user: IUser) {
  memoryUsers.set(user.firebaseUid, user);
}

export function getMemoryUser(uid: string): IUser | undefined {
  return memoryUsers.get(uid);
}
