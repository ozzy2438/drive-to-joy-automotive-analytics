# Data Governance

## Principles

- One approved definition per KPI.
- One documented owner per critical dataset and dashboard.
- One event catalogue for tracking changes.
- One experiment registry for active and completed tests.
- One decision log for material metric and implementation decisions.

## Governance artefacts

| Artefact | Location |
|---|---|
| KPI definitions | `measurement/kpi_definitions.md` |
| Event catalogue | `measurement/event_catalogue.md` |
| Data dictionary | `data/synthetic/data_dictionary/` |
| Warehouse conventions | `warehouse/` |
| Transformation docs | `dbt/` |
| Quality controls | `docs/27_data_quality_framework.md` |
| Experiment registry | `experiments/experiment_registry.md` |
| Decision log | `confluence/decision_log.md` |

## Change rule

Any change to a KPI, event, identity join, experiment or dashboard metric must update the relevant documentation and include QA evidence.
