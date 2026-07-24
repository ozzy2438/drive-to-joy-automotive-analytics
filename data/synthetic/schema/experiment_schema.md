# Experiment Schema

| Field | Type | Description |
|---|---|---|
| schema_version | STRING | Structural contract version |
| record_version | INTEGER | Stable business-record version |
| experiment_id | STRING | Experiment identifier |
| experiment_name | STRING | Human-readable name |
| collision_namespace | STRING | Mutually exclusive decision surface |
| status | STRING | Runtime/governance state |
| runtime_enabled | BOOLEAN | Demo runtime activation |
| allocation_unit | STRING | Stable assignment unit |
| allocation_rule | STRING | Deterministic assignment algorithm |
| variant_ids | STRING | Ordered semicolon-delimited variants |
| allocation | STRING | Registered variant allocation |
| planned_start_date | DATE | Planned start |
| planned_end_date | DATE | Planned end |
| primary_metric | STRING | Decision metric |
| owner | STRING | Accountable fictional team |
| feature_flag | STRING | Runtime kill-switch name |
| data_origin | STRING | Always `synthetic` |
