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
- `local_demo` reads sanitised browser collector evidence.
- `ga4_bigquery` extracts approved fields from nested/repeated GA4 BigQuery
  export records.

The default is `synthetic_flat`. Models downstream of `stg_ga4_events` must
never depend directly on either raw source shape.

Parse the complete graph without warehouse credentials:

```bash
make dbt-parse
```

Build governed raw schemas, all dbt layers, marts and quality tests:

```bash
make warehouse-smoke
```

Run the separate 180-day acceptance-scale profile with
`make warehouse-scale`. Local DuckDB files are ignored by Git. No BigQuery
credential is required.

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
- `fct_reconciliation_results`
- `agg_executive_daily`
- `agg_journey_daily`
- `agg_marketing_daily`
- `agg_data_quality_daily`
- `agg_experiment_daily`
- `agg_personalisation_daily`
- `dim_vehicle`
- `dim_dealer`
- `dim_campaign`
- `dim_date`
- `dim_experiment`
- `dim_personalisation_audience`

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
- Bounded experiment/personalisation outcome windows
- Controlled-defect detection and clean quality-result enforcement
- Melbourne business-date and DST boundaries
- Semantic aggregate grains, metadata and additive-rate reconciliation

The acceptance-only `agg_dashboard_fixture_results` model is enabled only with
`semantic_source_adapter: dashboard_fixture` and builds in a separate ignored
DuckDB database.
