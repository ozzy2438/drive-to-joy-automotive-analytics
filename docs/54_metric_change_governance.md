# Metric Change Governance

## Semantic versioning

- Major: formula, denominator, grain, filter, exclusion, unit or business
  meaning changes.
- Minor: backward-compatible dimensions, metadata or a new optional consumer
  field.
- Patch: wording or documentation correction that cannot change output.

An output-affecting bug correction is a major change even when the old output
was unintended.

## Change requirements

Every change must include:

1. Updated YAML contract and schema-valid metadata.
2. Impacted aggregate and reconciliation SQL.
3. Versioned fixture expectation changes.
4. Backward-compatibility and migration notes.
5. Owner approval and changelog entry.

## Compatibility

Existing metric versions must not be silently overwritten. A breaking version
uses a new version identifier and documented effective date. The prior version
remains available for a deprecation window or receives an explicit migration
plan.

## Deprecation

`deprecated_at` is null for active metrics. Deprecation requires a replacement
metric, consumer inventory, fixture evidence and removal date.

## Quality status

Allowed values are `pass`, `warn`, `fail`, `unknown` and `stale`.
Precedence is:

1. `fail`
2. `stale`
3. `warn`
4. `unknown`
5. `pass`

The first applicable condition wins. Status meaning is governed independently
from metric value.
