import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, DecodedIdToken } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

let adminApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  if (projectId && clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return adminApp;
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
      return null;
    }
  }

  return null;
}

export async function verifyFirebaseIdToken(token: string): Promise<DecodedIdToken | null> {
  const fbAdmin = getFirebaseAdmin();
  if (!fbAdmin) {
    if (token.startsWith("dev-mock-token-")) {
      const uid = token.replace("dev-mock-token-", "");
      return {
        uid,
        email: `${uid}@lunabloom.test`,
        email_verified: true,
        auth_time: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        sub: uid,
        iss: "https://securetoken.google.com/lunabloom-app",
        aud: "lunabloom-app",
        firebase: { identities: {}, sign_in_provider: "custom" },
      } as DecodedIdToken;
    }
    return null;
  }

  try {
    const auth = getAuth(fbAdmin);
    const decoded = await auth.verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.error("Firebase ID token verification failed:", error);
    return null;
  }
}
