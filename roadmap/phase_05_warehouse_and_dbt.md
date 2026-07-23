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

- [ ] dbt build passes.
- [ ] Core quality tests pass.
- [ ] Lineage is documented.
- [ ] Partition and cost-control standards are applied.
- [ ] KPI definitions map to marts.
