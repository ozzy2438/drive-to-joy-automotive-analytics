import { NextResponse } from "next/server";
import {
  sanitiseCrmEnvelope,
} from "@/lib/crm/emulator";
import type { StoredCrmEnvelope } from "@/lib/crm/contracts";
import {
  isLocalExportEnabled,
  readNdjson,
} from "@/lib/server/local-store";

export const runtime = "nodejs";

export async function GET() {
  if (!isLocalExportEnabled()) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const records = await readNdjson<StoredCrmEnvelope>("crm-records.ndjson");
  return NextResponse.json({
    data_origin: "synthetic",
    records: records.map(sanitiseCrmEnvelope),
  });
}
