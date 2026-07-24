import { NextResponse } from "next/server";
import {
  isLocalExportEnabled,
  readNdjson,
} from "@/lib/server/local-store";
import type { CanonicalEvent } from "@/lib/tracking";

export const runtime = "nodejs";

type CollectedEvent = CanonicalEvent & { ingested_at_utc: string };

export async function GET() {
  if (!isLocalExportEnabled()) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const events = await readNdjson<CollectedEvent>("events.ndjson");
  return new Response(
    events.map((event) => JSON.stringify(event)).join("\n") +
      (events.length ? "\n" : ""),
    {
      headers: {
        "content-type": "application/x-ndjson; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
}
