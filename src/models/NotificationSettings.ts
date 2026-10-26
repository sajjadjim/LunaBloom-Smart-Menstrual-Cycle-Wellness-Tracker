import mongoose, { Schema, Document, Model } from "mongoose";
import { INotificationSettings } from "@/types";

export interface INotificationSettingsDocument extends Omit<INotificationSettings, "_id">, Document {}

const NotificationSettingsSchema = new Schema<INotificationSettingsDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    emailEnabled: { type: Boolean, default: false },
    reminderOffsets: [{ type: Number, default: [2] }], // 2, 3, or [2, 3]
    discreetMode: { type: Boolean, default: false },
    consentTimestamp: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const NotificationSettingsModel: Model<INotificationSettingsDocument> =
  mongoose.models.NotificationSettings ||
  mongoose.model<INotificationSettingsDocument>("NotificationSettings", NotificationSettingsSchema);
