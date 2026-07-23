"""Lead-score evaluation contract."""


def classify_band(score: int) -> str:
    if score <= 29:
        return "low_intent"
    if score <= 59:
        return "consideration"
    if score <= 79:
        return "high_intent"
    return "sales_ready"
