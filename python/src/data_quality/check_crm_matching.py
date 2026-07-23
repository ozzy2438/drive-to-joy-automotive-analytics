"""CRM matching checks."""
import pandas as pd


def crm_match_rate(leads: pd.DataFrame) -> float:
    """Calculate matched share when crm_matched_flag exists."""
    if len(leads) == 0:
        return 0.0
    return float(leads["crm_matched_flag"].mean())
