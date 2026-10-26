"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { FlowerIllustration } from "@/components/animations/FlowerIllustration";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      success("Welcome Back! 🌸", "Successfully logged into LunaBloom.");
      router.push("/dashboard");
    } catch (err: any) {
      error("Login Failed", err.message || "Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      success("Welcome! 🌸", "Google authentication verified.");
      router.push("/dashboard");
    } catch (err: any) {
      error("Authentication Error", err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = async () => {
    setLoading(true);
    try {
      await loginAsGuest("Sarah");
      success("Guest Mode Active 🌸", "Exploring LunaBloom with personalized demo data.");
      router.push("/dashboard");
    } catch (err: any) {
      error("Error", "Could not initialize demo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute w-96 h-96 bg-pink-300/30 dark:bg-pink-600/15 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-purple-300/20 dark:bg-purple-900/15 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#1f0e1c]/90 backdrop-blur-xl border border-pink-100 dark:border-pink-900/60 shadow-2xl shadow-pink-500/10 z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <FlowerIllustration size={64} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#BE185D] to-[#F472B6] bg-clip-text text-transparent">
            Welcome to LunaBloom
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your private cycle journal and wellness dashboard
          </p>
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-[#251222] hover:bg-pink-50/50 text-xs font-semibold flex items-center justify-center gap-3 shadow-sm transition-all hover:scale-[1.01]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-pink-100 dark:bg-pink-900/40" />
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Or with email</span>
          <div className="flex-1 h-px bg-pink-100 dark:bg-pink-900/40" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE185D]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-muted-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-[#BE185D] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE185D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-semibold text-sm shadow-md hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {loading ? "Signing in..." : "Sign In to LunaBloom"}
          </button>
        </form>

        {/* Quick guest button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleGuestDemo}
            disabled={loading}
            className="w-full py-2.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs font-semibold text-[#BE185D] dark:text-[#F472B6] hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo: Explore as Guest</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-[#BE185D] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
