"""Synthetic GA4-style event generator contract.

Implement deterministic event generation using a configurable random seed.
Required outputs follow data/synthetic/schema/ga4_events_schema.md.
"""

from pathlib import Path
import pandas as pd


def generate_ga4_events(seed: int, days: int = 180, sessions: int = 100_000) -> pd.DataFrame:
    """Return a behaviourally coherent synthetic GA4-style event dataset.

    Implementation must include journey relationships and controlled defects
    described in data/synthetic/synthetic_data_specification.md.
    """
    raise NotImplementedError("Implement synthetic event generation")


def save_events(df: pd.DataFrame, output: str | Path) -> None:
    Path(output).parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(output, index=False)
