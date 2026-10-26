"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { toDateString, formatDisplayDate } from "@/lib/utils/date";
import { IPeriodRecord, FlowLevel } from "@/types";
import { Heart, Calendar, Trash2, Plus, Sparkles, Check } from "lucide-react";

export default function LogPeriodPage() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [startDate, setStartDate] = useState("2026-10-26");

  useEffect(() => {
    setStartDate(toDateString(new Date()));
  }, []);
  const [endDate, setEndDate] = useState("");
  const [flow, setFlow] = useState<FlowLevel>("medium");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState<IPeriodRecord[]>([]);

  const loadPeriods = async () => {
    try {
      const res = await fetch("/api/periods", {
        headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
      });
      if (res.ok) {
        const data = await res.json();
        setPeriods(data.records || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPeriods();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          startDate,
          endDate: endDate || undefined,
          flowLevels: { [startDate]: flow },
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to record period");

      success("Logged! 🌸", `Period recorded starting ${startDate}`);
      setNotes("");
      setEndDate("");
      await loadPeriods();
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sDate: string) => {
    if (confirm("Delete this period record?")) {
      try {
        const res = await fetch(`/api/periods?startDate=${sDate}`, {
          method: "DELETE",
          headers: (token ? { Authorization: `Bearer ${token}` } : {}) as HeadersInit,
        });
        if (res.ok) {
          success("Record Deleted", "Removed from your cycle history.");
          await loadPeriods();
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
          <span>Log Menstrual Period</span>
          <span className="text-2xl">💗</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Record your period dates and flow intensity to keep your cycle predictions accurate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-5">
          <h2 className="text-base font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Record New Period or Flow</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Period Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Period End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
                />
              </div>
            </div>

            {/* Flow Level */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Flow Intensity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["spotting", "light", "medium", "heavy"] as FlowLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFlow(level)}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize border transition-all ${
                      flow === level
                        ? "bg-[#BE185D] text-white border-[#BE185D] shadow-sm scale-102"
                        : "bg-pink-50/50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/40 text-[#3F243A] dark:text-[#FCE7F3]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Reflective Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any symptoms, discomforts, or comforting remedies that helped today?"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-bold text-sm shadow hover:shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{loading ? "Saving Record..." : "Save Period Record"}</span>
            </button>
          </form>
        </div>

        {/* Right: History Log */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Recent Period History</span>
          </h2>

          {periods.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">
              No periods recorded yet. Fill out the form to add your first record!
            </p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {[...periods].reverse().map((p) => (
                <div
                  key={p.startDate}
                  className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#3F243A] dark:text-[#FCE7F3] block">
                      {formatDisplayDate(p.startDate)} {p.endDate && `– ${formatDisplayDate(p.endDate)}`}
                    </span>
                    {p.notes && (
                      <p className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
                        {p.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(p.startDate)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
