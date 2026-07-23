"""Event anomaly detection utilities."""
import pandas as pd


def z_score_anomalies(series: pd.Series, threshold: float = 3.0) -> pd.Series:
    """Return boolean anomaly flags using z-score; handle zero variance safely."""
    std = series.std()
    if std == 0 or pd.isna(std):
        return pd.Series(False, index=series.index)
    return ((series - series.mean()) / std).abs() >= threshold
