# Partitioning and Clustering

## Partitioning

Partition large events and daily facts by `event_date` or `business_date`.

## Clustering candidates

- `event_name`
- `user_pseudo_id`
- `session_id`
- `vehicle_model`
- `dealer_id`
- `campaign_id`
- `experiment_id`

## Rule

Every high-volume query must include an appropriate partition filter unless there is a documented exception.
