# SQL Plan

## Purpose

This directory will contain reusable SQL for business analysis, data quality, experimentation and stakeholder reporting.

## Directory guide

| Directory | Purpose |
|---|---|
| `ad_hoc/` | Exploratory and business-question analysis |
| `data_quality/` | Monitoring and validation checks |
| `experimentation/` | Exposure, uplift, SRM, guardrail and segment analysis |
| `reporting/` | Dashboard-ready reporting queries where dbt marts are not sufficient |

## SQL standards

- Use partition filters for large event tables.
- Avoid `SELECT *` in production queries.
- Document business purpose and expected grain at top of every query.
- Reference governed marts where available.
- Keep KPI logic centralised in dbt rather than duplicating it across dashboards.
