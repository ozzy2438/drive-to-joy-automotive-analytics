"""Central configuration for reproducible local utilities."""
from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    random_seed: int = int(os.getenv("DATA_GENERATION_SEED", "20260723"))
    output_dir: str = os.getenv("DATA_OUTPUT_DIR", "data/processed")


settings = Settings()
