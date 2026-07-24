# Synthetic Data

Synthetic data represents the fictional AstraDrive automotive journey. It must be behaviourally coherent, reproducible and clearly labelled.

See `synthetic_data_specification.md` for requirements and `schema/` plus `data_dictionary/` for contracts.

## Generate and validate

From the repository root:

```bash
make setup
make generate-data
```

The pipeline writes source events, canonical events, submissions, CRM
outcomes, assignment tables and reference data to
`data/processed/local_foundation/`. It then validates schema compatibility,
identity separation, referential integrity, event ordering and bounded
experiment/personalisation joins with DuckDB.

The manifest records the seed, row counts, validation results and SHA-256
digest of each generated Parquet file. The generated data is ignored by Git.

Controlled data-quality defects are emitted only into separately named and
labelled files; governed canonical data remains clean.
