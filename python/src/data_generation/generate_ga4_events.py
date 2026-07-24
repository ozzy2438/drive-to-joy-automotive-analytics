"""Deterministic flat synthetic event generation."""

from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd

from src.contracts.canonical import CONTRACT_VERSION, stable_id
from src.data_generation.generate_dealers import generate_dealers
from src.data_generation.generate_vehicle_catalogue import generate_vehicle_catalogue
from src.data_generation.reference_data import generate_campaign_registry


def _variant_for_user(user_pseudo_id: str) -> str:
    bucket = int(stable_id("bucket", user_pseudo_id, "EXP-CTA-001").split("_")[1][:8], 16)
    return ("control", "treatment_a", "treatment_b")[bucket % 3]


def _personalisation_for_user(user_pseudo_id: str) -> tuple[str, bool]:
    bucket = int(
        stable_id("bucket", user_pseudo_id, "AUD-RET-004").split("_")[1][:8],
        16,
    )
    return (
        ("generic_holdout", True)
        if bucket % 5 == 0
        else ("recent_journey_next_step", False)
    )


def generate_ga4_events(seed: int, days: int = 180, sessions: int = 100_000) -> pd.DataFrame:
    """Return behaviourally coherent, privacy-safe flat source events."""
    if days < 1:
        raise ValueError("days must be at least 1")
    if sessions < 1:
        raise ValueError("sessions must be at least 1")

    rng = np.random.default_rng(seed)
    vehicles = generate_vehicle_catalogue()
    dealers = generate_dealers()
    campaigns = generate_campaign_registry().assign(
        active_start_date=lambda frame: pd.to_datetime(
            frame["active_start_date"]
        ).dt.date,
        active_end_date=lambda frame: pd.to_datetime(
            frame["active_end_date"]
        ).dt.date,
    )
    model_rows = vehicles.groupby("vehicle_model", sort=True).first().reset_index()
    campaign_channels = [
        "Paid Search",
        "Paid Social",
        "Organic Search",
        "Direct",
    ]
    campaign_channel_probabilities = [0.34, 0.22, 0.27, 0.17]
    end_date = date(2026, 9, 30)
    user_pool_size = max(1, int(sessions * 0.72))
    rows: list[dict[str, object]] = []

    def add_event(
        *,
        session_index: int,
        sequence: int,
        event_at: datetime,
        event_name: str,
        user_pseudo_id: str | None,
        session_id: str | None,
        base_context: dict[str, object],
        **context: object,
    ) -> int:
        event_id = stable_id("evt", seed, session_index, sequence, event_name)
        row = {
            "event_id": event_id,
            "event_date": event_at.date(),
            "event_timestamp": event_at,
            "event_name": event_name,
            "user_pseudo_id": user_pseudo_id,
            "session_id": session_id,
            **base_context,
            **context,
        }
        rows.append(row)
        return sequence + 1

    for session_index in range(sessions):
        user_index = int(rng.integers(0, user_pool_size))
        user_pseudo_id = stable_id("usr", seed, user_index)
        session_id = stable_id("ses", seed, session_index)
        offset_days = int(rng.integers(0, days))
        event_day = end_date - timedelta(days=offset_days)
        start_seconds = int(rng.integers(7 * 3600, 22 * 3600))
        event_at = datetime.combine(
            event_day,
            time.min,
            tzinfo=timezone.utc,
        ) + timedelta(seconds=start_seconds)
        device_category = str(
            rng.choice(["mobile", "desktop", "tablet"], p=[0.58, 0.37, 0.05])
        )
        analytics_consent = str(
            rng.choice(["granted", "denied"], p=[0.84, 0.16])
        )
        marketing_consent = (
            str(rng.choice(["granted", "denied"], p=[0.62, 0.38]))
            if analytics_consent == "granted"
            else "denied"
        )
        selected_channel = str(
            rng.choice(
                campaign_channels,
                p=campaign_channel_probabilities,
            )
        )
        eligible_campaigns = campaigns[
            (campaigns["channel"] == selected_channel)
            & (campaigns["active_start_date"] <= event_day)
            & (campaigns["active_end_date"] >= event_day)
            & (campaigns["governance_status"] == "approved")
        ]
        if eligible_campaigns.empty:
            source, medium, campaign_id, campaign_name = (
                ("direct", "none", None, None)
                if selected_channel == "Direct"
                else ("google", "organic", None, None)
            )
        else:
            campaign = eligible_campaigns.iloc[
                int(rng.integers(0, len(eligible_campaigns)))
            ]
            source = str(campaign["source"])
            medium = str(campaign["medium"])
            campaign_id = str(campaign["campaign_id"])
            campaign_name = str(campaign["campaign_name"])
        base_context: dict[str, object] = {
            "schema_version": CONTRACT_VERSION,
            "data_origin": "synthetic",
            "page_type": None,
            "journey_stage": None,
            "device_category": device_category,
            "traffic_source": source,
            "traffic_medium": medium,
            "campaign_id": campaign_id,
            "campaign_name": campaign_name,
            "entry_point": None,
            "comparison_model": None,
            "specification_section": None,
            "offer_id": None,
            "cta_id": None,
            "vehicle_model": None,
            "vehicle_variant": None,
            "powertrain": None,
            "configurator_id": None,
            "configurator_step": None,
            "configurator_value_band": None,
            "colour_id": None,
            "option_ids": None,
            "loan_term_months": None,
            "repayment_band": None,
            "dealer_id": None,
            "dealer_state": None,
            "search_method": None,
            "form_type": None,
            "form_instance_id": None,
            "web_submission_id": None,
            "lead_id_hash": None,
            "form_field": None,
            "form_error_type": None,
            "form_completion_time_seconds": None,
            "form_error_count": None,
            "experiment_id": None,
            "experiment_assignment_id": None,
            "variant_id": None,
            "audience_id": None,
            "personalisation_assignment_id": None,
            "experience_id": None,
            "holdout_flag": None,
            "consent_analytics": analytics_consent,
            "consent_marketing": marketing_consent,
            "cmp_version": "cmp_demo_1",
            "lead_status": None,
            "order_value_band": None,
        }
        sequence = 1
        sequence = add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name="consent_update",
            user_pseudo_id=user_pseudo_id if analytics_consent == "granted" else None,
            session_id=session_id if analytics_consent == "granted" else None,
            base_context=base_context,
            page_type="consent",
            journey_stage="discover",
        )
        if analytics_consent != "granted":
            continue

        event_at += timedelta(seconds=1)
        sequence = add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name="session_start",
            user_pseudo_id=user_pseudo_id,
            session_id=session_id,
            base_context=base_context,
            page_type="homepage",
            journey_stage="discover",
        )
        event_at += timedelta(seconds=int(rng.integers(2, 12)))
        sequence = add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name="view_homepage",
            user_pseudo_id=user_pseudo_id,
            session_id=session_id,
            base_context=base_context,
            page_type="homepage",
            journey_stage="discover",
        )
        if rng.random() > 0.82:
            continue

        selected = model_rows.iloc[int(rng.integers(0, len(model_rows)))]
        model = str(selected["vehicle_model"])
        variant = str(selected["vehicle_variant"])
        powertrain = str(selected["powertrain"])
        experiment_assignment_id = stable_id(
            "exa",
            user_pseudo_id,
            "EXP-CTA-001",
        )
        experiment_variant = _variant_for_user(user_pseudo_id)
        event_at += timedelta(seconds=int(rng.integers(4, 35)))
        sequence = add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name="view_vehicle_model",
            user_pseudo_id=user_pseudo_id,
            session_id=session_id,
            base_context=base_context,
            page_type="vehicle_model",
            journey_stage="research",
            vehicle_model=model,
            vehicle_variant=variant,
            powertrain=powertrain,
            experiment_id="EXP-CTA-001",
            experiment_assignment_id=experiment_assignment_id,
            variant_id=experiment_variant,
        )
        event_at += timedelta(milliseconds=150)
        sequence = add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name="experiment_exposure",
            user_pseudo_id=user_pseudo_id,
            session_id=session_id,
            base_context=base_context,
            page_type="vehicle_model",
            journey_stage="research",
            vehicle_model=model,
            experiment_id="EXP-CTA-001",
            experiment_assignment_id=experiment_assignment_id,
            variant_id=experiment_variant,
        )

        personalisation_assignment_id = None
        audience_id = None
        experience_id = None
        holdout_flag = None
        if user_index < sessions * 0.22:
            audience_id = "AUD-RET-004"
            experience_id, holdout_flag = _personalisation_for_user(user_pseudo_id)
            personalisation_assignment_id = stable_id(
                "psa",
                user_pseudo_id,
                audience_id,
            )
            event_at += timedelta(milliseconds=150)
            sequence = add_event(
                session_index=session_index,
                sequence=sequence,
                event_at=event_at,
                event_name="personalisation_exposure",
                user_pseudo_id=user_pseudo_id,
                session_id=session_id,
                base_context=base_context,
                page_type="vehicle_model",
                journey_stage="research",
                vehicle_model=model,
                audience_id=audience_id,
                personalisation_assignment_id=personalisation_assignment_id,
                experience_id=experience_id,
                holdout_flag=holdout_flag,
                experiment_id="EXP-CTA-001",
                experiment_assignment_id=experiment_assignment_id,
                variant_id=experiment_variant,
            )

        journey_context = {
            "vehicle_model": model,
            "vehicle_variant": variant,
            "powertrain": powertrain,
            "experiment_id": "EXP-CTA-001",
            "experiment_assignment_id": experiment_assignment_id,
            "variant_id": experiment_variant,
            "audience_id": audience_id,
            "personalisation_assignment_id": personalisation_assignment_id,
            "experience_id": experience_id,
            "holdout_flag": holdout_flag,
        }
        high_intent_score = 0.0
        if rng.random() < 0.34:
            configurator_id = stable_id("cfg", session_id, model)
            event_at += timedelta(seconds=int(rng.integers(10, 90)))
            sequence = add_event(
                session_index=session_index,
                sequence=sequence,
                event_at=event_at,
                event_name="configurator_start",
                user_pseudo_id=user_pseudo_id,
                session_id=session_id,
                base_context=base_context,
                page_type="configurator",
                journey_stage="configure",
                configurator_id=configurator_id,
                entry_point="vehicle_model_primary",
                **journey_context,
            )
            high_intent_score += 0.12
            if rng.random() < 0.61:
                event_at += timedelta(seconds=int(rng.integers(45, 420)))
                sequence = add_event(
                    session_index=session_index,
                    sequence=sequence,
                    event_at=event_at,
                    event_name="configurator_complete",
                    user_pseudo_id=user_pseudo_id,
                    session_id=session_id,
                    base_context=base_context,
                    page_type="configurator",
                    journey_stage="configure",
                    configurator_id=configurator_id,
                    configurator_step="complete",
                    configurator_value_band=str(selected["price_band"]),
                    **journey_context,
                )
                high_intent_score += 0.18

        if rng.random() < 0.24 + high_intent_score / 3:
            event_at += timedelta(seconds=int(rng.integers(8, 80)))
            sequence = add_event(
                session_index=session_index,
                sequence=sequence,
                event_at=event_at,
                event_name="finance_calculator_start",
                user_pseudo_id=user_pseudo_id,
                session_id=session_id,
                base_context=base_context,
                page_type="finance_calculator",
                journey_stage="evaluate",
                entry_point="vehicle_model_finance",
                **journey_context,
            )
            if rng.random() < 0.72:
                event_at += timedelta(seconds=int(rng.integers(20, 180)))
                sequence = add_event(
                    session_index=session_index,
                    sequence=sequence,
                    event_at=event_at,
                    event_name="finance_calculator_complete",
                    user_pseudo_id=user_pseudo_id,
                    session_id=session_id,
                    base_context=base_context,
                    page_type="finance_calculator",
                    journey_stage="evaluate",
                    loan_term_months=60,
                    repayment_band="illustrative_mid",
                    **journey_context,
                )
                high_intent_score += 0.12

        selected_dealer = None
        if rng.random() < 0.27 + high_intent_score / 2:
            selected_dealer = dealers.iloc[int(rng.integers(0, len(dealers)))]
            event_at += timedelta(seconds=int(rng.integers(6, 75)))
            sequence = add_event(
                session_index=session_index,
                sequence=sequence,
                event_at=event_at,
                event_name="dealer_select",
                user_pseudo_id=user_pseudo_id,
                session_id=session_id,
                base_context=base_context,
                page_type="dealer_locator",
                journey_stage="evaluate",
                dealer_id=str(selected_dealer["dealer_id"]),
                dealer_state=str(selected_dealer["state"]),
                search_method="state_filter",
                **journey_context,
            )
            high_intent_score += 0.15

        form_probability = 0.08 + high_intent_score
        if rng.random() >= min(form_probability, 0.72):
            continue
        form_type = "test_drive" if rng.random() < 0.64 else "quote"
        form_instance_id = stable_id("frm", seed, session_index, form_type)
        event_at += timedelta(seconds=int(rng.integers(5, 90)))
        sequence = add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name=f"{form_type}_start",
            user_pseudo_id=user_pseudo_id,
            session_id=session_id,
            base_context=base_context,
            page_type=f"{form_type}_form",
            journey_stage="convert",
            form_type=form_type,
            form_instance_id=form_instance_id,
            dealer_id=(
                str(selected_dealer["dealer_id"])
                if selected_dealer is not None
                else None
            ),
            dealer_state=(
                str(selected_dealer["state"])
                if selected_dealer is not None
                else None
            ),
            **journey_context,
        )
        error_probability = 0.31 if device_category == "mobile" else 0.14
        form_error_count = 0
        if rng.random() < error_probability:
            form_error_count = 1
            event_at += timedelta(seconds=int(rng.integers(4, 35)))
            sequence = add_event(
                session_index=session_index,
                sequence=sequence,
                event_at=event_at,
                event_name="form_error",
                user_pseudo_id=user_pseudo_id,
                session_id=session_id,
                base_context=base_context,
                page_type=f"{form_type}_form",
                journey_stage="convert",
                form_type=form_type,
                form_instance_id=form_instance_id,
                form_field="contact_preference",
                form_error_type="required",
                form_error_count=form_error_count,
                dealer_id=(
                    str(selected_dealer["dealer_id"])
                    if selected_dealer is not None
                    else None
                ),
                dealer_state=(
                    str(selected_dealer["state"])
                    if selected_dealer is not None
                    else None
                ),
                **journey_context,
            )
        completion_probability = 0.69 if device_category == "mobile" else 0.79
        if rng.random() >= completion_probability:
            continue
        web_submission_id = stable_id("sub", seed, session_index, form_type)
        lead_id_hash = stable_id("lead", web_submission_id, "analytics-demo")
        completion_seconds = int(rng.integers(12, 160))
        event_at += timedelta(seconds=completion_seconds)
        add_event(
            session_index=session_index,
            sequence=sequence,
            event_at=event_at,
            event_name=f"{form_type}_submit",
            user_pseudo_id=user_pseudo_id,
            session_id=session_id,
            base_context=base_context,
            page_type=f"{form_type}_form",
            journey_stage="convert",
            form_type=form_type,
            form_instance_id=form_instance_id,
            web_submission_id=web_submission_id,
            lead_id_hash=lead_id_hash,
            form_completion_time_seconds=completion_seconds,
            form_error_count=form_error_count,
            dealer_id=(
                str(selected_dealer["dealer_id"])
                if selected_dealer is not None
                else None
            ),
            dealer_state=(
                str(selected_dealer["state"])
                if selected_dealer is not None
                else None
            ),
            **journey_context,
        )

    return pd.DataFrame(rows)


def create_controlled_defect_scenario(
    events: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Create a separately labelled defect dataset and traceability registry."""
    result = events.copy()
    defects: list[dict[str, object]] = []
    candidate = result.index[result["event_name"] == "view_vehicle_model"]
    if len(candidate):
        row_index = int(candidate[0])
        event_id = str(result.at[row_index, "event_id"])
        result.at[row_index, "vehicle_model"] = None
        defects.append(
            {
                "record_type": "event",
                "record_id": event_id,
                "check_name": "missing_required_vehicle_model",
                "expected_result": "fail",
                "data_origin": "synthetic",
            }
        )
    submit_candidates = result.index[
        result["event_name"].isin(["test_drive_submit", "quote_submit"])
    ]
    if len(submit_candidates):
        source_index = int(submit_candidates[0])
        duplicate = result.loc[source_index].copy()
        duplicate["event_id"] = stable_id(
            "evt",
            duplicate["event_id"],
            "controlled_duplicate",
        )
        result = pd.concat([result, duplicate.to_frame().T], ignore_index=True)
        defects.append(
            {
                "record_type": "web_submission",
                "record_id": duplicate["web_submission_id"],
                "check_name": "duplicate_conversion",
                "expected_result": "fail",
                "data_origin": "synthetic",
            }
        )
    return result, pd.DataFrame(defects)


def save_events(df: pd.DataFrame, output: str | Path) -> None:
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(output, index=False)
