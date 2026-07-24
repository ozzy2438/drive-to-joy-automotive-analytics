"""JSON Schema loading and record validation."""

from __future__ import annotations

from datetime import date, datetime
import json
from pathlib import Path
from typing import Any

import pandas as pd
from jsonschema import Draft202012Validator, FormatChecker

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
SCHEMA_DIRECTORY = REPOSITORY_ROOT / "contracts" / "schemas"


def load_schema(schema_name: str) -> dict[str, Any]:
    """Load one version-controlled JSON Schema by filename."""
    path = SCHEMA_DIRECTORY / schema_name
    if not path.is_file():
        raise FileNotFoundError(f"Unknown contract schema: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def validate_schemas() -> list[str]:
    """Validate every committed contract schema and return its filename."""
    validated: list[str] = []
    for path in sorted(SCHEMA_DIRECTORY.glob("*.schema.json")):
        schema = json.loads(path.read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        validated.append(path.name)
    return validated


def serialise_record(record: dict[str, Any]) -> dict[str, Any]:
    """Convert dataframe-friendly scalar values into JSON-compatible values."""
    serialised: dict[str, Any] = {}
    for key, value in record.items():
        if value is None or (not isinstance(value, (list, dict)) and pd.isna(value)):
            serialised[key] = None
        elif isinstance(value, pd.Timestamp):
            serialised[key] = value.isoformat().replace("+00:00", "Z")
        elif isinstance(value, datetime):
            serialised[key] = value.isoformat().replace("+00:00", "Z")
        elif isinstance(value, date):
            serialised[key] = value.isoformat()
        elif hasattr(value, "item"):
            serialised[key] = value.item()
        else:
            serialised[key] = value
    return serialised


def validate_record(schema_name: str, record: dict[str, Any]) -> None:
    """Validate one record and raise a useful error on contract failure."""
    schema = load_schema(schema_name)
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    errors = sorted(
        validator.iter_errors(serialise_record(record)),
        key=lambda error: list(error.absolute_path),
    )
    if errors:
        details = "; ".join(
            f"{'.'.join(map(str, error.absolute_path)) or '<root>'}: "
            f"{error.message}"
            for error in errors
        )
        raise ValueError(f"{schema_name} validation failed: {details}")
