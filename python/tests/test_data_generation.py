"""Tests for deterministic data generation and identity contracts."""

from src.adapters.flat_synthetic import adapt_flat_synthetic_events
from src.data_generation.generate_dealers import generate_dealers
from src.data_generation.generate_ga4_events import (
    create_controlled_defect_scenario,
    generate_ga4_events,
)
from src.data_generation.generate_vehicle_catalogue import generate_vehicle_catalogue


def test_reference_data_meets_documented_minimums():
    assert len(generate_vehicle_catalogue()) >= 12
    assert len(generate_dealers()) >= 20


def test_event_generation_is_reproducible():
    first = generate_ga4_events(seed=42, days=7, sessions=120)
    second = generate_ga4_events(seed=42, days=7, sessions=120)
    assert first["event_id"].tolist() == second["event_id"].tolist()
    assert first["event_name"].tolist() == second["event_name"].tolist()


def test_form_identities_are_separate():
    events = adapt_flat_synthetic_events(
        generate_ga4_events(seed=20260723, days=14, sessions=400)
    )
    starts = events[
        events["event_name"].isin(["test_drive_start", "quote_start"])
    ]
    submits = events[
        events["event_name"].isin(["test_drive_submit", "quote_submit"])
    ]
    assert not starts.empty
    assert starts["form_instance_id"].notna().all()
    assert submits["web_submission_id"].notna().all()
    assert submits["lead_id_hash"].notna().all()
    assert (submits["form_instance_id"] != submits["web_submission_id"]).all()
    assert (submits["web_submission_id"] != submits["lead_id_hash"]).all()


def test_controlled_defects_are_separate_and_traceable():
    source = generate_ga4_events(seed=7, days=14, sessions=400)
    defect_source, registry = create_controlled_defect_scenario(source)
    assert len(defect_source) >= len(source)
    assert set(registry["expected_result"]) == {"fail"}
    assert {
        "missing_required_vehicle_model",
        "duplicate_conversion",
    }.issubset(set(registry["check_name"]))
