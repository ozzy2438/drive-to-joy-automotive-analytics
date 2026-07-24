"""Deterministic fictional dealer dimension generation."""
import pandas as pd


def generate_dealers() -> pd.DataFrame:
    """Return a fictional multi-state dealer network."""
    locations = [
        ("NSW-001", "AstraDrive Sydney Central", "NSW", "metro", "high"),
        ("NSW-002", "AstraDrive Parramatta East", "NSW", "metro", "medium"),
        ("NSW-003", "AstraDrive Newcastle Coast", "NSW", "regional", "medium"),
        ("NSW-004", "AstraDrive Riverina", "NSW", "regional", "low"),
        ("VIC-001", "AstraDrive Melbourne North", "VIC", "metro", "high"),
        ("VIC-002", "AstraDrive Bayside", "VIC", "metro", "medium"),
        ("VIC-003", "AstraDrive Geelong", "VIC", "regional", "medium"),
        ("VIC-004", "AstraDrive Ballarat", "VIC", "regional", "low"),
        ("QLD-001", "AstraDrive Brisbane West", "QLD", "metro", "high"),
        ("QLD-002", "AstraDrive Gold Coast", "QLD", "metro", "medium"),
        ("QLD-003", "AstraDrive Sunshine Coast", "QLD", "regional", "medium"),
        ("QLD-004", "AstraDrive Townsville", "QLD", "regional", "low"),
        ("SA-001", "AstraDrive Adelaide Central", "SA", "metro", "medium"),
        ("SA-002", "AstraDrive Adelaide Hills", "SA", "regional", "low"),
        ("WA-001", "AstraDrive Perth Coast", "WA", "metro", "high"),
        ("WA-002", "AstraDrive Fremantle", "WA", "metro", "medium"),
        ("TAS-001", "AstraDrive Hobart", "TAS", "metro", "low"),
        ("TAS-002", "AstraDrive Launceston", "TAS", "regional", "low"),
        ("ACT-001", "AstraDrive Canberra", "ACT", "metro", "medium"),
        ("NT-001", "AstraDrive Darwin", "NT", "regional", "low"),
    ]
    result = pd.DataFrame(
        locations,
        columns=[
            "dealer_id",
            "dealer_name",
            "state",
            "region_type",
            "capacity_band",
        ],
    )
    result["active_flag"] = True
    result["data_origin"] = "synthetic"
    return result
