"""Tests for deterministic data generation and identity contracts."""

import re

import pandas as pd

from src.adapters.flat_synthetic import adapt_flat_synthetic_events
from src.data_generation.export_reference_seeds import SEED_COLUMNS
from src.data_generation.generate_dealers import generate_dealers
from src.data_generation.generate_ga4_events import (
    create_controlled_defect_scenario,
    generate_ga4_events,
)
from src.data_generation.generate_vehicle_catalogue import generate_vehicle_catalogue
from src.data_generation.reference_data import (
    REPOSITORY_ROOT,
    generate_campaign_registry,
    generate_experiment_registry,
    generate_personalisation_audience_registry,
    load_reference_registry,
)


def test_reference_data_meets_documented_minimums():
    vehicles = generate_vehicle_catalogue()
    dealers = generate_dealers()
    campaigns = generate_campaign_registry()
    experiments = generate_experiment_registry()
    audiences = generate_personalisation_audience_registry()
    assert len(vehicles) >= 12
    assert vehicles["vehicle_model_id"].nunique() >= 5
    assert vehicles["body_type"].nunique() >= 3
    assert {"hybrid", "petrol"}.issubset(set(vehicles["powertrain"]))
    assert len(dealers) >= 20
    assert {"NSW", "VIC", "QLD", "SA", "WA", "ACT", "TAS"}.issubset(
        set(dealers["state"])
    )
    assert len(campaigns) >= 10
    assert {
        "Paid Search",
        "Paid Social",
        "Organic Search",
        "Email",
        "Referral",
        "Direct",
    }.issubset(set(campaigns["channel"]))
    assert set(experiments["experiment_id"]) == {
        "EXP-CTA-001",
        "EXP-FORM-002",
        "EXP-PERS-003",
        "EXP-FIN-004",
    }
    assert len(audiences) == 6
    owner = audiences[audiences["audience_id"] == "AUD-OWN-006"].iloc[0]
    assert owner["status"] == "placeholder"
    assert not owner["runtime_enabled"]


def test_reference_ids_and_campaign_names_are_governed():
    vehicles = generate_vehicle_catalogue()
    dealers = generate_dealers()
    campaigns = generate_campaign_registry()
    audiences = generate_personalisation_audience_registry()
    assert vehicles["variant_id"].is_unique
    assert dealers["dealer_id"].is_unique
    assert campaigns["campaign_id"].is_unique
    assert audiences["audience_id"].is_unique
    campaign_pattern = re.compile(r"^au_[a-z0-9_]+_2026_08$")
    assert campaigns["campaign_name"].map(
        lambda name: bool(campaign_pattern.fullmatch(name))
    ).all()
    valid_focuses = (
        set(vehicles["vehicle_model_id"])
        | set(audiences["audience_id"])
        | {"sitewide"}
    )
    assert set(campaigns["focus_id"]).issubset(valid_focuses)


def test_dbt_seeds_match_canonical_reference_registries():
    for registry_name, columns in SEED_COLUMNS.items():
        generated = load_reference_registry(registry_name).loc[:, columns]
        seed = pd.read_csv(
            REPOSITORY_ROOT / "dbt" / "seeds" / f"{registry_name}.csv"
        )
        pd.testing.assert_frame_equal(
            generated.reset_index(drop=True),
            seed.reset_index(drop=True),
            check_dtype=False,
        )


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
