import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { MoodRecordModel } from "@/models/MoodRecord";
import { MoodRecordInputSchema } from "@/lib/validations/schemas";
import { IMoodRecord } from "@/types";

const memoryMoods = new Map<string, IMoodRecord[]>();

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      const records = await MoodRecordModel.find({ userId: session.uid })
        .sort({ date: -1 })
        .lean();
      return NextResponse.json({ records });
    }

    const list = memoryMoods.get(session.uid) || [];
    return NextResponse.json({ records: list });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching moods";
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
    const parsed = MoodRecordInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid payload" }, { status: 400 });
    }

    const { date, mood, notes } = parsed.data;

    const db = await connectToDatabase();
    if (db) {
      const record = await MoodRecordModel.findOneAndUpdate(
        { userId: session.uid, date },
        { mood, notes: notes || "" },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, record: record.toObject() });
    }

    // In-memory fallback
    const list = memoryMoods.get(session.uid) || [];
    const index = list.findIndex((m) => m.date === date);
    const newRecord: IMoodRecord = {
      _id: `mem_mood_${Date.now()}`,
      userId: session.uid,
      date,
      mood,
      notes,
      createdAt: new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = newRecord;
    } else {
      list.unshift(newRecord);
    }
    memoryMoods.set(session.uid, list);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error logging mood";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
