-- Business question: Are mandatory event fields complete?

select
  event_name,
  count(*) as event_count,
  countif(vehicle_model is null and event_name in ('view_vehicle_model','configurator_start','configurator_complete','test_drive_submit','quote_submit')) as missing_vehicle_model,
  safe_divide(
    countif(vehicle_model is null and event_name in ('view_vehicle_model','configurator_start','configurator_complete','test_drive_submit','quote_submit')),
    count(*)
  ) as missing_vehicle_model_rate
from `analytics_staging.stg_ga4_events`
group by 1;
