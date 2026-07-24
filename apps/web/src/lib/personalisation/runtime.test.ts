import {
  assignPersonalisation,
  getImplementedAudiences,
  markPersonalisationExposure,
  readActivePersonalisationAssignment,
  selectPrimaryAudience,
} from "./runtime";
import { MemoryStorage } from "@/test/memory-storage";

describe("personalisation runtime", () => {
  it("selects one highest-priority eligible experience", () => {
    const selected = selectPrimaryAudience(
      {
        currentPowertrain: "hybrid",
        configuratorStarted: true,
        configuratorCompleted: false,
        visitCount: 3,
        highIntentActionCount: 3,
      },
      new Set(),
      new MemoryStorage(),
    );

    expect(selected?.audience_id).toBe("AUD-CFG-002");
  });

  it("honours an experiment collision namespace", () => {
    const selected = selectPrimaryAudience(
      { currentPowertrain: "hybrid" },
      new Set(["model_primary_action"]),
      new MemoryStorage(),
    );
    expect(selected).toBeNull();
  });

  it("creates stable treatment or generic holdout assignment", async () => {
    const audience = getImplementedAudiences().find(
      (item) => item.audience_id === "AUD-HYB-001",
    );
    expect(audience).toBeDefined();
    const assignedAt = new Date("2026-07-24T01:00:00.000Z");
    const first = await assignPersonalisation(
      "usr_example_0001",
      audience!,
      assignedAt,
    );
    const second = await assignPersonalisation(
      "usr_example_0001",
      audience!,
      assignedAt,
    );

    expect(first).toEqual(second);
    expect(first.experience_id).toBe(
      first.holdout_flag
        ? audience!.holdout_experience_id
        : audience!.treatment_experience_id,
    );
  });

  it("carries the most recently exposed assignment into downstream context", async () => {
    const storage = new MemoryStorage();
    const audience = getImplementedAudiences().find(
      (item) => item.audience_id === "AUD-REG-005",
    )!;
    const assignment = await assignPersonalisation(
      "usr_regional_example",
      audience,
      new Date("2026-07-24T01:00:00.000Z"),
    );

    markPersonalisationExposure(
      assignment,
      storage,
      new Date("2026-07-24T01:05:00.000Z"),
    );

    expect(readActivePersonalisationAssignment(storage)).toEqual(assignment);
  });
});
