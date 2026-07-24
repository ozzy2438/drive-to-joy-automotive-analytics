"""Adapter for nested GA4 BigQuery export-style event records."""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any

import pandas as pd

from src.contracts.canonical import (
    CONTRACT_VERSION,
    ensure_canonical_columns,
    reject_pii_columns,
    stable_id,
    validate_event_frame,
)

PARAMETER_MAP = {
    "audience_id": "audience_id",
    "campaign_id": "campaign_id",
    "campaign_name": "campaign_name",
    "colour_id": "colour_id",
    "comparison_model": "comparison_model",
    "cmp_version": "cmp_version",
    "configurator_id": "configurator_id",
    "configurator_step": "configurator_step",
    "configurator_value_band": "configurator_value_band",
    "consent_analytics": "consent_analytics",
    "consent_marketing": "consent_marketing",
    "cta_id": "cta_id",
    "dealer_id": "dealer_id",
    "dealer_state": "dealer_state",
    "entry_point": "entry_point",
    "experience_id": "experience_id",
    "experiment_assignment_id": "experiment_assignment_id",
    "experiment_id": "experiment_id",
    "form_error_type": "form_error_type",
    "form_error_count": "form_error_count",
    "form_field": "form_field",
    "form_completion_time_seconds": "form_completion_time_seconds",
    "form_instance_id": "form_instance_id",
    "form_type": "form_type",
    "ga_session_id": "session_id",
    "holdout_flag": "holdout_flag",
    "journey_stage": "journey_stage",
    "lead_id_hash": "lead_id_hash",
    "lead_status": "lead_status",
    "loan_term_months": "loan_term_months",
    "offer_id": "offer_id",
    "option_ids": "option_ids",
    "order_value_band": "order_value_band",
    "page_type": "page_type",
    "personalisation_assignment_id": "personalisation_assignment_id",
    "powertrain": "powertrain",
    "repayment_band": "repayment_band",
    "search_method": "search_method",
    "specification_section": "specification_section",
    "variant_id": "variant_id",
    "vehicle_model": "vehicle_model",
    "vehicle_variant": "vehicle_variant",
    "web_submission_id": "web_submission_id",
}


def _parameter_value(value: dict[str, Any]) -> Any:
    for key in ("string_value", "int_value", "double_value", "float_value"):
        if value.get(key) is not None:
            return value[key]
    return None


def _parameter_dictionary(event_params: Any) -> dict[str, Any]:
    if event_params is None:
        return {}
    result: dict[str, Any] = {}
    for parameter in event_params:
        key = parameter.get("key")
        if key:
            result[str(key)] = _parameter_value(parameter.get("value", {}))
    return result


def _optional_string(value: Any) -> str | None:
    if value is None:
        return None
    return str(value)


def _optional_boolean(value: Any) -> bool | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    text = str(value).strip().lower()
    if text in {"1", "true", "yes"}:
        return True
    if text in {"0", "false", "no"}:
        return False
    raise ValueError(f"Cannot convert holdout_flag to boolean: {value!r}")


def _optional_integer(value: Any) -> int | None:
    if value is None:
        return None
    return int(value)


def _optional_float(value: Any) -> float | None:
    if value is None:
        return None
    return float(value)


def adapt_ga4_bigquery_events(
    records: Iterable[dict[str, Any]],
    *,
    data_origin: str = "official_sample",
) -> pd.DataFrame:
    """Normalise nested GA4 export-style dictionaries to canonical events."""
    rows: list[dict[str, Any]] = []
    for record in records:
        reject_pii_columns(list(record.keys()))
        for required in ("event_date", "event_timestamp", "event_name"):
            if record.get(required) is None:
                raise ValueError(f"GA4 source record is missing {required}")

        params = _parameter_dictionary(record.get("event_params"))
        reject_pii_columns(list(params.keys()))
        timestamp = pd.to_datetime(
            int(record["event_timestamp"]),
            unit="us",
            utc=True,
        )
        user_pseudo_id = _optional_string(record.get("user_pseudo_id"))
        event_id = _optional_string(params.get("event_id")) or stable_id(
            "evt",
            user_pseudo_id,
            record["event_timestamp"],
            record["event_name"],
            record.get("event_bundle_sequence_id"),
        )
        traffic = record.get("traffic_source") or {}
        device = record.get("device") or {}
        row: dict[str, Any] = {
            "schema_version": CONTRACT_VERSION,
            "source_system": "ga4_bigquery",
            "data_origin": data_origin,
            "event_id": event_id,
            "event_date": pd.to_datetime(
                str(record["event_date"]),
                format="%Y%m%d",
                errors="raise",
            ).date(),
            "event_at": timestamp,
            "event_name": str(record["event_name"]),
            "user_pseudo_id": user_pseudo_id,
            "device_category": _optional_string(device.get("category")),
            "traffic_source": _optional_string(traffic.get("source")),
            "traffic_medium": _optional_string(traffic.get("medium")),
            "campaign_name": _optional_string(traffic.get("name")),
        }
        for source_key, canonical_key in PARAMETER_MAP.items():
            if source_key not in params:
                continue
            value = params.get(source_key)
            if canonical_key == "holdout_flag":
                row[canonical_key] = _optional_boolean(value)
            elif canonical_key in {"form_error_count", "loan_term_months"}:
                row[canonical_key] = _optional_integer(value)
            elif canonical_key == "form_completion_time_seconds":
                row[canonical_key] = _optional_float(value)
            else:
                row[canonical_key] = _optional_string(value)
        rows.append(row)

    result = ensure_canonical_columns(pd.DataFrame(rows))
    validate_event_frame(result)
    return result
