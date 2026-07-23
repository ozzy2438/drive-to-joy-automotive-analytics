-- Purpose: find applicable events missing required vehicle context.

select *
from `analytics_staging.stg_ga4_events`
where event_name in ('view_vehicle_model','configurator_start','configurator_complete','test_drive_submit','quote_submit')
  and vehicle_model is null;
