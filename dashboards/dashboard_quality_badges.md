# Dashboard Quality Badges

## Standard statuses

| Status | Meaning |
|---|---|
| `fail` | A critical contract or reconciliation condition failed |
| `stale` | Data is older than the governed freshness SLA |
| `warn` | A non-critical quality condition needs attention |
| `unknown` | Evidence or a valid denominator is unavailable |
| `pass` | All applicable checks passed |

## Precedence

`fail` → `stale` → `warn` → `unknown` → `pass`.

The first applicable status wins. For example, stale data with a critical
identity conflict is `fail`, while otherwise valid but late data is `stale`.
Daily CRM match rates with fewer than 10 eligible submissions are `unknown`
rather than thresholded; an identity conflict remains `fail` at any volume.

## Sources

- `fct_data_quality_results` supplies executable quality checks.
- `fct_reconciliation_results` supplies CRM match and identity status.
- `int_semantic_quality_status` applies run-level precedence.
- Governed aggregates publish the final badge beside every metric row.

Badges must display synthetic watermark, data-through timestamp and limitation
code. They must not be used to imply real commercial performance.
