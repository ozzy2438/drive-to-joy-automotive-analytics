import vehicles from "../../../../data/reference/v1/vehicle_catalogue.json";
import dealers from "../../../../data/reference/v1/dealers.json";
import campaigns from "../../../../data/reference/v1/campaign_registry.json";
import experiments from "../../../../data/reference/v1/experiment_registry.json";
import audiences from "../../../../data/reference/v1/personalisation_audience_registry.json";

describe("versioned reference data", () => {
  it("meets Sprint 2 minimum volumes and runtime constraints", () => {
    expect(vehicles.length).toBeGreaterThanOrEqual(12);
    expect(new Set(vehicles.map((row) => row.vehicle_model_id)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(vehicles.map((row) => row.body_type)).size).toBeGreaterThanOrEqual(3);
    expect(dealers.length).toBeGreaterThanOrEqual(20);
    expect(campaigns.length).toBeGreaterThanOrEqual(10);
    expect(experiments.filter((row) => row.runtime_enabled).map((row) => row.experiment_id)).toEqual([
      "EXP-CTA-001",
    ]);
    expect(
      audiences.find((row) => row.audience_id === "AUD-OWN-006"),
    ).toMatchObject({ status: "placeholder", runtime_enabled: false });
  });

  it("contains synthetic labels and no proprietary brand reference", () => {
    const serialised = JSON.stringify({
      vehicles,
      dealers,
      campaigns,
      experiments,
      audiences,
    });
    expect(serialised).not.toMatch(/\bhonda\b/i);
    expect(
      [...vehicles, ...dealers, ...campaigns, ...experiments, ...audiences].every(
        (row) => row.data_origin === "synthetic",
      ),
    ).toBe(true);
  });
});
