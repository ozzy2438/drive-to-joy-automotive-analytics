# dbt Transformation Strategy

## Layer standard

```text
raw → staging → intermediate → marts
```

## Staging

Standardise source types, extract event parameters, preserve source keys and apply source validations.

## Intermediate

Build reusable sessionisation, vehicle journey, form funnel, web-to-CRM match, attribution context and experiment exposure logic.

## Marts

Create stakeholder-oriented, documented, dashboard-ready tables with approved KPI definitions.

## Required tests

- Unique keys
- Not-null fields
- Accepted values
- Referential integrity
- Event completeness
- Duplicate lead detection
- UTM compliance
- CRM match threshold
- Invalid funnel sequencing
- Experiment SRM
- Assignment/exposure validity
- Bounded experiment and personalisation outcomes
- Controlled-defect detection
- Clean quality-result enforcement

## Local execution

`make warehouse-smoke` executes the complete graph in UTC-configured DuckDB.
`make warehouse-scale` is the separate volume acceptance profile. The
`ga4_bigquery` adapter is parse-validated without production credentials.
