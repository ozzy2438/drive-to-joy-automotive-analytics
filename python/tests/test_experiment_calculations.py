"""Tests for experiment calculations."""
from src.experimentation.srm_analysis import allocation_gap


def test_allocation_gap():
    import pandas as pd
    assert allocation_gap(pd.Series([100, 100])) == 0.0
