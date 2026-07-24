"""Deterministic fictional vehicle catalogue generation."""

import pandas as pd

from src.data_generation.reference_data import load_reference_registry

def generate_vehicle_catalogue() -> pd.DataFrame:
    """Return fictional vehicles and variants with no Honda references."""
    return load_reference_registry("vehicle_catalogue")
