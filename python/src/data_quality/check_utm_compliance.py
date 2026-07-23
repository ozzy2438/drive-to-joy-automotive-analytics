"""Campaign governance checks."""
import pandas as pd


def invalid_paid_campaigns(df: pd.DataFrame) -> pd.DataFrame:
    """Return paid campaigns missing required source/medium/campaign metadata."""
    required = ["source", "medium", "campaign_id"]
    paid = df[df["channel"].astype(str).str.startswith("Paid")].copy()
    return paid[paid[required].isna().any(axis=1)]
