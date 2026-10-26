import mongoose, { Schema, Document, Model } from "mongoose";
import { IReminderLog } from "@/types";

export interface IReminderLogDocument extends Omit<IReminderLog, "_id">, Document {}

const ReminderLogSchema = new Schema<IReminderLogDocument>(
  {
    userId: { type: String, required: true, index: true },
    predictedPeriodDate: { type: String, required: true },
    reminderOffset: { type: Number, required: true },
    reminderKey: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
    },
    providerMessageId: { type: String },
    attemptedAt: { type: Date },
    sentAt: { type: Date },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ReminderLogModel: Model<IReminderLogDocument> =
  mongoose.models.ReminderLog ||
  mongoose.model<IReminderLogDocument>("ReminderLog", ReminderLogSchema);
