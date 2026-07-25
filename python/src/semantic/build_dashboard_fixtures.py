"""Load versioned dashboard acceptance inputs into an isolated DuckDB."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path
from typing import Any

import duckdb

REQUIRED_SCENARIOS = {
    "clean_baseline",
    "unmatched_crm",
    "identity_conflict",
    "zero_denominator",
    "stale_data",
    "invalid_utm",
    "missing_parameter",
    "srm_failure",
    "personalisation_holdout",
}


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_dashboard_fixture_warehouse(
    *,
    input_path: str | Path,
    database_path: str | Path,
) -> dict[str, Any]:
    """Create or replace the isolated raw fixture input table."""
    source = Path(input_path)
    database = Path(database_path)
    with source.open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    if not rows:
        raise ValueError("Dashboard fixture input must not be empty")
    scenarios = {row["scenario_id"] for row in rows}
    if scenarios != REQUIRED_SCENARIOS:
        raise ValueError(
            f"Fixture scenarios mismatch; found={sorted(scenarios)}"
        )
    if {row["data_origin"] for row in rows} != {"synthetic"}:
        raise ValueError("Dashboard fixture inputs must be synthetic")
    if any("expected" in column for column in rows[0]):
        raise ValueError("Expected values belong in the acceptance manifest")

    database.parent.mkdir(parents=True, exist_ok=True)
    connection = duckdb.connect(str(database))
    try:
        connection.execute(
            "create schema if not exists raw_dashboard_fixtures"
        )
        connection.execute(
            """
            create or replace table raw_dashboard_fixtures.metric_inputs as
            select * from read_csv_auto(?, header=true, all_varchar=true)
            """,
            [str(source.resolve())],
        )
        loaded_rows = int(
            connection.execute(
                "select count(*) from raw_dashboard_fixtures.metric_inputs"
            ).fetchone()[0]
        )
    finally:
        connection.close()

    manifest = {
        "fixture_adapter": "dashboard_fixture",
        "fixture_version": "1.0.0",
        "data_origin": "synthetic",
        "input_sha256": _sha256(source),
        "row_count": loaded_rows,
        "scenario_count": len(scenarios),
        "scenarios": sorted(scenarios),
        "database": str(database.resolve()),
        "disclosure": (
            "Synthetic dashboard acceptance fixtures. Not real customer, "
            "campaign, CRM or automotive performance data."
        ),
    }
    manifest_path = database.with_suffix(".manifest.json")
    manifest_path.write_text(
        json.dumps(manifest, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    return manifest


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Build the isolated dashboard fixture DuckDB."
    )
    parser.add_argument("--input", required=True)
    parser.add_argument("--database", required=True)
    return parser


def main() -> None:
    args = _parser().parse_args()
    result = build_dashboard_fixture_warehouse(
        input_path=args.input,
        database_path=args.database,
    )
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
