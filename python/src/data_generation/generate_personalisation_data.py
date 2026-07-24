"""Personalisation assignment extraction from canonical exposure events."""

from datetime import timedelta

import pandas as pd

from src.contracts.canonical import CONTRACT_VERSION


def generate_personalisation_data(events: pd.DataFrame) -> pd.DataFrame:
    """Return one stable audience assignment including generic holdouts."""
    exposures = events[events["event_name"] == "personalisation_exposure"].copy()
    if exposures.empty:
        return pd.DataFrame()
    exposures = exposures.sort_values("event_at").drop_duplicates(
        ["personalisation_assignment_id"],
        keep="first",
    )
    result = pd.DataFrame(
        {
            "schema_version": CONTRACT_VERSION,
            "personalisation_assignment_id": exposures[
                "personalisation_assignment_id"
            ],
            "audience_id": exposures["audience_id"],
            "assignment_key": exposures["user_pseudo_id"],
            "experience_id": exposures["experience_id"],
            "holdout_flag": exposures["holdout_flag"].astype(bool),
            "eligible_at": exposures["event_at"],
            "assigned_at": exposures["event_at"],
            "exposed_at": exposures["event_at"],
            "exposure_event_id": exposures["event_id"],
            "outcome_window_end_at": exposures["event_at"] + timedelta(days=14),
            "consent_analytics": exposures["consent_analytics"],
            "data_origin": "synthetic",
        }
    )
    return result.reset_index(drop=True)
