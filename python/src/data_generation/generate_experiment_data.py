"""Synthetic experiment exposure and outcome generator contract."""
import pandas as pd


def generate_experiment_data(events: pd.DataFrame, seed: int) -> pd.DataFrame:
    """Generate assignment/exposure data, including one controlled SRM case."""
    raise NotImplementedError("Implement experiment data generation")
