# Local Event Collection

## Purpose

The local collector provides credential-free evidence linking a browser
journey, canonical events and CRM emulator outcomes.

## Endpoint and storage

`POST /api/events` accepts one canonical event. The server:

1. applies the PII guard;
2. validates JSON Schema and event-specific requirements;
3. adds `ingested_at_utc`;
4. appends the row to `events.ndjson` through a serial in-process queue.

The stored row preserves the original event time and arrival order.

## Export

With `ENABLE_LOCAL_DEMO_EXPORT=true` outside production:

```text
GET /api/events/export
```

returns NDJSON for local reconciliation. Production and disabled environments
return `404`.

## Quality command

After a local or Playwright run:

```bash
cd apps/web
DTJ_LOCAL_DATA_DIR=.local-data/e2e npm run quality:local
```

Checks include:

- canonical schema validation;
- CRM conversion match;
- forbidden PII scan;
- duplicate conversion IDs;
- duplicate experiment assignment exposure;
- duplicate personalisation assignment exposure.

## Operational limitation

Append ordering is guaranteed only inside one Node.js application process.
The collector is not a durable queue and has no retry, partitioning, retention
or multi-writer guarantee. Production ingestion remains out of scope.
