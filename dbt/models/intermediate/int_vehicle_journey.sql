with events as (
  select * from {{ ref('stg_ga4_events') }}
),

journey as (
  select
    session_id,
    vehicle_model,
    max(if(event_name = 'view_vehicle_model', 1, 0)) as viewed_model_flag,
    max(if(event_name = 'configurator_start', 1, 0)) as configurator_start_flag,
    max(if(event_name = 'configurator_complete', 1, 0)) as configurator_complete_flag,
    max(if(event_name = 'finance_calculator_start', 1, 0)) as finance_start_flag,
    max(if(event_name = 'finance_calculator_complete', 1, 0)) as finance_complete_flag,
    max(if(event_name = 'dealer_select', 1, 0)) as dealer_select_flag,
    max(if(event_name = 'test_drive_submit', 1, 0)) as test_drive_submit_flag,
    max(if(event_name = 'quote_submit', 1, 0)) as quote_submit_flag
  from events
  where session_id is not null
  group by 1, 2
)

select * from journey
