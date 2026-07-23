# KPI Definitions

| KPI | Formula | Grain | Source | Owner | Limitation |
|---|---|---|---|---|---|
| Qualified Leads per 1,000 Engaged Sessions | Qualified leads / engaged sessions × 1,000 | Date/channel/model | `fct_lead_funnel`, `fct_sessions` | Digital Analytics | Consent and CRM matching affect coverage |
| Cost per Qualified Lead | Spend / qualified leads | Date/channel/campaign | `fct_media_performance`, `fct_lead_funnel` | Marketing Analytics | Attribution is contextual, not necessarily causal |
| CRM Match Rate | matched web leads / submitted web leads | Date/form/channel | `fct_lead_funnel` | CRM Operations | Match key availability affects rate |
| Test Drive Booking Rate | test drive submits / eligible sessions | Date/model/device | `fct_sessions` | Digital Experience | Does not indicate attendance |
| Appointment Attendance Rate | attended / booked | Date/dealer/model | `fct_lead_funnel` | Sales Operations | Dealer-process effects included |
| Configurator Completion Rate | completions / starts | Date/model/device | `fct_vehicle_journey` | Product/Digital | May not equate to purchase intent |
| Form Error Rate | form errors / form starts | Date/form/device | `fct_vehicle_journey` | Web Product | Error event implementation quality matters |
| Experiment QL Lift | treatment QL rate − control QL rate | Experiment/variant/segment | `fct_experiment_results` | CRO/Analytics | Requires valid randomisation and adequate sample |
| Personalisation Holdout Lift | personalised outcome − holdout outcome | Audience/experience | `fct_personalisation_performance` | CRM/MarTech | Requires stable audience assignment |
