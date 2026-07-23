"""Mandatory event parameter completeness checks."""
import pandas as pd


def missing_rate(df: pd.DataFrame, column: str) -> float:
    """Calculate missing proportion for a required field."""
    if len(df) == 0:
        return 0.0
    return float(df[column].isna().mean())
