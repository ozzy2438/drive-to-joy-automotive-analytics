# Campaign Registry Schema

| Field | Type | Description |
|---|---|---|
| schema_version | STRING | Structural contract version |
| record_version | INTEGER | Stable business-record version |
| campaign_id | STRING | Stable fictional campaign key |
| campaign_name | STRING | Governed lowercase UTM campaign name |
| channel | STRING | Acquisition channel |
| source | STRING | Governed source |
| medium | STRING | Governed medium |
| owner | STRING | Accountable fictional team |
| objective | STRING | Campaign objective |
| focus_type | STRING | Vehicle/audience/sitewide focus |
| focus_id | STRING | Referential focus key |
| landing_page | STRING | Approved relative landing route |
| active_start_date | DATE | Planned active start |
| active_end_date | DATE | Planned active end |
| governance_status | STRING | Draft/approved/retired |
| data_origin | STRING | Always `synthetic` |
