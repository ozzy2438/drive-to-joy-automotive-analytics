"""Export canonical JSON reference registries as deterministic dbt CSV seeds."""

from __future__ import annotations

from pathlib import Path

from src.data_generation.reference_data import REPOSITORY_ROOT, load_reference_registry

SEED_COLUMNS = {
    "vehicle_catalogue": [
        "schema_version",
        "record_version",
        "vehicle_model_id",
        "vehicle_model",
        "model_slug",
        "variant_id",
        "vehicle_variant",
        "body_type",
        "usage_segment",
        "powertrain",
        "price_band",
        "seats",
        "launch_status",
        "data_origin",
    ],
    "dealers": [
        "schema_version",
        "record_version",
        "dealer_id",
        "dealer_name",
        "state",
        "region_type",
        "capacity_band",
        "active_flag",
        "availability_state",
        "data_origin",
    ],
    "campaign_registry": [
        "schema_version",
        "record_version",
        "campaign_id",
        "campaign_name",
        "channel",
        "source",
        "medium",
        "owner",
        "objective",
        "focus_type",
        "focus_id",
        "landing_page",
        "active_start_date",
        "active_end_date",
        "governance_status",
        "data_origin",
    ],
    "experiment_registry": [
        "schema_version",
        "record_version",
        "experiment_id",
        "experiment_name",
        "collision_namespace",
        "status",
        "runtime_enabled",
        "allocation_unit",
        "allocation_rule",
        "variant_ids",
        "allocation",
        "planned_start_date",
        "planned_end_date",
        "primary_metric",
        "owner",
        "feature_flag",
        "data_origin",
    ],
    "personalisation_audience_registry": [
        "schema_version",
        "record_version",
        "audience_id",
        "audience_name",
        "status",
        "runtime_enabled",
        "eligibility_version",
        "holdout_allocation",
        "cooldown_hours",
        "priority",
        "exclusion_rule_reference",
        "treatment_experience_id",
        "holdout_experience_id",
        "collision_namespace",
        "owner",
        "data_origin",
    ],
}


def write_reference_seeds(output_directory: Path | None = None) -> list[Path]:
    """Write stable seed projections and return their paths."""
    destination = output_directory or REPOSITORY_ROOT / "dbt" / "seeds"
    destination.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for registry_name, columns in SEED_COLUMNS.items():
        frame = load_reference_registry(registry_name)
        path = destination / f"{registry_name}.csv"
        frame.loc[:, columns].to_csv(path, index=False, lineterminator="\n")
        written.append(path)
    return written


if __name__ == "__main__":
    for seed_path in write_reference_seeds():
        print(seed_path.relative_to(REPOSITORY_ROOT))
