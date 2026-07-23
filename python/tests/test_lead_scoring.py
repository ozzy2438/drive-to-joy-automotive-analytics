"""Tests for lead scoring."""
from src.lead_scoring.evaluation import classify_band


def test_classify_band():
    assert classify_band(80) == "sales_ready"
