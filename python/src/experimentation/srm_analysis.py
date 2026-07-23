"""Sample Ratio Mismatch utilities."""
import pandas as pd


def allocation_gap(variant_counts: pd.Series) -> float:
    """Return max-min allocation gap relative to max allocation."""
    if variant_counts.empty or variant_counts.max() == 0:
        return 0.0
    return float((variant_counts.max() - variant_counts.min()) / variant_counts.max())
