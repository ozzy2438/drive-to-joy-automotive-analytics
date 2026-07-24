# Personalisation Audience Registry Schema

| Field | Type | Description |
|---|---|---|
| schema_version | STRING | Structural contract version |
| record_version | INTEGER | Stable business-record version |
| audience_id | STRING | Stable audience key |
| audience_name | STRING | Fictional governed name |
| status | STRING | Runtime/governance state |
| runtime_enabled | BOOLEAN | Demo runtime activation |
| eligibility_version | STRING | Versioned rule reference |
| holdout_allocation | NUMERIC | Generic holdout share |
| cooldown_hours | INTEGER | Minimum repeat-exposure interval |
| priority | INTEGER | Collision resolution rank |
| exclusion_rule_reference | STRING | Governed exclusion rule |
| treatment_experience_id | STRING | Primary treatment experience |
| holdout_experience_id | STRING | Generic holdout experience |
| collision_namespace | STRING | Competing decision surface |
| owner | STRING | Accountable fictional team |
| data_origin | STRING | Always `synthetic` |
