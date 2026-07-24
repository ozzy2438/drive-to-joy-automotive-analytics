# Phase 05 — Warehouse and dbt

## Objective

Create warehouse layers and tested dbt marts from raw events, CRM outcomes, media spend and reference data.

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

## Exit criteria

- [x] Local dbt build passes.
- [x] Core quality tests pass.
- [x] Lineage is documented.
- [ ] Production partition and cost controls are applied.
- [x] KPI definitions map to marts.

BigQuery deployment remains intentionally outside Sprint 4, so the production
partition/cost-control item is a documented future gate rather than a local
completion claim.
