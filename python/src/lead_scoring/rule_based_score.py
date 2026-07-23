"""Explainable rule-based lead scoring."""
import pandas as pd

WEIGHTS = {
    "view_vehicle_model": 5,
    "compare_vehicle_models": 8,
    "configurator_start": 12,
    "configurator_complete": 20,
    "finance_calculator_complete": 15,
    "dealer_select": 15,
    "test_drive_submit": 35,
    "quote_submit": 35,
}


def score_events(events: pd.DataFrame) -> pd.DataFrame:
    """Aggregate transparent behavioural score by user/session."""
    scored = events.copy()
    scored["points"] = scored["event_name"].map(WEIGHTS).fillna(0)
    return scored.groupby(["user_pseudo_id", "session_id"], dropna=False)["points"].sum().reset_index(name="intent_score")
