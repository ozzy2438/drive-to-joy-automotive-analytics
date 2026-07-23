# ADR-001 — BigQuery as Analytics Warehouse

## Context

The project needs event-level analytics, CRM outcome joins, media spend joins, experimentation analysis and dashboard-ready marts.

## Decision

Use BigQuery as the production-style target warehouse. Allow DuckDB only for local proof-of-concept work while retaining compatible table contracts.

## Alternatives

- GA4 UI only: insufficient for user/session-level joins and CRM closure.
- Spreadsheet-only reporting: insufficient for scale and governance.
- Another cloud warehouse: feasible but less directly aligned to GA4 export and role requirements.

## Consequences

Requires cost controls, partitioning, access management and data engineering documentation.

## Status

Accepted.
