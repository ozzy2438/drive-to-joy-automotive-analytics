# Synthetic Data Specification

## Objective

Create realistic but fictional automotive data to support web funnel, CRM lead-quality, campaign, dealer, experimentation, personalisation and data-quality analysis.

## Required core tables

| Table | Grain | Purpose |
|---|---|---|
| `ga4_events` | Event | Website interaction stream |
| `crm_leads` | Lead | Lead lifecycle and downstream outcomes |
| `media_spend_daily` | Date × channel × campaign | Spend and campaign context |
| `vehicle_catalogue` | Vehicle variant | Vehicle dimension |
| `dealers` | Dealer | Dealer dimension |
| `campaign_registry` | Campaign | Governed acquisition context |
| `experiments` | Experiment | Test registry |
| `personalisation_audience_registry` | Audience | Eligibility, priority and holdout governance |
| `experiment_exposure` | User × experiment | Stable variant assignment |
| `personalisation_exposure` | User × audience | Personalisation / holdout assignment |
| `consent_events` | Consent event | Consent-aware measurement |

## Required behavioural relationships

- Configurator completion increases qualified-lead probability.
- Finance calculator completion is a meaningful consideration signal.
- Dealer selection indicates stronger local intent.
- Paid Search generally has stronger immediate conversion intent than broad Paid Social.
- Mobile sessions have elevated form-friction risk.
- Form submit and qualified-lead outcomes are distinct.
- Experiment treatment effect is configurable and transparent.

## Required controlled imperfections

- Missing UTM values in a controlled share of paid traffic.
- Duplicate lead hashes in a controlled share of submissions.
- Missing `vehicle_model` parameters in a controlled share of events.
- Event-volume anomaly on selected dates.
- CRM matching failures.
- Consent-rate shift after a simulated CMP release.
- Sample Ratio Mismatch in one invalid experiment dataset.
- Mobile form-error spike during a simulated release.

## Data volume target

- 180 days minimum.
- 100,000 sessions minimum.
- 500,000 events minimum.
- 5 vehicle models minimum.
- 12 vehicle variants minimum.
- 20 fictional dealers across several Australian states.
- 10 campaigns minimum.
- 4 experiments minimum.
- 6 personalisation audience definitions minimum.

## Reference-data source of truth

Versioned JSON records under `data/reference/v1/` are canonical. Python
generators load those records and committed dbt CSV seeds are deterministic
projections validated in CI. Each reference record must include
`schema_version`, `record_version` and `data_origin=synthetic`.
