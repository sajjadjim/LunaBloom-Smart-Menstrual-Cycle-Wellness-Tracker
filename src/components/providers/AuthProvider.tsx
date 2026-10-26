"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/client";
import { IUser } from "@/types";

interface AuthContextType {
  user: FirebaseUser | { uid: string; email: string; displayName?: string } | null;
  profile: IUser | null;
  loading: boolean;
  isGuest: boolean;
  token: string | null;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (guestName?: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (e: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isGuest: false,
  token: null,
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginWithGoogle: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
  sendPasswordReset: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const syncProfile = async (idToken: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setProfile(data.user);
        }
      }
    } catch (err) {
      console.warn("Failed syncing profile from backend:", err);
    }
  };

  useEffect(() => {
    // Check if guest session stored
    try {
      const storedGuest = localStorage.getItem("lunabloom_guest_user");
      if (storedGuest) {
        const parsed = JSON.parse(storedGuest);
        setUser(parsed.user);
        setProfile(parsed.profile);
        setIsGuest(true);
        const guestToken = `dev-mock-token-${parsed.user.uid}`;
        setToken(guestToken);
        document.cookie = `lb_session=${guestToken}; path=/; max-age=86400; SameSite=Lax`;
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        setIsGuest(false);
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          document.cookie = `lb_session=${idToken}; path=/; credentials=include; max-age=86400; SameSite=Lax`;
          await syncProfile(idToken);
        } catch (e) {
          console.error("Error retrieving ID token:", e);
        }
      } else {
        setUser(null);
        setProfile(null);
        setToken(null);
        document.cookie = "lb_session=; path=/; max-age=0";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      document.cookie = `lb_session=${idToken}; path=/; max-age=86400; SameSite=Lax`;
      await syncProfile(idToken);
    } catch (err: any) {
      // If Firebase project is unconfigured in local dev, provide helpful fallback message
      if (err.code === "auth/api-key-not-valid" || err.code === "auth/invalid-api-key") {
        throw new Error("Firebase API key not configured in .env.local. Click 'Explore as Guest' below to test the full app immediately!");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      document.cookie = `lb_session=${idToken}; path=/; max-age=86400; SameSite=Lax`;
      // Create initial user in backend
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name, email }),
      });
      await syncProfile(idToken);
    } catch (err: any) {
      if (err.code === "auth/api-key-not-valid" || err.code === "auth/invalid-api-key") {
        throw new Error("Firebase API key not configured in .env.local. Click 'Explore as Guest' below to test the full app immediately!");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      document.cookie = `lb_session=${idToken}; path=/; credentials=include; max-age=86400; SameSite=Lax`;
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: cred.user.displayName || "Bloom User",
          email: cred.user.email,
        }),
      });
      await syncProfile(idToken);
    } catch (err: any) {
      if (err.code === "auth/api-key-not-valid" || err.code === "auth/invalid-api-key") {
        throw new Error("Firebase API key not configured in .env.local. Click 'Explore as Guest' below to test the full app immediately!");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async (guestName: string = "Sarah") => {
    setLoading(true);
    const guestUid = `guest_${Date.now().toString(36)}`;
    const guestUser = {
      uid: guestUid,
      email: `${guestUid}@lunabloom.test`,
      displayName: guestName,
    };
    const guestProfile: IUser = {
      firebaseUid: guestUid,
      name: guestName,
      email: guestUser.email,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      onboardingCompleted: true,
      favoriteMusic: ["Relaxing", "Lo-fi"],
      favoriteFoods: ["Fruit and yogurt", "Lentil soup"],
      interests: ["Yoga", "Reading", "Meditation"],
    };
    const guestToken = `dev-mock-token-${guestUid}`;

    setUser(guestUser);
    setProfile(guestProfile);
    setIsGuest(true);
    setToken(guestToken);
    document.cookie = `lb_session=${guestToken}; path=/; max-age=86400; SameSite=Lax`;

    try {
      localStorage.setItem(
        "lunabloom_guest_user",
        JSON.stringify({ user: guestUser, profile: guestProfile })
      );
      // Seed backend with demo period data for the guest so dashboard shines immediately
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${guestToken}`,
        },
        body: JSON.stringify({
          name: guestName,
          onboardingCompleted: true,
          initialPeriodStart: "2026-10-12",
          initialPeriodEnd: "2026-10-16",
          averageCycleLength: 28,
          averagePeriodDuration: 5,
        }),
      });
      // Seed previous period too for cycle pattern
      await fetch("/api/periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${guestToken}`,
        },
        body: JSON.stringify({
          startDate: "2026-09-14",
          endDate: "2026-09-18",
          flowLevels: { "2026-09-14": "heavy", "2026-09-15": "medium" },
          notes: "Regular cycle, mild cramping on day 1",
        }),
      });
    } catch (e) {
      console.warn("Guest seeding error:", e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        localStorage.removeItem("lunabloom_guest_user");
        setIsGuest(false);
      } else {
        await signOut(auth);
      }
      setUser(null);
      setProfile(null);
      setToken(null);
      document.cookie = "lb_session=; path=/; max-age=0";
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    if (token) {
      await syncProfile(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuest,
        token,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        sendPasswordReset,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
