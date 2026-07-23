# Data Model

## Layering

```text
Raw Sources → Staging → Intermediate → Analytics Marts → Dashboards/Reports/Experiments
```

## Fact tables

| Table | Grain |
|---|---|
| `fct_sessions` | Session |
| `fct_vehicle_journey` | Session × vehicle model |
| `fct_lead_funnel` | Web lead |
| `fct_media_performance` | Date × channel × campaign |
| `fct_experiment_results` | Experiment × variant × segment × date |
| `fct_data_quality_results` | Check × date |
| `fct_personalisation_performance` | Audience × experience × holdout × date |

## Dimensions

- `dim_vehicle`
- `dim_dealer`
- `dim_campaign`
- `dim_date`
- `dim_experiment`
- `dim_audience`

## Key joins

Use session/user keys for web behaviour, `lead_id_hash` for CRM closure, dealer/model/campaign keys for dimensions, and experiment/audience IDs for exposure analysis.
