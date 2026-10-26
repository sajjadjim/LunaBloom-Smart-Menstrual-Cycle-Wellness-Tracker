"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { calculateAge, toDateString } from "@/lib/utils/date";
import { FlowerIllustration } from "@/components/animations/FlowerIllustration";
import confetti from "canvas-confetti";
import {
  User,
  Calendar,
  Heart,
  Music,
  Salad,
  Bell,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smile,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, profile, token, refreshProfile } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // STEP 1: Personal Info
  const [name, setName] = useState(profile?.name || (user as any)?.displayName || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || "2000-01-15");
  const [gender, setGender] = useState(profile?.gender || "Female");
  const [address, setAddress] = useState(profile?.address || "");
  const [country, setCountry] = useState(profile?.country || "Bangladesh");
  const [timezone, setTimezone] = useState(
    profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka"
  );

  // STEP 2: Menstrual Info
  const [lastPeriodStart, setLastPeriodStart] = useState("2026-10-12");
  const [lastPeriodEnd, setLastPeriodEnd] = useState("2026-10-16");
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);
  const [notSureCycle, setNotSureCycle] = useState(false);
  const [averagePeriodDuration, setAveragePeriodDuration] = useState<number>(5);

  // STEP 3: Personal Preferences
  const [favoriteMusic, setFavoriteMusic] = useState<string[]>(["Relaxing", "Lo-fi"]);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>(["Lentil soup", "Fruit and yogurt"]);
  const [interests, setInterests] = useState<string[]>(["Reading", "Yoga", "Meditation"]);

  // STEP 4: Notifications
  const [reminderChoice, setReminderChoice] = useState<"2" | "3" | "both" | "none">("both");
  const [discreetMode, setDiscreetMode] = useState(false);

  const [calculatedAge, setCalculatedAge] = useState(0);

  useEffect(() => {
    setCalculatedAge(calculateAge(dateOfBirth));
  }, [dateOfBirth]);

  const musicOptions = ["Relaxing", "Pop", "Classical", "Lo-fi", "Romantic", "Instrumental", "Acoustic"];
  const foodOptions = [
    "Rice and vegetables",
    "Lentil soup (Daal)",
    "Fruit and yogurt",
    "Fish and vegetables",
    "Oatmeal",
    "Warm broths",
    "Nuts and seeds",
  ];
  const interestOptions = [
    "Reading",
    "Music",
    "Movies",
    "Yoga",
    "Meditation",
    "Walking",
    "Cooking",
    "Art",
    "Journaling",
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        error("Name is required", "Please enter your name.");
        return;
      }
      if (!dateOfBirth) {
        error("Date of Birth is required", "Please specify your birth date.");
        return;
      }
    }
    if (step === 2) {
      if (!lastPeriodStart) {
        error("Period Start is required", "Please select when your last period started.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      // Determine offsets
      let reminderOffsets = [2];
      let emailEnabled = true;
      if (reminderChoice === "3") reminderOffsets = [3];
      else if (reminderChoice === "both") reminderOffsets = [2, 3];
      else if (reminderChoice === "none") {
        emailEnabled = false;
        reminderOffsets = [];
      }

      const payload = {
        name,
        dateOfBirth,
        gender,
        address,
        country,
        timezone,
        initialPeriodStart: lastPeriodStart,
        initialPeriodEnd: lastPeriodEnd || undefined,
        averageCycleLength: notSureCycle ? 28 : averageCycleLength,
        averagePeriodDuration,
        favoriteMusic,
        favoriteFoods,
        interests,
        reminderOffsets,
        emailEnabled,
        discreetMode,
        onboardingCompleted: true,
      };

      const res = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile settings.");
      }

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#BE185D", "#F472B6", "#F9A8D4", "#FFF7FB"],
        });
      } catch {
        // ignore
      }

      await refreshProfile();
      success("Profile Configured! 🌸", "Welcome to your personal sanctuary.");
      router.push("/dashboard");
    } catch (err: any) {
      error("Submission Error", err.message || "Failed to finalize profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] flex items-center justify-center relative overflow-hidden transition-colors">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-[#1f0e1c]/95 backdrop-blur-xl border border-pink-100 dark:border-pink-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-pink-500/10">
        {/* Animated Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>Step {step} of 5</span>
            <span className="text-[#BE185D] dark:text-[#F472B6]">
              {step === 1 && "Personal Information"}
              {step === 2 && "Menstrual Details"}
              {step === 3 && "Personal Comforts"}
              {step === 4 && "Notification Preferences"}
              {step === 5 && "Complete"}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-pink-100 dark:bg-pink-950/60 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#BE185D] to-[#F472B6]"
              initial={{ width: "20%" }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
                Tell Us About You 🌸
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                We personalize your wellness greeting and timezone calculations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
                {dateOfBirth && (
                  <span className="text-[11px] text-[#BE185D] mt-1 block">
                    Calculated Age: {calculatedAge} years old
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Gender (Optional)
                </label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Female"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Country (Optional)
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Timezone *
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Menstrual Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
                When Did Your Last Period Start? 🩸
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                This establishes your baseline calculation. You can log or adjust anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Last Period Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Last Period End Date (Optional)
                </label>
                <input
                  type="date"
                  value={lastPeriodEnd}
                  onChange={(e) => setLastPeriodEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-pink-50/50 dark:bg-[#281325]/40 border border-pink-100 dark:border-pink-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-[#3F243A] dark:text-[#FCE7F3] block">
                      Average Cycle Length (Days)
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Typically between 21 and 35 days (default: 28 days)
                    </span>
                  </div>
                  {!notSureCycle && (
                    <span className="text-base font-bold text-[#BE185D]">
                      {averageCycleLength} days
                    </span>
                  )}
                </div>

                {!notSureCycle && (
                  <input
                    type="range"
                    min={21}
                    max={45}
                    value={averageCycleLength}
                    onChange={(e) => setAverageCycleLength(Number(e.target.value))}
                    className="w-full accent-[#BE185D]"
                  />
                )}

                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notSureCycle}
                    onChange={(e) => setNotSureCycle(e.target.checked)}
                    className="w-4 h-4 accent-[#BE185D]"
                  />
                  <span>I&apos;m not sure (use standard 28-day estimate for now)</span>
                </label>
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-pink-50/50 dark:bg-[#281325]/40 border border-pink-100 dark:border-pink-900/40">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#3F243A] dark:text-[#FCE7F3]">
                    Average Period Duration: {averagePeriodDuration} days
                  </label>
                </div>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={averagePeriodDuration}
                  onChange={(e) => setAveragePeriodDuration(Number(e.target.value))}
                  className="w-full accent-[#BE185D]"
                />
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Most periods last between 3 to 7 days.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Personal Preferences */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
                Your Comfort Preferences 🌷
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                We personalize relaxation tips and gentle self-care recommendations based on what brings you joy.
              </p>
            </div>

            {/* Favorite Music */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BE185D] flex items-center gap-1.5">
                <Music className="w-4 h-4" /> Favorite Music Genres
              </span>
              <div className="flex flex-wrap gap-2">
                {musicOptions.map((genre) => {
                  const isSel = favoriteMusic.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => {
                        if (isSel) setFavoriteMusic(favoriteMusic.filter((m) => m !== genre));
                        else setFavoriteMusic([...favoriteMusic, genre]);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSel
                          ? "bg-[#BE185D] text-white border-[#BE185D]"
                          : "bg-pink-50/60 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/60 text-[#3F243A] dark:text-[#FCE7F3]"
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Favorite Comfort Foods */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BE185D] flex items-center gap-1.5">
                <Salad className="w-4 h-4" /> Nourishing Foods You Enjoy
              </span>
              <div className="flex flex-wrap gap-2">
                {foodOptions.map((food) => {
                  const isSel = favoriteFoods.includes(food);
                  return (
                    <button
                      key={food}
                      type="button"
                      onClick={() => {
                        if (isSel) setFavoriteFoods(favoriteFoods.filter((f) => f !== food));
                        else setFavoriteFoods([...favoriteFoods, food]);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSel
                          ? "bg-[#BE185D] text-white border-[#BE185D]"
                          : "bg-pink-50/60 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/60 text-[#3F243A] dark:text-[#FCE7F3]"
                      }`}
                    >
                      {food}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests & Activities */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BE185D] flex items-center gap-1.5">
                <Smile className="w-4 h-4" /> Comfort Activities & Hobbies
              </span>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((act) => {
                  const isSel = interests.includes(act);
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => {
                        if (isSel) setInterests(interests.filter((i) => i !== act));
                        else setInterests([...interests, act]);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSel
                          ? "bg-[#BE185D] text-white border-[#BE185D]"
                          : "bg-pink-50/60 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/60 text-[#3F243A] dark:text-[#FCE7F3]"
                      }`}
                    >
                      {act}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Notification Settings */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
                Gentle Email Reminders 💌
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Would you like a reminder before your next predicted period so you can prepare comfortably?
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "both", label: "Both 2 and 3 days before (Recommended)", desc: "Receive gentle notice on day 3 and a quick check-in on day 2." },
                { id: "3", label: "3 days before", desc: "Allows ample time to prepare products and clothing." },
                { id: "2", label: "2 days before", desc: "A simple, timely reminder right before your predicted period." },
                { id: "none", label: "No email reminders", desc: "You prefer to check the dashboard manually." },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    reminderChoice === opt.id
                      ? "bg-pink-50 dark:bg-pink-950/60 border-[#BE185D] ring-1 ring-[#BE185D]"
                      : "border-pink-100 dark:border-pink-900/40 hover:bg-pink-50/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="reminderOption"
                    checked={reminderChoice === opt.id}
                    onChange={() => setReminderChoice(opt.id as any)}
                    className="mt-1 w-4 h-4 accent-[#BE185D]"
                  />
                  <div>
                    <span className="text-sm font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                      {opt.label}
                    </span>
                    <span className="text-xs text-muted-foreground leading-normal">
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Discreet Mode */}
            {reminderChoice !== "none" && (
              <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-[#281325]/40 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                    Discreet Email Mode
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Keeps sensitive words out of the email subject for privacy.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={discreetMode}
                  onChange={(e) => setDiscreetMode(e.target.checked)}
                  className="w-5 h-5 accent-[#BE185D]"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 5: Finish */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-6"
          >
            <div className="flex justify-center">
              <FlowerIllustration size={120} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#BE185D] to-[#F472B6] bg-clip-text text-transparent">
                Your Wellness Journey Starts Here 🌸
              </h2>
              <p className="text-sm text-[#5C3A55] dark:text-[#E2C7DC] max-w-md mx-auto">
                Thank you, {name}! Your cycle parameters and comfort preferences have been beautifully configured.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40 max-w-sm mx-auto text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-[#BE185D]">Ready to explore your dashboard:</p>
              <p>• Next period estimated from your {lastPeriodStart} start date</p>
              <p>• Preparation checklist and daily mood check-ins active</p>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              disabled={submitting}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <span>{submitting ? "Preparing Your Space..." : "Go to My Dashboard 🌷"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step Navigation Buttons */}
        {step < 5 && (
          <div className="pt-8 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 text-xs font-semibold text-muted-foreground hover:bg-pink-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-semibold text-xs shadow hover:shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
