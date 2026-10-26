import mongoose, { Schema, Document, Model } from "mongoose";
import { IMoodRecord } from "@/types";

export interface IMoodRecordDocument extends Omit<IMoodRecord, "_id">, Document {}

const MoodRecordSchema = new Schema<IMoodRecordDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, trim: true },
    mood: {
      type: String,
      required: true,
      enum: [
        "Happy",
        "Calm",
        "Sad",
        "Stressed",
        "Tired",
        "Irritated",
        "Loved",
        "Anxious",
        "Energetic",
      ],
    },
    notes: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

MoodRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

export const MoodRecordModel: Model<IMoodRecordDocument> =
  mongoose.models.MoodRecord ||
  mongoose.model<IMoodRecordDocument>("MoodRecord", MoodRecordSchema);
