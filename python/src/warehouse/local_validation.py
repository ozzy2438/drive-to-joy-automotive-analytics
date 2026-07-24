"""DuckDB checks for the generated local analytics foundation."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import duckdb

from src.contracts.canonical import CANONICAL_EVENT_COLUMNS, FORBIDDEN_PII_COLUMNS

REQUIRED_FILES = {
    "campaign_registry": "campaign_registry.parquet",
    "canonical_events": "canonical_events.parquet",
    "crm_leads": "crm_leads.parquet",
    "dealers": "dealers.parquet",
    "experiment_assignments": "experiment_assignments.parquet",
    "experiment_registry": "experiment_registry.parquet",
    "media_spend_daily": "media_spend_daily.parquet",
    "personalisation_assignments": "personalisation_assignments.parquet",
    "personalisation_audience_registry": (
        "personalisation_audience_registry.parquet"
    ),
    "raw_flat_events": "raw_flat_events.parquet",
    "vehicle_catalogue": "vehicle_catalogue.parquet",
    "web_submissions": "web_submissions.parquet",
}


def _sql_path(path: Path) -> str:
    return str(path.resolve()).replace("'", "''")


def validate_local_foundation(output_directory: str | Path) -> dict[str, Any]:
    """Validate contracts, identities and bounded outcome joins in DuckDB."""
    directory = Path(output_directory)
    missing_files = [
        filename
        for filename in REQUIRED_FILES.values()
        if not (directory / filename).is_file()
    ]
    if missing_files:
        raise FileNotFoundError(f"Missing generated foundation files: {missing_files}")

    connection = duckdb.connect(database=":memory:")
    for view_name, filename in REQUIRED_FILES.items():
        connection.execute(
            f"create view {view_name} as "
            f"select * from read_parquet('{_sql_path(directory / filename)}')"
        )

    dataset_columns = {
        view_name: {
            row[0]
            for row in connection.execute(
                f"describe select * from {view_name}"
            ).fetchall()
        }
        for view_name in REQUIRED_FILES
    }
    event_columns = dataset_columns["canonical_events"]
    privacy_safe_columns = all(
        not columns.intersection(FORBIDDEN_PII_COLUMNS)
        for columns in dataset_columns.values()
    )
    synthetic_origin_complete = all(
        connection.execute(
            f"""
            select count(*) > 0
              and count(*) = count(data_origin)
              and count(*) = count(*) filter (where data_origin = 'synthetic')
            from {view_name}
            """
        ).fetchone()[0]
        for view_name in REQUIRED_FILES
    )
    checks: dict[str, bool] = {
        "canonical_event_columns_complete": set(CANONICAL_EVENT_COLUMNS).issubset(
            event_columns
        ),
        "all_datasets_labelled_synthetic": synthetic_origin_complete,
        "no_forbidden_pii_columns": privacy_safe_columns,
        "event_ids_unique": connection.execute(
            """
            select count(*) = count(distinct event_id)
            from canonical_events
            """
        ).fetchone()[0],
        "form_starts_have_form_instance": connection.execute(
            """
            select count(*) = 0
            from canonical_events
            where event_name in ('test_drive_start', 'quote_start')
              and form_instance_id is null
            """
        ).fetchone()[0],
        "submits_have_separate_identities": connection.execute(
            """
            select count(*) = 0
            from canonical_events
            where event_name in ('test_drive_submit', 'quote_submit')
              and (
                form_instance_id is null
                or web_submission_id is null
                or lead_id_hash is null
              )
            """
        ).fetchone()[0],
        "web_submission_ids_unique": connection.execute(
            """
            select count(*) = count(distinct web_submission_id)
            from web_submissions
            """
        ).fetchone()[0],
        "crm_keys_unique": connection.execute(
            """
            select
              count(*) = count(distinct crm_lead_id)
              and count(*) = count(distinct web_submission_id)
            from crm_leads
            """
        ).fetchone()[0],
        "crm_outcomes_follow_submit": connection.execute(
            """
            select count(*) = 0
            from crm_leads c
            join web_submissions w using (web_submission_id, lead_id_hash)
            where c.lead_created_at < w.submitted_at
               or c.lead_status_updated_at < c.lead_created_at
            """
        ).fetchone()[0],
        "experiment_exposures_have_assignments": connection.execute(
            """
            select count(*) = 0
            from canonical_events e
            left join experiment_assignments a
              using (experiment_assignment_id)
            where e.event_name = 'experiment_exposure'
              and a.experiment_assignment_id is null
            """
        ).fetchone()[0],
        "experiment_outcomes_are_bounded": connection.execute(
            """
            with attributed_outcomes as (
              select
                w.submitted_at,
                a.exposed_at,
                a.outcome_window_end_at
              from web_submissions w
              join experiment_assignments a
                on w.experiment_assignment_id = a.experiment_assignment_id
               and w.user_pseudo_id = a.assignment_key
               and w.submitted_at between
                 a.exposed_at and a.outcome_window_end_at
            )
            select count(*) = 0
            from attributed_outcomes
            where submitted_at < exposed_at
               or submitted_at > outcome_window_end_at
            """
        ).fetchone()[0],
        "experiment_assignment_windows_valid": connection.execute(
            """
            select count(*) = 0
            from experiment_assignments
            where epoch(outcome_window_end_at) - epoch(exposed_at)
              != 30 * 24 * 60 * 60
            """
        ).fetchone()[0],
        "personalisation_exposures_have_assignments": connection.execute(
            """
            select count(*) = 0
            from canonical_events e
            left join personalisation_assignments a
              using (personalisation_assignment_id)
            where e.event_name = 'personalisation_exposure'
              and a.personalisation_assignment_id is null
            """
        ).fetchone()[0],
        "personalisation_outcomes_are_bounded": connection.execute(
            """
            with attributed_outcomes as (
              select
                w.submitted_at,
                a.exposed_at,
                a.outcome_window_end_at
              from web_submissions w
              join personalisation_assignments a
                on w.personalisation_assignment_id
                  = a.personalisation_assignment_id
               and w.user_pseudo_id = a.assignment_key
               and w.submitted_at between
                 a.exposed_at and a.outcome_window_end_at
            )
            select count(*) = 0
            from attributed_outcomes
            where submitted_at < exposed_at
               or submitted_at > outcome_window_end_at
            """
        ).fetchone()[0],
        "personalisation_assignment_windows_valid": connection.execute(
            """
            select count(*) = 0
            from personalisation_assignments
            where epoch(outcome_window_end_at) - epoch(exposed_at)
              != 14 * 24 * 60 * 60
            """
        ).fetchone()[0],
        "reference_vehicle_target_met": connection.execute(
            "select count(*) >= 12 from vehicle_catalogue"
        ).fetchone()[0],
        "reference_dealer_target_met": connection.execute(
            "select count(*) >= 20 from dealers"
        ).fetchone()[0],
        "reference_campaign_target_met": connection.execute(
            "select count(*) >= 10 from campaign_registry"
        ).fetchone()[0],
        "reference_experiment_target_met": connection.execute(
            "select count(*) >= 4 from experiment_registry"
        ).fetchone()[0],
        "reference_audience_target_met": connection.execute(
            "select count(*) >= 6 from personalisation_audience_registry"
        ).fetchone()[0],
        "campaign_focuses_resolve": connection.execute(
            """
            select count(*) = 0
            from campaign_registry c
            left join (
              select distinct vehicle_model_id as focus_id from vehicle_catalogue
              union all
              select audience_id from personalisation_audience_registry
              union all
              select 'sitewide'
            ) r using (focus_id)
            where r.focus_id is null
            """
        ).fetchone()[0],
        "media_campaigns_resolve": connection.execute(
            """
            select count(*) = 0
            from media_spend_daily m
            left join campaign_registry c using (campaign_id)
            where c.campaign_id is null
            """
        ).fetchone()[0],
        "only_approved_runtime_experiment_enabled": connection.execute(
            """
            select count(*) = 0
            from experiment_registry
            where runtime_enabled and experiment_id != 'EXP-CTA-001'
            """
        ).fetchone()[0],
        "owner_audience_remains_placeholder": connection.execute(
            """
            select count(*) = 1
            from personalisation_audience_registry
            where audience_id = 'AUD-OWN-006'
              and status = 'placeholder'
              and not runtime_enabled
            """
        ).fetchone()[0],
    }

    metrics = {
        "events": connection.execute(
            "select count(*) from canonical_events"
        ).fetchone()[0],
        "identified_sessions": connection.execute(
            "select count(distinct session_id) from canonical_events"
        ).fetchone()[0],
        "web_submissions": connection.execute(
            "select count(*) from web_submissions"
        ).fetchone()[0],
        "crm_leads": connection.execute("select count(*) from crm_leads").fetchone()[0],
        "crm_match_rate": connection.execute(
            """
            select coalesce(
              count(c.crm_lead_id)::double / nullif(count(*), 0),
              0
            )
            from web_submissions w
            left join crm_leads c using (web_submission_id, lead_id_hash)
            """
        ).fetchone()[0],
        "experiment_assignments": connection.execute(
            "select count(*) from experiment_assignments"
        ).fetchone()[0],
        "personalisation_assignments": connection.execute(
            "select count(*) from personalisation_assignments"
        ).fetchone()[0],
        "experiment_contexts_outside_outcome_window": connection.execute(
            """
            select count(*)
            from web_submissions w
            join experiment_assignments a
              on w.experiment_assignment_id = a.experiment_assignment_id
             and w.user_pseudo_id = a.assignment_key
            where w.submitted_at < a.exposed_at
               or w.submitted_at > a.outcome_window_end_at
            """
        ).fetchone()[0],
        "personalisation_contexts_outside_outcome_window": connection.execute(
            """
            select count(*)
            from web_submissions w
            join personalisation_assignments a
              on w.personalisation_assignment_id
                = a.personalisation_assignment_id
             and w.user_pseudo_id = a.assignment_key
            where w.submitted_at < a.exposed_at
               or w.submitted_at > a.outcome_window_end_at
            """
        ).fetchone()[0],
    }
    if metrics["web_submissions"] == 0:
        checks["web_submissions_generated"] = False
    else:
        checks["web_submissions_generated"] = True
        checks["crm_match_rate_in_expected_range"] = (
            0.80 <= metrics["crm_match_rate"] <= 1.0
        )
    connection.close()

    failures = sorted(name for name, passed in checks.items() if not passed)
    if failures:
        raise ValueError(f"Local foundation validation failed: {failures}")
    return {"checks": checks, "metrics": metrics}
