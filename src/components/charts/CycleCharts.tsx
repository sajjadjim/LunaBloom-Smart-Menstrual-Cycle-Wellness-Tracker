"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { IPeriodRecord, IMoodRecord, ISymptomRecord } from "@/types";
import { differenceInCalendarDaysSafe, formatDisplayDate } from "@/lib/utils/date";
import { BarChart3, TrendingUp, Calendar, Smile, Activity } from "lucide-react";

interface CycleChartsProps {
  periods: IPeriodRecord[];
  moods?: IMoodRecord[];
  symptoms?: ISymptomRecord[];
}

export function CycleCharts({ periods, moods = [], symptoms = [] }: CycleChartsProps) {
  const [timeFilter, setTimeFilter] = useState<"3m" | "6m" | "12m" | "all">("all");

  // Sorted periods
  const sortedPeriods = useMemo(() => {
    return [...periods].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [periods]);

  // Compute cycle lengths and durations
  const cycleData = useMemo(() => {
    const data: { label: string; cycleLength: number; duration: number; startDate: string }[] = [];

    for (let i = 0; i < sortedPeriods.length; i++) {
      const current = sortedPeriods[i];
      let duration = 5;
      if (current.endDate && current.endDate >= current.startDate) {
        duration = differenceInCalendarDaysSafe(current.endDate, current.startDate) + 1;
      }

      let cycleLength = 28;
      if (i > 0) {
        const prev = sortedPeriods[i - 1];
        const diff = differenceInCalendarDaysSafe(current.startDate, prev.startDate);
        if (diff >= 18 && diff <= 60) {
          cycleLength = diff;
        }
      }

      data.push({
        label: formatDisplayDate(current.startDate, "MMM yyyy"),
        startDate: current.startDate,
        cycleLength,
        duration,
      });
    }

    return data;
  }, [sortedPeriods]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (cycleData.length === 0) {
      return {
        total: 0,
        avgCycle: 28,
        avgDuration: 5,
        shortest: 28,
        longest: 28,
        variation: 0,
      };
    }

    const lengths = cycleData.slice(1).map((d) => d.cycleLength);
    const durations = cycleData.map((d) => d.duration);

    const avgCycle =
      lengths.length > 0 ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 28;
    const avgDuration =
      durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 5;
    const shortest = lengths.length > 0 ? Math.min(...lengths) : avgCycle;
    const longest = lengths.length > 0 ? Math.max(...lengths) : avgCycle;
    const variation = longest - shortest;

    return {
      total: sortedPeriods.length,
      avgCycle,
      avgDuration,
      shortest,
      longest,
      variation,
    };
  }, [cycleData, sortedPeriods]);

  // Mood frequency breakdown
  const moodDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    moods.forEach((m) => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [moods]);

  // Symptom frequency breakdown
  const symptomDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    symptoms.forEach((s) => {
      s.symptoms.forEach((sym) => {
        counts[sym] = (counts[sym] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [symptoms]);

  const moodColors = ["#BE185D", "#DB2777", "#F472B6", "#F9A8D4", "#A855F7", "#8B5CF6", "#6366F1"];

  if (periods.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-white/80 dark:bg-[#1f0e1c]/80 border border-pink-100 dark:border-pink-900/50 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-3xl">
          📊
        </div>
        <h3 className="text-lg font-bold text-[#BE185D] dark:text-[#F472B6]">
          No Cycle History Recorded Yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-6">
          Log your past or current menstrual cycles to unlock personalized trend lines, length variations, and symptom patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analytics Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Recorded
          </span>
          <p className="text-3xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-2">
            {stats.total}
          </p>
          <span className="text-[11px] text-muted-foreground">Cycles in journal</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Avg Cycle Length
          </span>
          <p className="text-3xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-2">
            {stats.avgCycle} <span className="text-sm font-medium">days</span>
          </p>
          <span className="text-[11px] text-muted-foreground">Recent trend average</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Avg Duration
          </span>
          <p className="text-3xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-2">
            {stats.avgDuration} <span className="text-sm font-medium">days</span>
          </p>
          <span className="text-[11px] text-muted-foreground">Flow days per period</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Cycle Range
          </span>
          <p className="text-2xl font-extrabold text-[#BE185D] dark:text-[#F472B6] mt-2">
            {stats.shortest} – {stats.longest} <span className="text-xs font-medium">days</span>
          </p>
          <span className="text-[11px] text-muted-foreground">Variation: {stats.variation} days</span>
        </div>
      </div>

      {/* Cycle Length Line Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-xl shadow-pink-500/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#BE185D] dark:text-[#F472B6] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              Cycle Length Trends
            </h3>
            <p className="text-xs text-muted-foreground">
              Intervals (days) between consecutive confirmed period start dates
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cycleData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 114, 182, 0.15)" />
              <XAxis dataKey="label" stroke="#8E6E87" fontSize={12} tickLine={false} />
              <YAxis stroke="#8E6E87" fontSize={12} domain={[20, 45]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderColor: "#F472B6",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "#3F243A",
                }}
              />
              <Line
                type="monotone"
                dataKey="cycleLength"
                stroke="#BE185D"
                strokeWidth={3}
                dot={{ fill: "#BE185D", r: 5 }}
                activeDot={{ r: 8, fill: "#F472B6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Duration and Symptoms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Period Duration Bar Chart */}
        <div className="p-6 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
          <h3 className="text-base font-bold text-[#BE185D] dark:text-[#F472B6] mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-500" />
            Period Duration (Days)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Duration of each confirmed menstrual period</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 114, 182, 0.15)" />
                <XAxis dataKey="label" stroke="#8E6E87" fontSize={11} tickLine={false} />
                <YAxis stroke="#8E6E87" fontSize={11} domain={[0, 10]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderColor: "#F472B6",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="duration" fill="#F472B6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Symptoms Breakdown */}
        <div className="p-6 rounded-3xl bg-white/85 dark:bg-[#1f0e1c]/85 border border-pink-100 dark:border-pink-900/50 shadow-sm">
          <h3 className="text-base font-bold text-[#BE185D] dark:text-[#F472B6] mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-500" />
            Top Logged Symptoms
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Most frequently reported sensations across cycles</p>

          {symptomDistribution.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No symptoms logged yet. Use the calendar to record sensations.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {symptomDistribution.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{item.name}</span>
                    <span className="text-[#BE185D] dark:text-[#F472B6]">{item.count} times</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-pink-100 dark:bg-pink-950/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-[#BE185D] rounded-full"
                      style={{
                        width: `${Math.min(100, (item.count / Math.max(1, stats.total)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
