"""Sample Ratio Mismatch utilities."""
from collections.abc import Mapping

import pandas as pd
from scipy.stats import chisquare


def allocation_gap(variant_counts: pd.Series) -> float:
    """Return a descriptive max-min allocation gap for triage only."""
    if variant_counts.empty or variant_counts.max() == 0:
        return 0.0
    return float((variant_counts.max() - variant_counts.min()) / variant_counts.max())


def sample_ratio_mismatch(
    variant_counts: pd.Series,
    planned_allocations: Mapping[str, float],
) -> dict[str, float]:
    """Run chi-square goodness-of-fit against registered allocations."""
    if variant_counts.empty:
        raise ValueError("variant_counts must not be empty")
    if (variant_counts < 0).any():
        raise ValueError("variant_counts must be non-negative")
    if set(variant_counts.index) != set(planned_allocations):
        raise ValueError("Observed and planned variant labels must match")
    allocation_total = sum(planned_allocations.values())
    if abs(allocation_total - 1.0) > 1e-9:
        raise ValueError("Planned allocations must sum to 1")
    ordered_labels = list(planned_allocations)
    observed = [float(variant_counts[label]) for label in ordered_labels]
    total = sum(observed)
    if total == 0:
        raise ValueError("Observed allocation total must be positive")
    expected = [total * planned_allocations[label] for label in ordered_labels]
    statistic, p_value = chisquare(f_obs=observed, f_exp=expected)
    return {"chi_square": float(statistic), "p_value": float(p_value)}
