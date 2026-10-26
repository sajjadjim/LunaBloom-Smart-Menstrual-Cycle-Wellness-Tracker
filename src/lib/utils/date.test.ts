import { describe, it, expect } from "vitest";
import {
  toDateString,
  parseSafeDate,
  addDaysSafe,
  differenceInCalendarDaysSafe,
  formatDisplayDate,
  calculateAge,
} from "./date";

describe("Calendar Date Safety Utilities", () => {
  it("formats date to YYYY-MM-DD string cleanly", () => {
    const d = new Date(2026, 9, 26); // October 26, 2026
    expect(toDateString(d)).toBe("2026-10-26");
  });

  it("calculates difference in calendar days without UTC shift", () => {
    expect(differenceInCalendarDaysSafe("2026-10-29", "2026-10-26")).toBe(3);
    expect(differenceInCalendarDaysSafe("2026-11-01", "2026-10-31")).toBe(1);
    expect(differenceInCalendarDaysSafe("2026-10-26", "2026-10-26")).toBe(0);
  });

  it("adds days safely across months", () => {
    expect(addDaysSafe("2026-10-28", 5)).toBe("2026-11-02");
    expect(addDaysSafe("2026-12-30", 3)).toBe("2027-01-02");
  });

  it("handles leap year February 29 correctly", () => {
    // 2028 is a leap year
    expect(addDaysSafe("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDaysSafe("2028-02-29", 1)).toBe("2028-03-01");
  });

  it("calculates accurate age from birthdate", () => {
    const age = calculateAge("2000-01-15");
    expect(age).toBeGreaterThanOrEqual(24);
  });
});
