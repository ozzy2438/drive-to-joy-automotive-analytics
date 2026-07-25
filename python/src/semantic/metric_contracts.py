"""Validate the governed metric registry and dashboard dependency boundary."""

from __future__ import annotations

import argparse
import json
import re
from datetime import date, datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

import jsonschema
import yaml

REQUIRED_METRIC_IDS = {
    "qualified_leads_per_1000_engaged_sessions",
    "qualified_lead_rate",
    "cost_per_qualified_lead",
    "crm_match_rate",
    "model_to_test_drive_rate",
    "configurator_completion_rate",
    "finance_to_lead_progression_rate",
    "test_drive_attendance_rate",
    "vehicle_order_rate",
    "experiment_qualified_lead_rate",
    "experiment_srm_status",
    "personalisation_holdout_lift",
    "event_parameter_completeness",
    "utm_compliance_rate",
    "data_freshness_status",
}
MODEL_REFERENCE = re.compile(
    r"\b(?:raw|stg|int|fct|agg|dim)_[a-z][a-z0-9_]*\b"
)
SQL_RELATION = re.compile(
    r"\b(?:from|join)\s+(?:[a-z][a-z0-9_]*\.)?"
    r"([a-z][a-z0-9_]*)\b",
    flags=re.IGNORECASE,
)


def _load_yaml(path: Path) -> dict[str, Any]:
    loaded = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(loaded, dict):
        raise ValueError(f"{path} must contain a YAML object")
    return _normalise_yaml_scalars(loaded)


def _normalise_yaml_scalars(value: Any) -> Any:
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if isinstance(value, dict):
        return {
            key: _normalise_yaml_scalars(item)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [_normalise_yaml_scalars(item) for item in value]
    return value


def business_date(timestamp: datetime) -> date:
    """Return the frozen Melbourne reporting date for a UTC timestamp."""
    if timestamp.tzinfo is None:
        raise ValueError("business_date requires a timezone-aware timestamp")
    return timestamp.astimezone(ZoneInfo("Australia/Melbourne")).date()


def _allowed_models(source_registry: dict[str, Any]) -> set[str]:
    return {
        item["model"]
        for item in source_registry.get("governed_sources", [])
    }


def _validate_dashboard_dependencies(
    repository_root: Path,
    source_registry: dict[str, Any],
) -> list[str]:
    dashboards = repository_root / "dashboards"
    allowed = _allowed_models(source_registry)
    forbidden_prefixes = tuple(
        source_registry.get("forbidden_model_prefixes", [])
    )
    checked: list[str] = []
    paths = sorted(dashboards.glob("*_dashboard_spec.md"))
    paths.extend(sorted((dashboards / "reconciliation").glob("*.sql")))
    for path in paths:
        text = path.read_text(encoding="utf-8")
        references = set(MODEL_REFERENCE.findall(text))
        forbidden = sorted(
            reference
            for reference in references
            if reference.startswith(forbidden_prefixes)
        )
        if forbidden:
            raise ValueError(
                f"{path} references forbidden models: {forbidden}"
            )
        ungoverned = sorted(references - allowed)
        if ungoverned:
            raise ValueError(
                f"{path} references models outside dashboard_sources.yml: "
                f"{ungoverned}"
            )
        checked.append(str(path.relative_to(repository_root)))
    return checked


def validate_metric_contracts(repository_root: str | Path) -> dict[str, Any]:
    """Validate schema, metric identity, query paths and source allowlist."""
    root = Path(repository_root)
    contract_path = root / "measurement" / "metric_contracts.yml"
    schema_path = (
        root / "measurement" / "schemas" / "metric-contract.schema.json"
    )
    sources_path = root / "dashboards" / "dashboard_sources.yml"
    contract = _load_yaml(contract_path)
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(
        schema,
        format_checker=jsonschema.FormatChecker(),
    )
    errors = sorted(validator.iter_errors(contract), key=lambda error: list(error.path))
    if errors:
        details = "; ".join(
            f"{'.'.join(map(str, error.path)) or '<root>'}: {error.message}"
            for error in errors
        )
        raise ValueError(f"Metric contract schema validation failed: {details}")

    metrics = contract["metrics"]
    metric_ids = [metric["metric_id"] for metric in metrics]
    if len(metric_ids) != len(set(metric_ids)):
        raise ValueError("metric_id values must be unique")
    if set(metric_ids) != REQUIRED_METRIC_IDS:
        missing = sorted(REQUIRED_METRIC_IDS - set(metric_ids))
        extra = sorted(set(metric_ids) - REQUIRED_METRIC_IDS)
        raise ValueError(f"Metric registry mismatch; missing={missing}, extra={extra}")
    if any("expected_value" in metric for metric in metrics):
        raise ValueError(
            "Expected values belong in dashboard_acceptance_manifest.yml"
        )

    source_registry = _load_yaml(sources_path)
    allowed = _allowed_models(source_registry)
    query_paths: list[str] = []
    for metric in metrics:
        if metric["source_model"] not in allowed:
            raise ValueError(
                f"{metric['metric_id']} uses ungoverned source "
                f"{metric['source_model']}"
            )
        query_path = root / metric["reconciliation_query"]
        if not query_path.is_file():
            raise ValueError(
                f"{metric['metric_id']} is missing {metric['reconciliation_query']}"
            )
        sql = query_path.read_text(encoding="utf-8")
        relations = {
            match.lower() for match in SQL_RELATION.findall(sql)
        }
        if not relations:
            raise ValueError(f"{query_path} does not select from a model")
        if not relations.issubset(allowed):
            raise ValueError(
                f"{query_path} uses sources outside the allowlist: "
                f"{sorted(relations - allowed)}"
            )
        if metric["source_model"] not in relations:
            raise ValueError(
                f"{query_path} does not use {metric['source_model']}"
            )
        query_paths.append(str(query_path.relative_to(root)))

    checked_dashboard_files = _validate_dashboard_dependencies(
        root,
        source_registry,
    )
    return {
        "contract_version": contract["contract_version"],
        "metric_count": len(metrics),
        "reporting_timezone": contract["reporting_timezone"],
        "governed_source_count": len(allowed),
        "reconciliation_query_count": len(query_paths),
        "dashboard_files_checked": len(checked_dashboard_files),
        "status": "pass",
    }


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate governed metric contracts and dashboard sources."
    )
    parser.add_argument("--repository-root", default=".")
    return parser


def main() -> None:
    args = _parser().parse_args()
    result = validate_metric_contracts(args.repository_root)
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
