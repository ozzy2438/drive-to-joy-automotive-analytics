"""Guardrail analysis contract."""
import pandas as pd


def compare_guardrail(control: pd.Series, treatment: pd.Series) -> dict:
    """Return descriptive comparison; add inference per metric design."""
    return {
        "control_mean": float(control.mean()),
        "treatment_mean": float(treatment.mean()),
        "absolute_difference": float(treatment.mean() - control.mean()),
    }
