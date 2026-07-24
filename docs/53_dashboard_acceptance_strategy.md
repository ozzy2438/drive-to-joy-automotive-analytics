# Dashboard Acceptance Strategy

## Isolation

Dashboard acceptance uses the `dashboard_fixture` adapter and a separate
ignored DuckDB database. It does not mutate or reuse the normal local
warehouse.

## Scenarios

- `clean_baseline`
- `unmatched_crm`
- `identity_conflict`
- `zero_denominator`
- `stale_data`
- `invalid_utm`
- `missing_parameter`
- `srm_failure`
- `personalisation_holdout`

Inputs are versioned under `data/synthetic/dashboard_fixtures/v1/`. Expected
values are stored only in `dashboards/dashboard_acceptance_manifest.yml`.

## Comparison policy

- Integer numerator and denominator components use exact equality.
- Decimal components and rates use the contract tolerance.
- Null and zero-denominator behaviour is explicit.
- Metric, freshness and quality statuses use exact equality.

## Execution

```bash
make dashboard-fixtures
```

The command loads a separate fixture DuckDB, builds the fixture aggregate and
compares all expected components, values and statuses.

## Reconciliation

`make dashboard-reconcile` executes every contract query against the normal
synthetic smoke warehouse and rederives the published metric from its additive
components.
