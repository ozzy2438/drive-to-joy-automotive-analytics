# Drive to Joy Changelog

All notable project-design and implementation changes should be recorded here.

## Unreleased

### Added

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

- Hardened raw-PII field detection across snake_case, camelCase and
  delimiter-separated keys.
- Added server-side vehicle, variant, dealer and dealer-state integrity checks
  to CRM submissions.
- Clarified synthetic-data disclosure and the pending accessibility audit gate.
