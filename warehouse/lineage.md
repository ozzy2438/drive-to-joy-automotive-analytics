# Lineage

```text
Web dataLayer → GTM → GA4-style raw events → staging events
CRM source → staging CRM
Media source → staging media
Reference seeds → staging reference
staging → intermediate sessions/journey/match/exposure
intermediate → marts
marts → dashboards/reports/experiments/alerts
```

Use dbt documentation and Mermaid diagrams to keep lineage current.

## Executable Sprint 4 lineage

```text
governed Parquet ─┐
local NDJSON ─────┼→ source adapter → stg_ga4_events
nested GA4 shape ─┘

stg_ga4_events → sessions / vehicle journey / form funnel
form funnel + CRM → full reconciliation
assignment + rendered exposure + reconciliation
  → bounded experiment and personalisation outcomes
intermediate models + reference seeds
  → canonical marts + executable quality results
```

Source-adapter branching is prohibited after canonical staging.

## Executable Sprint 5 lineage

```text
measurement/metric_contracts.yml
  → JSON Schema + semantic validation
  → governed metric documentation

canonical marts + quality facts
  → daily dashboard aggregates
  → executable reconciliation SQL
  → governed dashboard-source allowlist

versioned fixture CSV + acceptance manifest
  → isolated fixture DuckDB adapter
  → aggregate acceptance results
  → exact/tolerance assertions
```

Experiment aggregates accept only actual rendered exposures and apply the
30-day outcome window. Personalisation aggregates require the assignment key,
treatment/holdout context and the 14-day outcome window. UTC timestamps remain
available while `business_date` is derived in `Australia/Melbourne`.
