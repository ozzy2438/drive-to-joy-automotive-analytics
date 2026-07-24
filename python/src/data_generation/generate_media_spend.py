"""Deterministic synthetic daily media-spend generation."""
from datetime import date, timedelta

import numpy as np
import pandas as pd

from src.data_generation.reference_data import generate_campaign_registry
from src.data_generation.generate_vehicle_catalogue import generate_vehicle_catalogue


def generate_media_spend(seed: int, days: int = 180) -> pd.DataFrame:
    """Generate daily spend, impressions and clicks by campaign/channel."""
    if days < 1:
        raise ValueError("days must be at least 1")
    rng = np.random.default_rng(seed)
    campaigns = generate_campaign_registry()
    vehicle_names = (
        generate_vehicle_catalogue()
        .drop_duplicates("vehicle_model_id")
        .set_index("vehicle_model_id")["vehicle_model"]
        .to_dict()
    )
    end_date = date(2026, 9, 30)
    rows: list[dict[str, object]] = []
    for day_offset in range(days):
        spend_date = end_date - timedelta(days=days - day_offset - 1)
        for campaign in campaigns.itertuples(index=False):
            if not (
                date.fromisoformat(campaign.active_start_date)
                <= spend_date
                <= date.fromisoformat(campaign.active_end_date)
            ):
                continue
            vehicle_model = vehicle_names.get(campaign.focus_id)
            base_spend = (
                rng.uniform(180, 1400)
                if campaign.channel in {"Paid Search", "Paid Social"}
                else 0.0
            )
            impressions = int(base_spend * rng.uniform(12, 28)) if base_spend else 0
            clicks = int(impressions * rng.uniform(0.018, 0.065)) if impressions else 0
            rows.append(
                {
                    "spend_date": spend_date,
                    "channel": campaign.channel,
                    "source": campaign.source,
                    "medium": campaign.medium,
                    "campaign_id": campaign.campaign_id,
                    "campaign_name": campaign.campaign_name,
                    "objective": campaign.objective,
                    "vehicle_model": vehicle_model,
                    "spend_aud": round(base_spend, 2),
                    "impressions": impressions,
                    "clicks": clicks,
                    "data_origin": "synthetic",
                }
            )
    return pd.DataFrame(rows)
