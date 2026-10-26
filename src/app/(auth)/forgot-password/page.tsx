"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { FlowerIllustration } from "@/components/animations/FlowerIllustration";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
      success("Email Sent! 🌸", "Password reset instructions have been dispatched.");
    } catch (err: any) {
      error("Reset Failed", err.message || "Could not send reset instructions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] relative overflow-hidden">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#1f0e1c]/90 backdrop-blur-xl border border-pink-100 dark:border-pink-900/60 shadow-2xl shadow-pink-500/10 z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <FlowerIllustration size={64} />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#BE185D] dark:text-[#F472B6]">
            Reset Your Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your email and we will send you a secure link to reset your credentials.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-[#BE185D]">
              Check your inbox at {email}
            </p>
            <p className="text-xs text-muted-foreground">
              Follow the link inside the email to choose a new password.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-xs font-semibold text-[#BE185D] hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Your Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-semibold text-sm shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-[#BE185D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
