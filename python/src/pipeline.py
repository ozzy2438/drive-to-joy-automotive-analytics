"""Build the deterministic local synthetic analytics foundation."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import pandas as pd

from src.adapters.flat_synthetic import adapt_flat_synthetic_events
from src.contracts.canonical import CONTRACT_VERSION, reject_pii_columns
from src.contracts.schema_validation import validate_record, validate_schemas
from src.data_generation.generate_crm_leads import generate_crm_leads
from src.data_generation.generate_dealers import generate_dealers
from src.data_generation.generate_experiment_data import generate_experiment_data
from src.data_generation.generate_ga4_events import (
    create_controlled_defect_scenario,
    generate_ga4_events,
)
from src.data_generation.generate_media_spend import generate_media_spend
from src.data_generation.generate_personalisation_data import (
    generate_personalisation_data,
)
from src.data_generation.generate_vehicle_catalogue import generate_vehicle_catalogue
from src.data_generation.reference_data import (
    generate_campaign_registry,
    generate_experiment_registry,
    generate_personalisation_audience_registry,
)
from src.warehouse.local_validation import validate_local_foundation


def _web_submissions(events: pd.DataFrame) -> pd.DataFrame:
    submits = events[
        events["event_name"].isin(["test_drive_submit", "quote_submit"])
    ].copy()
    result = pd.DataFrame(
        {
            "schema_version": CONTRACT_VERSION,
            "form_instance_id": submits["form_instance_id"],
            "web_submission_id": submits["web_submission_id"],
            "lead_id_hash": submits["lead_id_hash"],
            "submitted_at": submits["event_at"],
            "form_type": submits["form_type"],
            "user_pseudo_id": submits["user_pseudo_id"],
            "session_id": submits["session_id"],
            "vehicle_model": submits["vehicle_model"],
            "dealer_id": submits["dealer_id"],
            "experiment_assignment_id": submits["experiment_assignment_id"],
            "personalisation_assignment_id": submits[
                "personalisation_assignment_id"
            ],
            "data_origin": "synthetic",
        }
    )
    return result.reset_index(drop=True)


def _write_parquet(frame: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frame.to_parquet(path, index=False)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _validate_contract_samples(
    canonical_events: pd.DataFrame,
    web_submissions: pd.DataFrame,
    crm_leads: pd.DataFrame,
    experiment_assignments: pd.DataFrame,
    personalisation_assignments: pd.DataFrame,
) -> None:
    validate_schemas()
    samples = [
        ("canonical_event.schema.json", canonical_events),
        ("web_submission.schema.json", web_submissions),
        ("canonical_crm_lead.schema.json", crm_leads),
        ("experiment_assignment.schema.json", experiment_assignments),
        ("personalisation_assignment.schema.json", personalisation_assignments),
    ]
    for schema_name, frame in samples:
        if frame.empty:
            continue
        for record in frame.head(10).to_dict(orient="records"):
            validate_record(schema_name, record)


def _validate_synthetic_boundaries(
    datasets: dict[str, pd.DataFrame],
) -> None:
    """Reject unlabeled data, PII-shaped fields and proprietary brand claims."""
    email_pattern = r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"
    for filename, frame in datasets.items():
        reject_pii_columns(frame.columns)
        if "data_origin" not in frame.columns:
            raise ValueError(f"{filename} is missing data_origin")
        if set(frame["data_origin"].dropna()) != {"synthetic"}:
            raise ValueError(f"{filename} contains a non-synthetic data origin")
        for column in frame.select_dtypes(include=["object", "string"]).columns:
            values = frame[column].dropna().astype(str)
            if values.str.contains(email_pattern, regex=True).any():
                raise ValueError(f"{filename}.{column} contains an email address")
            if values.str.contains(r"(?i)\bhonda\b", regex=True).any():
                raise ValueError(
                    f"{filename}.{column} contains a prohibited Honda claim"
                )


def build_local_foundation(
    *,
    output_directory: str | Path,
    seed: int = 20260723,
    days: int = 30,
    sessions: int = 1_000,
    include_controlled_defects: bool = True,
) -> dict[str, Any]:
    """Generate, validate and describe the local synthetic foundation."""
    output = Path(output_directory)
    output.mkdir(parents=True, exist_ok=True)

    raw_events = generate_ga4_events(seed=seed, days=days, sessions=sessions)
    canonical_events = adapt_flat_synthetic_events(raw_events)
    web_submissions = _web_submissions(canonical_events)
    crm_leads = generate_crm_leads(canonical_events, seed=seed + 1)
    experiment_assignments = generate_experiment_data(
        canonical_events,
        seed=seed + 2,
    )
    personalisation_assignments = generate_personalisation_data(canonical_events)
    vehicle_catalogue = generate_vehicle_catalogue()
    dealers = generate_dealers()
    campaign_registry = generate_campaign_registry()
    experiment_registry = generate_experiment_registry()
    personalisation_audience_registry = (
        generate_personalisation_audience_registry()
    )
    media_spend = generate_media_spend(seed=seed + 3, days=days)

    datasets = {
        "raw_flat_events.parquet": raw_events,
        "canonical_events.parquet": canonical_events,
        "web_submissions.parquet": web_submissions,
        "crm_leads.parquet": crm_leads,
        "experiment_assignments.parquet": experiment_assignments,
        "personalisation_assignments.parquet": personalisation_assignments,
        "vehicle_catalogue.parquet": vehicle_catalogue,
        "dealers.parquet": dealers,
        "campaign_registry.parquet": campaign_registry,
        "experiment_registry.parquet": experiment_registry,
        "personalisation_audience_registry.parquet": (
            personalisation_audience_registry
        ),
        "media_spend_daily.parquet": media_spend,
    }
    _validate_synthetic_boundaries(datasets)
    for filename, frame in datasets.items():
        _write_parquet(frame, output / filename)

    if include_controlled_defects:
        defect_source, defect_registry = create_controlled_defect_scenario(raw_events)
        defect_events = adapt_flat_synthetic_events(defect_source)
        _write_parquet(
            defect_events,
            output / "canonical_events_controlled_defects.parquet",
        )
        _write_parquet(defect_registry, output / "controlled_defect_registry.parquet")

    _validate_contract_samples(
        canonical_events,
        web_submissions,
        crm_leads,
        experiment_assignments,
        personalisation_assignments,
    )
    validation = validate_local_foundation(output)

    generated_files = sorted(output.glob("*.parquet"))
    manifest = {
        "contract_version": CONTRACT_VERSION,
        "data_origin": "synthetic",
        "disclosure": (
            "Synthetic demonstration data. Not Honda Australia data or "
            "performance."
        ),
        "configuration": {
            "seed": seed,
            "days": days,
            "sessions_requested": sessions,
            "controlled_defects_in_separate_dataset": include_controlled_defects,
        },
        "files": {
            path.name: {
                "sha256": _sha256(path),
                "bytes": path.stat().st_size,
            }
            for path in generated_files
        },
        "validation": validation,
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    return manifest


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Build the Drive to Joy local synthetic foundation."
    )
    parser.add_argument("--output", required=True)
    parser.add_argument("--seed", type=int, default=20260723)
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--sessions", type=int, default=1_000)
    parser.add_argument(
        "--without-controlled-defects",
        action="store_true",
        help="Skip the separately labelled controlled-defect dataset.",
    )
    return parser


def main() -> None:
    args = _parser().parse_args()
    manifest = build_local_foundation(
        output_directory=args.output,
        seed=args.seed,
        days=args.days,
        sessions=args.sessions,
        include_controlled_defects=not args.without_controlled_defects,
    )
    print(json.dumps(manifest["validation"], indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
