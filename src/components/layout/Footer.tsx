import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#FFF0F7] dark:bg-[#120810] border-t border-pink-100 dark:border-pink-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🌸</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#BE185D] to-[#F472B6] bg-clip-text text-transparent">
                LunaBloom
              </span>
            </Link>
            <p className="text-sm text-[#5C3A55] dark:text-[#E2C7DC] leading-relaxed">
              Your Cycle, Your Comfort, Your Confidence. A gentle, private, and empowering wellness tracker crafted for every phase of your journey.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8E6E87] dark:text-[#A788A2]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero data selling. Privacy-first architecture.</span>
            </div>
          </div>

          {/* Features Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#BE185D] dark:text-[#F472B6] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5C3A55] dark:text-[#E2C7DC]">
              <li>
                <Link href="/calendar" className="hover:text-[#BE185D] transition-colors">
                  Interactive Calendar
                </Link>
              </li>
              <li>
                <Link href="/nutrition" className="hover:text-[#BE185D] transition-colors">
                  Period Nutrition Guide
                </Link>
              </li>
              <li>
                <Link href="/wellness" className="hover:text-[#BE185D] transition-colors">
                  Wellness & Hygiene Guide
                </Link>
              </li>
              <li>
                <Link href="/checklist" className="hover:text-[#BE185D] transition-colors">
                  Period Preparation Kit
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#BE185D] transition-colors">
                  Cycle Analytics & Charts
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#BE185D] dark:text-[#F472B6] mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#5C3A55] dark:text-[#E2C7DC]">
              <li>
                <Link href="/about" className="hover:text-[#BE185D] transition-colors">
                  Our Mission & About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#BE185D] transition-colors">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#BE185D] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-[#BE185D] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Comfort & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#BE185D] dark:text-[#F472B6] mb-4">
              Gentle Care
            </h4>
            <p className="text-sm text-[#5C3A55] dark:text-[#E2C7DC] leading-relaxed">
              Have questions or suggestions? We are here to listen with compassion.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#BE185D] dark:text-[#F472B6]">
              <Mail className="w-4 h-4" />
              <span>care@lunabloom.app</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8E6E87] dark:text-[#A788A2]">
              <Globe className="w-3.5 h-3.5" />
              <span>Designed with love for Bangladesh & global community</span>
            </div>
          </div>
        </div>

        {/* Medical disclaimer alert banner */}
        <div className="mt-12 pt-8 border-t border-pink-200/60 dark:border-pink-900/40 text-xs text-[#8E6E87] dark:text-[#A788A2] leading-relaxed">
          <p className="mb-3">
            <strong>Medical Notice:</strong> LunaBloom is an educational tracking and self-care application. Predictions, cycle lengths, and nutrition suggestions are estimates designed for comfort and preparation. LunaBloom does not provide medical advice, diagnose clinical conditions, or serve as a method of contraception. If you experience severe pain, excessive bleeding, or unusual symptoms, please consult a qualified healthcare provider.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-pink-100 dark:border-pink-950/40">
            <p>© {new Date().getFullYear()} LunaBloom. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for your wellness and peace of mind.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
