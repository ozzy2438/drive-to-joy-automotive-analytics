"""Duplicate lead detection."""
import pandas as pd


def duplicate_leads(df: pd.DataFrame) -> pd.DataFrame:
    """Return lead hashes appearing more than once."""
    counts = df.groupby("lead_id_hash", dropna=False).size().reset_index(name="count")
    return counts[counts["count"] > 1]
