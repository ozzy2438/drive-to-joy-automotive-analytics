"""Load governed synthetic sources into a reproducible local DuckDB warehouse."""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import duckdb

from src.warehouse.local_validation import validate_local_foundation

WAREHOUSE_SCHEMA_VERSION = "1.0.0"

FOUNDATION_TABLES = {
    ("raw_synthetic", "events_flat"): "raw_flat_events.parquet",
    ("raw_synthetic", "canonical_events"): "canonical_events.parquet",
    ("raw_synthetic", "web_submissions"): "web_submissions.parquet",
    ("raw_synthetic", "experiment_assignments"): (
        "experiment_assignments.parquet"
    ),
    ("raw_synthetic", "personalisation_assignments"): (
        "personalisation_assignments.parquet"
    ),
    ("raw_crm", "leads"): "crm_leads.parquet",
    ("raw_media", "daily_spend"): "media_spend_daily.parquet",
    ("raw_reference", "vehicle_catalogue"): "vehicle_catalogue.parquet",
    ("raw_reference", "dealers"): "dealers.parquet",
    ("raw_reference", "campaign_registry"): "campaign_registry.parquet",
    ("raw_reference", "experiment_registry"): "experiment_registry.parquet",
    ("raw_reference", "personalisation_audience_registry"): (
        "personalisation_audience_registry.parquet"
    ),
    ("raw_quality", "canonical_events_controlled_defects"): (
        "canonical_events_controlled_defects.parquet"
    ),
    ("raw_quality", "controlled_defect_registry"): (
        "controlled_defect_registry.parquet"
    ),
}


def _sql_path(path: Path) -> str:
    return str(path.resolve()).replace("'", "''")


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _read_foundation_manifest(directory: Path) -> dict[str, Any]:
    manifest_path = directory / "manifest.json"
    if not manifest_path.is_file():
        raise FileNotFoundError(f"Missing foundation manifest: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("data_origin") != "synthetic":
        raise ValueError("Only visibly synthetic foundation data may be loaded")
    for filename in FOUNDATION_TABLES.values():
        path = directory / filename
        expected = manifest.get("files", {}).get(filename, {}).get("sha256")
        if not expected:
            raise ValueError(f"Manifest is missing a digest for {filename}")
        if _sha256(path) != expected:
            raise ValueError(f"Digest mismatch for {filename}")
    return manifest


def _load_parquet_table(
    connection: duckdb.DuckDBPyConnection,
    schema: str,
    table: str,
    path: Path,
) -> int:
    connection.execute(f"create schema if not exists {schema}")
    connection.execute(
        f"create or replace table {schema}.{table} as "
        f"select * from read_parquet('{_sql_path(path)}')"
    )
    return int(
        connection.execute(
            f"select count(*) from {schema}.{table}"
        ).fetchone()[0]
    )


def _load_runtime_evidence(
    connection: duckdb.DuckDBPyConnection,
    runtime_directory: Path,
) -> dict[str, int]:
    row_counts: dict[str, int] = {}
    events_path = runtime_directory / "events.ndjson"
    crm_path = runtime_directory / "crm-records.ndjson"
    if not events_path.is_file() and not crm_path.is_file():
        return row_counts

    connection.execute("create schema if not exists raw_local_demo")
    if events_path.is_file():
        connection.execute(
            "create or replace table raw_local_demo.events as "
            f"select * from read_json_auto('{_sql_path(events_path)}', "
            "format='newline_delimited')"
        )
        row_counts["raw_local_demo.events"] = int(
            connection.execute(
                "select count(*) from raw_local_demo.events"
            ).fetchone()[0]
        )
    if crm_path.is_file():
        connection.execute(
            """
            create or replace table raw_local_demo.crm_leads as
            select
              envelope.lead.schema_version as schema_version,
              envelope.lead.crm_lead_id as crm_lead_id,
              envelope.lead.web_submission_id as web_submission_id,
              envelope.lead.lead_id_hash as lead_id_hash,
              envelope.lead.web_submit_at as web_submit_at,
              envelope.lead.lead_created_at as lead_created_at,
              envelope.lead.lead_status as lead_status,
              envelope.lead.lead_status_updated_at as lead_status_updated_at,
              envelope.lead.vehicle_model_interest as vehicle_model_interest,
              envelope.lead.dealer_id as dealer_id,
              envelope.lead.disqualification_reason as disqualification_reason,
              envelope.lead.appointment_booked_at as appointment_booked_at,
              envelope.lead.appointment_attended_flag
                as appointment_attended_flag,
              envelope.lead.vehicle_ordered_flag as vehicle_ordered_flag,
              envelope.lead.order_value_band as order_value_band,
              envelope.lead.data_origin as data_origin
            from read_json_auto(
              ?,
              format='newline_delimited'
            ) as envelope
            """,
            [str(crm_path.resolve())],
        )
        row_counts["raw_local_demo.crm_leads"] = int(
            connection.execute(
                "select count(*) from raw_local_demo.crm_leads"
            ).fetchone()[0]
        )
    return row_counts


def load_local_warehouse(
    *,
    foundation_directory: str | Path,
    database_path: str | Path,
    runtime_directory: str | Path | None = None,
) -> dict[str, Any]:
    """Load clean generated sources and optional demo evidence into DuckDB."""
    foundation = Path(foundation_directory)
    database = Path(database_path)
    source_manifest = _read_foundation_manifest(foundation)
    validation = validate_local_foundation(foundation)
    database.parent.mkdir(parents=True, exist_ok=True)

    connection = duckdb.connect(str(database))
    row_counts: dict[str, int] = {}
    try:
        connection.execute("begin transaction")
        for (schema, table), filename in FOUNDATION_TABLES.items():
            row_counts[f"{schema}.{table}"] = _load_parquet_table(
                connection,
                schema,
                table,
                foundation / filename,
            )
        if runtime_directory is not None:
            row_counts.update(
                _load_runtime_evidence(connection, Path(runtime_directory))
            )
        connection.execute("create schema if not exists raw_governance")
        connection.execute(
            """
            create or replace table raw_governance.source_loads (
              warehouse_schema_version varchar,
              loaded_at_utc timestamp,
              data_origin varchar,
              source_manifest_sha256 varchar,
              source_table varchar,
              row_count bigint
            )
            """
        )
        loaded_at = datetime.now(timezone.utc)
        manifest_digest = _sha256(foundation / "manifest.json")
        connection.executemany(
            """
            insert into raw_governance.source_loads values (?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    WAREHOUSE_SCHEMA_VERSION,
                    loaded_at,
                    "synthetic",
                    manifest_digest,
                    table_name,
                    row_count,
                )
                for table_name, row_count in sorted(row_counts.items())
            ],
        )
        connection.execute("commit")
    except Exception:
        connection.execute("rollback")
        raise
    finally:
        connection.close()

    load_manifest = {
        "warehouse_schema_version": WAREHOUSE_SCHEMA_VERSION,
        "loaded_at_utc": loaded_at.isoformat(),
        "data_origin": "synthetic",
        "disclosure": (
            "Synthetic demonstration data. Not real customer, CRM, campaign "
            "or automotive performance data."
        ),
        "database": str(database.resolve()),
        "database_sha256": _sha256(database),
        "source_manifest_sha256": manifest_digest,
        "source_configuration": source_manifest["configuration"],
        "source_validation": validation,
        "row_counts": dict(sorted(row_counts.items())),
    }
    manifest_path = foundation / "warehouse_load_manifest.json"
    manifest_path.write_text(
        json.dumps(load_manifest, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    return load_manifest


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Load the synthetic foundation into local DuckDB."
    )
    parser.add_argument("--foundation", required=True)
    parser.add_argument("--database", required=True)
    parser.add_argument("--runtime-data")
    return parser


def main() -> None:
    args = _parser().parse_args()
    manifest = load_local_warehouse(
        foundation_directory=args.foundation,
        database_path=args.database,
        runtime_directory=args.runtime_data,
    )
    print(json.dumps(manifest, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
