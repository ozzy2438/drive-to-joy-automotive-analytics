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
| `fct_reconciliation_results` | Reconciliation check × business date | Identity and web-to-CRM reconciliation status |
| `agg_executive_daily` | Business date | Executive funnel outcomes and governed rate components |
| `agg_journey_daily` | Business date × vehicle model | Research, configurator, finance and lead progression |
| `agg_marketing_daily` | Business date × campaign | Spend, UTM compliance and qualified-lead efficiency |
| `agg_data_quality_daily` | Business date | Freshness, completeness, reconciliation and quality badges |
| `agg_experiment_daily` | Business date × experiment × variant | Actual-exposure outcomes within the governed 30-day window |
| `agg_personalisation_daily` | Business date × audience × treatment experience | Treatment/holdout comparison within the governed 14-day window |
| `dim_vehicle` | Vehicle variant | Fictional vehicle reference |
| `dim_dealer` | Dealer | Fictional dealer reference |
| `dim_campaign` | Campaign | Governed UTM/campaign reference |
| `dim_experiment` | Experiment | Status, allocation and collision rules |
| `dim_personalisation_audience` | Audience | Eligibility, holdout and cooldown rules |
| `dim_date` | Calendar date | Portable reporting calendar |

`web_submission_id` represents accepted web conversion. `lead_id_hash`
represents an opaque CRM reconciliation key. Neither implies qualification.

All dashboard-facing aggregates expose additive numerator and denominator
components alongside derived rates. They also carry contract version,
synthetic-origin, watermark, freshness, quality and limitation metadata.
