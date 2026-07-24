"""Tests for experiment calculations."""
import pandas as pd

from src.experimentation.frequentist_analysis import holm_adjust
from src.experimentation.sample_size import three_arm_users_per_variant
from src.experimentation.srm_analysis import (
    allocation_gap,
    sample_ratio_mismatch,
)


def test_allocation_gap():
    assert allocation_gap(pd.Series([100, 100])) == 0.0


def test_srm_uses_registered_three_arm_allocation():
    result = sample_ratio_mismatch(
        pd.Series(
            {"control": 1_000, "treatment_a": 1_005, "treatment_b": 995}
        ),
        {"control": 1 / 3, "treatment_a": 1 / 3, "treatment_b": 1 / 3},
    )
    assert result["p_value"] > 0.05


def test_srm_detects_material_mismatch():
    result = sample_ratio_mismatch(
        pd.Series(
            {"control": 1_000, "treatment_a": 1_000, "treatment_b": 500}
        ),
        {"control": 1 / 3, "treatment_a": 1 / 3, "treatment_b": 1 / 3},
    )
    assert result["p_value"] < 0.001


def test_holm_adjust_preserves_original_order():
    assert holm_adjust([0.04, 0.01]) == [0.04, 0.02]


def test_three_arm_power_plan_is_conservative():
    planned = three_arm_users_per_variant(
        baseline_rate=0.08,
        minimum_detectable_effect_absolute=0.02,
    )
    assert planned > 0
