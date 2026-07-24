# Dealer Schema

| Field | Type | Description |
|---|---|---|
| schema_version | STRING | Structural contract version |
| record_version | INTEGER | Stable business-record version |
| dealer_id | STRING | Unique fictional dealer key |
| dealer_name | STRING | Fictional name |
| state | STRING | Australian state |
| region_type | STRING | Metro/regional |
| active_flag | BOOLEAN | Active dealership |
| capacity_band | STRING | Synthetic capacity indicator |
| availability_state | STRING | Available/limited/inactive state |
| data_origin | STRING | Always `synthetic` |
