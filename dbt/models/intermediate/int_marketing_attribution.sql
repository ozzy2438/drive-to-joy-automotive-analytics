with sessions as (
  select * from {{ ref('int_sessions') }}
),

campaigns as (
  select * from {{ ref('stg_campaign_registry') }}
)

select
  s.event_date,
  coalesce(
    c.channel,
    case
      when s.traffic_source = 'direct' then 'Direct'
      when s.traffic_medium = 'organic' then 'Organic Search'
      else 'Unattributed'
    end
  ) as channel,
  s.traffic_source as source,
  s.traffic_medium as medium,
  s.campaign_id,
  s.campaign_name,
  count(*) as sessions,
  countif(s.high_intent_flag = 1) as high_intent_sessions,
  countif(s.web_lead_flag = 1) as web_lead_sessions
from sessions s
left join campaigns c
  on s.campaign_id = c.campaign_id
group by 1, 2, 3, 4, 5, 6
