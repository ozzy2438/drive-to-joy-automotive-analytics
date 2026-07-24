"""Adapter for deterministic flat synthetic event rows."""

from __future__ import annotations

import pandas as pd

from src.contracts.canonical import (
    CONTRACT_VERSION,
    ensure_canonical_columns,
    reject_pii_columns,
    validate_event_frame,
)

REQUIRED_SOURCE_COLUMNS = {
    "event_id",
    "event_date",
    "event_timestamp",
    "event_name",
    "user_pseudo_id",
    "session_id",
    "consent_analytics",
    "consent_marketing",
}


def adapt_flat_synthetic_events(source: pd.DataFrame) -> pd.DataFrame:
    """Normalise a flat synthetic source frame to canonical event columns."""
    reject_pii_columns(source.columns)
    missing = sorted(REQUIRED_SOURCE_COLUMNS.difference(source.columns))
    if missing:
        raise ValueError(f"Flat synthetic source is missing fields: {missing}")

    result = source.copy()
    result["schema_version"] = CONTRACT_VERSION
    result["source_system"] = "synthetic_flat"
    result["data_origin"] = "synthetic"
    result["event_at"] = pd.to_datetime(
        result["event_timestamp"],
        utc=True,
        errors="raise",
    )
    result["event_date"] = pd.to_datetime(
        result["event_date"],
        errors="raise",
    ).dt.date
    result = ensure_canonical_columns(result)
    validate_event_frame(result)
    return result
