# Local Warehouse and Reconciliation

## Purpose

Sprint 4 turns the canonical contracts into a reproducible analytics
warehouse without external credentials. The executable path is:

```text
synthetic Parquet / optional local NDJSON
→ governed DuckDB raw schemas
→ dbt staging adapters
→ intermediate reconciliation
→ canonical marts
→ executable quality gates
```

All core records are visibly labelled synthetic. Outputs are ignored by Git
and are not Honda Australia, GA4, Salesforce or commercial-performance data.

## Source boundaries

| Adapter | Input | Status |
|---|---|---|
| `synthetic_flat` | Deterministic governed Parquet | Default executable source |
| `local_demo` | Local collector and CRM-emulator NDJSON | Optional executable evidence |
| `ga4_bigquery` | Nested/repeated GA4 export shape | Credential-free parse validation only |

Source-specific shape handling ends at staging. Intermediate and mart models
depend only on `stg_ga4_events` and standardised CRM/reference relations.
Local-demo CRM records are never described as Salesforce records.

## Reproducible profiles

Run the CI-sized profile:

```bash
make setup
make warehouse-smoke
```

Run the explicit acceptance-scale profile:

```bash
make warehouse-scale
```

The scale profile requests 120,000 consent-aware journeys over 180 days so the
canonical output exceeds 100,000 identified sessions and 500,000 events.
Scale is intentionally not run on every pull request.

Generated files are written under `data/processed/`. The foundation manifest
records generator configuration, file SHA-256 digests, row counts, disclosure
and validation evidence. The warehouse loader verifies those digests before
creating or replacing raw tables and writes a separate load manifest.

## DuckDB schemas

| Schema | Responsibility |
|---|---|
| `raw_synthetic` | Flat/canonical events, submissions and assignments |
| `raw_crm` | Synthetic CRM lifecycle records |
| `raw_media` | Synthetic daily campaign spend |
| `raw_reference` | Versioned reference registries |
| `raw_quality` | Isolated controlled-defect fixtures |
| `raw_local_demo` | Optional browser and CRM-emulator evidence |
| `raw_governance` | Source load version, digest and row-count evidence |
| `main_staging` | Canonical source standardisation |
| `main_intermediate` | Session, form, reconciliation and exposure logic |
| `main_marts` | Governed analytics facts and dimensions |
| `main_quality` | Executable quality result mart |

DuckDB execution is fixed to UTC so daylight-saving transitions cannot invert
CRM lifecycle comparisons. Production BigQuery deployment remains out of
scope.

## Identity and CRM reconciliation

`form_instance_id`, `web_submission_id` and `lead_id_hash` remain separate.
The reconciliation model retains `matched`, `web_only`, `crm_only` and
`identity_conflict` states. A record is CRM-matched only when submission ID
and opaque lead hash both agree. A form submit remains a web conversion; it
does not become a qualified lead until the CRM lifecycle says so.

## Experiment and personalisation attribution

Assignment context may remain on a later submit after its analysis window has
expired. That context is retained for traceability but is not attributed.

- Experiment outcomes join on `experiment_assignment_id` and assignment-key
  user, after exposure and within 30 days.
- Personalisation outcomes join on `personalisation_assignment_id` and
  assignment-key user, after exposure and within 14 days.
- Exposure and outcome session IDs are both retained for same-session and
  cross-session analysis.
- Date-only, variant-only and unbounded joins are prohibited.

`EXP-CTA-001` SRM uses a three-arm chi-square diagnostic. No mart or document
declares a winner, uplift or live performance result.

## Quality gates

The local build tests schema/identity completeness, uniqueness, consent,
reference integrity, UTM governance, CRM match and lifecycle order, funnel
progression, assignment validity, bounded outcomes, three-arm SRM and daily
volume anomalies. The anomaly gate uses a four-sigma threshold plus a minimum
absolute delta to reduce false positives across many event/day comparisons.

Controlled defects are stored outside the clean source. Tests prove that the
registered missing vehicle context and duplicate conversion are detected,
while the clean quality mart must contain only passing checks.

## Optional local-demo build

After generating browser evidence in `apps/web/.local-data/e2e`, load it into
a separate ignored database:

```bash
cd python
.venv/bin/python -m src.warehouse.load_local_warehouse \
  --foundation ../data/processed/local_foundation \
  --database ../data/processed/drive_to_joy_local_demo.duckdb \
  --runtime-data ../apps/web/.local-data/e2e
cd ..
DTJ_DUCKDB_PATH=data/processed/drive_to_joy_local_demo.duckdb \
  python/.venv/bin/dbt build \
  --project-dir dbt \
  --profiles-dir dbt/ci \
  --target local \
  --vars '{event_source_adapter: local_demo, crm_source_adapter: local_demo}'
```

Nested GA4 shape compatibility can be parsed without a credential:

```bash
python/.venv/bin/dbt parse \
  --project-dir dbt \
  --profiles-dir dbt/ci \
  --target ci \
  --no-partial-parse \
  --vars '{event_source_adapter: ga4_bigquery}'
```

## Deliberate limitations

- No production GCP or BigQuery deployment.
- No real GA4/GTM credential or export.
- No real Salesforce integration or customer PII.
- No dashboard or public administration surface.
- No paid traffic, live experiment conclusion or performance claim.
- Local DuckDB materialisations demonstrate contracts and lineage; production
  partitioning, clustering, access control and orchestration are design-only.
