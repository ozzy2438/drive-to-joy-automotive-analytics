# Data Quality Framework

## Quality dimensions

| Dimension | Question |
|---|---|
| Completeness | Are mandatory fields present? |
| Accuracy | Does the value represent intended action? |
| Timeliness | Is data available when needed? |
| Consistency | Do definitions align across systems? |
| Uniqueness | Are duplicate events/leads controlled? |
| Validity | Are values within approved rules? |
| Traceability | Can a metric be traced to source and logic? |

## Checks

| Check | Severity |
|---|---|
| Daily event anomaly | High |
| Missing mandatory parameter | High |
| Duplicate conversion | High |
| UTM compliance | Medium |
| CRM match rate | Critical |
| Source freshness | Critical |
| Consent shift | Medium |
| Experiment SRM | Critical |
| Invalid funnel progression | High |
| Assignment/exposure mismatch | Critical |
| Outcome outside analysis window | Critical |
| Web/CRM identity conflict | Critical |
| Controlled defect not detected | Critical |

## Response

Critical issues require immediate investigation; high issues within one business day; medium issues enter planned remediation; low governance issues are handled in maintenance.

Local owners, triage and scale instructions are in the
[local warehouse runbook](../operations/local_warehouse_runbook.md).
