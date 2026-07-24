"""Deterministic fictional dealer dimension generation."""

import pandas as pd

from src.data_generation.reference_data import load_reference_registry

def generate_dealers() -> pd.DataFrame:
    """Return a fictional multi-state dealer network."""
    return load_reference_registry("dealers")
