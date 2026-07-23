# System Context

```mermaid
flowchart LR
  Visitor[Anonymous/known visitor] --> Demo[AstraDrive demo site]
  Demo --> GTM[dataLayer and GTM]
  GTM --> Analytics[GA4-style event collection]
  Analytics --> Warehouse[BigQuery warehouse]
  CRM[CRM outcomes] --> Warehouse
  Media[Media spend] --> Warehouse
  Reference[Vehicle/dealer/campaign reference] --> Warehouse
  Warehouse --> Marts[dbt marts]
  Marts --> Stakeholders[Dashboards and reports]
  Marts --> Experiments[Experiment analysis]
  Marts --> Quality[Quality monitoring]
```
