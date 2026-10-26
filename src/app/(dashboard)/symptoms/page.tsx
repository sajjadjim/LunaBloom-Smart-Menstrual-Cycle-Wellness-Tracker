"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { toDateString, formatDisplayDate } from "@/lib/utils/date";
import { ISymptomRecord, SymptomSeverity } from "@/types";
import { Activity, Plus, Clock, AlertCircle } from "lucide-react";

export default function SymptomsPage() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [date, setDate] = useState(toDateString(new Date()));
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Cramps"]);
  const [severity, setSeverity] = useState<SymptomSeverity>("Mild");
  const [notes, setNotes] = useState("");
  const [symptomsList, setSymptomsList] = useState<ISymptomRecord[]>([]);
  const [saving, setSaving] = useState(false);

  const availableSymptoms = [
    "Cramps",
    "Headache",
    "Back Pain",
    "Bloating",
    "Fatigue",
    "Breast Tenderness",
    "Acne",
    "Mood Changes",
    "Nausea",
    "Insomnia",
    "Food Cravings",
  ];

  const loadSymptoms = async () => {
    try {
      const res = await fetch("/api/symptoms", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setSymptomsList(data.records || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSymptoms();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      error("Selection required", "Please choose at least one symptom.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          date,
          symptoms: selectedSymptoms,
          severity,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to record symptoms");
      success("Symptoms Recorded 🌷", `Saved sensations for ${date}`);
      setNotes("");
      await loadSymptoms();
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
          <span>Symptom Tracker</span>
          <span className="text-2xl">🌷</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Record physical sensations, cramps, and energy levels to understand your body&apos;s natural rhythm.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Select Symptoms (Choose one or more):
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      if (isSelected) setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
                      else setSelectedSymptoms([...selectedSymptoms, sym]);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-[#BE185D] text-white border-[#BE185D] shadow-sm scale-102"
                        : "bg-pink-50/50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/40 text-[#3F243A] dark:text-[#FCE7F3] hover:bg-pink-50"
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">
              Severity Level
            </label>
            <div className="grid grid-cols-3 max-w-sm gap-2">
              {(["Mild", "Moderate", "Severe"] as SymptomSeverity[]).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    severity === sev
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-pink-50/50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/40 text-[#3F243A] dark:text-[#FCE7F3]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific triggers or remedies that brought relief?"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-[#281325]/40 text-sm focus:ring-2 focus:ring-[#BE185D] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white font-bold text-sm shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Log Symptoms 🌷"}</span>
          </button>
        </form>
      </div>

      {/* Symptom History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 border border-pink-100 dark:border-pink-900/50 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Symptom History</span>
        </h2>

        {symptomsList.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            No symptoms logged yet. Use the form above to record your first entry.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {symptomsList.map((s) => (
              <div
                key={s._id || s.date}
                className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#3F243A] dark:text-[#FCE7F3]">
                      {formatDisplayDate(s.date)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200">
                      {s.severity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.symptoms.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#200e1e] border border-pink-200 text-[11px] font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  {s.notes && (
                    <p className="text-muted-foreground text-[11px] mt-1.5 italic">
                      &ldquo;{s.notes}&rdquo;
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
