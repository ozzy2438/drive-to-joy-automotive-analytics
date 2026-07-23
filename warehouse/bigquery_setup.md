# BigQuery Setup

## Setup sequence

1. Create GCP project and billing configuration.
2. Create datasets defined in `docs/25_bigquery_architecture.md`.
3. Configure least-privilege access groups.
4. Enable GA4 export or load synthetic raw event tables.
5. Load CRM, media and reference sources.
6. Configure dbt target dataset.
7. Add scheduled freshness/quality checks.

## Environments

Use separate development and production datasets/projects where possible. Do not mix experiment sandbox tables with governed reporting marts.
