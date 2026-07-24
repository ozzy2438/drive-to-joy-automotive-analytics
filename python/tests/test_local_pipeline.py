"""End-to-end tests for the reproducible local foundation."""

from src.pipeline import build_local_foundation


def test_local_foundation_builds_and_validates(tmp_path):
    manifest = build_local_foundation(
        output_directory=tmp_path,
        seed=20260723,
        days=14,
        sessions=350,
        include_controlled_defects=True,
    )
    assert manifest["data_origin"] == "synthetic"
    assert all(manifest["validation"]["checks"].values())
    assert manifest["validation"]["metrics"]["web_submissions"] > 0
    assert (tmp_path / "manifest.json").is_file()
    assert (tmp_path / "controlled_defect_registry.parquet").is_file()
