"""Segment analysis contract."""
import pandas as pd


def segment_rates(df: pd.DataFrame, segment: str, outcome: str) -> pd.DataFrame:
    """Return outcome rates by segment and variant when present."""
    return df.groupby([segment, "variant_id"], dropna=False)[outcome].mean().reset_index(name=f"{outcome}_rate")
