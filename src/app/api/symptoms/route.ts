import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { SymptomRecordModel } from "@/models/SymptomRecord";
import { SymptomRecordInputSchema } from "@/lib/validations/schemas";
import { ISymptomRecord } from "@/types";

const memorySymptoms = new Map<string, ISymptomRecord[]>();

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      const records = await SymptomRecordModel.find({ userId: session.uid })
        .sort({ date: -1 })
        .lean();
      return NextResponse.json({ records });
    }

    const list = memorySymptoms.get(session.uid) || [];
    return NextResponse.json({ records: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching symptoms";
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
    const parsed = SymptomRecordInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload" }, { status: 400 });
    }

    const { date, symptoms, severity, notes } = parsed.data;

    const db = await connectToDatabase();
    if (db) {
      const record = await SymptomRecordModel.findOneAndUpdate(
        { userId: session.uid, date },
        { symptoms, severity, notes: notes || "" },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, record: record.toObject() });
    }

    // In-memory fallback
    const list = memorySymptoms.get(session.uid) || [];
    const index = list.findIndex((s) => s.date === date);
    const newRecord: ISymptomRecord = {
      _id: `mem_symp_${Date.now()}`,
      userId: session.uid,
      date,
      symptoms,
      severity,
      notes,
      createdAt: new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = newRecord;
    } else {
      list.unshift(newRecord);
    }
    memorySymptoms.set(session.uid, list);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error logging symptoms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
