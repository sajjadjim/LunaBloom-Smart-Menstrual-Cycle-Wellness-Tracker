"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Heart, AlertCircle, Info } from "lucide-react";
import { IPredictionResult } from "@/types";
import { formatDisplayDate } from "@/lib/utils/date";

interface CycleRingProps {
  prediction: IPredictionResult | null;
  lastPeriodDate?: string;
  onLogClick?: () => void;
}

export function CycleRing({ prediction, lastPeriodDate, onLogClick }: CycleRingProps) {
  if (!prediction) {
    return (
      <div className="w-full flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  const {
    cycleDay,
    calculatedCycleLength,
    daysUntilNextPeriod,
    predictedStartDate,
    confidence,
    confidenceMessage,
    isEarlyEstimate,
    calculatedPeriodDuration,
  } = prediction;

  // Calculate percentage of cycle completed
  const progressPercent = Math.min(100, Math.max(0, Math.round((cycleDay / calculatedCycleLength) * 100)));

  // Determine current biological cycle phase
  let currentPhase = "Follicular Phase";
  let phaseDescription = "Energy rising, estrogen increasing.";
  let phaseColor = "text-rose-600 dark:text-rose-400";
  let phaseBg = "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60";

  if (cycleDay <= calculatedPeriodDuration) {
    currentPhase = "Menstrual Phase";
    phaseDescription = "Time for extra rest, hydration, and warmth.";
    phaseColor = "text-[#BE185D] dark:text-[#F472B6]";
    phaseBg = "bg-pink-100 dark:bg-pink-950/60 border-pink-300 dark:border-pink-800";
  } else if (cycleDay >= 12 && cycleDay <= 16) {
    currentPhase = "Estimated Fertile / Ovulation Window";
    phaseDescription = "Peak energy & focus. Educational estimate only.";
    phaseColor = "text-purple-600 dark:text-purple-300";
    phaseBg = "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60";
  } else if (cycleDay > 16) {
    currentPhase = "Luteal Phase";
    phaseDescription = "Progesterone dominant. Prioritize nourishing comfort.";
    phaseColor = "text-amber-700 dark:text-amber-300";
    phaseBg = "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60";
  }

  // Circular SVG dimensions
  const size = 300;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 backdrop-blur-xl border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 transition-all">
      {/* Top Phase Header Tag */}
      <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold mb-6 flex items-center gap-1.5 ${phaseBg} ${phaseColor}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{currentPhase}</span>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-pink-100 dark:text-pink-950/50"
            fill="none"
          />

          {/* Animated Active Track */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#ringGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            filter="url(#ringGlow)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Center Contents */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Cycle Status
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#BE185D] dark:text-[#F472B6] tracking-tight">
              Day {cycleDay}
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              of {calculatedCycleLength}-day cycle ({progressPercent}%)
            </p>

            {/* Countdown Badge */}
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-[#BE185D] dark:text-[#F9A8D4] text-xs font-semibold">
                {daysUntilNextPeriod <= 0
                  ? "Period predicted today"
                  : `Period in ~${daysUntilNextPeriod} day${daysUntilNextPeriod === 1 ? "" : "s"}`}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Phase advice & dates below ring */}
      <div className="mt-6 text-center max-w-sm space-y-2">
        <p className="text-xs text-[#5C3A55] dark:text-[#E2C7DC]">
          {phaseDescription}
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            Next: {formatDisplayDate(predictedStartDate, "MMM d")}
          </span>
          {lastPeriodDate && (
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Last: {formatDisplayDate(lastPeriodDate, "MMM d")}
            </span>
          )}
        </div>
      </div>

      {/* Confidence Pill */}
      <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-pink-50 dark:bg-pink-950/30 text-[#8E6E87] dark:text-[#C5A4BE] border border-pink-100 dark:border-pink-900/40">
        <Info className="w-3.5 h-3.5 text-pink-500 shrink-0" />
        <span className="truncate">{confidenceMessage}</span>
      </div>

      {/* Quick Action Button */}
      {onLogClick && (
        <button
          onClick={onLogClick}
          className="mt-6 w-full max-w-xs py-2.5 px-4 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] hover:shadow-lg hover:shadow-pink-500/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          Log Today&apos;s Flow or Symptoms
        </button>
      )}
    </div>
  );
}
