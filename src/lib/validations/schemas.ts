import { z } from "zod";

export const OnboardingStep1Schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide a valid date (YYYY-MM-DD)"),
  gender: z.string().optional().default("Female"),
  address: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  timezone: z.string().min(1, "Timezone is required"),
});

export const OnboardingStep2Schema = z.object({
  lastPeriodStart: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide a valid date (YYYY-MM-DD)"),
  lastPeriodEnd: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional()
    .or(z.literal("")),
  averageCycleLength: z
    .number()
    .int()
    .min(18, "Cycle length is typically at least 18 days")
    .max(60, "Cycle length is typically at most 60 days")
    .default(28),
  averagePeriodDuration: z
    .number()
    .int()
    .min(2, "Duration is typically at least 2 days")
    .max(14, "Duration is typically at most 14 days")
    .default(5),
});

export const OnboardingStep3Schema = z.object({
  favoriteMusic: z.array(z.string()).default([]),
  favoriteFoods: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
});

export const OnboardingStep4Schema = z.object({
  reminderOffsets: z.array(z.number()).default([2]),
  emailEnabled: z.boolean().default(false),
});

export const PeriodRecordInputSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Valid start date is required (YYYY-MM-DD)"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Valid date format required")
    .optional()
    .or(z.literal("")),
  flowLevels: z.record(z.string(), z.enum(["spotting", "light", "medium", "heavy"])).optional(),
  notes: z.string().max(500).optional(),
});

export const MoodRecordInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: z.enum([
    "Happy",
    "Calm",
    "Sad",
    "Stressed",
    "Tired",
    "Irritated",
    "Loved",
    "Anxious",
    "Energetic",
  ]),
  notes: z.string().max(500).optional(),
});

export const SymptomRecordInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  symptoms: z.array(z.string()).min(1, "Select at least one symptom"),
  severity: z.enum(["Mild", "Moderate", "Severe"]),
  notes: z.string().max(500).optional(),
});

export const NotificationSettingsInputSchema = z.object({
  emailEnabled: z.boolean(),
  reminderOffsets: z.array(z.number()),
  discreetMode: z.boolean(),
});
