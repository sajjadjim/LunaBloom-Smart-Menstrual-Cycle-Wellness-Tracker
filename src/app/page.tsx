"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FlowerIllustration, FloatingPetals } from "@/components/animations/FlowerIllustration";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Sparkles,
  Calendar,
  Heart,
  Smile,
  ShieldCheck,
  Mail,
  TrendingUp,
  Lock,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { loginAsGuest, user } = useAuth();
  const router = useRouter();
  const [guestLoading, setGuestLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleGuestDemo = async () => {
    setGuestLoading(true);
    try {
      await loginAsGuest("Sarah");
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setGuestLoading(false);
    }
  };

  const features = [
    {
      title: "Smart Period Tracking",
      desc: "Log flow levels (spotting, light, medium, heavy) and dates with a calming, simple interface.",
      icon: Heart,
      color: "from-pink-400 to-rose-500",
    },
    {
      title: "Accurate Prediction Engine",
      desc: "Real statistical cycle date calculations that adapt as your logged history grows, without false guarantees.",
      icon: TrendingUp,
      color: "from-rose-500 to-pink-600",
    },
    {
      title: "Personalized Wellness Tips",
      desc: "Gentle comfort ideas aligned with your favorite music, activities, and cycle phases.",
      icon: Compass,
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Daily Mood Tracking",
      desc: "Check in with your feelings daily using comforting emoji cards and reflective notes.",
      icon: Smile,
      color: "from-amber-400 to-pink-500",
    },
    {
      title: "Automatic Email Reminders",
      desc: "Opt-in gentle alerts 2 or 3 days before your predicted period so you're always comfortably prepared.",
      icon: Mail,
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Cycle History & Analytics",
      desc: "Observe your average cycle length, duration, and patterns with clear, elegant charts.",
      icon: Calendar,
      color: "from-fuchsia-400 to-pink-600",
    },
    {
      title: "Interactive Calendar",
      desc: "A soft pink monthly matrix highlighting confirmed periods, predicted windows, and wellness logs.",
      icon: Clock,
      color: "from-pink-400 to-purple-500",
    },
    {
      title: "Private & Secure Data",
      desc: "Health data is strictly scoped to your identity. Zero data selling, full export, and instant account deletion.",
      icon: Lock,
      color: "from-emerald-400 to-teal-600",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Create your free account",
      desc: "Sign up via Google or Email in seconds. Your identity and health records remain completely private.",
    },
    {
      num: "02",
      title: "Enter previous period info",
      desc: "Share your last period start date and cycle estimates so our engine can initialize predictions.",
    },
    {
      num: "03",
      title: "Track flow & daily symptoms",
      desc: "Log daily flow intensity, moods, or cramps on the interactive monthly calendar with a single tap.",
    },
    {
      num: "04",
      title: "Get predictions & reminders",
      desc: "Receive comforting, opt-in email notifications before your cycle begins so you can prepare comfortably.",
    },
    {
      num: "05",
      title: "Understand your cycle over time",
      desc: "Gain holistic insight into your body's rhythm, hormonal shifts, and personalized comfort patterns.",
    },
  ];

  const faqs = [
    {
      q: "How accurate are LunaBloom's cycle predictions?",
      a: "LunaBloom uses real calendar date mathematics based on your consecutive logged cycle intervals. While accuracy increases as you log more months, menstrual cycles naturally fluctuate due to stress, travel, illness, or hormonal variations. Our predictions are estimates meant for preparation, not medical contraception.",
    },
    {
      q: "Is my personal health and cycle data secure?",
      a: "Yes, absolutely. LunaBloom follows a strict privacy-first philosophy. All queries are strictly scoped to your verified account session. We do not sell health data to third-party advertisers or data brokers, and you can export or permanently delete your records anytime with one click.",
    },
    {
      q: "How do the automatic email reminders work?",
      a: "Email notifications are 100% opt-in. You choose whether to receive reminders 2 days before, 3 days before, or both. We also provide a Discreet Mode option that removes sensitive words from the subject line for your privacy.",
    },
    {
      q: "Can I use LunaBloom if I have irregular cycles?",
      a: "Yes. LunaBloom is specifically engineered to detect cycle length variance. When your intervals fluctuate significantly, LunaBloom informs you with an estimated range rather than false precision, helping you embrace your body without anxiety.",
    },
    {
      q: "Does LunaBloom offer an ovulation estimate?",
      a: "Yes, LunaBloom provides an educational ovulation and fertile window estimation that can be toggled on or off in your settings. Please note that calendar-based estimates are approximate and must never be used as a method of birth control.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] relative overflow-hidden transition-colors">
      <FloatingPetals />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 dark:bg-pink-950/70 border border-pink-200 dark:border-pink-900/60 text-[#BE185D] dark:text-[#F472B6] text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Cycle, Your Comfort, Your Confidence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#3F243A] dark:text-[#FCE7F3] leading-[1.15]">
                Understand Your Cycle. <br />
                <span className="bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#F472B6] bg-clip-text text-transparent">
                  Embrace Your Wellness.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#5C3A55] dark:text-[#DEC5D7] max-w-2xl leading-relaxed">
                Track your period, understand your body, and prepare for every cycle with confidence. A gentle, private sanctuary designed for your comfort and peace of mind.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] hover:from-[#9D174D] hover:to-[#BE185D] text-white text-base font-semibold shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Open My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] hover:from-[#9D174D] hover:to-[#BE185D] text-white text-base font-semibold shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Start Tracking Free</span>
                    </Link>

                    <button
                      onClick={handleGuestDemo}
                      disabled={guestLoading}
                      className="px-6 py-3.5 rounded-full bg-white dark:bg-[#200E1D] border border-pink-200 dark:border-pink-900/60 text-[#BE185D] dark:text-[#F472B6] hover:bg-pink-50 dark:hover:bg-pink-950/40 text-base font-semibold shadow-sm transition-all flex items-center gap-2"
                    >
                      {guestLoading ? "Loading Demo..." : "Explore as Guest"}
                    </button>
                  </>
                )}

                <a
                  href="#features"
                  className="px-6 py-3.5 text-sm font-semibold text-[#5C3A55] dark:text-[#DEC5D7] hover:text-[#BE185D] transition-colors"
                >
                  Explore Features ↓
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#8E6E87] dark:text-[#A788A2]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>100% Free & No Ads</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-500" />
                  <span>Encrypted Health Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span>Gentle Opt-In Reminders</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic with Animated Calendar Preview & Floating Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Outer soft glow backdrop */}
              <div className="absolute w-80 h-80 bg-pink-300/30 dark:bg-pink-600/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />

              <div className="relative w-full max-w-md p-6 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 backdrop-blur-xl border border-pink-100 dark:border-pink-900/50 shadow-2xl shadow-pink-500/10">
                {/* Visual Calendar Header */}
                <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-pink-900/40">
                  <div className="flex items-center gap-2">
                    <FlowerIllustration size={28} animate={false} />
                    <span className="font-bold text-sm text-[#BE185D] dark:text-[#F472B6]">
                      November 2026
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-[#BE185D] font-semibold">
                    Cycle Day 12
                  </span>
                </div>

                {/* Mini Calendar Mock */}
                <div className="grid grid-cols-7 gap-1.5 py-4 text-center text-xs">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <span key={i} className="text-muted-foreground font-semibold text-[10px]">
                      {d}
                    </span>
                  ))}
                  {[...Array(30)].map((_, i) => {
                    const dayNum = i + 1;
                    const isPeriod = dayNum >= 12 && dayNum <= 16;
                    const isPredicted = dayNum >= 10 && dayNum <= 14 && false;
                    return (
                      <div
                        key={i}
                        className={`py-2 rounded-xl text-xs font-medium transition-all ${
                          isPeriod
                            ? "bg-[#BE185D] text-white shadow-sm font-bold scale-105"
                            : isPredicted
                            ? "bg-pink-200 text-[#BE185D]"
                            : "bg-pink-50/50 dark:bg-pink-950/20 text-[#3F243A] dark:text-[#FCE7F3]"
                        }`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>

                {/* Floating Preview Cards */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-200 dark:bg-pink-900 flex items-center justify-center text-sm">
                        🌸
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          Next Period
                        </p>
                        <p className="text-xs font-bold text-[#BE185D] dark:text-[#F472B6]">
                          Estimated in 8 days (Nov 15)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Ready</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-200 dark:bg-purple-900 flex items-center justify-center text-sm">
                        😌
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          Mood Today
                        </p>
                        <p className="text-xs font-bold text-purple-900 dark:text-purple-300">
                          Feeling Calm & Focused
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-purple-600 font-semibold">Logged</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-xs text-[#5C3A55] dark:text-[#DEC5D7]">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                      🌷 Daily Comfort Tip:
                    </span>
                    &ldquo;Drink warm water and enjoy your favorite relaxing playlist today.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white/60 dark:bg-[#120810]/60 border-y border-pink-100 dark:border-pink-950/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#BE185D] dark:text-[#F472B6]">
                Designed For Your Wellbeing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3]">
                Everything You Need For Every Phase
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Built with medical sensitivity, modern data accuracy, and a warm aesthetic that feels like a caring companion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1c0d1a] border border-pink-100 dark:border-pink-900/50 shadow-lg shadow-pink-500/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-5 shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-[#3F243A] dark:text-[#FCE7F3] mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-[#5C3A55] dark:text-[#C5A4BE] leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#BE185D] dark:text-[#F472B6]">
              Simple & Calming
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3]">
              How LunaBloom Works
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              A 5-step intuitive flow designed to give you clarity and peace of mind effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((st) => (
              <div
                key={st.num}
                className="relative p-6 rounded-3xl bg-white/70 dark:bg-[#1c0d1a]/70 border border-pink-100 dark:border-pink-900/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-extrabold text-[#BE185D]/25 dark:text-[#F472B6]/20 block mb-3">
                    {st.num}
                  </span>
                  <h3 className="text-base font-bold text-[#3F243A] dark:text-[#FCE7F3] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#5C3A55] dark:text-[#C5A4BE] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-20 bg-white/50 dark:bg-[#120810]/50 border-t border-pink-100 dark:border-pink-950/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#BE185D] dark:text-[#F472B6]">
                Questions & Answers
              </span>
              <h2 className="text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/40 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#3F243A] dark:text-[#FCE7F3] hover:text-[#BE185D]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-pink-500 transition-transform ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C3A55] dark:text-[#DEC5D7] leading-relaxed border-t border-pink-50 dark:border-pink-950 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#F472B6] text-white shadow-2xl shadow-pink-500/20 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
                🌸
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Experience Calmer, More Confident Cycles?
              </h2>
              <p className="text-sm sm:text-base text-pink-100 leading-relaxed">
                Join thousands who trust LunaBloom for private period tracking, thoughtful preparation checklists, and personalized comfort suggestions.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-3.5 rounded-full bg-white text-[#BE185D] hover:bg-pink-50 font-bold text-sm shadow-md transition-all hover:scale-105"
                >
                  Create Your Free Account
                </Link>
                <button
                  onClick={handleGuestDemo}
                  disabled={guestLoading}
                  className="px-6 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-white font-semibold text-sm transition-all border border-white/20"
                >
                  Explore Guest Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
