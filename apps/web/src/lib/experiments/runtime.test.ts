import {
  assignExperimentVariant,
  getCtaExperimentAssignment,
  getCtaExperimentDefinition,
} from "./runtime";
import { MemoryStorage } from "@/test/memory-storage";

describe("experiment runtime", () => {
  it("assigns EXP-CTA-001 deterministically to one of three variants", async () => {
    const definition = getCtaExperimentDefinition();
    const assignedAt = new Date("2026-07-24T01:00:00.000Z");
    const first = await assignExperimentVariant(
      "usr_example_0001",
      definition,
      assignedAt,
    );
    const second = await assignExperimentVariant(
      "usr_example_0001",
      definition,
      assignedAt,
    );

    expect(first.variant_id).toBe(second.variant_id);
    expect(["control", "treatment_a", "treatment_b"]).toContain(first.variant_id);
    expect(first.experiment_assignment_id).toBe(
      second.experiment_assignment_id,
    );
  });

  it("persists assignment only with granted consent", async () => {
    const storage = new MemoryStorage();
    const denied = await getCtaExperimentAssignment(
      "usr_example_0001",
      {
        analytics: "denied",
        marketing: "denied",
        cmpVersion: "cmp_demo_1",
      },
      storage,
    );
    expect(denied).toBeNull();
    expect(storage.length).toBe(0);

    const granted = await getCtaExperimentAssignment(
      "usr_example_0001",
      {
        analytics: "granted",
        marketing: "denied",
        cmpVersion: "cmp_demo_1",
      },
      storage,
    );
    expect(granted?.experiment_id).toBe("EXP-CTA-001");
    expect(storage.length).toBe(1);
  });
});
