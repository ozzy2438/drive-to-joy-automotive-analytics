# Data Flow

1. Visitor interacts with demo site.
2. Site pushes structured event context to dataLayer.
3. GTM validates/mapping sends approved analytics events subject to consent.
4. Raw event data reaches GA4-style collection/export.
5. CRM, media and reference data enter raw datasets.
6. dbt standardises, sessionises, joins and creates marts.
7. Quality checks evaluate completeness, freshness, matching and experiment integrity.
8. Dashboards and reports consume marts.
9. Experiment and personalisation decisions are documented.
