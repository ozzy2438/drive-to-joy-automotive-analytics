# Experiment Schema

| Field | Type | Description |
|---|---|---|
| experiment_id | STRING | Experiment identifier |
| experiment_name | STRING | Human-readable name |
| start_date | DATE | Planned/actual start |
| end_date | DATE | Planned/actual end |
| primary_metric | STRING | Decision metric |
| control_variant | STRING | Control label |
| treatment_variants | STRING | Treatment labels |
| allocation_ratio | STRING | Planned allocation |
| status | STRING | Draft/active/complete/stopped |
