"use client";

import React, { useState, useEffect } from "react";
import { PeriodCalendar } from "@/components/calendar/PeriodCalendar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { IPeriodRecord, IMoodRecord, ISymptomRecord, IPredictionResult, FlowLevel, MoodType } from "@/types";

export default function CalendarPage() {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [periods, setPeriods] = useState<IPeriodRecord[]>([]);
  const [moods, setMoods] = useState<IMoodRecord[]>([]);
  const [symptoms, setSymptoms] = useState<ISymptomRecord[]>([]);
  const [prediction, setPrediction] = useState<IPredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [pRes, mRes, sRes, predRes] = await Promise.all([
        fetch("/api/periods", { headers }),
        fetch("/api/moods", { headers }),
        fetch("/api/symptoms", { headers }),
        fetch("/api/predictions", { headers }),
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        setPeriods(data.records || []);
      }
      if (mRes.ok) {
        const data = await mRes.json();
        setMoods(data.records || []);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSymptoms(data.records || []);
      }
      if (predRes.ok) {
        const data = await predRes.json();
        setPrediction(data.prediction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSavePeriod = async (data: {
    startDate: string;
    endDate?: string;
    flowLevels?: Record<string, FlowLevel>;
    notes?: string;
  }) => {
    try {
      const res = await fetch("/api/periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save period");
      success("Logged Successfully 🌸", `Period recorded for ${data.startDate}`);
      await loadData();
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const handleDeletePeriod = async (startDate: string) => {
    try {
      const res = await fetch(`/api/periods?startDate=${startDate}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error("Failed to delete period record");
      success("Record Removed", "Period record removed from calendar.");
      await loadData();
    } catch (err: any) {
      error("Error", err.message);
    }
  };

  const handleSaveMood = async (data: { date: string; mood: MoodType; notes?: string }) => {
    try {
      await fetch("/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSymptoms = async (data: {
    date: string;
    symptoms: string[];
    severity: "Mild" | "Moderate" | "Severe";
    notes?: string;
  }) => {
    try {
      await fetch("/api/symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3]">
          Period Calendar 📅
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          View your confirmed cycles, predicted future periods, and daily wellness logs.
        </p>
      </div>

      <PeriodCalendar
        periods={periods}
        moods={moods}
        symptoms={symptoms}
        prediction={prediction}
        onSavePeriod={handleSavePeriod}
        onDeletePeriod={handleDeletePeriod}
        onSaveMood={handleSaveMood}
        onSaveSymptoms={handleSaveSymptoms}
      />
    </div>
  );
}
