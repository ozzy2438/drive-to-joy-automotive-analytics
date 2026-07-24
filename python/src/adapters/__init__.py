"""Raw-source adapters producing canonical analytics events."""

from src.adapters.flat_synthetic import adapt_flat_synthetic_events
from src.adapters.ga4_bigquery import adapt_ga4_bigquery_events

__all__ = ["adapt_flat_synthetic_events", "adapt_ga4_bigquery_events"]
