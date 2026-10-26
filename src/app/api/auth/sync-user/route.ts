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

    const userEmail = (session.email && session.email.trim()) || body.email || `${session.uid}@lunabloom.app`;
    const userName = (name && name.trim()) || body.name || session.user?.name || userEmail.split("@")[0] || "Bloom User";

    if (db) {
      let user = await UserModel.findOne({
        $or: [
          { firebaseUid: session.uid },
          ...(userEmail ? [{ email: userEmail.toLowerCase() }] : []),
        ],
      });

      if (!user) {
        user = await UserModel.create({
          firebaseUid: session.uid,
          name: userName,
          email: userEmail.toLowerCase(),
          emailVerified: true,
          dateOfBirth: dateOfBirth || "",
          gender: gender || "Female",
          address: address || "",
          country: country || "",
          timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          favoriteMusic: Array.isArray(favoriteMusic) ? favoriteMusic : [],
          favoriteFoods: Array.isArray(favoriteFoods) ? favoriteFoods : [],
          interests: Array.isArray(interests) ? interests : [],
          onboardingCompleted: onboardingCompleted !== undefined ? Boolean(onboardingCompleted) : false,
        });
      } else {
        user.firebaseUid = session.uid;
        if (name && name.trim()) user.name = name.trim();
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (gender !== undefined) user.gender = gender;
        if (address !== undefined) user.address = address;
        if (country !== undefined) user.country = country;
        if (timezone) user.timezone = timezone;
        if (favoriteMusic && Array.isArray(favoriteMusic)) user.favoriteMusic = favoriteMusic;
        if (favoriteFoods && Array.isArray(favoriteFoods)) user.favoriteFoods = favoriteFoods;
        if (interests && Array.isArray(interests)) user.interests = interests;
        if (onboardingCompleted !== undefined) user.onboardingCompleted = Boolean(onboardingCompleted);
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
      if (averageCycleLength !== undefined || averagePeriodDuration !== undefined) {
        const cycleLen = Math.max(15, Math.min(90, Number(averageCycleLength) || 28));
        const periodDur = Math.max(2, Math.min(14, Number(averagePeriodDuration) || 5));
        await CycleSettingsModel.findOneAndUpdate(
          { userId: session.uid },
          {
            averageCycleLength: cycleLen,
            averagePeriodDuration: periodDur,
          },
          { upsert: true, new: true }
        );
      }

      // Update or create notification settings
      if (reminderOffsets !== undefined || emailEnabled !== undefined) {
        const offsets = Array.isArray(reminderOffsets) ? reminderOffsets.map(Number) : [2];
        await NotificationSettingsModel.findOneAndUpdate(
          { userId: session.uid },
          {
            emailEnabled: Boolean(emailEnabled),
            reminderOffsets: offsets,
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
        name: userName,
        email: userEmail.toLowerCase(),
        dateOfBirth: dateOfBirth || session.user?.dateOfBirth || "",
        gender: gender || session.user?.gender || "Female",
        address: address || session.user?.address || "",
        country: country || session.user?.country || "",
        timezone: timezone || session.user?.timezone || "UTC",
        favoriteMusic: favoriteMusic || session.user?.favoriteMusic || [],
        favoriteFoods: favoriteFoods || session.user?.favoriteFoods || [],
        interests: interests || session.user?.interests || [],
        onboardingCompleted: onboardingCompleted !== undefined ? Boolean(onboardingCompleted) : Boolean(session.user?.onboardingCompleted),
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
    console.error("API /api/auth/sync-user error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
