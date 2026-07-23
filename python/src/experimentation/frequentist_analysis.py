"""Frequentist two-proportion experiment analysis."""
from statsmodels.stats.proportion import proportions_ztest


def two_proportion_test(control_successes: int, control_total: int, treatment_successes: int, treatment_total: int):
    """Return z statistic and p value."""
    return proportions_ztest(
        count=[treatment_successes, control_successes],
        nobs=[treatment_total, control_total],
        alternative="two-sided",
    )
