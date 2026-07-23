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
