# ADR-011 — Local Warehouse Execution

## Context

The canonical contracts, synthetic generator and web runtime require an
executable warehouse path before dashboards or production integrations can be
trusted. The repository must support clean synthetic evidence, optional local
runtime evidence and the real nested GA4 export shape without requiring cloud
credentials or misrepresenting local files as production systems.

## Decision

Use deterministic Parquet as the governed default input, DuckDB as the local
warehouse and dbt as the only transformation graph from staging onward.

- Verify source-manifest SHA-256 digests before loading raw tables.
- Keep `synthetic_flat`, `local_demo` and `ga4_bigquery` source adapters
  separate until the canonical staging relation.
- Store local browser and CRM-emulator evidence in `raw_local_demo`; never
  label it GA4 or Salesforce.
- Reconcile web and CRM identities with submission ID and opaque lead hash,
  retaining unmatched and identity-conflict states.
- Attribute experiment and personalisation outcomes only with assignment ID,
  assignment key and explicit outcome window.
- Fix local warehouse execution to UTC.
- Run a small deterministic smoke profile in CI and a separate 180-day scale
  acceptance profile locally.
- Keep DuckDB, Parquet, NDJSON and manifests out of Git.

## Alternatives

- **BigQuery-only development:** closer to the planned target, but requires
  credentials and creates cost and access barriers for public reproduction.
- **One universal raw schema:** simpler initially, but hides the material
  difference between flat synthetic data and nested GA4 exports.
- **Run scale data in every CI job:** stronger volume coverage per run, but
  wastes time and resources for deterministic logic already covered by smoke
  tests.
- **Join only on submission ID:** fails to detect opaque identity conflicts.
- **Unbounded assignment attribution:** inflates downstream outcomes and
  invalidates experiment and personalisation measurement.

## Consequences

- Contributors can build all canonical marts and quality gates locally with
  one command and no external service.
- Scale evidence remains explicit and reproducible without slowing every PR.
- Source adapters can evolve independently while downstream grains remain
  stable.
- DuckDB compatibility macros are required for date and timestamp behaviour.
- BigQuery performance and operational controls cannot be claimed until a
  future authorised deployment.

## Privacy implications

Only synthetic or sanitised local-demo records are accepted. The loader
inherits the canonical PII guard, verifies synthetic disclosure and never
loads raw contact fields. `lead_id_hash` remains derived from an opaque
internal reference, not from email, phone, name or another PII value.

## Rollback

Disable the local warehouse Make targets and dbt source-selection variables.
Generated files under the ignored `data/processed/` directory can be replaced
by a fresh deterministic run. Canonical contracts, web runtime and source
adapter documentation remain independently usable.

## Status

Accepted for Sprint 4.
