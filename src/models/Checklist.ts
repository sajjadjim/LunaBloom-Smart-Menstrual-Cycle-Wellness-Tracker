import mongoose, { Schema, Document, Model } from "mongoose";
import { IChecklist } from "@/types";

export interface IChecklistDocument extends Omit<IChecklist, "_id">, Document {}

const ChecklistItemSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const ChecklistSchema = new Schema<IChecklistDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    cycleReference: { type: String },
    items: [ChecklistItemSchema],
  },
  {
    timestamps: true,
  }
);

export const ChecklistModel: Model<IChecklistDocument> =
  mongoose.models.Checklist ||
  mongoose.model<IChecklistDocument>("Checklist", ChecklistSchema);
