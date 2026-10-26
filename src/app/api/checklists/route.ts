import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/mongodb/client";
import { ChecklistModel } from "@/models/Checklist";
import { IChecklist, IChecklistItem } from "@/types";

const DEFAULT_CHECKLIST_ITEMS: IChecklistItem[] = [
  { id: "item-1", text: "Sanitary pads or preferred products", checked: false },
  { id: "item-2", text: "Spare underwear in travel pouch", checked: false },
  { id: "item-3", text: "Comfortable, loose-fitting clothing", checked: false },
  { id: "item-4", text: "Heating pad or warm compress ready", checked: false },
  { id: "item-5", text: "Water bottle for daily hydration", checked: false },
  { id: "item-6", text: "Personal hygiene wipes and essentials", checked: false },
  { id: "item-7", text: "Favorite comforting snacks or herbal tea", checked: false },
  { id: "item-8", text: "Personal comfort item (book, playlist, journal)", checked: false },
];

const memoryChecklists = new Map<string, IChecklistItem[]>();

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (db) {
      let checklist = await ChecklistModel.findOne({ userId: session.uid }).lean();
      if (!checklist) {
        checklist = await ChecklistModel.create({
          userId: session.uid,
          items: DEFAULT_CHECKLIST_ITEMS,
        });
      }
      return NextResponse.json({ items: checklist.items });
    }

    let items = memoryChecklists.get(session.uid);
    if (!items) {
      items = [...DEFAULT_CHECKLIST_ITEMS];
      memoryChecklists.set(session.uid, items);
    }
    return NextResponse.json({ items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching checklist";
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
    const items = body.items as IChecklistItem[];
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items array is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (db) {
      const updated = await ChecklistModel.findOneAndUpdate(
        { userId: session.uid },
        { items },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, items: updated.items });
    }

    memoryChecklists.set(session.uid, items);
    return NextResponse.json({ success: true, items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error saving checklist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
