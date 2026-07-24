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
| `fct_lead_funnel` | Accepted web or CRM lead record |
| `fct_media_performance` | Date × campaign |
| `fct_experiment_results` | Exposure date × experiment × variant |
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

Use session/user keys for web behaviour. CRM closure requires
`web_submission_id` plus `lead_id_hash`; neither alone implies qualification.
Experiment and personalisation outcomes require assignment ID, assignment-key
user and a bounded post-exposure window. Dealer/model/campaign keys resolve to
versioned reference dimensions.
