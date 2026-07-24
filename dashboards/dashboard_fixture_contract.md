# Dashboard Fixture Contract

## Adapter

`dashboard_fixture` is an acceptance-only semantic adapter. It loads versioned
synthetic metric components into `raw_dashboard_fixtures.metric_inputs` in
`data/processed/dashboard_fixtures.duckdb`.

The database and generated manifest are Git-ignored. The source CSV and
expected-value YAML are committed and reviewable.

## Input fields

| Field | Purpose |
|---|---|
| `fixture_version` | Fixture semantic version |
| `scenario_id` | Required acceptance scenario |
| `metric_id` | Governed metric identity |
| `operation` | Ratio, difference, count, status or freshness |
| `numerator`, `denominator`, `scale` | Additive calculation inputs |
| `status_value` | Exact status input when applicable |
| `data_through_at_utc`, `evaluated_at_utc` | Deterministic freshness clock |
| `input_quality_status` | Scenario quality input |
| `limitation_code` | Reader-facing limitation key |
| `data_origin` | Must be `synthetic` |

Expected values are prohibited from the input CSV and metric registry.

## Required scenarios

The builder rejects any fixture set that does not contain all nine governed
scenarios. It also rejects non-synthetic origin.
