"""Load versioned synthetic reference registries."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
REFERENCE_DIRECTORY = REPOSITORY_ROOT / "data" / "reference" / "v1"

REFERENCE_FILES = {
    "vehicle_catalogue": "vehicle_catalogue.json",
    "dealers": "dealers.json",
    "campaign_registry": "campaign_registry.json",
    "experiment_registry": "experiment_registry.json",
    "personalisation_audience_registry": "personalisation_audience_registry.json",
}


def load_reference_registry(registry_name: str) -> pd.DataFrame:
    """Return one validated, deterministic reference registry."""
    try:
        filename = REFERENCE_FILES[registry_name]
    except KeyError as error:
        raise ValueError(f"Unknown reference registry: {registry_name}") from error
    records = json.loads(
        (REFERENCE_DIRECTORY / filename).read_text(encoding="utf-8")
    )
    frame = pd.DataFrame(records)
    if frame.empty:
        raise ValueError(f"{registry_name} must not be empty")
    if frame["data_origin"].isna().any() or set(frame["data_origin"]) != {
        "synthetic"
    }:
        raise ValueError(f"{registry_name} must be entirely synthetic")
    if set(frame["schema_version"]) != {"1.0.0"}:
        raise ValueError(f"{registry_name} contains an unsupported schema version")
    if (frame["record_version"] < 1).any():
        raise ValueError(f"{registry_name} contains an invalid record version")
    return frame


def generate_campaign_registry() -> pd.DataFrame:
    return load_reference_registry("campaign_registry")


def generate_experiment_registry() -> pd.DataFrame:
    return load_reference_registry("experiment_registry")


def generate_personalisation_audience_registry() -> pd.DataFrame:
    return load_reference_registry("personalisation_audience_registry")
