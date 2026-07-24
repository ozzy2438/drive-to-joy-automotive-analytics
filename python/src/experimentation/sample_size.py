"""Sample-size planning for two-proportion tests."""
from math import ceil
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize


def required_users_per_variant(baseline_rate: float, treatment_rate: float, power: float = 0.8, alpha: float = 0.05) -> int:
    """Estimate equal-allocation users required per variant."""
    effect_size = proportion_effectsize(treatment_rate, baseline_rate)
    result = NormalIndPower().solve_power(effect_size=effect_size, power=power, alpha=alpha, ratio=1.0, alternative="two-sided")
    return ceil(result)


def three_arm_users_per_variant(
    baseline_rate: float,
    minimum_detectable_effect_absolute: float,
    power: float = 0.8,
    family_alpha: float = 0.05,
) -> int:
    """Plan equal three-arm size with conservative Bonferroni alpha.

    EXP-CTA-001 makes two confirmatory treatment-control comparisons. Final
    analysis uses Holm adjustment; planning divides family alpha by two.
    """
    if minimum_detectable_effect_absolute <= 0:
        raise ValueError("minimum_detectable_effect_absolute must be positive")
    treatment_rate = baseline_rate + minimum_detectable_effect_absolute
    if treatment_rate >= 1:
        raise ValueError("baseline plus minimum detectable effect must be below 1")
    return required_users_per_variant(
        baseline_rate=baseline_rate,
        treatment_rate=treatment_rate,
        power=power,
        alpha=family_alpha / 2,
    )
