"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  Smile,
  Activity,
  Salad,
  BarChart3,
  CheckSquare,
  BookOpen,
  Settings,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: "🌸" },
  { label: "Period Calendar", href: "/calendar", icon: CalendarDays, badge: "📅" },
  { label: "Log Period", href: "/period", icon: Heart, badge: "💗" },
  { label: "Mood Tracker", href: "/mood", icon: Smile, badge: "😊" },
  { label: "Symptoms", href: "/symptoms", icon: Activity, badge: "🌷" },
  { label: "Nutrition Guide", href: "/nutrition", icon: Salad, badge: "🥗" },
  { label: "Cycle Insights", href: "/insights", icon: BarChart3, badge: "📊" },
  { label: "Prep Checklist", href: "/checklist", icon: CheckSquare, badge: "🎀" },
  { label: "Wellness Guide", href: "/wellness", icon: BookOpen, badge: "📚" },
  { label: "Settings", href: "/settings", icon: Settings, badge: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const displayName = profile?.name || (user as any)?.displayName || "Sarah";

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#FFF7FB]/90 dark:bg-[#150A13]/90 border-r border-pink-100 dark:border-pink-950/60 p-5 select-none transition-colors">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F472B6] to-[#BE185D] flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform">
          🌸
        </div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#BE185D] to-[#F472B6] bg-clip-text text-transparent">
            LunaBloom
          </span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Wellness Suite
          </p>
        </div>
      </Link>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white shadow-md shadow-pink-500/20 font-semibold"
                  : "text-[#3F243A]/80 dark:text-[#FCE7F3]/80 hover:bg-pink-100/60 dark:hover:bg-pink-950/40 hover:text-[#BE185D] dark:hover:text-[#F472B6]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#BE185D] dark:text-[#F472B6]"}`} />
              <span className="flex-1">{item.label}</span>
              <span className="text-xs opacity-75">{item.badge}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile and Controls */}
      <div className="pt-4 border-t border-pink-200/60 dark:border-pink-900/40 space-y-3">
        {/* Theme switcher */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#3F243A] dark:text-[#FCE7F3] hover:bg-pink-100/50 dark:hover:bg-pink-950/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-pink-600" />}
            {theme === "dark" ? "Light Pink Mode" : "Dark Rose Mode"}
          </span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-pink-200/50 dark:bg-pink-900/50">
            {theme}
          </span>
        </button>

        {/* User bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/70 dark:bg-[#200E1D]/70 border border-pink-100 dark:border-pink-950/60">
          <Link href="/settings" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-rose-400 flex items-center justify-center text-white text-xs font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#3F243A] dark:text-[#FCE7F3] truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email || "bloom@lunabloom.app"}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
