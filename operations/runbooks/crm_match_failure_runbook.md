# CRM Match Failure Runbook

## Trigger

CRM match rate drops below threshold or lead extract fails.

## Actions

1. Check web lead key generation.
2. Check hash/mapping contract.
3. Check CRM ingestion/export freshness.
4. Check changed CRM fields/status values.
5. Annotate lead-quality reports.
6. Escalate to CRM owner.
7. Backfill only with documented reconciliation.
