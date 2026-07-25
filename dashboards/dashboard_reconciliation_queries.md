# Dashboard Reconciliation Queries

## Rule

Each metric contract points to one executable SQL file under
`dashboards/reconciliation/`. Queries expose a standard result:

- business date
- metric ID
- numerator
- denominator
- metric value or status
- metric version
- origin and synthetic watermark
- quality and freshness status
- limitation code

## Validation

`make semantic-check` verifies that each query exists and references only its
allowlisted source. `make dashboard-reconcile` executes all 15 queries against
the local DuckDB marts and rederives every numeric value from its components.

The query files are executable evidence, not illustrative snippets.
