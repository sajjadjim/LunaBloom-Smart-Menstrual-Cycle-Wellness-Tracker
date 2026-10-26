"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { CycleCharts } from "@/components/charts/CycleCharts";
import { IPeriodRecord, IMoodRecord, ISymptomRecord } from "@/types";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

export default function InsightsPage() {
  const { token } = useAuth();
  const [periods, setPeriods] = useState<IPeriodRecord[]>([]);
  const [moods, setMoods] = useState<IMoodRecord[]>([]);
  const [symptoms, setSymptoms] = useState<ISymptomRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [pRes, mRes, sRes] = await Promise.all([
          fetch("/api/periods", { headers }),
          fetch("/api/moods", { headers }),
          fetch("/api/symptoms", { headers }),
        ]);

        if (pRes.ok) {
          const d = await pRes.json();
          setPeriods(d.records || []);
        }
        if (mRes.ok) {
          const d = await mRes.json();
          setMoods(d.records || []);
        }
        if (sRes.ok) {
          const d = await sRes.json();
          setSymptoms(d.records || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3F243A] dark:text-[#FCE7F3] flex items-center gap-2">
          <span>Cycle History & Analytics</span>
          <span className="text-2xl">📊</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Explore cycle length trends, duration metrics, and symptom frequencies calculated from your real entries.
        </p>
      </div>

      <CycleCharts periods={periods} moods={moods} symptoms={symptoms} />
    </div>
  );
}
