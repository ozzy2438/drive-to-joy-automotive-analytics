"""Tests for machine contracts and source-adapter parity."""

import json
from pathlib import Path

import pandas as pd
import pytest

from src.adapters.flat_synthetic import adapt_flat_synthetic_events
from src.adapters.ga4_bigquery import adapt_ga4_bigquery_events
from src.contracts.schema_validation import (
    REPOSITORY_ROOT,
    validate_record,
    validate_schemas,
)


def _ga4_param(key, value):
    value_key = "int_value" if isinstance(value, int) else "string_value"
    return {"key": key, "value": {value_key: value}}


def test_all_contract_schemas_are_valid():
    validated = validate_schemas()
    assert len(validated) == 6


def test_experiment_definition_fixture_is_contract_valid():
    path = (
        REPOSITORY_ROOT
        / "contracts"
        / "examples"
        / "EXP-CTA-001.definition.json"
    )
    validate_record(
        "experiment_definition.schema.json",
        json.loads(path.read_text(encoding="utf-8")),
    )


def test_flat_and_nested_adapters_have_business_context_parity():
    event_at = pd.Timestamp("2026-07-01T10:00:00Z")
    flat = pd.DataFrame(
        [
            {
                "event_id": "evt_adapter_parity",
                "event_date": "2026-07-01",
                "event_timestamp": event_at,
                "event_name": "test_drive_submit",
                "user_pseudo_id": "usr_demo",
                "session_id": "123456",
                "page_type": "test_drive_form",
                "journey_stage": "convert",
                "device_category": "mobile",
                "traffic_source": "google",
                "traffic_medium": "cpc",
                "campaign_id": "cmp_001",
                "campaign_name": "synthetic_campaign",
                "vehicle_model": "Aurora SUV",
                "form_type": "test_drive",
                "form_instance_id": "frm_demo_001",
                "web_submission_id": "sub_demo_001",
                "lead_id_hash": "lead_0123456789abcdef",
                "experiment_id": "EXP-CTA-001",
                "experiment_assignment_id": "exa_demo_001",
                "variant_id": "control",
                "consent_analytics": "granted",
                "consent_marketing": "denied",
                "cmp_version": "cmp_demo_1",
            }
        ]
    )
    nested = [
        {
            "event_date": "20260701",
            "event_timestamp": int(event_at.timestamp() * 1_000_000),
            "event_name": "test_drive_submit",
            "user_pseudo_id": "usr_demo",
            "device": {"category": "mobile"},
            "traffic_source": {
                "source": "google",
                "medium": "cpc",
                "name": "synthetic_campaign",
            },
            "event_params": [
                _ga4_param("event_id", "evt_adapter_parity"),
                _ga4_param("ga_session_id", 123456),
                _ga4_param("page_type", "test_drive_form"),
                _ga4_param("journey_stage", "convert"),
                _ga4_param("campaign_id", "cmp_001"),
                _ga4_param("vehicle_model", "Aurora SUV"),
                _ga4_param("form_type", "test_drive"),
                _ga4_param("form_instance_id", "frm_demo_001"),
                _ga4_param("web_submission_id", "sub_demo_001"),
                _ga4_param("lead_id_hash", "lead_0123456789abcdef"),
                _ga4_param("experiment_id", "EXP-CTA-001"),
                _ga4_param("experiment_assignment_id", "exa_demo_001"),
                _ga4_param("variant_id", "control"),
                _ga4_param("consent_analytics", "granted"),
                _ga4_param("consent_marketing", "denied"),
                _ga4_param("cmp_version", "cmp_demo_1"),
            ],
        }
    ]
    flat_result = adapt_flat_synthetic_events(flat).iloc[0]
    nested_result = adapt_ga4_bigquery_events(
        nested,
        data_origin="synthetic",
    ).iloc[0]
    comparable = [
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
        "form_type",
        "form_instance_id",
        "web_submission_id",
        "lead_id_hash",
        "experiment_id",
        "experiment_assignment_id",
        "variant_id",
        "consent_analytics",
        "consent_marketing",
        "cmp_version",
    ]
    assert flat_result[comparable].to_dict() == nested_result[comparable].to_dict()


def test_adapter_rejects_raw_pii_columns():
    source = pd.DataFrame(
        [
            {
                "event_id": "evt_privacy_test",
                "event_date": "2026-07-01",
                "event_timestamp": "2026-07-01T10:00:00Z",
                "event_name": "test_drive_submit",
                "user_pseudo_id": "usr_demo",
                "session_id": "ses_demo",
                "consent_analytics": "granted",
                "consent_marketing": "denied",
                "email": "prohibited@example.invalid",
            }
        ]
    )
    with pytest.raises(ValueError, match="Raw PII"):
        adapt_flat_synthetic_events(source)


def test_nested_adapter_rejects_pii_event_parameters():
    nested = [
        {
            "event_date": "20260701",
            "event_timestamp": 1_783_074_000_000_000,
            "event_name": "test_drive_submit",
            "user_pseudo_id": "usr_demo",
            "event_params": [
                _ga4_param("ga_session_id", 123456),
                _ga4_param("email", "prohibited@example.invalid"),
            ],
        }
    ]
    with pytest.raises(ValueError, match="Raw PII"):
        adapt_ga4_bigquery_events(nested)
