# Governed KPI Definitions

## Contract authority

`measurement/metric_contracts.yml` is the machine-readable source of truth.
This document is its readable interpretation. The JSON Schema and
`make semantic-check` reject missing metadata, invalid versions, ungoverned
sources and missing reconciliation queries.

All reporting dates use `Australia/Melbourne`. Source timestamps remain UTC.
All results in the public repository are synthetic demonstrations.

## Metric catalogue

| Metric ID | Version | Governed source | Grain | Owner |
|---|---:|---|---|---|
| `qualified_leads_per_1000_engaged_sessions` | 1.0.0 | `agg_executive_daily` | Business date | Digital Analytics |
| `qualified_lead_rate` | 1.0.0 | `agg_executive_daily` | Business date | CRM Analytics |
| `cost_per_qualified_lead` | 1.0.0 | `agg_marketing_daily` | Date, channel, campaign | Marketing Analytics |
| `crm_match_rate` | 1.0.0 | `agg_executive_daily` | Business date | CRM Operations |
| `model_to_test_drive_rate` | 1.0.0 | `agg_journey_daily` | Date, vehicle model | Digital Experience |
| `configurator_completion_rate` | 1.0.0 | `agg_journey_daily` | Date, vehicle model | Product Analytics |
| `finance_to_lead_progression_rate` | 1.0.0 | `agg_journey_daily` | Date, vehicle model | Digital Experience |
| `test_drive_attendance_rate` | 1.0.0 | `agg_executive_daily` | Business date | Sales Operations |
| `vehicle_order_rate` | 1.0.0 | `agg_executive_daily` | Business date | Sales Operations |
| `experiment_qualified_lead_rate` | 1.0.0 | `agg_experiment_daily` | Date, experiment, variant | Experimentation |
| `experiment_srm_status` | 1.0.0 | `agg_experiment_daily` | Date, experiment | Experimentation |
| `personalisation_holdout_lift` | 1.0.0 | `agg_personalisation_daily` | Date, audience, experience | Personalisation |
| `event_parameter_completeness` | 1.0.0 | `agg_data_quality_daily` | Business date | Digital Analytics |
| `utm_compliance_rate` | 1.0.0 | `agg_data_quality_daily` | Business date | Marketing Analytics |
| `data_freshness_status` | 1.0.0 | `agg_data_quality_daily` | Evaluation run | Analytics Engineering |

## Formula and denominator freeze

| Metric ID | Additive numerator | Additive denominator | Governed calculation | Zero policy |
|---|---|---|---|---|
| `qualified_leads_per_1000_engaged_sessions` | Qualified matched leads | Engaged sessions | Numerator / denominator × 1,000 | Null |
| `qualified_lead_rate` | Qualified matched leads | CRM-matched submissions | Ratio of sums | Null |
| `cost_per_qualified_lead` | Spend AUD | Attributed qualified leads | Ratio of sums | Null |
| `crm_match_rate` | Matched web submissions | Eligible web submissions | Ratio of sums | Null |
| `model_to_test_drive_rate` | Same-model test-drive submit sessions | Model-view sessions | Ratio of sums | Null |
| `configurator_completion_rate` | Configurator completions | Configurator starts | Ratio of sums | Null |
| `finance_to_lead_progression_rate` | Finance-complete lead sessions | Finance-complete sessions | Ratio of sums | Null |
| `test_drive_attendance_rate` | Attended test drives | Booked test drives | Ratio of sums | Null |
| `vehicle_order_rate` | Vehicle orders | Qualified matched leads | Ratio of sums | Null |
| `experiment_qualified_lead_rate` | Bounded qualified outcomes | Actual exposed assignments | Ratio of sums | Null |
| `experiment_srm_status` | Observed exposure allocation | Expected equal allocation | Three-arm chi-square status | Unknown |
| `personalisation_holdout_lift` | Treatment qualified-lead rate | Holdout qualified-lead rate | Treatment rate − holdout rate | Null |
| `event_parameter_completeness` | Complete eligible events | Eligible required events | Ratio of sums | Null |
| `utm_compliance_rate` | Compliant paid sessions | Eligible paid sessions | Ratio of sums | Null |
| `data_freshness_status` | Data-through timestamp | Evaluation timestamp | 48-hour status policy | Unknown |

Rate metrics must be recomputed from summed numerator and denominator
components. A dashboard must never average daily rates.

## Filters and exclusions

- Qualified outcomes require a matched `web_submission_id` and opaque
  `lead_id_hash`; `web_only`, `crm_only` and `identity_conflict` records are not
  silently counted as qualified.
- Model, configurator and finance progression is same-session and same-model.
- Experiment metrics use valid actual exposures and the 30-day outcome window.
- Personalisation metrics require assignment-key agreement, explicit generic
  holdout and the 14-day outcome window.
- Paid UTM compliance uses `cpc` and `paid_social` sessions only.
- Data freshness uses the governed evaluation clock. Timestamps more than one
  day in the future return `unknown`.

## Acceptance and reconciliation

Every metric names a fixture scenario and executable reconciliation query in
the YAML contract. Expected fixture values are deliberately stored in
`dashboards/dashboard_acceptance_manifest.yml`, not in the production metric
registry.

Integer component counts use exact equality. Rates and decimal values use the
metric-specific tolerance. Run:

```bash
make semantic-check
make dashboard-fixtures
make dashboard-reconcile
```

## Limitations

The contracts describe production-style methods over synthetic demonstration
data. They do not represent Honda Australia traffic, leads, spend, experiments
or vehicle-order performance. Attribution metrics are contextual, not causal,
and no experiment winner may be declared from these aggregates.
