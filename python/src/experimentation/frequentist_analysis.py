"""Frequentist two-proportion experiment analysis."""
from collections.abc import Iterable

from statsmodels.stats.proportion import proportions_ztest


def two_proportion_test(control_successes: int, control_total: int, treatment_successes: int, treatment_total: int):
    """Return z statistic and p value."""
    return proportions_ztest(
        count=[treatment_successes, control_successes],
        nobs=[treatment_total, control_total],
        alternative="two-sided",
    )


def holm_adjust(p_values: Iterable[float]) -> list[float]:
    """Adjust a confirmatory p-value family using Holm's step-down method."""
    values = [float(value) for value in p_values]
    if not values:
        return []
    if any(value < 0 or value > 1 for value in values):
        raise ValueError("p-values must be between 0 and 1")
    ordered = sorted(enumerate(values), key=lambda item: item[1])
    adjusted = [0.0] * len(values)
    running_max = 0.0
    family_size = len(values)
    for rank, (original_index, value) in enumerate(ordered):
        candidate = min(1.0, (family_size - rank) * value)
        running_max = max(running_max, candidate)
        adjusted[original_index] = running_max
    return adjusted
