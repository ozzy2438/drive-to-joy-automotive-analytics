# dbt Transformation Foundation

## Goal

Transform raw GA4-style event data, CRM outcomes, media spend and reference data into tested, documented analytics marts.

## Layers

```text
raw → staging → intermediate → marts
```

## Source adapters

The dbt variable `event_source_adapter` selects a source-specific staging
model while preserving one canonical downstream relation:

```yaml
vars:
  event_source_adapter: synthetic_flat
```

- `synthetic_flat` reads deterministic local flat events.
- `ga4_bigquery` extracts approved fields from nested/repeated GA4 BigQuery
  export records.

The default is `synthetic_flat`. Models downstream of `stg_ga4_events` must
never depend directly on either raw source shape.

Parse the complete graph without warehouse credentials:

```bash
make dbt-parse
```

Load all versioned reference seeds and run their integrity tests in local
DuckDB:

```bash
make dbt-seed-local
```

The local DuckDB file is written under `data/processed/` and ignored by Git.
No BigQuery credentials are required.

Running `dbt build` against BigQuery requires an owner-provided local profile
and credentials; neither is committed.

## Marts

- `fct_sessions`
- `fct_vehicle_journey`
- `fct_lead_funnel`
- `fct_media_performance`
- `fct_experiment_results`
- `fct_personalisation_performance`
- `fct_data_quality_results`
- `dim_vehicle`
- `dim_dealer`
- `dim_campaign`
- `dim_date`

## Required tests

- Unique keys
- Not-null critical fields
- Accepted values
- Referential integrity
- Event completeness
- Duplicate leads
- UTM compliance
- CRM match threshold
- Invalid funnel progression
- Experiment Sample Ratio Mismatch
