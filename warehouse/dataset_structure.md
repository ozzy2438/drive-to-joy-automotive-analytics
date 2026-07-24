# Dataset Structure

| Dataset | Content | Retention/role |
|---|---|---|
| raw_ga4 | Raw event export | Source preservation |
| raw_crm | CRM outcome extracts | Restricted operational source |
| raw_media | Spend/campaign extracts | Marketing source |
| raw_reference | Vehicle/dealer/campaign/experiment dimensions | Reference source |
| analytics_staging | Standardised models | Transformation |
| analytics_intermediate | Reusable logic | Transformation |
| analytics_marts | Governed reporting tables | BI consumption |
| analytics_quality | Check outputs | Monitoring |
| analytics_sandbox | Ad hoc analysis | Controlled exploration |

## Local physical mapping

Local DuckDB uses `raw_synthetic`, `raw_crm`, `raw_media`, `raw_reference`,
`raw_quality`, optional `raw_local_demo` and `raw_governance`. dbt writes
`main_staging`, `main_intermediate`, `main_marts` and `main_quality`.

The Sprint 5 acceptance adapter writes to a separate
`data/processed/dashboard_fixtures.duckdb` warehouse and is enabled only with
`semantic_source_adapter=dashboard_fixture`. It cannot replace the normal
synthetic/local-demo source adapter accidentally.

The mapping proves the data contracts locally; it does not claim that the
BigQuery datasets above have been deployed. Dashboard specifications may
reference only the governed aggregate allowlist in
`dashboards/dashboard_sources.yml`.
