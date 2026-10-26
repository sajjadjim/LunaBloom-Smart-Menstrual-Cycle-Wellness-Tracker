import { describe, it, expect } from "vitest";
import { calculateCyclePredictions } from "./engine";
import { IPeriodRecord } from "@/types";

describe("Period Prediction Engine", () => {
  it("provides fallback estimate when no history is provided", () => {
    const result = calculateCyclePredictions([], {
      today: "2026-10-26",
      defaultCycleLength: 28,
      defaultPeriodDuration: 5,
    });

    expect(result.calculatedCycleLength).toBe(28);
    expect(result.calculatedPeriodDuration).toBe(5);
    expect(result.predictedStartDate).toBe("2026-11-23");
    expect(result.isEarlyEstimate).toBe(true);
    expect(result.confidence).toBe("low");
  });

  it("calculates accurate prediction from a single confirmed period", () => {
    const records: IPeriodRecord[] = [
      {
        userId: "user-1",
        startDate: "2026-10-01",
        endDate: "2026-10-05",
      },
    ];

    const result = calculateCyclePredictions(records, {
      today: "2026-10-26",
      defaultCycleLength: 28,
    });

    // 2026-10-01 + 28 days = 2026-10-29
    expect(result.predictedStartDate).toBe("2026-10-29");
    expect(result.predictedEndDate).toBe("2026-11-02"); // 5 days duration (Oct 29 to Nov 2)
    expect(result.daysUntilNextPeriod).toBe(3); // Oct 26 to Oct 29 is 3 days
    expect(result.cycleDay).toBe(26); // Day 26 of cycle
  });

  it("calculates average cycle length across multiple consecutive cycles", () => {
    // Cycle 1: Oct 1 -> Oct 29 (28 days)
    // Cycle 2: Oct 29 -> Nov 28 (30 days)
    // Average: 29 days
    const records: IPeriodRecord[] = [
      { userId: "u1", startDate: "2026-10-01", endDate: "2026-10-05" },
      { userId: "u1", startDate: "2026-10-29", endDate: "2026-11-02" },
      { userId: "u1", startDate: "2026-11-28", endDate: "2026-12-02" },
    ];

    const result = calculateCyclePredictions(records, {
      today: "2026-12-05",
    });

    expect(result.calculatedCycleLength).toBe(29);
    // Nov 28 + 29 days = Dec 27
    expect(result.predictedStartDate).toBe("2026-12-27");
    expect(result.isEarlyEstimate).toBe(false);
  });

  it("correctly handles leap year leap day (February 29)", () => {
    // In leap year 2028: Feb 1 to Feb 29 is 28 days
    const records: IPeriodRecord[] = [
      { userId: "u1", startDate: "2028-02-01", endDate: "2028-02-05" },
    ];

    const result = calculateCyclePredictions(records, {
      today: "2028-02-15",
      defaultCycleLength: 28,
      defaultPeriodDuration: 5,
    });

    // Feb 1 + 28 days in 2028 (leap year) = Feb 29
    expect(result.predictedStartDate).toBe("2028-02-29");
  });

  it("flags irregular cycles when variance is high", () => {
    // Cycle 1: 24 days, Cycle 2: 35 days (variance = 11 days >= 7)
    const records: IPeriodRecord[] = [
      { userId: "u1", startDate: "2026-06-01" },
      { userId: "u1", startDate: "2026-06-25" }, // 24 days
      { userId: "u1", startDate: "2026-07-30" }, // 35 days
    ];

    const result = calculateCyclePredictions(records, {
      today: "2026-08-01",
    });

    expect(result.isIrregular).toBe(true);
    expect(result.confidenceMessage).toContain("vary");
  });

  it("calculates ovulation and fertile window when enabled", () => {
    const records: IPeriodRecord[] = [
      { userId: "u1", startDate: "2026-10-01" },
    ];

    const result = calculateCyclePredictions(records, {
      today: "2026-10-05",
      defaultCycleLength: 28,
      trackOvulation: true,
    });

    // Predicted start: 2026-10-29
    // Ovulation: 2026-10-29 - 14 days = 2026-10-15
    expect(result.ovulationDate).toBe("2026-10-15");
    expect(result.fertileWindow?.startDate).toBe("2026-10-11");
    expect(result.fertileWindow?.endDate).toBe("2026-10-16");
  });
});
