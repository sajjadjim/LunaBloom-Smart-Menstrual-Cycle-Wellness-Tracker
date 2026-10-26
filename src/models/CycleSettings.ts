import mongoose, { Schema, Document, Model } from "mongoose";
import { ICycleSettings } from "@/types";

export interface ICycleSettingsDocument extends Omit<ICycleSettings, "_id">, Document {}

const CycleSettingsSchema = new Schema<ICycleSettingsDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    averageCycleLength: { type: Number, required: true, default: 28, min: 15, max: 90 },
    averagePeriodDuration: { type: Number, required: true, default: 5, min: 2, max: 14 },
    predictionPreferences: {
      trackOvulation: { type: Boolean, default: false },
      manualOverrideCycleLength: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

export const CycleSettingsModel: Model<ICycleSettingsDocument> =
  mongoose.models.CycleSettings ||
  mongoose.model<ICycleSettingsDocument>("CycleSettings", CycleSettingsSchema);
