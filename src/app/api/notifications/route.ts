import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { NotificationSettingsModel } from "@/models/NotificationSettings";
import { ReminderLogModel } from "@/models/ReminderLog";
import { PeriodRecordModel } from "@/models/PeriodRecord";
import { NotificationSettingsInputSchema } from "@/lib/validations/schemas";
import { INotificationSettings } from "@/types";

const memoryNotificationSettings = new Map<string, INotificationSettings>();

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      let settings = await NotificationSettingsModel.findOne({ userId: session.uid }).lean();
      if (!settings) {
        settings = {
          userId: session.uid,
          emailEnabled: false,
          reminderOffsets: [2],
          discreetMode: false,
        } as any;
      }

      const recentLogs = await ReminderLogModel.find({ userId: session.uid })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      return NextResponse.json({ settings, logs: recentLogs });
    }

    const settings = memoryNotificationSettings.get(session.uid) || {
      userId: session.uid,
      emailEnabled: false,
      reminderOffsets: [2],
      discreetMode: false,
    };

    return NextResponse.json({ settings, logs: [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching notification settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // If test reminder requested, acknowledge instantly
    if (body.action === "send_test") {
      return NextResponse.json({
        success: true,
        message: "In-app wellness reminder active! No external email required.",
      });
    }

    const parsed = NotificationSettingsInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload" }, { status: 400 });
    }

    const { emailEnabled, reminderOffsets, discreetMode } = parsed.data;

    const db = await connectToDatabase();
    if (db) {
      const updated = await NotificationSettingsModel.findOneAndUpdate(
        { userId: session.uid },
        {
          emailEnabled,
          reminderOffsets,
          discreetMode,
          consentTimestamp: emailEnabled ? new Date() : undefined,
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, settings: updated.toObject() });
    }

    // In-memory fallback
    const newSettings: INotificationSettings = {
      userId: session.uid,
      emailEnabled,
      reminderOffsets,
      discreetMode,
      consentTimestamp: emailEnabled ? new Date() : undefined,
    };
    memoryNotificationSettings.set(session.uid, newSettings);

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error saving notification settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
