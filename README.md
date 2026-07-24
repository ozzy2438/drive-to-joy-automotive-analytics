# Drive to Joy

> Production-style Automotive Digital Analytics, Experimentation and Lead-Quality Intelligence Platform.

## Overview

Drive to Joy is an end-to-end portfolio case study for an Automotive Analytics Specialist role. It demonstrates how an automotive brand can measure and optimise customer journeys from vehicle discovery through qualified CRM leads, test-drive attendance and vehicle-order outcomes.

## What this repository covers

- GA4-style event measurement design
- Google Tag Manager and dataLayer specifications
- Consent-aware analytics design
- BigQuery warehouse architecture
- dbt transformation strategy
- CRM lead-quality closure
- Marketing channel and campaign measurement
- Data-quality monitoring
- A/B testing and experimentation governance
- Personalisation audience and holdout design
- Dashboard specifications
- Jira, Confluence and operating-model documentation
- Portfolio and interview materials

## Important data disclosure

This repository contains **no proprietary Honda Australia data**, customer data, campaign data, CRM data, dealership data, or internal analytics exports. The core data model is synthetic and the project is a fictional, production-style automotive analytics case study.

Honda Australia is referenced only as the target-employer and role context. This work is not affiliated with, commissioned by, or endorsed by Honda Australia.

## Business problem

Automotive businesses can see traffic and form submissions, but often cannot reliably identify which channels, customer journeys and digital experiences create qualified CRM leads, attended test drives and vehicle orders.

Drive to Joy connects website behaviour, campaign context, CRM outcomes, data-quality monitoring and experimentation to support commercial decisions.

## North Star Metric

### Qualified Leads per 1,000 Engaged Sessions

```text
Qualified Leads per 1,000 Engaged Sessions =
(Qualified CRM Leads / Engaged Sessions) × 1,000
```

## Planned customer journey

```text
Acquisition
→ Landing Page
→ Vehicle Range
→ Vehicle Model Page
→ Configurator / Finance Calculator / Dealer Search
→ Test Drive or Quote Form
→ CRM Lead
→ Qualified Lead
→ Appointment Attended
→ Vehicle Order
```

## Repository navigation

| Directory | Purpose |
|---|---|
| [`docs/`](./docs) | Business context, strategy, governance and technical plans |
| [`roadmap/`](./roadmap) | End-to-end implementation sequence |
| [`architecture/`](./architecture) | Architecture decisions and Mermaid diagrams |
| [`measurement/`](./measurement) | KPI, event, GTM, GA4 and QA specifications |
| [`contracts/`](./contracts) | Versioned event, identity, CRM and assignment contracts |
| [`data/`](./data) | Data policy, sources and synthetic-data contracts |
| [`crm/`](./crm) | Lead lifecycle and online-to-offline measurement |
| [`warehouse/`](./warehouse) | BigQuery warehouse guidance |
| [`dbt/`](./dbt) | Transformation-layer design |
| [`sql/`](./sql) | Analysis and data-quality query plan |
| [`python/`](./python) | Data generation and analysis module plan |
| [`experiments/`](./experiments) | Experiment governance and case studies |
| [`personalisation/`](./personalisation) | Audience and holdout design |
| [`dashboards/`](./dashboards) | Dashboard specifications |
| [`web-demo/`](./web-demo) | Fictional automotive demo site requirements |
| [`operations/`](./operations) | Runbooks and operating model |
| [`jira/`](./jira) | Epics, stories and acceptance criteria |
| [`confluence/`](./confluence) | Documentation-hub structure |
| [`presentation/`](./presentation) | Portfolio and interview collateral |

## Local foundation

Sprint 0–1 provides a deterministic, privacy-safe development baseline. It
normalises both flat synthetic events and nested GA4 BigQuery export records
into canonical contract version `1.1.0`, generates coherent synthetic
outcomes, and validates the result in DuckDB.

Prerequisites are Python 3.11+, Make and Node.js/npm for Markdown linting.

```bash
make setup
make check
```

The generated Parquet files and validation manifest are written to
`data/processed/local_foundation/` and ignored by Git. Override the
deterministic defaults when needed:

```bash
make generate-data SEED=20260723 DAYS=60 SESSIONS=5000
```

See the [canonical contracts](./contracts/README.md),
[local Python workflow](./python/README.md), and
[repository governance](./docs/40_repository_governance.md).

## Build order

Start with [`roadmap/README.md`](./roadmap/README.md). Do not start with dashboards.

1. Define business problem, stakeholders and KPI tree.
2. Define the canonical data, identity and outcome contracts.
3. Generate and validate deterministic synthetic data.
4. Build warehouse adapters, dbt models and data-quality tests.
5. Build the fictional automotive demo site.
6. Implement dataLayer, GTM and GA4-style event collection.
7. Add data-quality monitoring.
8. Build stakeholder dashboards.
9. Run experiments and analyse results.
10. Add personalisation audiences and holdouts.
11. Package a portfolio case study and interview walkthrough.

## Reference sources

- [Google Analytics demo account](https://support.google.com/analytics/answer/6367342)
- [Google Analytics BigQuery sample dataset documentation](https://support.google.com/analytics/answer/10937659)
- [GA4 BigQuery export schema](https://support.google.com/analytics/answer/7029846)
- [Google Analytics ecommerce event reference](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [FCAI VFACTS publications](https://www.fcai.com.au/news/index/view/news/770)
- [Australian Bureau of Statistics](https://www.abs.gov.au/statistics)
- [Google Trends](https://trends.google.com/trends/)
- [data.gov.au](https://data.gov.au/data)

## Current status

Sprint 0–1 establishes the executable local foundation: versioned contracts,
source adapters, deterministic generators, DuckDB checks and meaningful CI.
Dashboard, demo-site and live-experiment implementation remain out of scope
until the canonical mart and data-quality layers are complete.
