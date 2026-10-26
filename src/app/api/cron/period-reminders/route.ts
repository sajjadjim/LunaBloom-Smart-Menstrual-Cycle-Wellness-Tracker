import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/client";
import { NotificationSettingsModel } from "@/models/NotificationSettings";
import { UserModel } from "@/models/User";
import { PeriodRecordModel } from "@/models/PeriodRecord";
import { CycleSettingsModel } from "@/models/CycleSettings";
import { ReminderLogModel } from "@/models/ReminderLog";
import { calculateCyclePredictions } from "@/lib/period-calculator/engine";
import { toDateString, differenceInCalendarDaysSafe } from "@/lib/utils/date";

export async function GET(req: NextRequest) {
  return handleCronReminders(req);
}

export async function POST(req: NextRequest) {
  return handleCronReminders(req);
}

async function handleCronReminders(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET || "lunabloom_secure_cron_secret_key_2026";
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const url = new URL(req.url);
  const secretParam = url.searchParams.get("secret");

  if (bearerToken !== cronSecret && secretParam !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  const db = await connectToDatabase();
  if (!db) {
    return NextResponse.json(
      { status: "skipped", message: "Database not connected. Reminders bypassed in dev." },
      { status: 200 }
    );
  }

  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    // Find all users who opted-in for email reminders
    const activeSettings = await NotificationSettingsModel.find({ emailEnabled: true }).lean();
    results.processed = activeSettings.length;

    for (const setting of activeSettings) {
      try {
        const user = await UserModel.findOne({ firebaseUid: setting.userId }).lean();
        if (!user || !user.email) {
          results.skipped++;
          continue;
        }

        // Determine user local date based on timezone
        let userToday = toDateString(new Date());
        if (user.timezone) {
          try {
            const formatter = new Intl.DateTimeFormat("en-CA", {
              timeZone: user.timezone,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            userToday = formatter.format(new Date());
          } catch {
            userToday = toDateString(new Date());
          }
        }

        const periodRecords = await PeriodRecordModel.find({ userId: user.firebaseUid })
          .sort({ startDate: 1 })
          .lean();

        const cycleSettings = await CycleSettingsModel.findOne({ userId: user.firebaseUid }).lean();

        const prediction = calculateCyclePredictions(periodRecords as any, {
          today: userToday,
          defaultCycleLength: cycleSettings?.averageCycleLength || 28,
          defaultPeriodDuration: cycleSettings?.averagePeriodDuration || 5,
        });

        const daysUntil = differenceInCalendarDaysSafe(prediction.predictedStartDate, userToday);
        const offsets = setting.reminderOffsets || [2];

        for (const offset of offsets) {
          if (daysUntil === offset) {
            const reminderKey = `${user.firebaseUid}_${prediction.predictedStartDate}_${offset}`;

            // Check idempotency log
            const existingLog = await ReminderLogModel.findOne({ reminderKey });
            if (existingLog && existingLog.status === "sent") {
              results.skipped++;
              continue;
            }

            // Create pending attempt record
            const logDoc = await ReminderLogModel.findOneAndUpdate(
              { reminderKey },
              {
                userId: user.firebaseUid,
                predictedPeriodDate: prediction.predictedStartDate,
                reminderOffset: offset,
                attemptedAt: new Date(),
                status: "pending",
              },
              { upsert: true, new: true }
            );

            // Record in-app notification readiness
            logDoc.status = "sent";
            logDoc.sentAt = new Date();
            logDoc.providerMessageId = "in_app_reminder";
            await logDoc.save();
            results.sent++;
          }
        }
      } catch (userErr) {
        console.error(`Error processing reminder for user ${setting.userId}:`, userErr);
        results.failed++;
      }
    }

    return NextResponse.json({ status: "success", summary: results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error running cron job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
