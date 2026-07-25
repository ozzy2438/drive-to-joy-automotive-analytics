# Dashboard Aggregate Strategy

## Purpose

The aggregate layer publishes stable daily grains and additive metric
components before any dashboard UI is implemented.

## Grain policy

- Executive and data quality: Melbourne business date.
- Journey: business date and vehicle model.
- Marketing: business date, channel and campaign.
- Experiment: business date, experiment and variant.
- Personalisation: business date, audience and treatment experience.

Singular tests reject duplicate rows at these grains.

## Rate policy

Numerators and denominators remain additive. Stored rates are convenience
fields and are reconciled in dbt and Python. Consumers must calculate a
cross-period rate from summed components, never from an average of daily rates.

## Metadata policy

All aggregates expose contract version, reporting timezone, data origin,
synthetic watermark, data-through timestamp, evaluation timestamp, freshness,
quality and limitation code.

## Fixture policy

Acceptance fixtures use their own adapter and DuckDB database. They test
zero-denominator, stale, quality and holdout behaviour without contaminating
the canonical smoke warehouse.
