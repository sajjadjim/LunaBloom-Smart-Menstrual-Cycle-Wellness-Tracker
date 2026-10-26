export type MoodType =
  | "Happy"
  | "Calm"
  | "Sad"
  | "Stressed"
  | "Tired"
  | "Irritated"
  | "Loved"
  | "Anxious"
  | "Energetic";

export type FlowLevel = "spotting" | "light" | "medium" | "heavy";

export type SymptomSeverity = "Mild" | "Moderate" | "Severe";

export interface IUser {
  _id?: string;
  firebaseUid: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: string;
  address?: string;
  country?: string;
  timezone: string;
  favoriteMusic?: string[];
  favoriteFoods?: string[];
  interests?: string[];
  onboardingCompleted: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPeriodRecord {
  _id?: string;
  userId: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  flowLevels?: Record<string, FlowLevel>; // date -> flowLevel
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IMoodRecord {
  _id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: MoodType;
  notes?: string;
  createdAt?: string | Date;
}

export interface ISymptomRecord {
  _id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  symptoms: string[];
  severity: SymptomSeverity;
  notes?: string;
  createdAt?: string | Date;
}

export interface ICycleSettings {
  _id?: string;
  userId: string;
  averageCycleLength: number;
  averagePeriodDuration: number;
  predictionPreferences?: {
    trackOvulation?: boolean;
    manualOverrideCycleLength?: number;
  };
  updatedAt?: string | Date;
}

export interface INotificationSettings {
  _id?: string;
  userId: string;
  emailEnabled: boolean;
  reminderOffsets: number[]; // e.g. [2], [3], [2, 3]
  discreetMode: boolean;
  consentTimestamp?: string | Date;
  updatedAt?: string | Date;
}

export interface IReminderLog {
  _id?: string;
  userId: string;
  predictedPeriodDate: string;
  reminderOffset: number;
  reminderKey: string; // unique idempotency key: ${userId}_${predictedPeriodDate}_${offset}
  status: "pending" | "sent" | "failed" | "skipped";
  providerMessageId?: string;
  attemptedAt?: string | Date;
  sentAt?: string | Date;
  errorMessage?: string;
}

export interface IChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface IChecklist {
  _id?: string;
  userId: string;
  cycleReference?: string;
  items: IChecklistItem[];
  updatedAt?: string | Date;
}

export interface IPredictionResult {
  predictedStartDate: string;
  predictedEndDate: string;
  calculatedCycleLength: number;
  calculatedPeriodDuration: number;
  ovulationDate?: string;
  fertileWindow?: {
    startDate: string;
    endDate: string;
  };
  confidence: "low" | "medium" | "high";
  confidenceMessage: string;
  isEarlyEstimate: boolean;
  isIrregular: boolean;
  cycleDay: number;
  daysUntilNextPeriod: number;
}
