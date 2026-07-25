# Dashboard Semantic Layer

## Purpose

The semantic layer lets a future dashboard consumer use governed aggregates
without recreating business rules in BI calculated fields.

## Governed aggregates

| Model | Grain | Primary use |
|---|---|---|
| `agg_executive_daily` | Melbourne business date | Lead and commercial funnel |
| `agg_journey_daily` | Date and vehicle model | Research and tool progression |
| `agg_marketing_daily` | Date, channel and campaign | Spend and lead efficiency |
| `agg_data_quality_daily` | Melbourne business date | Completeness, UTM and freshness |
| `agg_experiment_daily` | Date, experiment and variant | Exposure outcomes and SRM |
| `agg_personalisation_daily` | Date, audience and experience | Treatment versus holdout |

`fct_reconciliation_results` provides the governed daily web/CRM match
components and badge status.

## Additive components

Ratios are stored for convenience, but their numerators and denominators remain
separate. Cross-day or cross-dimension totals must use ratio-of-sums. Daily
rate averaging is invalid.

## Metadata

Every aggregate carries contract version, timezone, origin, synthetic
watermark, data-through time, evaluation time, freshness, quality and
limitation code.

## Consumer boundary

Only sources in `dashboards/dashboard_sources.yml` may appear in dashboard
specifications or reconciliation SQL. CI rejects raw, staging, intermediate
and unallowlisted model references.
