with media as (
  select * from {{ ref('stg_media_spend') }}
),

attribution as (
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
  coalesce(a.sessions, 0) as sessions,
  coalesce(a.high_intent_sessions, 0) as high_intent_sessions,
  coalesce(a.web_lead_sessions, 0) as web_lead_sessions,
  {{ safe_divide('m.spend_aud', 'coalesce(a.web_lead_sessions, 0)') }}
    as cost_per_web_lead
from media m
left join attribution a
  on m.spend_date = a.event_date
 and m.campaign_id = a.campaign_id
