# ADR-002 — dbt for Transformations

## Context

Business metrics must be tested, documented and reusable across dashboards and analysis.

## Decision

Use dbt layered models for staging, intermediate logic and marts.

## Consequences

Adds project structure and tests, but reduces hidden BI logic and improves lineage.

## Status

Accepted.
