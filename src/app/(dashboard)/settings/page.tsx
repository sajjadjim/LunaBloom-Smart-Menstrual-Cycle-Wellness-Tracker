"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { calculateAge } from "@/lib/utils/date";
import {
  User,
  Bell,
  Lock,
  Download,
  Trash2,
  Mail,
  Send,
  Sparkles,
  ShieldAlert,
  Save,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, token, refreshProfile, logout } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<"profile" | "cycle" | "notifications" | "privacy">("profile");

  // Profile fields
  const [name, setName] = useState(profile?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || "");
  const [gender, setGender] = useState(profile?.gender || "Female");
  const [address, setAddress] = useState(profile?.address || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [timezone, setTimezone] = useState(profile?.timezone || "UTC");

  // Cycle settings
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [avgPeriodDuration, setAvgPeriodDuration] = useState(5);
  const [trackOvulation, setTrackOvulation] = useState(false);

  // Notification settings
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [reminderOffsets, setReminderOffsets] = useState<number[]>([2]);
  const [discreetMode, setDiscreetMode] = useState(false);

  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.dateOfBirth) setDateOfBirth(profile.dateOfBirth);
      if (profile.gender) setGender(profile.gender);
      if (profile.address) setAddress(profile.address);
      if (profile.country) setCountry(profile.country);
      if (profile.timezone) setTimezone(profile.timezone);
    }

    const loadSettings = async () => {
      try {
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [notifRes, predRes] = await Promise.all([
          fetch("/api/notifications", { headers }),
          fetch("/api/predictions", { headers }),
        ]);

        if (notifRes.ok) {
          const d = await notifRes.json();
          if (d.settings) {
            setEmailEnabled(Boolean(d.settings.emailEnabled));
            setReminderOffsets(d.settings.reminderOffsets || [2]);
            setDiscreetMode(Boolean(d.settings.discreetMode));
          }
        }

        if (predRes.ok) {
          const p = await predRes.json();
          if (p.settings) {
            setAvgCycleLength(p.settings.averageCycleLength || 28);
            setAvgPeriodDuration(p.settings.averagePeriodDuration || 5);
            setTrackOvulation(Boolean(p.settings.trackOvulation));
          }
        }
      } catch (err) {
        console.error("Settings load error:", err);
      }
    };

    loadSettings();
  }, [profile, token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name,
          dateOfBirth,
          gender,
          address,
          country,
          timezone,
          averageCycleLength: avgCycleLength,
          averagePeriodDuration: avgPeriodDuration,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      await refreshProfile();
      success("Settings Saved 🌸", "Your profile information has been updated.");
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          emailEnabled,
          reminderOffsets,
          discreetMode,
        }),
      });

      if (!res.ok) throw new Error("Failed to update notification settings");
      success("Preferences Updated 💌", "Notification settings saved successfully.");
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          action: "send_test",
          discreetMode,
        }),
      });

      const d = await res.json();
      if (d.success) {
        success("Test Dispatched! 💌", d.message || "Check your email inbox.");
      } else {
        error("Email Error", d.error || "Failed to dispatch test.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setSendingTest(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/auth/account", {
        headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
      });
      if (!res.ok) throw new Error("Failed to export data");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lunabloom_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      success("Data Exported", "Your personal health archive has been downloaded.");
    } catch (err: any) {
      error("Export Error", err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "WARNING: This will permanently erase your LunaBloom account and ALL associated cycle, mood, and symptom records. This cannot be undone. Are you sure?"
    );
    if (confirmed) {
      try {
        const res = await fetch("/api/auth/account", {
          method: "DELETE",
          headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
        });
        if (res.ok) {
          await logout();
          success("Account Erased", "All health records have been permanently deleted.");
          router.push("/");
        }
      } catch (err: any) {
        error("Error", err.message);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
          <span>Settings & Preferences</span>
          <span className="text-2xl">⚙️</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your profile, email reminders, cycle parameters, and privacy rights.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-pink-100 dark:border-pink-900/40 gap-6 text-xs sm:text-sm font-semibold">
        {[
          { id: "profile", label: "Profile Info" },
          { id: "cycle", label: "Cycle & Ovulation" },
          { id: "notifications", label: "Email Reminders" },
          { id: "privacy", label: "Privacy & Data" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#BE185D] text-[#BE185D] dark:text-[#F472B6]"
                : "border-transparent text-muted-foreground hover:text-[#BE185D]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-100 dark:border-pink-950 bg-gray-100/60 dark:bg-black/30 text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
              />
              {dateOfBirth && (
                <span className="text-[11px] text-[#BE185D] mt-1 block">
                  Calculated Age: {calculateAge(dateOfBirth)} years old
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Gender</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Profile Information"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Cycle & Ovulation */}
      {activeTab === "cycle" && (
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40">
              <label className="text-xs font-bold text-[#BE185D] block mb-1">
                Default Cycle Length: {avgCycleLength} Days
              </label>
              <input
                type="range"
                min={21}
                max={45}
                value={avgCycleLength}
                onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                className="w-full accent-[#BE185D] mt-2"
              />
              <span className="text-[11px] text-muted-foreground block mt-1">
                Used as fallback when insufficient historical cycles have been logged.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40">
              <label className="text-xs font-bold text-[#BE185D] block mb-1">
                Default Period Duration: {avgPeriodDuration} Days
              </label>
              <input
                type="range"
                min={2}
                max={10}
                value={avgPeriodDuration}
                onChange={(e) => setAvgPeriodDuration(Number(e.target.value))}
                className="w-full accent-[#BE185D] mt-2"
              />
              <span className="text-[11px] text-muted-foreground block mt-1">
                Estimated duration of flow per menstrual period.
              </span>
            </div>
          </div>

          {/* Section 18: Optional Ovulation Estimate */}
          <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-purple-900 dark:text-purple-200 block">
                  Show Optional Ovulation Window on Calendar
                </span>
                <span className="text-xs text-muted-foreground">
                  Displays estimated fertile days (~14 days before predicted period) in lavender.
                </span>
              </div>
              <input
                type="checkbox"
                checked={trackOvulation}
                onChange={(e) => setTrackOvulation(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1a0f25] border border-purple-200/60 text-[11px] text-purple-900/80 dark:text-purple-200 leading-relaxed">
              <strong>Important Warning:</strong> Calendar-based ovulation estimates are approximations and highly variable. Never use this educational estimate as a method of contraception or family planning.
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Cycle Parameters</span>
          </button>
        </form>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSaveNotifications} className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40">
            <div>
              <span className="text-sm font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                Enable In-App Period Reminders 🌸
              </span>
              <span className="text-xs text-muted-foreground">
                Display preparation reminders right on your dashboard and cycle calendar before your estimated period starts.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#BE185D]"
            />
          </div>

          {emailEnabled && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-[#BE185D] block mb-2">
                  When would you like to see reminders?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: [2], label: "2 days before" },
                    { val: [3], label: "3 days before" },
                    { val: [2, 3], label: "Both 2 & 3 days before" },
                  ].map((item, idx) => {
                    const isSelected = JSON.stringify(reminderOffsets) === JSON.stringify(item.val);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReminderOffsets(item.val)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-[#BE185D] text-white border-[#BE185D] shadow-sm"
                            : "bg-pink-50/40 border-pink-200 text-[#3F243A] dark:text-[#FCE7F3]"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discreet Mode */}
              <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                    Discreet Reminder Mode
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Softens notification phrasing (e.g. &ldquo;Gentle wellness reminder from LunaBloom&rdquo;).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={discreetMode}
                  onChange={(e) => setDiscreetMode(e.target.checked)}
                  className="w-5 h-5 accent-[#BE185D]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Notification Preferences</span>
          </button>
        </form>
      )}

      {/* TAB 4: Privacy & Data Ownership */}
      {activeTab === "privacy" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Privacy Guaranteed
            </span>
            <p>
              Your health data is encrypted in transit and isolated to your verified account. We do not sell or monetize personal cycle records.
            </p>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40">
              <div>
                <span className="text-xs font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                  Export My Personal Health Data
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Download a complete JSON backup of all your recorded periods, moods, and symptoms.
                </span>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-5 py-2 rounded-xl bg-white dark:bg-[#200e1e] border border-pink-200 dark:border-pink-900/60 text-xs font-semibold text-[#BE185D] hover:bg-pink-50 flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
              <div>
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">
                  Permanently Delete My Account
                </span>
                <span className="text-[11px] text-rose-600/80 dark:text-rose-400">
                  Irreversibly erases all period history, mood logs, and personal settings from our database.
                </span>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
