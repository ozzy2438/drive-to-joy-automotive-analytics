import { NextResponse } from "next/server";
import { appendNdjson } from "@/lib/server/local-store";
import {
  assertCanonicalEvent,
  assertNoRawPii,
  type CanonicalEvent,
} from "@/lib/tracking";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const candidate: unknown = await request.json();
    assertNoRawPii(candidate);
    assertCanonicalEvent(candidate);
    const stored = {
      ...(candidate as CanonicalEvent),
      ingested_at_utc: new Date().toISOString(),
    };
    await appendNdjson("events.ndjson", stored);
    return NextResponse.json(
      { accepted: true, event_id: stored.event_id },
      { status: 202 },
    );
  } catch {
    return NextResponse.json(
      { accepted: false, error: "invalid_event_payload" },
      { status: 400 },
    );
  }
}
