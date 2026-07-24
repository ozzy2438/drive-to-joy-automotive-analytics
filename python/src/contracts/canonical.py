"""Canonical event fields shared by every source adapter."""

from __future__ import annotations

import hashlib
from typing import Any

import pandas as pd

CONTRACT_VERSION = "1.0.0"

CANONICAL_EVENT_COLUMNS = (
    "schema_version",
    "source_system",
    "data_origin",
    "event_id",
    "event_date",
    "event_at",
    "event_name",
    "user_pseudo_id",
    "session_id",
    "page_type",
    "journey_stage",
    "device_category",
    "traffic_source",
    "traffic_medium",
    "campaign_id",
    "campaign_name",
    "vehicle_model",
    "vehicle_variant",
    "powertrain",
    "configurator_id",
    "dealer_id",
    "dealer_state",
    "form_type",
    "form_instance_id",
    "web_submission_id",
    "lead_id_hash",
    "form_field",
    "form_error_type",
    "experiment_id",
    "experiment_assignment_id",
    "variant_id",
    "audience_id",
    "personalisation_assignment_id",
    "experience_id",
    "holdout_flag",
    "consent_analytics",
    "consent_marketing",
    "cmp_version",
)

FORBIDDEN_PII_COLUMNS = {
    "address",
    "customer_address",
    "customer_email",
    "customer_name",
    "customer_phone",
    "email",
    "email_address",
    "first_name",
    "full_name",
    "last_name",
    "name",
    "phone",
    "phone_number",
    "postal_address",
}

ALLOWED_DATA_ORIGINS = {"synthetic", "official_sample", "live_demo"}


def stable_id(prefix: str, *parts: Any, length: int = 24) -> str:
    """Create a deterministic pseudonymous identifier from non-PII parts."""
    material = "|".join("" if part is None else str(part) for part in parts)
    digest = hashlib.sha256(material.encode("utf-8")).hexdigest()[:length]
    return f"{prefix}_{digest}"


def reject_pii_columns(columns: list[str] | pd.Index) -> None:
    """Reject obvious raw-PII fields at the analytics adapter boundary."""
    normalised = {str(column).strip().lower() for column in columns}
    prohibited = sorted(normalised.intersection(FORBIDDEN_PII_COLUMNS))
    if prohibited:
        raise ValueError(
            "Raw PII columns are prohibited in analytics inputs: "
            + ", ".join(prohibited)
        )


def ensure_canonical_columns(frame: pd.DataFrame) -> pd.DataFrame:
    """Add nullable canonical fields and return stable contract column order."""
    result = frame.copy()
    for column in CANONICAL_EVENT_COLUMNS:
        if column not in result.columns:
            result[column] = None
    return result.loc[:, CANONICAL_EVENT_COLUMNS]


def validate_event_frame(frame: pd.DataFrame) -> None:
    """Validate frame-level invariants that JSON Schema cannot express."""
    missing = sorted(set(CANONICAL_EVENT_COLUMNS).difference(frame.columns))
    if missing:
        raise ValueError(f"Missing canonical event columns: {missing}")
    if frame["event_id"].isna().any():
        raise ValueError("event_id must be present for every canonical event")
    if frame["event_id"].duplicated().any():
        duplicates = frame.loc[frame["event_id"].duplicated(), "event_id"].tolist()
        raise ValueError(f"Duplicate canonical event_id values: {duplicates[:5]}")
    if frame["event_name"].isna().any():
        raise ValueError("event_name must be present for every canonical event")
    invalid_origins = set(frame["data_origin"].dropna()).difference(
        ALLOWED_DATA_ORIGINS
    )
    if invalid_origins:
        raise ValueError(f"Invalid data_origin values: {sorted(invalid_origins)}")
