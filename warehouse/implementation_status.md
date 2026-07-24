# Local Warehouse Implementation Status

## Sprint 4–5 status

The local warehouse, canonical dbt marts, reconciliation graph and quality
gates are executable. Sprint 5 adds metric contract freeze, semantic aggregates
and isolated dashboard acceptance. No production cloud, vendor integration or
dashboard UI is deployed.

## Implemented

- Manifest-verified Parquet ingestion into governed DuckDB raw schemas.
- Optional local browser/CRM-emulator NDJSON ingestion.
- Separate flat synthetic, local-demo and nested GA4 source adapters.
- Canonical staging, session, vehicle, form and marketing intermediates.
- Full web/CRM reconciliation with unmatched and identity-conflict states.
- Assignment-key and bounded-window experiment/personalisation outcomes.
- All required facts, dimensions and a quality-result mart.
- Controlled-defect, clean-quality, grain, SRM, lifecycle and attribution
  tests.
- CI smoke profile and separate local acceptance-scale profile.
- JSON-Schema-validated registry for 15 governed metrics.
- Melbourne business-date conversion with UTC preservation and DST tests.
- Daily reconciliation fact and six dashboard-facing aggregate models.
- Dashboard source allowlist and executable reconciliation queries.
- Separate fixture adapter and DuckDB warehouse covering nine scenarios.

## Acceptance evidence

The deterministic scale profile (`seed=20260723`, 180 days, 120,000 requested
consent-aware journeys) produced:

| Metric | Result |
|---|---:|
| Canonical events | 657,929 |
| Identified sessions | 100,730 |
| Web submissions | 13,663 |
| CRM records | 12,562 |
| Experiment assignments | 53,136 |
| Personalisation assignments | 16,255 |
| Sprint 4 dbt models/seeds/tests | 111 passed |

Late assignment context is retained but excluded from outcomes: 3,466
experiment and 1,241 personalisation submit contexts fell outside their
analysis window in this scale fixture.

The deterministic Sprint 5 smoke and acceptance profiles produced:

| Gate | Result |
|---|---:|
| Python tests | 29 passed |
| Local dbt models/seeds/tests | 154 passed |
| Governed metrics | 15 validated |
| Governed dashboard sources | 6 validated |
| Reconciliation queries | 15 executed |
| Reconciled aggregate rows | 1,218 passed |
| Fixture scenarios | 9 passed |
| Fixture expectations | 23 passed |
| BigQuery compatibility | dbt parse passed |

## Not implemented

- Production BigQuery deployment, partition materialisation or orchestration.
- Real GA4/GTM credentials or exports.
- Real Salesforce or customer PII.
- Dashboard UI, paid traffic or live experiment conclusions.
- Production alert routing and authentication.

## Sprint 5 acceptance commands

```bash
make semantic-check
make dashboard-fixtures
make dashboard-reconcile
make check
```

The fixture warehouse is generated under `data/processed/` and remains
Git-ignored. Its expected values are synthetic test assertions, not performance
results.
