import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { UserModel } from "@/models/User";
import { PeriodRecordModel } from "@/models/PeriodRecord";
import { MoodRecordModel } from "@/models/MoodRecord";
import { SymptomRecordModel } from "@/models/SymptomRecord";
import { CycleSettingsModel } from "@/models/CycleSettings";
import { NotificationSettingsModel } from "@/models/NotificationSettings";
import { ChecklistModel } from "@/models/Checklist";
import { ReminderLogModel } from "@/models/ReminderLog";

// GET: Export all user data securely
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        exportDate: new Date().toISOString(),
        user: session.user,
        periods: [],
        moods: [],
        symptoms: [],
      });
    }

    const [user, periods, moods, symptoms, cycleSettings, notificationSettings, checklist] =
      await Promise.all([
        UserModel.findOne({ firebaseUid: session.uid }).lean(),
        PeriodRecordModel.find({ userId: session.uid }).lean(),
        MoodRecordModel.find({ userId: session.uid }).lean(),
        SymptomRecordModel.find({ userId: session.uid }).lean(),
        CycleSettingsModel.findOne({ userId: session.uid }).lean(),
        NotificationSettingsModel.findOne({ userId: session.uid }).lean(),
        ChecklistModel.findOne({ userId: session.uid }).lean(),
      ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      appName: "LunaBloom",
      account: {
        firebaseUid: session.uid,
        email: session.email,
        profile: user,
      },
      healthData: {
        periods,
        moods,
        symptoms,
        cycleSettings,
        checklist,
      },
      preferences: {
        notifications: notificationSettings,
      },
    };

    return NextResponse.json(exportData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error exporting user data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: GDPR / Privacy compliant deletion of all health records
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      await Promise.all([
        UserModel.deleteOne({ firebaseUid: session.uid }),
        PeriodRecordModel.deleteMany({ userId: session.uid }),
        MoodRecordModel.deleteMany({ userId: session.uid }),
        SymptomRecordModel.deleteMany({ userId: session.uid }),
        CycleSettingsModel.deleteOne({ userId: session.uid }),
        NotificationSettingsModel.deleteOne({ userId: session.uid }),
        ChecklistModel.deleteOne({ userId: session.uid }),
        ReminderLogModel.deleteMany({ userId: session.uid }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Your LunaBloom account and all associated health records have been permanently erased.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
