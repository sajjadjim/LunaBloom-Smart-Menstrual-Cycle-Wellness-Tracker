"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { navItems } from "./Sidebar";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Smile,
  BarChart3,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const primaryMobileTabs = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
    { label: "Log", href: "/period", icon: Heart },
    { label: "Mood", href: "/mood", icon: Smile },
    { label: "Insights", href: "/insights", icon: BarChart3 },
  ];

  return (
    <>
      {/* Top Header for Mobile */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-[#FFF7FB]/90 dark:bg-[#150A13]/90 backdrop-blur-md border-b border-pink-100 dark:border-pink-950/60 px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🌸</span>
          <span className="text-lg font-bold bg-gradient-to-r from-[#BE185D] to-[#F472B6] bg-clip-text text-transparent">
            LunaBloom
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#3F243A] dark:text-[#FCE7F3]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-pink-600" />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl text-[#3F243A] dark:text-[#FCE7F3] bg-pink-100/50 dark:bg-pink-900/30"
            aria-label="Open navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Slide-out Full Menu Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs h-full bg-[#FFF7FB] dark:bg-[#150A13] p-6 flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-pink-900/40">
              <span className="font-bold text-lg text-[#BE185D]">Navigation</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#BE185D] text-white font-semibold shadow-sm"
                        : "text-[#3F243A] dark:text-[#FCE7F3] hover:bg-pink-100/60 dark:hover:bg-pink-950/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-xs">{item.badge}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-pink-100 dark:border-pink-900/40">
              <p className="text-xs text-muted-foreground truncate mb-3">
                {profile?.name || user?.email || "Bloom Friend"}
              </p>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-sm font-semibold hover:bg-rose-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1a0c18]/95 backdrop-blur-lg border-t border-pink-200/60 dark:border-pink-950/70 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {primaryMobileTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-[#BE185D] dark:text-[#F472B6] font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#BE185D]"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-pink-100 dark:bg-pink-950/80 scale-110" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
