"""Deterministic synthetic daily media-spend generation."""
from datetime import date, timedelta

import numpy as np
import pandas as pd


def generate_media_spend(seed: int, days: int = 180) -> pd.DataFrame:
    """Generate daily spend, impressions and clicks by campaign/channel."""
    if days < 1:
        raise ValueError("days must be at least 1")
    rng = np.random.default_rng(seed)
    campaigns = [
        ("cmp_001", "Paid Search", "google", "cpc", "lead", "Aurora SUV"),
        ("cmp_002", "Paid Search", "google", "cpc", "lead", "Coastline SUV"),
        ("cmp_003", "Paid Search", "bing", "cpc", "lead", "Harbour EV"),
        ("cmp_004", "Paid Social", "meta", "paid_social", "awareness", "Metro Hatch"),
        ("cmp_005", "Paid Social", "meta", "paid_social", "lead", "Aurora SUV"),
        ("cmp_006", "Paid Video", "youtube", "cpv", "consideration", "Harbour EV"),
        ("cmp_007", "Display", "google", "display", "awareness", "Solstice Sedan"),
        ("cmp_008", "Affiliate", "partner_demo", "affiliate", "lead", "Trailstar Utility"),
        ("cmp_009", "Email", "demo_crm", "email", "nurture", "Coastline SUV"),
        ("cmp_010", "Organic Context", "google", "organic", "research", "Aurora SUV"),
    ]
    end_date = date(2026, 7, 22)
    rows: list[dict[str, object]] = []
    for day_offset in range(days):
        spend_date = end_date - timedelta(days=days - day_offset - 1)
        for campaign_id, channel, source, medium, objective, vehicle_model in campaigns:
            base_spend = 0.0 if channel == "Organic Context" else rng.uniform(180, 1400)
            impressions = int(base_spend * rng.uniform(12, 28)) if base_spend else 0
            clicks = int(impressions * rng.uniform(0.018, 0.065)) if impressions else 0
            rows.append(
                {
                    "spend_date": spend_date,
                    "channel": channel,
                    "source": source,
                    "medium": medium,
                    "campaign_id": campaign_id,
                    "campaign_name": (
                        f"au_{channel.lower().replace(' ', '_')}_{objective}_"
                        f"{vehicle_model.lower().replace(' ', '_')}_2026_07"
                    ),
                    "objective": objective,
                    "vehicle_model": vehicle_model,
                    "spend_aud": round(base_spend, 2),
                    "impressions": impressions,
                    "clicks": clicks,
                    "data_origin": "synthetic",
                }
            )
    return pd.DataFrame(rows)
