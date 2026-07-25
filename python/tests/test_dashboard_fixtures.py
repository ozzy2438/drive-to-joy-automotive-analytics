from pathlib import Path

import duckdb

from src.semantic.build_dashboard_fixtures import (
    REQUIRED_SCENARIOS,
    build_dashboard_fixture_warehouse,
)
from src.semantic.validate_dashboard_fixtures import _numeric_equal


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]


def test_fixture_builder_uses_isolated_synthetic_scenarios(tmp_path: Path) -> None:
    database = tmp_path / "fixtures.duckdb"
    manifest = build_dashboard_fixture_warehouse(
        input_path=(
            REPOSITORY_ROOT
            / "data"
            / "synthetic"
            / "dashboard_fixtures"
            / "v1"
            / "metric_inputs.csv"
        ),
        database_path=database,
    )

    assert manifest["fixture_adapter"] == "dashboard_fixture"
    assert set(manifest["scenarios"]) == REQUIRED_SCENARIOS
    connection = duckdb.connect(str(database), read_only=True)
    try:
        origins = connection.execute(
            "select distinct data_origin "
            "from raw_dashboard_fixtures.metric_inputs"
        ).fetchall()
    finally:
        connection.close()
    assert origins == [("synthetic",)]


def test_fixture_comparison_uses_exact_counts_and_tolerant_rates() -> None:
    assert not _numeric_equal(
        10.0000001,
        10,
        0.001,
        exact_integer=True,
    )
    assert _numeric_equal(
        10.0000001,
        10,
        0.001,
        exact_integer=False,
    )
