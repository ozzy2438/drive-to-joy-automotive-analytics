"""Sample-size planning for two-proportion tests."""
from math import ceil
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize


def required_users_per_variant(baseline_rate: float, treatment_rate: float, power: float = 0.8, alpha: float = 0.05) -> int:
    """Estimate equal-allocation users required per variant."""
    effect_size = proportion_effectsize(treatment_rate, baseline_rate)
    result = NormalIndPower().solve_power(effect_size=effect_size, power=power, alpha=alpha, ratio=1.0, alternative="two-sided")
    return ceil(result)
