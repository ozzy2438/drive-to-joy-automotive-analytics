"""Execute governed dashboard reconciliation SQL against local aggregates."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import duckdb
import yaml

VALID_STATUSES = {"pass", "warn", "fail", "unknown", "stale"}


def _load_yaml(path: Path) -> dict[str, Any]:
    loaded = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(loaded, dict):
        raise ValueError(f"{path} must contain a YAML object")
    return loaded


def _expected_value(
    *,
    aggregation_behavior: str,
    unit: str,
    numerator: float | None,
    denominator: float | None,
) -> float | None:
    if aggregation_behavior == "ratio_of_sums":
        if denominator in (None, 0) or numerator is None:
            return None
        scale = 1000 if unit == "per_1000_sessions" else 1
        return float(numerator) / float(denominator) * scale
    if aggregation_behavior == "difference_of_ratios":
        if numerator is None or denominator is None:
            return None
        return float(numerator) - float(denominator)
    return None


def reconcile_dashboards(
    *,
    repository_root: str | Path,
    database_path: str | Path,
) -> dict[str, Any]:
    """Run every contract query and rederive governed metric values."""
    root = Path(repository_root)
    registry = _load_yaml(root / "measurement" / "metric_contracts.yml")
    metrics = {metric["metric_id"]: metric for metric in registry["metrics"]}
    connection = duckdb.connect(str(database_path), read_only=True)
    failures: list[str] = []
    row_count = 0
    try:
        for metric_id, metric in metrics.items():
            query_path = root / metric["reconciliation_query"]
            cursor = connection.execute(
                query_path.read_text(encoding="utf-8")
            )
            columns = [description[0] for description in cursor.description]
            rows = [
                dict(zip(columns, row, strict=True))
                for row in cursor.fetchall()
            ]
            if not rows:
                failures.append(f"{metric_id} returned no rows")
                continue
            row_count += len(rows)
            for row in rows:
                if row["metric_id"] != metric_id:
                    failures.append(f"{metric_id} returned another metric_id")
                if row["metric_version"] != metric["metric_version"]:
                    failures.append(f"{metric_id} version mismatch")
                if row["data_origin"] != "synthetic":
                    failures.append(f"{metric_id} is not synthetic")
                if row["quality_status"] not in VALID_STATUSES:
                    failures.append(f"{metric_id} has invalid quality status")
                if metric["aggregation_behavior"] == "status":
                    if row["metric_status"] not in VALID_STATUSES:
                        failures.append(f"{metric_id} has invalid metric status")
                    continue
                expected = _expected_value(
                    aggregation_behavior=metric["aggregation_behavior"],
                    unit=metric["unit"],
                    numerator=row["numerator"],
                    denominator=row["denominator"],
                )
                actual = row["metric_value"]
                tolerance = float(metric["tolerance"])
                if expected is None:
                    if actual is not None:
                        failures.append(
                            f"{metric_id} violated zero-denominator policy"
                        )
                elif (
                    actual is None
                    or abs(float(actual) - expected) > tolerance
                ):
                    failures.append(f"{metric_id} failed reconciliation")
    finally:
        connection.close()

    if failures:
        raise ValueError(
            "Dashboard reconciliation failed: " + "; ".join(failures)
        )
    return {
        "metric_count": len(metrics),
        "query_count": len(metrics),
        "reconciled_row_count": row_count,
        "data_origin": "synthetic",
        "status": "pass",
    }


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Reconcile governed dashboard aggregate metrics."
    )
    parser.add_argument("--repository-root", default=".")
    parser.add_argument("--database", required=True)
    return parser


def main() -> None:
    args = _parser().parse_args()
    result = reconcile_dashboards(
        repository_root=args.repository_root,
        database_path=args.database,
    )
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
