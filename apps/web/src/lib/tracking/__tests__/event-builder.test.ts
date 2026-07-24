import {
  buildCanonicalEvent,
  CANONICAL_SCHEMA_VERSION,
} from "@/lib/tracking";

const grantedContext = {
  consent: {
    analytics: "granted" as const,
    marketing: "denied" as const,
    cmpVersion: "cmp_demo_1",
  },
  identity: {
    userPseudoId: "usr_example_0001",
    sessionId: "ses_example_0001",
  },
  pageType: "vehicle_model",
  journeyStage: "research" as const,
};

const deterministic = {
  now: () => new Date("2026-07-24T01:02:03.000Z"),
  eventId: () => "evt_example_0001",
};

describe("canonical event builder", () => {
  it("accepts a valid view_vehicle_model event", () => {
    const event = buildCanonicalEvent(
      "view_vehicle_model",
      {
        vehicle_model: "Aurora SUV",
        vehicle_variant: "Aurora Touring",
        powertrain: "hybrid",
      },
      grantedContext,
      deterministic,
    );

    expect(event.schema_version).toBe(CANONICAL_SCHEMA_VERSION);
    expect(event.event_date).toBe("2026-07-24");
    expect(event.vehicle_model).toBe("Aurora SUV");
  });

  it("rejects a vehicle event without vehicle context", () => {
    expect(() =>
      buildCanonicalEvent(
        "view_vehicle_model",
        {},
        grantedContext,
        deterministic,
      ),
    ).toThrow(/vehicle_model/);
  });

  it("keeps accepted submission identities absent at form start", () => {
    const event = buildCanonicalEvent(
      "test_drive_start",
      {
        form_instance_id: "frm_example_0001",
        form_type: "test_drive",
        vehicle_model: "Aurora SUV",
        dealer_id: "VIC-001",
      },
      { ...grantedContext, pageType: "test_drive_form" },
      deterministic,
    );

    expect(event.form_instance_id).toBe("frm_example_0001");
    expect(event.web_submission_id).toBeNull();
    expect(event.lead_id_hash).toBeNull();
  });

  it.each([
    { email: "test.user@example.invalid" },
    { phone: "0400 000 000" },
    { name: "Example User" },
    { form_field: "test.user@example.invalid" },
  ])("rejects raw PII-shaped fields or values", (fields) => {
    expect(() =>
      buildCanonicalEvent(
        "test_drive_start",
        {
          form_instance_id: "frm_example_0001",
          form_type: "test_drive",
          vehicle_model: "Aurora SUV",
          dealer_id: "VIC-001",
          ...fields,
        },
        grantedContext,
        deterministic,
      ),
    ).toThrow(/PII guard/);
  });
});
