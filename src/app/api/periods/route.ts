import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { PeriodRecordModel } from "@/models/PeriodRecord";
import { PeriodRecordInputSchema } from "@/lib/validations/schemas";
import { IPeriodRecord } from "@/types";

// In-memory fallback periods store
const memoryPeriods = new Map<string, IPeriodRecord[]>();

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      const records = await PeriodRecordModel.find({ userId: session.uid })
        .sort({ startDate: 1 })
        .lean();
      return NextResponse.json({ records });
    }

    const list = memoryPeriods.get(session.uid) || [];
    return NextResponse.json({ records: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching periods";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = PeriodRecordInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload" }, { status: 400 });
    }

    const { startDate, endDate, flowLevels, notes } = parsed.data;

    const db = await connectToDatabase();
    if (db) {
      // Find existing record on or covering this date, or update
      let record = await PeriodRecordModel.findOne({
        userId: session.uid,
        startDate,
      });

      if (record) {
        if (endDate !== undefined) record.endDate = endDate || undefined;
        if (flowLevels) record.flowLevels = flowLevels as any;
        if (notes !== undefined) record.notes = notes;
        await record.save();
      } else {
        record = await PeriodRecordModel.create({
          userId: session.uid,
          startDate,
          endDate: endDate || undefined,
          flowLevels: flowLevels || { [startDate]: "medium" },
          notes: notes || "",
        });
      }

      return NextResponse.json({ success: true, record: record.toObject() });
    }

    // In-memory fallback
    const list = memoryPeriods.get(session.uid) || [];
    const index = list.findIndex((r) => r.startDate === startDate);
    const newRecord: IPeriodRecord = {
      _id: `mem_${Date.now()}`,
      userId: session.uid,
      startDate,
      endDate: endDate || undefined,
      flowLevels: flowLevels as any,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = { ...list[index], ...newRecord };
    } else {
      list.push(newRecord);
    }
    list.sort((a, b) => a.startDate.localeCompare(b.startDate));
    memoryPeriods.set(session.uid, list);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error saving period";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const startDate = searchParams.get("startDate");

    if (!id && !startDate) {
      return NextResponse.json({ error: "Record ID or startDate is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db) {
      const query: any = { userId: session.uid };
      if (id) query._id = id;
      if (startDate) query.startDate = startDate;

      const result = await PeriodRecordModel.deleteOne(query);
      return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    }

    // In-memory fallback
    let list = memoryPeriods.get(session.uid) || [];
    list = list.filter((r) => {
      if (id && r._id === id) return false;
      if (startDate && r.startDate === startDate) return false;
      return true;
    });
    memoryPeriods.set(session.uid, list);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting period";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
