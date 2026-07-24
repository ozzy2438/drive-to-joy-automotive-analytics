"""Tests for deterministic local warehouse source loading."""

from __future__ import annotations

import json

import duckdb

from src.pipeline import build_local_foundation
from src.warehouse.load_local_warehouse import load_local_warehouse
from src.warehouse.local_validation import validate_local_foundation


def test_loads_governed_raw_schemas_and_manifest(tmp_path):
    foundation = tmp_path / "foundation"
    database = tmp_path / "warehouse.duckdb"
    build_local_foundation(
        output_directory=foundation,
        seed=20260724,
        days=14,
        sessions=400,
    )

    manifest = load_local_warehouse(
        foundation_directory=foundation,
        database_path=database,
    )

    connection = duckdb.connect(str(database), read_only=True)
    try:
        assert connection.execute(
            "select count(*) from raw_synthetic.events_flat"
        ).fetchone()[0] > 0
        assert connection.execute(
            "select count(*) from raw_crm.leads"
        ).fetchone()[0] > 0
        assert connection.execute(
            "select count(*) from raw_media.daily_spend"
        ).fetchone()[0] > 0
        assert connection.execute(
            "select count(*) from raw_governance.source_loads"
        ).fetchone()[0] == len(manifest["row_counts"])
    finally:
        connection.close()

    persisted = json.loads(
        (foundation / "warehouse_load_manifest.json").read_text(
            encoding="utf-8"
        )
    )
    assert persisted["data_origin"] == "synthetic"
    assert persisted["database_sha256"] == manifest["database_sha256"]
    assert persisted["row_counts"]["raw_reference.dealers"] >= 20


def test_loads_optional_local_runtime_evidence(tmp_path):
    foundation = tmp_path / "foundation"
    runtime = tmp_path / "runtime"
    database = tmp_path / "warehouse.duckdb"
    build_local_foundation(
        output_directory=foundation,
        seed=20260724,
        days=14,
        sessions=400,
    )
    runtime.mkdir()
    event = {
        "schema_version": "1.1.0",
        "source_system": "synthetic_flat",
        "data_origin": "synthetic",
        "event_id": "evt_runtime_example",
        "event_date": "2026-07-24",
        "event_at": "2026-07-24T01:00:00.000Z",
        "event_name": "view_homepage",
        "user_pseudo_id": "usr_runtime_example",
        "session_id": "ses_runtime_example",
        "consent_analytics": "granted",
        "consent_marketing": "denied",
        "ingested_at_utc": "2026-07-24T01:00:01.000Z",
    }
    (runtime / "events.ndjson").write_text(
        json.dumps(event) + "\n",
        encoding="utf-8",
    )

    manifest = load_local_warehouse(
        foundation_directory=foundation,
        database_path=database,
        runtime_directory=runtime,
    )

    assert manifest["row_counts"]["raw_local_demo.events"] == 1


def test_validation_separates_context_from_bounded_attribution(tmp_path):
    foundation = tmp_path / "foundation"
    build_local_foundation(
        output_directory=foundation,
        seed=20260723,
        days=90,
        sessions=5_000,
    )

    validation = validate_local_foundation(foundation)

    assert validation["checks"]["experiment_outcomes_are_bounded"]
    assert validation["checks"]["personalisation_outcomes_are_bounded"]
    assert (
        validation["metrics"]["experiment_contexts_outside_outcome_window"]
        > 0
    )
