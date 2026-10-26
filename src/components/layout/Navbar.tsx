"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun, Menu, X, Sparkles, Heart } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Wellness Guide", href: "/wellness" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFF7FB]/80 dark:bg-[#150A13]/85 border-b border-pink-100 dark:border-pink-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F472B6] to-[#BE185D] flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
            🌸
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#BE185D] via-[#DB2777] to-[#F472B6] bg-clip-text text-transparent">
              LunaBloom
            </span>
            <span className="hidden sm:block text-[11px] font-medium tracking-wide text-muted-foreground -mt-1">
              Your Cycle, Your Comfort
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#BE185D] dark:hover:text-[#F472B6] ${
                  isActive
                    ? "text-[#BE185D] dark:text-[#F472B6] font-semibold"
                    : "text-[#3F243A]/80 dark:text-[#FCE7F3]/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-[#3F243A] dark:text-[#FCE7F3] hover:bg-pink-100/70 dark:hover:bg-pink-900/30 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-pink-600" />}
          </button>

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white text-sm font-semibold shadow-md hover:shadow-pink-400/30 hover:scale-[1.02] transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#3F243A] dark:text-[#FCE7F3] hover:text-[#BE185D] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white text-sm font-semibold shadow-md hover:shadow-pink-300/40 hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Start Tracking Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#3F243A] dark:text-[#FCE7F3]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-pink-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#3F243A] dark:text-[#FCE7F3]"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-[#FFF7FB] dark:bg-[#150A13] border-b border-pink-100 dark:border-pink-900/50">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-[#3F243A] dark:text-[#FCE7F3] rounded-lg hover:bg-pink-100/50 dark:hover:bg-pink-950/40"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-pink-200 dark:border-pink-900/40 flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#BE185D] text-white font-semibold text-sm shadow"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-full border border-pink-300 dark:border-pink-800 text-[#3F243A] dark:text-[#FCE7F3] font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-semibold text-sm shadow"
                >
                  Start Tracking Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
