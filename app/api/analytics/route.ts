import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type EventType = "page_view" | "cta_click";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { type?: string; page?: string };
    const { type, page } = body;

    const validTypes: EventType[] = ["page_view", "cta_click"];
    if (!type || !validTypes.includes(type as EventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }
    if (!page || typeof page !== "string") {
      return NextResponse.json({ error: "Page is required" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("events").insertOne({
      type: type as EventType,
      page: page.trim(),
      userAgent: req.headers.get("user-agent") ?? "unknown",
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
