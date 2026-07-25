# Metric Contract Freeze

## Decision

Metric contract version `1.0.0` freezes the first dashboard-ready semantic
definitions. `measurement/metric_contracts.yml` is authoritative and is
validated against `measurement/schemas/metric-contract.schema.json`.

## Mandatory contract fields

Each metric declares identity, semantic version, definition, formula,
numerator, denominator, grain, dimensions, source model and columns, filters,
exclusions, freshness, quality dependencies, owner, limitation, fixture,
reconciliation query, aggregation behaviour, unit, timezone, zero policy,
effective and deprecated dates, and tolerance.

Expected KPI values are not valid contract metadata. They belong to the
versioned acceptance manifest.

## Denominator decisions

- Qualified Lead Rate uses CRM-matched submissions.
- CRM Match Rate uses eligible web submissions.
- Vehicle Order Rate uses qualified matched leads.
- Experiment Qualified Lead Rate uses actual exposed assignments.
- Personalisation Holdout Lift is an absolute rate difference.

These definitions prevent similarly named metrics from silently sharing an
incorrect denominator.

## Calendar decision

UTC timestamps are retained. Reporting dates use `Australia/Melbourne`.
Adapter-dispatched SQL handles DuckDB and BigQuery syntax, while DST boundary
tests protect the business-date contract.

## Enforcement

`make semantic-check` fails for invalid YAML, schema violations, duplicate or
missing metric IDs, ungoverned sources, absent reconciliation queries or
dashboard dependencies outside the allowlist.
