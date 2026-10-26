import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, saveMemoryUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { UserModel } from "@/models/User";
import { CycleSettingsModel } from "@/models/CycleSettings";
import { NotificationSettingsModel } from "@/models/NotificationSettings";
import { PeriodRecordModel } from "@/models/PeriodRecord";
import { IUser } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      name,
      dateOfBirth,
      gender,
      address,
      country,
      timezone,
      favoriteMusic,
      favoriteFoods,
      interests,
      onboardingCompleted,
      initialPeriodStart,
      initialPeriodEnd,
      averageCycleLength,
      averagePeriodDuration,
      reminderOffsets,
      emailEnabled,
    } = body;

    const db = await connectToDatabase();

    if (db) {
      let user = await UserModel.findOne({ firebaseUid: session.uid });

      if (!user) {
        user = await UserModel.create({
          firebaseUid: session.uid,
          name: name || session.email.split("@")[0] || "Bloom User",
          email: session.email,
          emailVerified: true,
          dateOfBirth: dateOfBirth || "",
          gender: gender || "Female",
          address: address || "",
          country: country || "",
          timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          favoriteMusic: favoriteMusic || [],
          favoriteFoods: favoriteFoods || [],
          interests: interests || [],
          onboardingCompleted: Boolean(onboardingCompleted),
        });
      } else {
        if (name) user.name = name;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender !== undefined) user.gender = gender;
        if (address !== undefined) user.address = address;
        if (country !== undefined) user.country = country;
        if (timezone) user.timezone = timezone;
        if (favoriteMusic) user.favoriteMusic = favoriteMusic;
        if (favoriteFoods) user.favoriteFoods = favoriteFoods;
        if (interests) user.interests = interests;
        if (onboardingCompleted !== undefined) user.onboardingCompleted = onboardingCompleted;
        await user.save();
      }

      // If initial period provided during onboarding
      if (initialPeriodStart) {
        const existing = await PeriodRecordModel.findOne({
          userId: session.uid,
          startDate: initialPeriodStart,
        });
        if (!existing) {
          await PeriodRecordModel.create({
            userId: session.uid,
            startDate: initialPeriodStart,
            endDate: initialPeriodEnd || undefined,
            flowLevels: { [initialPeriodStart]: "medium" },
          });
        }
      }

      // Update or create cycle settings
      if (averageCycleLength || averagePeriodDuration) {
        await CycleSettingsModel.findOneAndUpdate(
          { userId: session.uid },
          {
            averageCycleLength: averageCycleLength || 28,
            averagePeriodDuration: averagePeriodDuration || 5,
          },
          { upsert: true, new: true }
        );
      }

      // Update or create notification settings
      if (reminderOffsets || emailEnabled !== undefined) {
        await NotificationSettingsModel.findOneAndUpdate(
          { userId: session.uid },
          {
            emailEnabled: Boolean(emailEnabled),
            reminderOffsets: reminderOffsets || [2],
            consentTimestamp: emailEnabled ? new Date() : undefined,
          },
          { upsert: true, new: true }
        );
      }

      return NextResponse.json({
        success: true,
        user: user.toObject(),
        onboardingCompleted: user.onboardingCompleted,
      });
    } else {
      // In-memory fallback
      const fallbackUser: IUser = {
        firebaseUid: session.uid,
        name: name || session.user?.name || session.email.split("@")[0] || "Bloom User",
        email: session.email,
        dateOfBirth: dateOfBirth || session.user?.dateOfBirth || "",
        gender: gender || session.user?.gender || "Female",
        timezone: timezone || session.user?.timezone || "UTC",
        favoriteMusic: favoriteMusic || session.user?.favoriteMusic || [],
        favoriteFoods: favoriteFoods || session.user?.favoriteFoods || [],
        interests: interests || session.user?.interests || [],
        onboardingCompleted: onboardingCompleted !== undefined ? onboardingCompleted : Boolean(session.user?.onboardingCompleted),
      };
      saveMemoryUser(fallbackUser);

      return NextResponse.json({
        success: true,
        user: fallbackUser,
        onboardingCompleted: fallbackUser.onboardingCompleted,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error syncing user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
