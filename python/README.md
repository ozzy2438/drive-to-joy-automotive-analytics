# Python Module Plan

## Purpose

This directory will contain Python modules for synthetic data generation, data-quality checks, experimentation analysis, lead-scoring prototyping and reporting exports.

## Planned modules

| Module | Responsibility |
|---|---|
| `data_generation` | Generate synthetic event, CRM, media, dealer and experiment datasets |
| `data_quality` | Detect anomalies, completeness failures, duplicates and matching issues |
| `experimentation` | Power calculation, frequentist/Bayesian analysis, SRM and guardrails |
| `lead_scoring` | Explainable behavioural scoring and calibration against CRM outcomes |
| `reporting` | Weekly summaries, experiment readouts and documentation exports |

## Rules

- Tests are required for calculation logic.
- Random seeds must be configurable for reproducible synthetic data.
- No credentials or production data may be stored here.
- Outputs must be labelled synthetic where applicable.
