"""Tests for quality checks."""
import pandas as pd
from src.data_quality.check_event_completeness import missing_rate


def test_missing_rate():
    assert missing_rate(pd.DataFrame({"x": [1, None]}), "x") == 0.5
