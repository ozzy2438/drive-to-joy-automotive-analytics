# Vehicle Catalogue Schema

| Field | Type | Description |
|---|---|---|
| schema_version | STRING | Structural contract version |
| record_version | INTEGER | Stable business-record version |
| vehicle_model_id | STRING | Stable fictional model key |
| vehicle_model | STRING | Model family |
| model_slug | STRING | Route-safe model identifier |
| variant_id | STRING | Stable fictional variant key |
| vehicle_variant | STRING | Variant name |
| body_type | STRING | SUV/sedan/etc. |
| usage_segment | STRING | Fictional primary use context |
| powertrain | STRING | Hybrid/petrol/etc. |
| price_band | STRING | Synthetic pricing band |
| seats | INTEGER | Capacity |
| launch_status | STRING | Current/future/discontinued |
| data_origin | STRING | Always `synthetic` |
