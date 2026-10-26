import { format, parseISO, differenceInDays, addDays, isValid } from "date-fns";

/**
 * Calendar-date-safe utilities that prevent UTC time shifts.
 * Always treats dates as ISO `YYYY-MM-DD` strings.
 */

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseSafeDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  // Month is 0-indexed in JS Date
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function addDaysSafe(dateStr: string, days: number): string {
  const d = parseSafeDate(dateStr);
  const next = addDays(d, days);
  return toDateString(next);
}

export function differenceInCalendarDaysSafe(laterDateStr: string, earlierDateStr: string): number {
  const d1 = parseSafeDate(laterDateStr);
  const d2 = parseSafeDate(earlierDateStr);
  return differenceInDays(d1, d2);
}

export function formatDisplayDate(dateStr: string, pattern: string = "MMM d, yyyy"): string {
  try {
    const d = parseSafeDate(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, pattern);
  } catch {
    return dateStr;
  }
}

export function calculateAge(dobStr: string): number {
  if (!dobStr) return 0;
  try {
    const birthDate = parseSafeDate(dobStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  } catch {
    return 0;
  }
}
