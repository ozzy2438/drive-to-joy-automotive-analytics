# Executable Dashboard Metric Layer

## Source of truth

The semantic layer is governed by three machine-readable assets:

1. `measurement/metric_contracts.yml` defines metric meaning and version.
2. `dashboards/dashboard_sources.yml` allowlists dashboard-facing models.
3. `dashboards/dashboard_acceptance_manifest.yml` stores fixture expectations.

Markdown explains these contracts but does not override them.

## Query path

```text
Canonical marts
→ fct_reconciliation_results
→ governed agg_*_daily models
→ executable reconciliation SQL
→ future dashboard implementation
```

Dashboard specifications and SQL cannot reference raw, staging or intermediate
models. `make semantic-check` enforces the source boundary.

## Aggregation behaviour

- `ratio_of_sums`: sum numerator and denominator, then divide.
- `difference_of_ratios`: independently calculate both ratios, then subtract.
- `additive`: sum across compatible dimensions.
- `status`: apply the governed status rule; never average or count statuses.

Daily rates must not be averaged. Each aggregate preserves additive components
beside the convenience rate.

## Calendar and time

- Source and lifecycle timestamps remain UTC.
- `business_date` is derived in `Australia/Melbourne`.
- SQL and Python tests cover daylight-saving fall-back and spring-forward.
- Media `spend_date` is already a governed Australian business date.

## Required row metadata

Each production aggregate exposes:

- `metric_contract_version`
- `reporting_timezone`
- `data_origin`
- `synthetic_watermark`
- `data_through_at_utc`
- `evaluated_at_utc`
- `freshness_status`
- `quality_status`
- `limitation_code`

## Quality precedence

`fail` → `stale` → `warn` → `unknown` → `pass`.

The first applicable status is published. A valid metric value does not
override a failing data-quality badge.

## Execution

```bash
make semantic-check
make dashboard-fixtures
make dashboard-reconcile
```

No dashboard UI, Looker Studio or Tableau implementation is part of this
layer.
