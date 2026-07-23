# BigQuery Architecture

## Dataset layout

```text
raw_ga4
raw_crm
raw_media
raw_reference
analytics_staging
analytics_intermediate
analytics_marts
analytics_quality
analytics_sandbox
```

## Controls

- Partition large tables by event or business date.
- Cluster high-volume tables using common filters and joins.
- Require partition filters.
- Avoid `SELECT *` in production queries.
- Materialise repeated logic in dbt.
- Separate sandbox from governed marts.
- Record data freshness and query-cost expectations.
