"use client";

import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Plus, Trash2, Calendar as CalIcon, X } from "lucide-react";
import { IPeriodRecord, IMoodRecord, ISymptomRecord, IPredictionResult, FlowLevel, MoodType } from "@/types";
import { toDateString, parseSafeDate, formatDisplayDate } from "@/lib/utils/date";

interface PeriodCalendarProps {
  periods: IPeriodRecord[];
  moods?: IMoodRecord[];
  symptoms?: ISymptomRecord[];
  prediction?: IPredictionResult | null;
  onSavePeriod: (data: { startDate: string; endDate?: string; flowLevels?: Record<string, FlowLevel>; notes?: string }) => Promise<void>;
  onDeletePeriod: (startDate: string) => Promise<void>;
  onSaveMood?: (data: { date: string; mood: MoodType; notes?: string }) => Promise<void>;
  onSaveSymptoms?: (data: { date: string; symptoms: string[]; severity: "Mild" | "Moderate" | "Severe"; notes?: string }) => Promise<void>;
}

export function PeriodCalendar({
  periods,
  moods = [],
  symptoms = [],
  prediction,
  onSavePeriod,
  onDeletePeriod,
  onSaveMood,
  onSaveSymptoms,
}: PeriodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state in modal
  const [modalPeriodStarted, setModalPeriodStarted] = useState(false);
  const [modalPeriodEnded, setModalPeriodEnded] = useState(false);
  const [modalEndDate, setModalEndDate] = useState("");
  const [modalFlow, setModalFlow] = useState<FlowLevel>("medium");
  const [modalNotes, setModalNotes] = useState("");
  const [modalMood, setModalMood] = useState<MoodType | "">("");
  const [modalSymptoms, setModalSymptoms] = useState<string[]>([]);
  const [modalSeverity, setModalSeverity] = useState<"Mild" | "Moderate" | "Severe">("Mild");

  // Determine date sets
  const confirmedDates = new Set<string>();
  periods.forEach((p) => {
    const start = parseSafeDate(p.startDate);
    const end = p.endDate ? parseSafeDate(p.endDate) : start;
    if (end >= start) {
      const days = eachDayOfInterval({ start, end });
      days.forEach((d) => confirmedDates.add(toDateString(d)));
    } else {
      confirmedDates.add(p.startDate);
    }
  });

  const predictedDates = new Set<string>();
  if (prediction?.predictedStartDate) {
    const pStart = parseSafeDate(prediction.predictedStartDate);
    const pEnd = prediction.predictedEndDate
      ? parseSafeDate(prediction.predictedEndDate)
      : parseSafeDate(prediction.predictedStartDate);
    if (pEnd >= pStart) {
      const days = eachDayOfInterval({ start: pStart, end: pEnd });
      days.forEach((d) => predictedDates.add(toDateString(d)));
    }
  }

  const fertileDates = new Set<string>();
  if (prediction?.fertileWindow?.startDate && prediction?.fertileWindow?.endDate) {
    const fStart = parseSafeDate(prediction.fertileWindow.startDate);
    const fEnd = parseSafeDate(prediction.fertileWindow.endDate);
    if (fEnd >= fStart) {
      const days = eachDayOfInterval({ start: fStart, end: fEnd });
      days.forEach((d) => fertileDates.add(toDateString(d)));
    }
  }

  const wellnessDates = new Set<string>();
  moods.forEach((m) => wellnessDates.add(m.date));
  symptoms.forEach((s) => wellnessDates.add(s.date));

  // Calendar matrix days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInGrid = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);

    // Populate modal if record exists
    const periodForDate = periods.find((p) => {
      const s = p.startDate;
      const e = p.endDate || p.startDate;
      return dateStr >= s && dateStr <= e;
    });

    if (periodForDate) {
      setModalPeriodStarted(true);
      setModalPeriodEnded(Boolean(periodForDate.endDate));
      setModalEndDate(periodForDate.endDate || "");
      setModalFlow(periodForDate.flowLevels?.[dateStr] || "medium");
      setModalNotes(periodForDate.notes || "");
    } else {
      setModalPeriodStarted(false);
      setModalPeriodEnded(false);
      setModalEndDate("");
      setModalFlow("medium");
      setModalNotes("");
    }

    const moodForDate = moods.find((m) => m.date === dateStr);
    setModalMood(moodForDate ? moodForDate.mood : "");

    const symptomForDate = symptoms.find((s) => s.date === dateStr);
    setModalSymptoms(symptomForDate ? symptomForDate.symptoms : []);
    setModalSeverity(symptomForDate ? symptomForDate.severity : "Mild");

    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!selectedDateStr) return;
    setSaving(true);
    try {
      if (modalPeriodStarted) {
        await onSavePeriod({
          startDate: selectedDateStr,
          endDate: modalPeriodEnded && modalEndDate ? modalEndDate : undefined,
          flowLevels: { [selectedDateStr]: modalFlow },
          notes: modalNotes,
        });
      }

      if (modalMood && onSaveMood) {
        await onSaveMood({
          date: selectedDateStr,
          mood: modalMood as MoodType,
          notes: modalNotes,
        });
      }

      if (modalSymptoms.length > 0 && onSaveSymptoms) {
        await onSaveSymptoms({
          date: selectedDateStr,
          symptoms: modalSymptoms,
          severity: modalSeverity,
          notes: modalNotes,
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDateStr) return;
    if (confirm("Are you sure you want to delete this period entry?")) {
      setSaving(true);
      try {
        await onDeletePeriod(selectedDateStr);
        setIsModalOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const availableSymptoms = [
    "Cramps",
    "Headache",
    "Back Pain",
    "Bloating",
    "Fatigue",
    "Breast Tenderness",
    "Acne",
    "Nausea",
  ];

  const availableMoods: { type: MoodType; emoji: string }[] = [
    { type: "Happy", emoji: "😊" },
    { type: "Calm", emoji: "😌" },
    { type: "Sad", emoji: "😔" },
    { type: "Stressed", emoji: "😣" },
    { type: "Tired", emoji: "😴" },
    { type: "Irritated", emoji: "😡" },
    { type: "Loved", emoji: "🥰" },
    { type: "Anxious", emoji: "😟" },
    { type: "Energetic", emoji: "🤩" },
  ];

  return (
    <div className="w-full bg-white/85 dark:bg-[#1f0e1c]/85 backdrop-blur-xl border border-pink-100 dark:border-pink-900/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-500/5">
      {/* Month Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click any date to log flow, symptoms, or mood.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl border border-pink-200 dark:border-pink-900/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-[#BE185D] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3.5 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-xs font-semibold text-[#BE185D] transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl border border-pink-200 dark:border-pink-900/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-[#BE185D] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {daysInGrid.map((day) => {
          const dayStr = toDateString(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          const isConfirmed = confirmedDates.has(dayStr);
          const isPredicted = !isConfirmed && predictedDates.has(dayStr);
          const isFertile = !isConfirmed && !isPredicted && fertileDates.has(dayStr);
          const hasWellness = wellnessDates.has(dayStr);

          let cellClass = "bg-white dark:bg-[#281325]/50 border-pink-100 dark:border-pink-950/40 text-[#3F243A] dark:text-[#FCE7F3]";
          let badge = null;

          if (isConfirmed) {
            cellClass = "bg-gradient-to-tr from-[#BE185D] to-[#E11D48] text-white border-[#BE185D] shadow-md shadow-pink-500/20";
            badge = "🩸";
          } else if (isPredicted) {
            cellClass = "bg-pink-100 dark:bg-pink-950/70 border-pink-300 dark:border-pink-800 text-[#BE185D] dark:text-[#F9A8D4] border-dashed";
            badge = "✨";
          } else if (isFertile) {
            cellClass = "bg-purple-100/70 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200";
            badge = "🌱";
          } else if (hasWellness) {
            cellClass = "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200";
            badge = "🌿";
          }

          return (
            <button
              key={dayStr}
              onClick={() => handleDateClick(dayStr)}
              className={`min-h-[64px] sm:min-h-[82px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.03] hover:shadow-md cursor-pointer ${
                !isCurrentMonth ? "opacity-35" : ""
              } ${cellClass} ${isTodayDate ? "ring-2 ring-[#BE185D]" : ""}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs sm:text-sm font-semibold ${isTodayDate ? "underline decoration-2" : ""}`}>
                  {format(day, "d")}
                </span>
                {badge && <span className="text-xs">{badge}</span>}
              </div>

              {/* Mini details tag on desktop */}
              <div className="hidden sm:block text-[10px] truncate opacity-90">
                {isConfirmed && "Period"}
                {isPredicted && "Predicted"}
                {isFertile && "Fertile"}
                {hasWellness && !isConfirmed && !isPredicted && "Wellness"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="mt-8 pt-6 border-t border-pink-100 dark:border-pink-900/40 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#BE185D]" />
          <span>Confirmed Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-pink-200 border border-dashed border-[#BE185D]" />
          <span>Predicted Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-purple-200" />
          <span>Fertile Window (Approx.)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-200" />
          <span>Wellness Logged</span>
        </div>
      </div>

      {/* Interactive Date Modal */}
      {isModalOpen && selectedDateStr && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FFF7FB] dark:bg-[#1a0c18] rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 dark:border-pink-900/60 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-pink-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-[#BE185D]">
                  <CalIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#BE185D] dark:text-[#F472B6]">
                    {formatDisplayDate(selectedDateStr, "EEEE, MMMM d, yyyy")}
                  </h3>
                  <p className="text-xs text-muted-foreground">Log or update entries for this date</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-6">
              {/* Period Flow Switch */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#251222] border border-pink-100 dark:border-pink-950/60 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-semibold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#BE185D] fill-[#BE185D]" />
                    Period on this date?
                  </span>
                  <input
                    type="checkbox"
                    checked={modalPeriodStarted}
                    onChange={(e) => setModalPeriodStarted(e.target.checked)}
                    className="w-5 h-5 accent-[#BE185D] rounded"
                  />
                </label>

                {modalPeriodStarted && (
                  <div className="pt-3 border-t border-pink-100 dark:border-pink-900/40 space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">Flow Level:</span>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {(["spotting", "light", "medium", "heavy"] as FlowLevel[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setModalFlow(level)}
                            className={`py-1.5 text-xs font-medium rounded-xl capitalize border transition-all ${
                              modalFlow === level
                                ? "bg-[#BE185D] text-white border-[#BE185D] shadow-sm font-semibold"
                                : "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/40 text-[#3F243A] dark:text-[#FCE7F3]"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={modalPeriodEnded}
                          onChange={(e) => setModalPeriodEnded(e.target.checked)}
                          className="w-4 h-4 accent-[#BE185D]"
                        />
                        <span>Has period ended on/before this date?</span>
                      </label>
                      {modalPeriodEnded && (
                        <input
                          type="date"
                          value={modalEndDate || selectedDateStr}
                          onChange={(e) => setModalEndDate(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/40 bg-white dark:bg-[#1a0c18] text-xs"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mood Selection */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#251222] border border-pink-100 dark:border-pink-950/60 space-y-2.5">
                <span className="text-sm font-semibold text-[#3F243A] dark:text-[#FCE7F3] block">
                  Today&apos;s Mood:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {availableMoods.map((m) => (
                    <button
                      key={m.type}
                      type="button"
                      onClick={() => setModalMood(modalMood === m.type ? "" : m.type)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        modalMood === m.type
                          ? "bg-pink-100 dark:bg-pink-950 border-[#BE185D] ring-1 ring-[#BE185D]"
                          : "border-pink-100 dark:border-pink-950 hover:bg-pink-50"
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[10px] font-medium truncate">{m.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms Selection */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#251222] border border-pink-100 dark:border-pink-950/60 space-y-2.5">
                <span className="text-sm font-semibold text-[#3F243A] dark:text-[#FCE7F3] block">
                  Logged Symptoms:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableSymptoms.map((sym) => {
                    const isSelected = modalSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setModalSymptoms(modalSymptoms.filter((s) => s !== sym));
                          } else {
                            setModalSymptoms([...modalSymptoms, sym]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                          isSelected
                            ? "bg-[#BE185D] text-white border-[#BE185D]"
                            : "bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/40 text-[#3F243A] dark:text-[#FCE7F3]"
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>

                {modalSymptoms.length > 0 && (
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Severity:</span>
                    {(["Mild", "Moderate", "Severe"] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setModalSeverity(sev)}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium border ${
                          modalSeverity === sev
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300 font-bold"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Personal Notes (Optional):
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="How are you feeling today? Any comforts that helped?"
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-[#1f0e1c] focus:outline-none focus:ring-2 focus:ring-[#BE185D]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-3">
              {confirmedDates.has(selectedDateStr) ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Period Record
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-900/40 text-xs font-semibold text-muted-foreground hover:bg-pink-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#DB2777] text-white text-xs font-semibold shadow hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving ? "Saving..." : "Save Log"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
