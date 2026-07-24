// @vitest-environment node

import { createCrmEnvelope, sanitiseCrmEnvelope } from "./emulator";
import { transitionCrmLead } from "./lifecycle";

const safeRequest = {
  form_instance_id: "frm_example_0001",
  form_type: "test_drive" as const,
  vehicle_model: "Aurora SUV",
  vehicle_variant: "Aurora Hybrid Touring",
  dealer_id: "VIC-001",
  dealer_state: "VIC",
  user_pseudo_id: "usr_example_0001",
  session_id: "ses_example_0001",
  experiment_assignment_id: "exa_example_0001",
  variant_id: "control",
  personalisation_assignment_id: null,
  audience_id: null,
  experience_id: null,
  holdout_flag: null,
  demo_acknowledgement: true as const,
};

describe("CRM emulator", () => {
  it("creates separate form, submission and opaque lead identities", () => {
    const ids = ["web-uuid", "internal-uuid", "crm-uuid"];
    const envelope = createCrmEnvelope(safeRequest, {
      now: () => new Date("2026-07-24T03:00:00.000Z"),
      opaqueId: () => ids.shift()!,
    });

    expect(envelope.submission.form_instance_id).toBe("frm_example_0001");
    expect(envelope.submission.web_submission_id).toBe("sub_web-uuid");
    expect(envelope.submission.lead_id_hash).toMatch(/^lead_[a-f0-9]{64}$/);
    expect(envelope.submission.lead_id_hash).not.toContain("example");
    expect(envelope.lead.web_submission_id).toBe(
      envelope.submission.web_submission_id,
    );
    expect(sanitiseCrmEnvelope(envelope)).not.toHaveProperty(
      "internal_lead_reference",
    );
  });

  it("rejects forbidden PII before persistence", () => {
    expect(() =>
      createCrmEnvelope({
        ...safeRequest,
        email: "test.user@example.invalid",
      }),
    ).toThrow(/PII guard/);
    expect(() =>
      createCrmEnvelope({
        ...safeRequest,
        firstName: "Example",
      }),
    ).toThrow(/PII guard/);
  });

  it.each([
    { vehicle_model: "Unknown Synthetic Model" },
    { vehicle_variant: "Unknown Synthetic Variant" },
    { dealer_id: "NSW-004", dealer_state: "NSW" },
    { dealer_id: "VIC-001", dealer_state: "NSW" },
  ])("rejects invalid reference context", (invalidContext) => {
    expect(() =>
      createCrmEnvelope({
        ...safeRequest,
        ...invalidContext,
      }),
    ).toThrow(/vehicle|variant|dealer/i);
  });

  it("supports only valid lifecycle transitions", () => {
    const ids = ["web-uuid", "internal-uuid", "crm-uuid"];
    const envelope = createCrmEnvelope(safeRequest, {
      opaqueId: () => ids.shift()!,
    });
    const contacted = transitionCrmLead(envelope.lead, "contacted");
    const qualified = transitionCrmLead(contacted, "qualified");
    const booked = transitionCrmLead(qualified, "appointment_booked");
    const attended = transitionCrmLead(booked, "attended");
    const ordered = transitionCrmLead(attended, "ordered", new Date(), "50000_60000");

    expect(ordered.appointment_attended_flag).toBe(true);
    expect(ordered.vehicle_ordered_flag).toBe(true);
    expect(ordered.order_value_band).toBe("50000_60000");
    expect(() => transitionCrmLead(ordered, "contacted")).toThrow(
      /Invalid CRM lifecycle transition/,
    );
  });
});
