"""Synthetic CRM lead generator contract."""
import pandas as pd


def generate_crm_leads(events: pd.DataFrame, seed: int) -> pd.DataFrame:
    """Generate CRM outcomes from successful synthetic form submissions.

    Must preserve lead_id_hash joins and create qualified, disqualified,
    appointment and order outcomes with documented probabilities.
    """
    raise NotImplementedError("Implement CRM lead generation")
