with events as (
  select *
  from {{ ref('stg_ga4_events') }}
  where session_id is not null
    and vehicle_model is not null
)

select
  session_id,
  max(user_pseudo_id) as user_pseudo_id,
  vehicle_model,
  cast(min(event_at) as date) as event_date,
  min(event_at) as journey_start_at,
  max(event_at) as journey_end_at,
  max(if(event_name = 'view_vehicle_model', 1, 0)) as viewed_model_flag,
  max(if(event_name = 'view_vehicle_variant', 1, 0)) as viewed_variant_flag,
  max(if(event_name = 'view_specification', 1, 0)) as viewed_specification_flag,
  max(if(event_name = 'view_offer', 1, 0)) as viewed_offer_flag,
  max(if(event_name = 'configurator_start', 1, 0)) as configurator_start_flag,
  max(if(
    event_name = 'configurator_complete',
    1,
    0
  )) as configurator_complete_flag,
  max(if(event_name = 'finance_calculator_start', 1, 0)) as finance_start_flag,
  max(if(
    event_name = 'finance_calculator_complete',
    1,
    0
  )) as finance_complete_flag,
  max(if(event_name = 'dealer_select', 1, 0)) as dealer_select_flag,
  max(if(event_name = 'test_drive_submit', 1, 0)) as test_drive_submit_flag,
  max(if(event_name = 'quote_submit', 1, 0)) as quote_submit_flag
from events
group by session_id, vehicle_model
