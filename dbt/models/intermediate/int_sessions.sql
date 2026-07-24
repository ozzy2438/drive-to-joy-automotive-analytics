with events as (
  select *
  from {{ ref('stg_ga4_events') }}
  where session_id is not null
    and consent_analytics = 'granted'
),

ranked as (
  select
    *,
    row_number() over (
      partition by session_id
      order by event_at, event_id
    ) as event_sequence
  from events
)

select
  session_id,
  max(user_pseudo_id) as user_pseudo_id,
  cast(min(event_at) as date) as event_date,
  min(event_at) as session_start_at,
  max(event_at) as session_end_at,
  max(consent_analytics) as consent_analytics,
  max(if(event_sequence = 1, device_category, null)) as device_category,
  max(if(event_sequence = 1, traffic_source, null)) as traffic_source,
  max(if(event_sequence = 1, traffic_medium, null)) as traffic_medium,
  max(if(event_sequence = 1, campaign_id, null)) as campaign_id,
  max(if(event_sequence = 1, campaign_name, null)) as campaign_name,
  count(*) as event_count,
  max(if(event_name = 'view_vehicle_model', 1, 0)) as viewed_model_flag,
  max(if(
    event_name in (
      'configurator_start',
      'configurator_complete',
      'finance_calculator_complete',
      'dealer_select',
      'test_drive_start',
      'quote_start'
    ),
    1,
    0
  )) as high_intent_flag,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    1,
    0
  )) as web_lead_flag
from ranked
group by session_id
