with media as (
  select * from {{ ref('stg_media_spend') }}
),
journey as (
  select * from {{ ref('int_marketing_attribution') }}
)

select
  m.spend_date,
  m.channel,
  m.source,
  m.medium,
  m.campaign_id,
  m.campaign_name,
  m.objective,
  m.vehicle_model,
  m.spend_aud,
  m.impressions,
  m.clicks,
  coalesce(j.sessions, 0) as sessions,
  coalesce(j.high_intent_sessions, 0) as high_intent_sessions,
  coalesce(j.web_lead_sessions, 0) as web_lead_sessions
from media m
left join journey j
  on m.spend_date = j.event_date
 and m.channel = j.channel
