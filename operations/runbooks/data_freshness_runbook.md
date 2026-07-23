# Data Freshness Runbook

## Trigger

Expected source or dbt output does not arrive within SLA.

## Actions

1. Identify source and last successful timestamp.
2. Check scheduled job and credentials.
3. Check upstream source availability.
4. Pause dependent dashboards/experiments if required.
5. Add freshness annotation.
6. Restore and validate backfill.
