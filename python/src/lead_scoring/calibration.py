"""Lead score calibration contract."""
import pandas as pd


def qualification_rate_by_band(df: pd.DataFrame, score_column: str = "intent_score") -> pd.DataFrame:
    """Compare score bands with observed qualified-lead outcome."""
    bins = [-1, 29, 59, 79, float("inf")]
    labels = ["low_intent", "consideration", "high_intent", "sales_ready"]
    result = df.copy()
    result["score_band"] = pd.cut(result[score_column], bins=bins, labels=labels)
    return result.groupby("score_band", observed=False)["qualified_lead_flag"].mean().reset_index(name="qualified_lead_rate")
