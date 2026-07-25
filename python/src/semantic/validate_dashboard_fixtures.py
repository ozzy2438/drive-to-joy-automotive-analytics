"""Reconcile fixture aggregate results to versioned expected KPI values."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import duckdb
import yaml

from src.semantic.build_dashboard_fixtures import REQUIRED_SCENARIOS


def _load_yaml(path: Path) -> dict[str, Any]:
    loaded = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(loaded, dict):
        raise ValueError(f"{path} must contain a YAML object")
    return loaded


def _numeric_equal(
    actual: float | None,
    expected: float | int | None,
    tolerance: float,
    *,
    exact_integer: bool,
) -> bool:
    if expected is None:
        return actual is None
    if actual is None:
        return False
    expected_number = float(expected)
    if exact_integer and isinstance(expected, int) and not isinstance(
        expected,
        bool,
    ):
        return actual == expected_number
    return abs(float(actual) - expected_number) <= tolerance


def validate_dashboard_fixture_results(
    *,
    repository_root: str | Path,
    database_path: str | Path,
) -> dict[str, Any]:
    """Validate exact components, tolerant rates and exact statuses."""
    root = Path(repository_root)
    manifest = _load_yaml(
        root / "dashboards" / "dashboard_acceptance_manifest.yml"
    )
    scenarios = {
        scenario["scenario_id"] for scenario in manifest["scenarios"]
    }
    if scenarios != REQUIRED_SCENARIOS:
        raise ValueError("Acceptance manifest scenario registry is incomplete")

    connection = duckdb.connect(str(database_path), read_only=True)
    failures: list[str] = []
    try:
        available = {
            (row[0], row[1]): row[2:]
            for row in connection.execute(
                """
                select
                  scenario_id,
                  metric_id,
                  numerator,
                  denominator,
                  metric_value,
                  metric_status,
                  quality_status
                from main_marts.agg_dashboard_fixture_results
                """
            ).fetchall()
        }
    finally:
        connection.close()

    for expectation in manifest["expectations"]:
        key = (expectation["scenario_id"], expectation["metric_id"])
        actual = available.get(key)
        if actual is None:
            failures.append(f"missing result {key}")
            continue
        numerator, denominator, value, status, quality_status = actual
        tolerance = float(expectation["tolerance"])
        checks = {
            "numerator": _numeric_equal(
                numerator,
                expectation["expected_numerator"],
                tolerance,
                exact_integer=True,
            ),
            "denominator": _numeric_equal(
                denominator,
                expectation["expected_denominator"],
                tolerance,
                exact_integer=True,
            ),
            "value": _numeric_equal(
                value,
                expectation["expected_value"],
                tolerance,
                exact_integer=False,
            ),
            "status": status == expectation["expected_status"],
            "quality_status": (
                quality_status == expectation["expected_quality_status"]
            ),
        }
        for check_name, passed in checks.items():
            if not passed:
                failures.append(f"{key} failed {check_name}")

    if failures:
        raise ValueError(
            "Dashboard fixture reconciliation failed: " + "; ".join(failures)
        )
    return {
        "fixture_adapter": manifest["fixture_adapter"],
        "scenario_count": len(scenarios),
        "expectation_count": len(manifest["expectations"]),
        "exact_component_policy": "integer counts use exact equality",
        "decimal_policy": "rates and decimal components use metric tolerance",
        "status": "pass",
    }


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate dashboard fixture KPI expectations."
    )
    parser.add_argument("--repository-root", default=".")
    parser.add_argument("--database", required=True)
    return parser


def main() -> None:
    args = _parser().parse_args()
    result = validate_dashboard_fixture_results(
        repository_root=args.repository_root,
        database_path=args.database,
    )
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
