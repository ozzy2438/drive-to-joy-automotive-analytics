from datetime import datetime, timezone
from pathlib import Path

from src.semantic.metric_contracts import (
    business_date,
    validate_metric_contracts,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]


def test_metric_contract_registry_and_dashboard_boundary() -> None:
    result = validate_metric_contracts(REPOSITORY_ROOT)

    assert result["status"] == "pass"
    assert result["metric_count"] == 15
    assert result["reconciliation_query_count"] == 15
    assert result["reporting_timezone"] == "Australia/Melbourne"


def test_melbourne_business_date_handles_dst_fall_back() -> None:
    before_fall_back = datetime(2026, 4, 4, 15, 30, tzinfo=timezone.utc)
    after_fall_back = datetime(2026, 4, 4, 16, 30, tzinfo=timezone.utc)

    assert business_date(before_fall_back).isoformat() == "2026-04-05"
    assert business_date(after_fall_back).isoformat() == "2026-04-05"


def test_melbourne_business_date_handles_dst_spring_forward() -> None:
    before_spring_forward = datetime(
        2026, 10, 3, 15, 30, tzinfo=timezone.utc
    )
    after_spring_forward = datetime(
        2026, 10, 3, 16, 30, tzinfo=timezone.utc
    )

    assert business_date(before_spring_forward).isoformat() == "2026-10-04"
    assert business_date(after_spring_forward).isoformat() == "2026-10-04"
