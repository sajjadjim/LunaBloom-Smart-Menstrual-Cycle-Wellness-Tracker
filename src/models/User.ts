import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    emailVerified: { type: Boolean, default: false },
    dateOfBirth: { type: String, trim: true },
    gender: { type: String, trim: true, default: "Female" },
    address: { type: String, trim: true },
    country: { type: String, trim: true },
    timezone: { type: String, required: true, default: "UTC" },
    favoriteMusic: [{ type: String }],
    favoriteFoods: [{ type: String }],
    interests: [{ type: String }],
    onboardingCompleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
