# Warehouse README

This directory documents the warehouse environment, access conventions, cost controls, scheduling and lineage.

The preferred future production-style target is BigQuery. Sprint 4 implements
the complete local contract in DuckDB, with adapter-dispatched SQL where
engines differ. This is reproducible warehouse evidence, not a production GCP
deployment.

See [local warehouse and reconciliation](../docs/46_local_warehouse_and_reconciliation.md)
[implementation status](./implementation_status.md) and
[ADR-011](../architecture/architecture_decision_records/ADR-011-local-warehouse-execution.md).
