"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { toDateString, formatDisplayDate } from "@/lib/utils/date";
import { IMoodRecord, MoodType } from "@/types";
import { Smile, Sparkles, Check, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function MoodTrackerPage() {
  const { token, profile } = useAuth();
  const { success, error } = useToast();

  const [date, setDate] = useState(toDateString(new Date()));
  const [selectedMood, setSelectedMood] = useState<MoodType>("Calm");
  const [notes, setNotes] = useState("");
  const [moods, setMoods] = useState<IMoodRecord[]>([]);
  const [saving, setSaving] = useState(false);

  const moodOptions: { type: MoodType; emoji: string; desc: string }[] = [
    { type: "Happy", emoji: "😊", desc: "Joyful and uplifted" },
    { type: "Calm", emoji: "😌", desc: "Peaceful and centered" },
    { type: "Loved", emoji: "🥰", desc: "Warm and appreciated" },
    { type: "Energetic", emoji: "🤩", desc: "Motivated and inspired" },
    { type: "Tired", emoji: "😴", desc: "Needing restorative rest" },
    { type: "Sad", emoji: "😔", desc: "Reflective or low" },
    { type: "Stressed", emoji: "😣", desc: "Overwhelmed or tense" },
    { type: "Anxious", emoji: "😟", desc: "Restless or uneasy" },
    { type: "Irritated", emoji: "😡", desc: "Sensitive or annoyed" },
  ];

  const loadMoods = async () => {
    try {
      const res = await fetch("/api/moods", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setMoods(data.records || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadMoods();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          date,
          mood: selectedMood,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to record mood");
      success("Mood Logged 🌸", `Recorded "${selectedMood}" for ${date}`);
      setNotes("");
      await loadMoods();
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Section 12: Personalized comfort suggestions based on mood
  const getComfortIdea = (m: MoodType) => {
    switch (m) {
      case "Anxious":
        return "Try the 4-7-8 breathing exercise: breathe in for 4 seconds, hold for 7, and exhale gently for 8. A cup of warm chamomile tea or light stretching can help ground you.";
      case "Tired":
        return "Honor your body's request for rest. If possible, take a 20-minute power nap or enjoy a warm foot soak with calming essential oils.";
      case "Stressed":
        return "Step away from screens for a short walk. Journaling your immediate thoughts on paper can help untangle worries.";
      case "Irritated":
        return "Hormonal shifts can heighten sensitivity. Give yourself permission to say no to non-essential tasks today and enjoy a cozy comfort meal.";
      case "Sad":
        return "Wrap yourself in a soft blanket, listen to gentle music, or reach out to a trusted loved one. You are worthy of tender care.";
      case "Happy":
      case "Energetic":
        return "Wonderful! Channel this vibrant energy into creative projects, walking in nature, or cooking a delicious nourishing meal.";
      default:
        return "Take a deep breath and cherish this serene moment. Maintain gentle hydration throughout your day.";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
          <span>Daily Mood Tracker</span>
          <span className="text-2xl">😊</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Honor your emotions throughout your cycle. Track shifts and receive gentle comfort ideas.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
            />
          </div>

          {/* Mood Options Grid */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-3">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moodOptions.map((opt) => {
                const isSelected = selectedMood === opt.type;
                return (
                  <motion.button
                    key={opt.type}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMood(opt.type)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-pink-100/80 dark:bg-pink-950/70 border-[#BE185D] ring-2 ring-[#BE185D]/30 shadow-md"
                        : "bg-pink-50/30 dark:bg-[#251222]/30 border-pink-100 dark:border-pink-900/40 hover:bg-pink-50"
                    }`}
                  >
                    <span className="text-3xl shrink-0">{opt.emoji}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-[#3F243A] dark:text-[#FCE7F3] block truncate">
                        {opt.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground leading-tight block">
                        {opt.desc}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Gentle Comfort Suggestion Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-pink-50 to-purple-50 dark:from-[#200e1f] dark:to-[#170e24] border border-pink-100 dark:border-pink-900/40 space-y-1">
            <span className="text-xs font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Gentle Comfort Suggestion for {selectedMood}:
            </span>
            <p className="text-xs text-[#5C3A55] dark:text-[#DEC5D7] leading-relaxed">
              {getComfortIdea(selectedMood)}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Personal Reflection Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What thoughts or sensations are present right now?"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-bold text-sm shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Smile className="w-4 h-4" />
            <span>{saving ? "Saving Mood..." : "Save Today's Mood 🌸"}</span>
          </button>
        </form>
      </div>

      {/* Mood History Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Mood Journal History</span>
        </h2>

        {moods.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            No moods recorded yet. Log your first check-in above!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {moods.map((m) => (
              <div
                key={m._id || m.date}
                className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 flex items-start gap-3"
              >
                <span className="text-2xl">
                  {moodOptions.find((opt) => opt.type === m.mood)?.emoji || "🌸"}
                </span>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3F243A] dark:text-[#FCE7F3]">{m.mood}</span>
                    <span className="text-muted-foreground text-[10px]">{formatDisplayDate(m.date)}</span>
                  </div>
                  {m.notes && (
                    <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2 italic">
                      &ldquo;{m.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
