"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { CycleRing } from "@/components/dashboard/CycleRing";
import { IPredictionResult, IPeriodRecord, IMoodRecord } from "@/types";
import { formatDisplayDate } from "@/lib/utils/date";
import {
  CalendarDays,
  Heart,
  Smile,
  Activity,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function DashboardPage() {
  const { user, profile, token } = useAuth();
  const [prediction, setPrediction] = useState<IPredictionResult | null>(null);
  const [periods, setPeriods] = useState<IPeriodRecord[]>([]);
  const [recentMood, setRecentMood] = useState<IMoodRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Time-aware greeting
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const fetchData = async () => {
      try {
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [predRes, periodRes, moodRes] = await Promise.all([
          fetch("/api/predictions", { headers }),
          fetch("/api/periods", { headers }),
          fetch("/api/moods", { headers }),
        ]);

        if (predRes.ok) {
          const predData = await predRes.json();
          setPrediction(predData.prediction);
        }

        if (periodRes.ok) {
          const pData = await periodRes.json();
          setPeriods(pData.records || []);
        }

        if (moodRes.ok) {
          const mData = await moodRes.json();
          if (mData.records && mData.records.length > 0) {
            setRecentMood(mData.records[0]);
          }
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const displayName = profile?.name || (user as any)?.displayName || "Sarah";
  const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : null;

  // Personalized Comfort Recommendation
  const generateComfortTip = () => {
    if (recentMood?.mood === "Tired" || recentMood?.mood === "Stressed") {
      return "Feeling a bit tired today? Try taking a 15-minute gentle pause, drinking warm herbal tea, and resting your eyes.";
    }
    if (recentMood?.mood === "Anxious") {
      return "Notice any tension? Try 4-7-8 breathing or listening to your favorite calming playlist for five peaceful minutes.";
    }
    if (profile?.interests?.includes("Yoga")) {
      return "A gentle child's pose or light stretching can help ease pelvic tension and release calm endorphins.";
    }
    if (profile?.favoriteMusic?.length) {
      return `Enjoying some ${profile.favoriteMusic[0]} music today may bring an extra touch of tranquility to your afternoon.`;
    }
    return "Stay hydrated and remember to be kind to yourself in every phase of your journey.";
  };

  return (
    <div className="space-y-8">
      {/* Top Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-pink-100 dark:border-pink-900/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
            <span>{greeting}, {displayName}</span>
            <span className="text-2xl animate-pulse">🌸</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Let&apos;s take care of you today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/period"
            className="px-4 py-2 rounded-full bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Log Flow</span>
          </Link>
          <Link
            href="/calendar"
            className="px-4 py-2 rounded-full border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-[#1f0e1c] text-[#BE185D] dark:text-[#F472B6] hover:bg-pink-50 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Open Calendar</span>
          </Link>
        </div>
      </div>

      {/* Main Feature: Circular Ring & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Circular Cycle Ring */}
        <div className="lg:col-span-7 flex justify-center">
          <CycleRing
            prediction={prediction}
            lastPeriodDate={lastPeriod?.startDate}
          />
        </div>

        {/* Right: Personalized Suggestion & Quick Action Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Personalized Wellness Tip Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-pink-50 to-purple-50 dark:from-[#220f20] dark:to-[#1a0f25] border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#BE185D] dark:text-[#F472B6]">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Comfort Suggestion</span>
            </div>
            <p className="text-sm text-[#5C3A55] dark:text-[#DEC5D7] leading-relaxed">
              &ldquo;{generateComfortTip()}&rdquo;
            </p>
            <div className="pt-1 flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/nutrition" className="text-[#BE185D] dark:text-[#F472B6] font-semibold hover:underline flex items-center gap-1">
                <span>View period nutrition guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/period"
                className="p-3 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40 hover:bg-pink-100/60 transition-colors flex items-center gap-2.5 text-xs font-semibold text-[#BE185D] dark:text-[#F472B6]"
              >
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                <span>Log Period Flow</span>
              </Link>

              <Link
                href="/mood"
                className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-100/60 transition-colors flex items-center gap-2.5 text-xs font-semibold text-purple-800 dark:text-purple-300"
              >
                <Smile className="w-4 h-4 text-purple-600" />
                <span>Log Daily Mood</span>
              </Link>

              <Link
                href="/symptoms"
                className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 hover:bg-amber-100/60 transition-colors flex items-center gap-2.5 text-xs font-semibold text-amber-800 dark:text-amber-300"
              >
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Log Symptoms</span>
              </Link>

              <Link
                href="/checklist"
                className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/60 transition-colors flex items-center gap-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prep Checklist</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main 6 Dashboard Metric Cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Key Cycle Indicators
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: Cycle Day */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Current Status
            </span>
            <p className="text-xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-1">
              Day {prediction?.cycleDay || 1}
            </p>
            <span className="text-[10px] text-muted-foreground">of active cycle</span>
          </div>

          {/* Card 2: Next Predicted Period */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Next Period
            </span>
            <p className="text-xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-1">
              {prediction ? `${prediction.daysUntilNextPeriod} days` : "8 days"}
            </p>
            <span className="text-[10px] text-muted-foreground">
              {prediction?.predictedStartDate ? formatDisplayDate(prediction.predictedStartDate, "MMM d") : "Estimated"}
            </span>
          </div>

          {/* Card 3: Average Cycle Length */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Avg Cycle
            </span>
            <p className="text-xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-1">
              {prediction?.calculatedCycleLength || 28} days
            </p>
            <span className="text-[10px] text-muted-foreground">Interval pattern</span>
          </div>

          {/* Card 4: Last Period */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Last Period
            </span>
            <p className="text-sm font-bold text-[#BE185D] dark:text-[#F472B6] mt-1 truncate">
              {lastPeriod
                ? `${formatDisplayDate(lastPeriod.startDate, "MMM d")} – ${
                    lastPeriod.endDate ? formatDisplayDate(lastPeriod.endDate, "MMM d") : "Active"
                  }`
                : "Oct 12 – Oct 16"}
            </p>
            <span className="text-[10px] text-muted-foreground">Confirmed dates</span>
          </div>

          {/* Card 5: Current Mood */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Current Mood
            </span>
            <p className="text-sm font-bold text-[#BE185D] dark:text-[#F472B6] mt-1 truncate">
              {recentMood ? `${recentMood.mood}` : "Feeling Calm 😊"}
            </p>
            <span className="text-[10px] text-muted-foreground">Logged today</span>
          </div>

          {/* Card 6: Cycle Pattern */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Cycle Pattern
            </span>
            <p className="text-sm font-bold text-[#BE185D] dark:text-[#F472B6] mt-1 truncate">
              {prediction?.isIrregular ? "Variable rhythm" : "Consistent cycle"}
            </p>
            <span className="text-[10px] text-muted-foreground">Statistical status</span>
          </div>
        </div>
      </div>
    </div>
  );
}
