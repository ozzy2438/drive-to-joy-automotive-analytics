"""Deterministic fictional vehicle catalogue generation."""
import pandas as pd


def generate_vehicle_catalogue() -> pd.DataFrame:
    """Return fictional vehicles and variants with no Honda references."""
    rows = [
        ("Aurora SUV", "Aurora Hybrid Touring", "SUV", "hybrid", "50000_60000", 5),
        ("Aurora SUV", "Aurora Petrol Active", "SUV", "petrol", "40000_50000", 5),
        ("Coastline SUV", "Coastline Hybrid Elite", "SUV", "hybrid", "60000_70000", 7),
        ("Coastline SUV", "Coastline Petrol Touring", "SUV", "petrol", "50000_60000", 7),
        ("Metro Hatch", "Metro Hybrid Urban", "Hatch", "hybrid", "30000_40000", 5),
        ("Metro Hatch", "Metro Petrol Sport", "Hatch", "petrol", "30000_40000", 5),
        ("Solstice Sedan", "Solstice Hybrid Luxe", "Sedan", "hybrid", "50000_60000", 5),
        ("Solstice Sedan", "Solstice Petrol Touring", "Sedan", "petrol", "40000_50000", 5),
        ("Trailstar Utility", "Trailstar Diesel Work", "Utility", "diesel", "50000_60000", 5),
        ("Trailstar Utility", "Trailstar Hybrid Adventure", "Utility", "hybrid", "60000_70000", 5),
        ("Harbour EV", "Harbour EV Long Range", "SUV", "electric", "70000_plus", 5),
        ("Harbour EV", "Harbour EV City", "SUV", "electric", "60000_70000", 5),
    ]
    columns = [
        "vehicle_model",
        "vehicle_variant",
        "body_type",
        "powertrain",
        "price_band",
        "seats",
    ]
    result = pd.DataFrame(rows, columns=columns)
    result["launch_status"] = "current"
    result["data_origin"] = "synthetic"
    return result
