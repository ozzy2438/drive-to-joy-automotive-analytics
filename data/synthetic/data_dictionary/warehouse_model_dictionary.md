# Warehouse Model Dictionary

| Model | Grain | Purpose |
|---|---|---|
| `fct_sessions` | Session | Governed acquisition and journey flags |
| `fct_vehicle_journey` | Session × vehicle model | Research-to-intent progression |
| `fct_lead_funnel` | Accepted web or CRM lead record | Full web/CRM reconciliation |
| `fct_media_performance` | Date × campaign | Spend and attributed web-lead sessions |
| `fct_experiment_results` | Exposure date × experiment × variant | Bounded assignment-key outcomes |
| `fct_personalisation_performance` | Exposure date × audience × experience × holdout | Bounded incrementality outcomes |
| `fct_data_quality_results` | Check × run date | Executable status, severity and owner |
| `dim_vehicle` | Vehicle variant | Fictional vehicle reference |
| `dim_dealer` | Dealer | Fictional dealer reference |
| `dim_campaign` | Campaign | Governed UTM/campaign reference |
| `dim_experiment` | Experiment | Status, allocation and collision rules |
| `dim_personalisation_audience` | Audience | Eligibility, holdout and cooldown rules |
| `dim_date` | Calendar date | Portable reporting calendar |

`web_submission_id` represents accepted web conversion. `lead_id_hash`
represents an opaque CRM reconciliation key. Neither implies qualification.
