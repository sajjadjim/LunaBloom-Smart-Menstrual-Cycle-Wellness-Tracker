import {
  differenceInCalendarDaysSafe,
  addDaysSafe,
  toDateString,
} from "@/lib/utils/date";
import { IPeriodRecord, IPredictionResult } from "@/types";

interface PredictionOptions {
  today?: string; // YYYY-MM-DD, defaults to current date
  defaultCycleLength?: number; // fallback e.g. 28
  defaultPeriodDuration?: number; // fallback e.g. 5
  trackOvulation?: boolean;
}

export function calculateCyclePredictions(
  periodRecords: IPeriodRecord[],
  options: PredictionOptions = {}
): IPredictionResult {
  const today = options.today || toDateString(new Date());
  const fallbackCycleLength = options.defaultCycleLength || 28;
  const fallbackPeriodDuration = options.defaultPeriodDuration || 5;

  // Filter and sort records chronologically by start date
  const sortedRecords = [...periodRecords]
    .filter((r) => r.startDate && r.startDate.trim().length > 0)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  // If no records at all, return default estimate relative to today
  if (sortedRecords.length === 0) {
    const predictedStart = addDaysSafe(today, fallbackCycleLength);
    const predictedEnd = addDaysSafe(predictedStart, fallbackPeriodDuration - 1);
    const ovulationDate = addDaysSafe(predictedStart, -14);

    return {
      predictedStartDate: predictedStart,
      predictedEndDate: predictedEnd,
      calculatedCycleLength: fallbackCycleLength,
      calculatedPeriodDuration: fallbackPeriodDuration,
      ovulationDate: options.trackOvulation ? ovulationDate : undefined,
      fertileWindow: options.trackOvulation
        ? {
            startDate: addDaysSafe(ovulationDate, -4),
            endDate: addDaysSafe(ovulationDate, 1),
          }
        : undefined,
      confidence: "low",
      confidenceMessage: "Early estimate — log your previous period to personalize calculations.",
      isEarlyEstimate: true,
      isIrregular: false,
      cycleDay: 1,
      daysUntilNextPeriod: fallbackCycleLength,
    };
  }

  // Calculate duration from records with valid start and end dates
  const durations: number[] = [];
  sortedRecords.forEach((r) => {
    if (r.endDate && r.endDate >= r.startDate) {
      const dur = differenceInCalendarDaysSafe(r.endDate, r.startDate) + 1;
      if (dur >= 2 && dur <= 14) {
        durations.push(dur);
      }
    }
  });

  const avgDuration =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : fallbackPeriodDuration;

  // Calculate cycle lengths between consecutive confirmed period starts
  const cycleLengths: number[] = [];
  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const diff = differenceInCalendarDaysSafe(
      sortedRecords[i + 1].startDate,
      sortedRecords[i].startDate
    );
    // Ignore duplicate entries or short gap overlaps (<15 days) and long gaps (>70 days)
    if (diff >= 18 && diff <= 65) {
      cycleLengths.push(diff);
    }
  }

  // Determine cycle length
  let calculatedCycleLength = fallbackCycleLength;
  let isEarlyEstimate = true;
  let isIrregular = false;
  let confidence: "low" | "medium" | "high" = "low";
  let confidenceMessage = "Early estimate — accuracy will improve as you log more cycles.";

  if (cycleLengths.length >= 2) {
    isEarlyEstimate = false;
    const avg = Math.round(
      cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    );
    calculatedCycleLength = avg;

    // Check irregularity (variance > 7 days between min and max)
    const minLength = Math.min(...cycleLengths);
    const maxLength = Math.max(...cycleLengths);
    const variation = maxLength - minLength;

    if (variation >= 7) {
      isIrregular = true;
      confidence = "medium";
      confidenceMessage = "Your cycle lengths vary, so your next period may begin earlier or later.";
    } else if (cycleLengths.length >= 3) {
      confidence = "high";
      confidenceMessage = "High prediction confidence based on consistent recent cycles.";
    } else {
      confidence = "medium";
      confidenceMessage = "Moderate prediction confidence. Keep logging to refine accuracy.";
    }
  } else if (cycleLengths.length === 1) {
    calculatedCycleLength = cycleLengths[0];
    confidence = "medium";
    confidenceMessage = "Early estimate based on your last logged cycle interval.";
  }

  // Latest confirmed record
  const latestRecord = sortedRecords[sortedRecords.length - 1];
  const lastStart = latestRecord.startDate;

  // Next prediction: last confirmed start + calculated cycle length
  let predictedStart = addDaysSafe(lastStart, calculatedCycleLength);

  // If predictedStart is in the past (e.g. user hasn't logged recently), project forward
  while (predictedStart < today) {
    predictedStart = addDaysSafe(predictedStart, calculatedCycleLength);
  }

  const predictedEnd = addDaysSafe(predictedStart, avgDuration - 1);

  // Ovulation & Fertile window calculations (approx. 14 days before predicted start)
  const ovulationDate = addDaysSafe(predictedStart, -14);
  const fertileWindow = options.trackOvulation
    ? {
        startDate: addDaysSafe(ovulationDate, -4),
        endDate: addDaysSafe(ovulationDate, 1),
      }
    : undefined;

  // Cycle day calculations
  const rawCycleDay = differenceInCalendarDaysSafe(today, lastStart) + 1;
  const cycleDay = Math.max(1, rawCycleDay);
  const daysUntilNextPeriod = differenceInCalendarDaysSafe(predictedStart, today);

  return {
    predictedStartDate: predictedStart,
    predictedEndDate: predictedEnd,
    calculatedCycleLength,
    calculatedPeriodDuration: avgDuration,
    ovulationDate: options.trackOvulation ? ovulationDate : undefined,
    fertileWindow,
    confidence,
    confidenceMessage,
    isEarlyEstimate,
    isIrregular,
    cycleDay,
    daysUntilNextPeriod,
  };
}
