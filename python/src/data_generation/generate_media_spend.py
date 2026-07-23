"""Synthetic daily media-spend generator contract."""
import pandas as pd


def generate_media_spend(seed: int, days: int = 180) -> pd.DataFrame:
    """Generate daily spend, impressions and clicks by campaign/channel."""
    raise NotImplementedError("Implement media generation")
