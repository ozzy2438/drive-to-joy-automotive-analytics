# Build Roadmap

## Delivery principle

Build this project in dependency order. Dashboards are not the starting point: business definitions, tracking contracts, data modelling and data-quality controls come first.

## Phases

| Phase | Goal |
|---|---|
| 00 | Repository setup and delivery standards |
| 01 | Business, stakeholder, product and KPI definition |
| 02 | Measurement foundation: dataLayer, GTM, GA4, consent and UTM governance |
| 03 | Fictional automotive demo website |
| 04 | Synthetic-data generation and public-context data ingestion |
| 05 | Warehouse and dbt transformations |
| 06 | Stakeholder dashboards and reports |
| 07 | Data-quality monitoring, alerts and runbooks |
| 08 | A/B testing and experimentation |
| 09 | Personalisation audiences, holdouts and measurement |
| 10 | Operating model: Jira, Confluence, RACI and release process |
| 11 | Portfolio packaging |
| 12 | Interview walkthrough and role alignment |

## Mandatory quality gate before dashboards

- KPI definitions complete.
- Event taxonomy complete.
- dataLayer contract complete.
- CRM matching strategy documented.
- Data dictionary complete.
- Warehouse transformations tested.
- Data-quality checks operational.
- Known limitations disclosed.

## Start here

1. Read [`../docs/00_project_charter.md`](../docs/00_project_charter.md)
2. Complete [`phase_00_repository_setup.md`](./phase_00_repository_setup.md)
3. Complete phases sequentially.
