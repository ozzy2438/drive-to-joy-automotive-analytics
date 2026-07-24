# Python Local Foundation

## Purpose

This package implements deterministic synthetic data generation, source
normalisation, contract validation, local warehouse checks and experiment
calculation utilities.

## Implemented modules

| Module | Responsibility |
|---|---|
| `data_generation` | Generate synthetic event, CRM, media, dealer and experiment datasets |
| `adapters` | Normalise flat synthetic and nested GA4 BigQuery shapes |
| `contracts` | Enforce canonical columns, JSON Schemas and privacy invariants |
| `warehouse` | Validate the generated local foundation with DuckDB |
| `semantic` | Validate metric contracts, build isolated fixtures and reconcile dashboard aggregates |
| `experimentation` | Power calculation, frequentist/Bayesian analysis, SRM and guardrails |

Lead scoring and reporting exports remain future work.

## Commands

Run these from the repository root:

```bash
make setup
make test-python
make generate-data
make warehouse-smoke
make warehouse-scale
make semantic-check
make dashboard-fixtures
make dashboard-reconcile
make dbt-parse
```

Or invoke the pipeline from this directory:

```bash
.venv/bin/python -m src.pipeline \
  --output ../data/processed/local_foundation \
  --seed 20260723 \
  --days 30 \
  --sessions 1000
```

The same seed and parameters produce the same logical records. The output
manifest includes file digests, bounded-context metrics and executable
validation results. The loader verifies every digest before materialising
governed DuckDB raw schemas.

## Rules

- Tests are required for calculation logic.
- Random seeds must be configurable for reproducible synthetic data.
- No credentials or production data may be stored here.
- Outputs must be labelled synthetic where applicable.
