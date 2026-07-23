# Architecture

## Logical flow

```text
Demo Automotive Website
→ dataLayer
→ Google Tag Manager
→ GA4-style Event Collection
→ BigQuery Raw Events

CRM Outcomes + Media Spend + Reference Data
→ BigQuery Raw Sources
→ dbt Staging
→ dbt Intermediate Models
→ Analytics Marts
→ Dashboards / Reports / Experimentation / Alerts
```

## Architecture goals

- Reliable measurement
- Privacy-aware data contracts
- Clear data lineage
- Reusable KPI logic
- Testable transformations
- Data-quality visibility
- Experiment validity
- Stakeholder-ready reporting

See `diagrams/` for Mermaid source files.
