import mongoose, { Schema, Document, Model } from "mongoose";
import { IPeriodRecord } from "@/types";

export interface IPeriodRecordDocument extends Omit<IPeriodRecord, "_id">, Document {}

const PeriodRecordSchema = new Schema<IPeriodRecordDocument>(
  {
    userId: { type: String, required: true, index: true },
    startDate: { type: String, required: true, trim: true, index: true },
    endDate: { type: String, trim: true },
    flowLevels: { type: Map, of: String, default: {} },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

PeriodRecordSchema.index({ userId: 1, startDate: -1 });

export const PeriodRecordModel: Model<IPeriodRecordDocument> =
  mongoose.models.PeriodRecord ||
  mongoose.model<IPeriodRecordDocument>("PeriodRecord", PeriodRecordSchema);
