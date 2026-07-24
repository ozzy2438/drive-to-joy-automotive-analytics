"""Synthetic CRM lead outcome generation from accepted web submissions."""
from datetime import timedelta

import numpy as np
import pandas as pd

from src.contracts.canonical import CONTRACT_VERSION, stable_id


def generate_crm_leads(events: pd.DataFrame, seed: int) -> pd.DataFrame:
    """Generate CRM outcomes from successful synthetic form submissions.

    Preserve submission and lead keys while keeping form submit and CRM
    qualification as distinct outcomes.
    """
    rng = np.random.default_rng(seed)
    submits = events[
        events["event_name"].isin(["test_drive_submit", "quote_submit"])
    ].copy()
    if submits.empty:
        return pd.DataFrame(
            columns=[
                "schema_version",
                "crm_lead_id",
                "web_submission_id",
                "lead_id_hash",
                "web_submit_at",
                "lead_created_at",
                "lead_status",
                "lead_status_updated_at",
                "vehicle_model_interest",
                "dealer_id",
                "disqualification_reason",
                "appointment_booked_at",
                "appointment_attended_flag",
                "vehicle_ordered_flag",
                "order_value_band",
                "data_origin",
            ]
        )

    event_time_column = "event_at" if "event_at" in submits else "event_timestamp"
    session_signals = (
        events.assign(
            configurator_complete_flag=(
                events["event_name"] == "configurator_complete"
            ).astype(int),
            finance_complete_flag=(
                events["event_name"] == "finance_calculator_complete"
            ).astype(int),
            dealer_select_flag=(events["event_name"] == "dealer_select").astype(int),
        )
        .groupby("session_id", dropna=False)[
            [
                "configurator_complete_flag",
                "finance_complete_flag",
                "dealer_select_flag",
            ]
        ]
        .max()
    )
    rows: list[dict[str, object]] = []
    for submit in submits.itertuples(index=False):
        if rng.random() > 0.92:
            continue
        session_id = getattr(submit, "session_id")
        signals = (
            session_signals.loc[session_id]
            if session_id in session_signals.index
            else pd.Series(dtype=float)
        )
        qualification_probability = (
            0.38
            + 0.15 * float(signals.get("configurator_complete_flag", 0))
            + 0.08 * float(signals.get("finance_complete_flag", 0))
            + 0.10 * float(signals.get("dealer_select_flag", 0))
        )
        qualified = rng.random() < min(qualification_probability, 0.82)
        submitted_at = pd.Timestamp(getattr(submit, event_time_column))
        created_at = submitted_at + timedelta(minutes=int(rng.integers(2, 75)))
        appointment_booked_at = None
        attended = False
        ordered = False
        disqualification_reason = None
        order_value_band = None
        status = "qualified" if qualified else "disqualified"
        status_at = created_at + timedelta(hours=int(rng.integers(2, 72)))
        if qualified and rng.random() < 0.58:
            appointment_booked_at = status_at + timedelta(
                days=int(rng.integers(1, 8))
            )
            status = "appointment_booked"
            status_at = appointment_booked_at
            if rng.random() < 0.72:
                attended = True
                status = "attended"
                status_at = appointment_booked_at + timedelta(hours=2)
                if rng.random() < 0.24:
                    ordered = True
                    status = "ordered"
                    status_at += timedelta(days=int(rng.integers(1, 15)))
                    order_value_band = str(
                        rng.choice(
                            [
                                "40000_50000",
                                "50000_60000",
                                "60000_70000",
                                "70000_plus",
                            ]
                        )
                    )
        elif not qualified:
            disqualification_reason = str(
                rng.choice(
                    [
                        "duplicate",
                        "invalid",
                        "uncontactable",
                        "out_of_area",
                        "low_intent",
                        "existing_customer",
                    ],
                    p=[0.16, 0.14, 0.22, 0.08, 0.34, 0.06],
                )
            )
        rows.append(
            {
                "schema_version": CONTRACT_VERSION,
                "crm_lead_id": stable_id(
                    "crm",
                    getattr(submit, "web_submission_id"),
                ),
                "web_submission_id": getattr(submit, "web_submission_id"),
                "lead_id_hash": getattr(submit, "lead_id_hash"),
                "web_submit_at": submitted_at,
                "lead_created_at": created_at,
                "lead_status": status,
                "lead_status_updated_at": status_at,
                "vehicle_model_interest": getattr(submit, "vehicle_model"),
                "dealer_id": getattr(submit, "dealer_id"),
                "disqualification_reason": disqualification_reason,
                "appointment_booked_at": appointment_booked_at,
                "appointment_attended_flag": attended,
                "vehicle_ordered_flag": ordered,
                "order_value_band": order_value_band,
                "data_origin": "synthetic",
            }
        )
    return pd.DataFrame(rows)
