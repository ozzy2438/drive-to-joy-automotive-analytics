# Logical Architecture

The logical architecture separates collection, storage, transformation, governance and consumption.

```text
Collection: website/dataLayer/GTM/GA4-style events
Sources: CRM, media, reference dimensions
Storage: raw warehouse datasets
Transformation: dbt staging/intermediate/marts
Governance: tests, quality checks, access and documentation
Consumption: dashboards, reports, experiments, personalisation analysis
```
