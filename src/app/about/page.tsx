"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FlowerIllustration } from "@/components/animations/FlowerIllustration";
import { Heart, ShieldCheck, Mail, Send, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FB] dark:bg-[#150A13] text-[#3F243A] dark:text-[#FCE7F3] transition-colors">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        {/* Story Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <FlowerIllustration size={100} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Our Mission: Comfort, Privacy, & Confidence
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            LunaBloom was founded on a simple belief: menstrual cycle tracking should feel like a warm, supportive sanctuary — not a cold clinical spreadsheet or an advertising surveillance tool.
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[#BE185D]">
              <Heart className="w-5 h-5 fill-[#BE185D]" />
            </div>
            <h3 className="text-lg font-bold">Compassionate Design</h3>
            <p className="text-xs text-[#5C3A55] dark:text-[#C5A4BE] leading-relaxed">
              Soft colors, gentle micro-interactions, and reassuring language that honors the emotional and physical nuances of menstruation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[#BE185D]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Uncompromising Privacy</h3>
            <p className="text-xs text-[#5C3A55] dark:text-[#C5A4BE] leading-relaxed">
              Your cycle and mood records belong strictly to you. We never share or sell health data to third-party ad networks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-[#BE185D]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Discreet Support</h3>
            <p className="text-xs text-[#5C3A55] dark:text-[#C5A4BE] leading-relaxed">
              Opt-in email notifications with customizable timing and discreet subject lines, keeping your personal routine peaceful.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div id="contact" className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1f0e1c] border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 max-w-2xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
              Get in Touch with LunaBloom
            </h2>
            <p className="text-xs text-muted-foreground">
              We welcome suggestions, feedback, and questions from our community.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-[#BE185D]">Thank You for Reaching Out!</h3>
              <p className="text-xs text-muted-foreground">
                Your message has been received with warmth. We will respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-[#281325]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE185D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-[#281325]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE185D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your thoughts or questions with us..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-[#281325]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE185D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-semibold text-sm shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
