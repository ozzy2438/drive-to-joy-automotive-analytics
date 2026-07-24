# Drive to Joy Changelog

All notable project-design and implementation changes should be recorded here.

## Unreleased

### Added

- Machine-readable metric contract registry with JSON Schema validation,
  Melbourne business-date policy and metric SemVer.
- CRM reconciliation result fact and six governed dashboard-ready daily
  aggregates with additive numerator/denominator components.
- Dashboard source allowlist, executable per-metric reconciliation SQL and CI
  enforcement against raw, staging or intermediate dependencies.
- Isolated `dashboard_fixture` adapter, nine synthetic edge-case scenarios and
  versioned expected KPI acceptance manifest.
- Quality badge status model with `fail`, `stale`, `warn`, `unknown`, `pass`
  precedence.
- Governed Parquet-to-DuckDB loader with digest verification, source-load
  manifest and optional local-demo NDJSON evidence.
- Complete local dbt staging, reconciliation, bounded attribution, canonical
  mart and quality graph.
- Smoke and acceptance-scale warehouse profiles, with UTC execution and CI
  integration.
- Controlled-defect detection, clean quality enforcement, three-arm SRM and
  bounded outcome tests.
- ADR-011, local warehouse guide, model dictionary and operational runbook.
- Next.js AstraDrive analytics test surface with all required research,
  configurator, finance, dealer and lead routes.
- Consent-aware canonical tracking, local ordered NDJSON collection and
  browser-to-CRM reconciliation.
- Deterministic three-arm `EXP-CTA-001` runtime and five personalisation
  audiences with generic holdouts, cooldowns and collision handling.
- Local CRM emulator with opaque server-side lead identity and tested lifecycle
  transitions.
- Vitest, Playwright, production-build and local privacy/duplicate quality
  gates for the web runtime.
- Canonical analytics contract `1.1.0` journey fields for executable web,
  adapter and warehouse parity.
- Versioned AstraDrive vehicle, dealer, campaign, experiment and
  personalisation audience registries.
- Deterministic JSON-to-dbt seed export with Python parity tests.
- Local DuckDB dbt seed loading and reference-integrity tests.
- Initial documentation-first repository structure.
- Project charter and role alignment.
- Data disclosure policy.
- Dataset source plan.
- KPI tree and event catalogue.
- Synthetic data specification.
- Experimentation and personalisation foundations.

### Changed

- Separated stable assignment context from bounded attributed outcomes and
  exposed excluded late-context counts in validation manifests.
- Raised daily multi-series anomaly control to four sigma with a minimum
  absolute delta to reduce expected multiple-comparison false positives.
- Made campaign and media generation respect governed campaign active dates.
- Normalised DuckDB execution to UTC across daylight-saving boundaries.
- Hardened raw-PII field detection across snake_case, camelCase and
  delimiter-separated keys.
- Added server-side vehicle, variant, dealer and dealer-state integrity checks
  to CRM submissions.
- Clarified synthetic-data disclosure and the pending accessibility audit gate.
