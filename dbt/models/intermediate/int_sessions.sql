with events as (
  select * from {{ ref('stg_ga4_events') }}
),

sessionised as (
  select
    concat(user_pseudo_id, '-', ga_session_id) as session_id,
    user_pseudo_id,
    event_date,
    min(event_at) as session_start_at,
    max(event_at) as session_end_at,
    any_value(consent_analytics) as consent_analytics,
    max(if(event_name = 'view_vehicle_model', 1, 0)) as viewed_model_flag,
    max(if(event_name in ('configurator_start', 'configurator_complete', 'finance_calculator_complete', 'dealer_select', 'test_drive_start', 'quote_start'), 1, 0)) as high_intent_flag,
    max(if(event_name in ('test_drive_submit', 'quote_submit'), 1, 0)) as web_lead_flag
  from events
  where ga_session_id is not null
  group by 1, 2, 3
)

select * from sessionised
