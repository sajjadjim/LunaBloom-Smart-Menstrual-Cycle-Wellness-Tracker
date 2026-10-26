"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlowerIllustration } from "@/components/animations/FlowerIllustration";
import { Sparkles, Heart, ArrowRight, Home } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [maybeLater, setMaybeLater] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#FFF7FB] via-[#FCE7F3] to-[#FFF7FB] dark:from-[#150A13] dark:via-[#200E1D] dark:to-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] relative overflow-hidden">
      {/* Decorative floating blur circles */}
      <div className="absolute w-80 h-80 bg-pink-300/30 dark:bg-pink-600/10 rounded-full blur-3xl -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-purple-300/25 dark:bg-purple-900/15 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none" />

      <div className="w-full max-w-lg p-8 sm:p-12 rounded-3xl bg-white/90 dark:bg-[#1f0e1c]/90 backdrop-blur-xl border border-pink-100 dark:border-pink-900/60 shadow-2xl shadow-pink-500/15 z-10 text-center space-y-8">
        {/* Animated Flower */}
        <div className="flex justify-center">
          <FlowerIllustration size={110} />
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#F472B6] bg-clip-text text-transparent">
            Welcome to LunaBloom 🌸
          </h1>

          <p className="text-sm sm:text-base text-[#5C3A55] dark:text-[#E2C7DC] leading-relaxed">
            LunaBloom is designed to support people who menstruate by helping them track their cycles, understand their symptoms, and prepare for upcoming periods with peace of mind.
          </p>
        </div>

        {!maybeLater ? (
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40">
              <p className="text-sm font-semibold text-[#BE185D] dark:text-[#F472B6]">
                Would you like to use LunaBloom to track your menstrual cycle?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => router.push("/profile-setup")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] hover:from-[#9D174D] hover:to-[#BE185D] text-white font-bold text-sm shadow-lg shadow-pink-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>YES — Let&apos;s Begin 🌷</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMaybeLater(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-pink-200 dark:border-pink-900/60 bg-white/70 dark:bg-[#251222]/70 text-[#5C3A55] dark:text-[#E2C7DC] hover:bg-pink-50 text-sm font-semibold transition-all"
              >
                NO — Maybe Later
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            <div className="p-5 rounded-2xl bg-pink-50 dark:bg-pink-950/50 border border-pink-100 dark:border-pink-900/40 text-xs sm:text-sm text-[#5C3A55] dark:text-[#E2C7DC] leading-relaxed">
              <p className="font-semibold text-[#BE185D] mb-1">We understand completely 💗</p>
              LunaBloom is here whenever you are ready. You can browse our educational Nutrition and Wellness guides anytime without setting up a menstrual tracking profile.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-[#BE185D] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#9D174D]"
              >
                <Home className="w-4 h-4" />
                Return to Home Page
              </Link>
              <button
                type="button"
                onClick={() => setMaybeLater(false)}
                className="px-6 py-3 rounded-full border border-pink-200 text-xs font-semibold text-[#5C3A55] dark:text-[#E2C7DC]"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Sensitivity statement */}
        <p className="text-[11px] text-[#8E6E87] dark:text-[#A788A2] italic pt-2">
          This is a purpose confirmation to tailor your experience. LunaBloom respects all bodies and journeys.
        </p>
      </div>
    </div>
  );
}
