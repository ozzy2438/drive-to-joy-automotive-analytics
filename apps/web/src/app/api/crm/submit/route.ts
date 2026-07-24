import { NextResponse } from "next/server";
import { createCrmEnvelope } from "@/lib/crm/emulator";
import { appendNdjson } from "@/lib/server/local-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const candidate: unknown = await request.json();
    const envelope = createCrmEnvelope(candidate);
    await appendNdjson("crm-records.ndjson", envelope);
    return NextResponse.json(
      {
        accepted: true,
        web_submission_id: envelope.submission.web_submission_id,
        lead_id_hash: envelope.submission.lead_id_hash,
        crm_lead_id: envelope.lead.crm_lead_id,
        accepted_at: envelope.submission.submitted_at,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { accepted: false, error: "invalid_demo_submission" },
      { status: 400 },
    );
  }
}
