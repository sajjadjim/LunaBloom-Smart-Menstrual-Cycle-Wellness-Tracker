import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { PeriodRecordModel } from "@/models/PeriodRecord";
import { CycleSettingsModel } from "@/models/CycleSettings";
import { calculateCyclePredictions } from "@/lib/period-calculator/engine";
import { IPeriodRecord } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let records: IPeriodRecord[] = [];
    let defaultCycleLength = 28;
    let defaultPeriodDuration = 5;
    let trackOvulation = false;

    const db = await connectToDatabase();
    if (db) {
      records = (await PeriodRecordModel.find({ userId: session.uid })
        .sort({ startDate: 1 })
        .lean()) as unknown as IPeriodRecord[];

      const settings = await CycleSettingsModel.findOne({ userId: session.uid }).lean();
      if (settings) {
        if (settings.averageCycleLength) defaultCycleLength = settings.averageCycleLength;
        if (settings.averagePeriodDuration) defaultPeriodDuration = settings.averagePeriodDuration;
        if (settings.predictionPreferences?.trackOvulation !== undefined) {
          trackOvulation = settings.predictionPreferences.trackOvulation;
        }
      }
    }

    const prediction = calculateCyclePredictions(records, {
      defaultCycleLength,
      defaultPeriodDuration,
      trackOvulation,
    });

    return NextResponse.json({
      prediction,
      totalCyclesRecorded: records.length,
      settings: {
        averageCycleLength: defaultCycleLength,
        averagePeriodDuration: defaultPeriodDuration,
        trackOvulation,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error calculating predictions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
