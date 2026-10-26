import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  // Replace escaped newlines from environment variable
  privateKey = privateKey.replace(/\\n/g, "\n");
}

let adminApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  if (projectId && clientEmail && privateKey) {
    try {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
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

export async function verifyFirebaseIdToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  const fbAdmin = getFirebaseAdmin();
  if (!fbAdmin) {
    // If Firebase Admin credentials are not provided in environment,
    // allow simulated verification for local development/testing if token matches dev format
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
      } as admin.auth.DecodedIdToken;
    }
    return null;
  }

  try {
    const decoded = await fbAdmin.auth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.error("Firebase ID token verification failed:", error);
    return null;
  }
}
