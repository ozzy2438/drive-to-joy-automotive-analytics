# Local Warehouse Implementation Status

## Sprint 4 status

The local warehouse, canonical dbt marts, reconciliation graph and quality
gates are executable. No production cloud or vendor integration is deployed.

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
| dbt models/seeds/tests | 111 passed |

Late assignment context is retained but excluded from outcomes: 3,466
experiment and 1,241 personalisation submit contexts fell outside their
analysis window in this scale fixture.

## Not implemented

- Production BigQuery deployment, partition materialisation or orchestration.
- Real GA4/GTM credentials or exports.
- Real Salesforce or customer PII.
- Dashboards, paid traffic or live experiment conclusions.
- Production alert routing and authentication.
