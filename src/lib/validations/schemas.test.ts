import { describe, it, expect } from "vitest";
import {
  PeriodRecordInputSchema,
  MoodRecordInputSchema,
  SymptomRecordInputSchema,
  OnboardingStep1Schema,
  NotificationSettingsInputSchema,
} from "./schemas";

describe("LunaBloom Input Validation Schemas", () => {
  it("validates valid period record input", () => {
    const valid = {
      startDate: "2026-10-12",
      endDate: "2026-10-16",
      flowLevels: { "2026-10-12": "heavy" },
      notes: "First day cramps",
    };
    const res = PeriodRecordInputSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects invalid period date format", () => {
    const invalid = {
      startDate: "12-10-2026", // should be YYYY-MM-DD
    };
    const res = PeriodRecordInputSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("validates mood record input with enum constraints", () => {
    const valid = {
      date: "2026-10-26",
      mood: "Calm",
      notes: "Peaceful morning",
    };
    const res = MoodRecordInputSchema.safeParse(valid);
    expect(res.success).toBe(true);

    const invalid = {
      date: "2026-10-26",
      mood: "Ecstatic", // Not in allowed enum
    };
    const invalidRes = MoodRecordInputSchema.safeParse(invalid);
    expect(invalidRes.success).toBe(false);
  });

  it("validates symptoms input and rejects empty symptom lists", () => {
    const valid = {
      date: "2026-10-26",
      symptoms: ["Cramps", "Headache"],
      severity: "Moderate",
    };
    expect(SymptomRecordInputSchema.safeParse(valid).success).toBe(true);

    const empty = {
      date: "2026-10-26",
      symptoms: [],
      severity: "Moderate",
    };
    expect(SymptomRecordInputSchema.safeParse(empty).success).toBe(false);
  });

  it("validates notification settings schema", () => {
    const valid = {
      emailEnabled: true,
      reminderOffsets: [2, 3],
      discreetMode: true,
    };
    expect(NotificationSettingsInputSchema.safeParse(valid).success).toBe(true);
  });
});
