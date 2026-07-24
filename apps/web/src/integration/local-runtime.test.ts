// @vitest-environment node

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST as collectEvent } from "@/app/api/events/route";
import { POST as submitCrm } from "@/app/api/crm/submit/route";
import type { StoredCrmEnvelope } from "@/lib/crm/contracts";
import { readNdjson } from "@/lib/server/local-store";
import { buildCanonicalEvent, type CanonicalEvent } from "@/lib/tracking";

describe.sequential("local collector and CRM integration", () => {
  let localDataDirectory: string;

  beforeAll(async () => {
    localDataDirectory = await mkdtemp(
      path.join(tmpdir(), "drive-to-joy-web-integration-"),
    );
    process.env.DTJ_LOCAL_DATA_DIR = localDataDirectory;
  });

  afterAll(async () => {
    delete process.env.DTJ_LOCAL_DATA_DIR;
    await rm(localDataDirectory, { recursive: true, force: true });
  });

  it("preserves event arrival order", async () => {
    const context = {
      consent: {
        analytics: "granted" as const,
        marketing: "denied" as const,
        cmpVersion: "cmp_demo_1",
      },
      identity: {
        userPseudoId: "usr_integration_example",
        sessionId: "ses_integration_example",
      },
      pageType: "homepage",
      journeyStage: "discover" as const,
    };
    const first = buildCanonicalEvent("view_homepage", {}, context, {
      eventId: () => "evt_integration_first",
    });
    const second = buildCanonicalEvent(
      "view_vehicle_range",
      {},
      { ...context, pageType: "vehicle_range", journeyStage: "research" },
      { eventId: () => "evt_integration_second" },
    );

    for (const event of [first, second]) {
      const response = await collectEvent(
        new Request("http://example.invalid/api/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(event),
        }),
      );
      expect(response.status).toBe(202);
    }

    const stored = await readNdjson<CanonicalEvent & { ingested_at_utc: string }>(
      "events.ndjson",
    );
    expect(stored.map((event) => event.event_id)).toEqual([
      "evt_integration_first",
      "evt_integration_second",
    ]);
  });

  it("reconciles an accepted CRM record with its later conversion event", async () => {
    const formInstanceId = "frm_integration_example";
    const crmResponse = await submitCrm(
      new Request("http://example.invalid/api/crm/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          form_instance_id: formInstanceId,
          form_type: "test_drive",
          vehicle_model: "Aurora SUV",
          vehicle_variant: "Aurora Hybrid Touring",
          dealer_id: "VIC-003",
          dealer_state: "VIC",
          user_pseudo_id: "usr_integration_example",
          session_id: "ses_integration_example",
          experiment_assignment_id: "exa_integration_example",
          variant_id: "treatment_a",
          personalisation_assignment_id: "psa_integration_example",
          audience_id: "AUD-REG-005",
          experience_id: "generic_holdout",
          holdout_flag: true,
          demo_acknowledgement: true,
        }),
      }),
    );
    expect(crmResponse.status).toBe(201);
    const accepted = await crmResponse.json();

    const conversion = buildCanonicalEvent(
      "test_drive_submit",
      {
        form_instance_id: formInstanceId,
        form_type: "test_drive",
        vehicle_model: "Aurora SUV",
        vehicle_variant: "Aurora Hybrid Touring",
        dealer_id: "VIC-003",
        dealer_state: "VIC",
        web_submission_id: accepted.web_submission_id,
        lead_id_hash: accepted.lead_id_hash,
        experiment_id: "EXP-CTA-001",
        experiment_assignment_id: "exa_integration_example",
        variant_id: "treatment_a",
        personalisation_assignment_id: "psa_integration_example",
        audience_id: "AUD-REG-005",
        experience_id: "generic_holdout",
        holdout_flag: true,
      },
      {
        consent: {
          analytics: "granted",
          marketing: "denied",
          cmpVersion: "cmp_demo_1",
        },
        identity: {
          userPseudoId: "usr_integration_example",
          sessionId: "ses_integration_example",
        },
        pageType: "test_drive_form",
        journeyStage: "convert",
      },
      { eventId: () => "evt_integration_conversion" },
    );
    const collectResponse = await collectEvent(
      new Request("http://example.invalid/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(conversion),
      }),
    );
    expect(collectResponse.status).toBe(202);

    const crm = await readNdjson<StoredCrmEnvelope>("crm-records.ndjson");
    const events = await readNdjson<CanonicalEvent & { ingested_at_utc: string }>(
      "events.ndjson",
    );
    const storedConversion = events.find(
      (event) => event.event_id === "evt_integration_conversion",
    );
    const matchedLead = crm.find(
      (envelope) =>
        envelope.submission.web_submission_id ===
        storedConversion?.web_submission_id,
    );
    expect(matchedLead?.submission.lead_id_hash).toBe(
      storedConversion?.lead_id_hash,
    );
    expect(storedConversion).toMatchObject({
      dealer_id: "VIC-003",
      experiment_assignment_id: "exa_integration_example",
      personalisation_assignment_id: "psa_integration_example",
      holdout_flag: true,
    });
  });
});
