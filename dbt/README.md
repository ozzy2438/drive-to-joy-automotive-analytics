# dbt Transformation Plan

## Goal

Transform raw GA4-style event data, CRM outcomes, media spend and reference data into tested, documented analytics marts.

## Layers

```text
raw → staging → intermediate → marts
```

## Required marts

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
