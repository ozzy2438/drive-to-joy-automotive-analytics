"""Experiment assignment extraction from canonical exposure events."""
from datetime import timedelta

import pandas as pd

from src.contracts.canonical import CONTRACT_VERSION


def generate_experiment_data(events: pd.DataFrame, seed: int) -> pd.DataFrame:
    """Return one stable assignment/exposure row per user and experiment."""
    del seed
    exposures = events[events["event_name"] == "experiment_exposure"].copy()
    if exposures.empty:
        return pd.DataFrame()
    exposures = exposures.sort_values("event_at").drop_duplicates(
        ["experiment_assignment_id"],
        keep="first",
    )
    result = pd.DataFrame(
        {
            "schema_version": CONTRACT_VERSION,
            "experiment_assignment_id": exposures["experiment_assignment_id"],
            "experiment_id": exposures["experiment_id"],
            "assignment_key": exposures["user_pseudo_id"],
            "variant_id": exposures["variant_id"],
            "allocation_unit": "browser",
            "eligible_at": exposures["event_at"],
            "assigned_at": exposures["event_at"],
            "exposed_at": exposures["event_at"],
            "exposure_event_id": exposures["event_id"],
            "outcome_window_end_at": exposures["event_at"] + timedelta(days=30),
            "eligible_flag": True,
            "exclusion_reason": None,
            "consent_analytics": exposures["consent_analytics"],
            "data_origin": "synthetic",
        }
    )
    return result.reset_index(drop=True)
