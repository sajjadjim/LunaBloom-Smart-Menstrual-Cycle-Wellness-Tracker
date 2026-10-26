import mongoose, { Schema, Document, Model } from "mongoose";
import { ISymptomRecord } from "@/types";

export interface ISymptomRecordDocument extends Omit<ISymptomRecord, "_id">, Document {}

const SymptomRecordSchema = new Schema<ISymptomRecordDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, trim: true },
    symptoms: [{ type: String, required: true }],
    severity: {
      type: String,
      required: true,
      enum: ["Mild", "Moderate", "Severe"],
      default: "Mild",
    },
    notes: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

SymptomRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

export const SymptomRecordModel: Model<ISymptomRecordDocument> =
  mongoose.models.SymptomRecord ||
  mongoose.model<ISymptomRecordDocument>("SymptomRecord", SymptomRecordSchema);
