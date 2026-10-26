"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Calendar, Smile, Mail, TrendingUp, ShieldCheck, Salad, CheckSquare, Sparkles } from "lucide-react";

export default function FeaturesPage() {
  const deepFeatures = [
    {
      title: "Smart Menstrual Calendar",
      desc: "Color-coded monthly matrix with instant period logging, multi-day flow intervals, flow intensity tags, and custom notes.",
      icon: Calendar,
      bullets: ["Spotting, Light, Medium, Heavy flow levels", "Consecutive day interval calculation", "Calendar-date-safe storage without UTC shifts"],
    },
    {
      title: "Statistical Cycle Prediction Engine",
      desc: "Computes upcoming cycles from your real consecutive period intervals, dynamically identifying variations and irregular rhythms.",
      icon: TrendingUp,
      bullets: ["Average cycle length and duration", "Irregularity and variance alerts", "Leap year and calendar month duration safety"],
    },
    {
      title: "In-App Wellness Reminders",
      desc: "Never be caught off-guard. Receive soft, timely advance alerts right on your dashboard and cycle calendar 2 or 3 days beforehand.",
      icon: Mail,
      bullets: ["Customizable 2 or 3 day advance notices", "Discreet notification wording mode", "Instant dashboard comfort suggestions"],
    },
    {
      title: "Daily Mood & Emotion Tracking",
      desc: "Log your daily emotional landscape with 9 curated moods and personalized comfort suggestions tailored to your mood.",
      icon: Smile,
      bullets: ["Happy, Calm, Sad, Stressed, Tired, Loved & more", "One primary mood per day with reflection notes", "Long-term emotional trend analysis"],
    },
    {
      title: "Nutritional Period Guide",
      desc: "Discover iron-rich meals, magnesium sources, and hydrating foods specially selected to soothe and nourish your body.",
      icon: Salad,
      bullets: ["Culturally diverse recipes (e.g. Bangladesh lentils & soups)", "Hormonal phase support", "Food allergy considerations & gentle hydration"],
    },
    {
      title: "Preparation Kit Checklist",
      desc: "An interactive, customizable checklist to ensure pads, extra products, heating pads, and personal comforts are ready.",
      icon: CheckSquare,
      bullets: ["Pre-filled essential items", "Add & remove custom personal comfort items", "Automated pre-cycle reminders"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] transition-colors">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950 text-[#BE185D] dark:text-[#F472B6] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Comprehensive Features Built For Comfort
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every feature in LunaBloom is designed to provide clarity, reassurance, and emotional comfort throughout your menstrual cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deepFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-8 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#BE185D] to-[#F472B6] flex items-center justify-center text-white mb-6 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3F243A] dark:text-[#FCE7F3] mb-3">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[#5C3A55] dark:text-[#C5A4BE] leading-relaxed mb-6">
                    {f.desc}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-pink-100 dark:border-pink-900/40 pt-4 text-xs text-[#8E6E87] dark:text-[#DEC5D7]">
                  {f.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#BE185D]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-bold text-sm shadow-lg hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Tracking Now — It&apos;s Free</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
