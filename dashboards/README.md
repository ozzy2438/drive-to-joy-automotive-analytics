# Dashboard Strategy

## Principle

Dashboards are decision interfaces, not metric collections.

Every dashboard must answer:

1. What happened?
2. Why might it have happened?
3. What is the commercial or customer impact?
4. What action should the owner take?
5. How reliable is the underlying data?

## Dashboard inventory

| Dashboard | Audience | Primary decision |
|---|---|---|
| Executive Digital Performance | Digital leadership | Priorities and investment |
| Customer Journey and UX | Product, UX and web | Friction to resolve |
| Marketing Performance | Marketing and agencies | Channel/campaign quality |
| Data Quality Monitor | Analytics, engineering and CRM | Measurement issues |
| Experimentation Hub | CRO, product and leadership | Rollout, stop or iterate |
| Personalisation Performance | CRM, MarTech and digital | Incremental audience value |

## Mandatory dashboard elements

- Reporting period
- Data freshness timestamp
- Data-quality status
- Metric definition link
- Decision purpose
- Owner
- Known limitation
- Recommended next action

## Executable pre-UI gate

Dashboard UI is not yet implemented. Its governed foundation is executable:

- `measurement/metric_contracts.yml` freezes 15 versioned metrics.
- `dashboard_sources.yml` allowlists six aggregate models.
- `dashboard_acceptance_manifest.yml` stores versioned synthetic expectations.
- `reconciliation/` contains one executable query per metric.

```bash
make semantic-check
make dashboard-fixtures
make dashboard-reconcile
```
