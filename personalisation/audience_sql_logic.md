# Audience SQL Logic

## Example: Configurator Abandoners

```sql
select distinct user_pseudo_id
from `analytics_marts.fct_vehicle_journey`
where configurator_start_flag = 1
  and configurator_complete_flag = 0
```

## Example: Returning High Intent

Implement using user-level event/session aggregation over the approved lookback window. Keep all audience rules versioned and testable.

## Rules

- Exclude users with completed lead conversion in cooldown where appropriate.
- Avoid sensitive attributes.
- Record eligibility timestamp and audience version.
- Do not mix audience eligibility with outcome metric logic.
