with media as (
  select
    spend_date as business_date,
    channel,
    campaign_id,
    max(campaign_name) as campaign_name,
    sum(spend_aud) as spend_aud,
    sum(impressions) as impressions,
    sum(clicks) as clicks,
    sum(sessions) as sessions,
    sum(web_lead_sessions) as web_lead_sessions
  from {{ ref('fct_media_performance') }}
  group by 1, 2, 3
),

attributed_leads as (
  select
    {{ business_date('l.form_submit_at') }} as business_date,
    coalesce(c.channel, 'Unattributed') as channel,
    s.campaign_id,
    countif(l.qualified_lead_flag) as attributed_qualified_leads
  from {{ ref('fct_lead_funnel') }} l
  left join {{ ref('fct_sessions') }} s
    on l.session_id = s.session_id
  left join {{ ref('dim_campaign') }} c
    on s.campaign_id = c.campaign_id
  where l.web_lead_flag
  group by 1, 2, 3
),

daily as (
  select
    coalesce(m.business_date, a.business_date) as business_date,
    coalesce(m.channel, a.channel) as channel,
    coalesce(m.campaign_id, a.campaign_id) as campaign_id,
    m.campaign_name,
    coalesce(m.spend_aud, 0) as spend_aud,
    coalesce(m.impressions, 0) as impressions,
    coalesce(m.clicks, 0) as clicks,
    coalesce(m.sessions, 0) as sessions,
    coalesce(m.web_lead_sessions, 0) as web_lead_sessions,
    coalesce(a.attributed_qualified_leads, 0)
      as attributed_qualified_leads
  from media m
  full outer join attributed_leads a
    on m.business_date = a.business_date
   and m.channel = a.channel
   and coalesce(m.campaign_id, '') = coalesce(a.campaign_id, '')
),

metadata as (
  select * from {{ ref('int_semantic_quality_status') }}
)

select
  d.*,
  {{ safe_divide(
    'd.spend_aud',
    'd.attributed_qualified_leads'
  ) }} as cost_per_qualified_lead,
  '1.0.0' as metric_contract_version,
  m.reporting_timezone,
  m.data_origin,
  m.synthetic_watermark,
  m.data_through_at_utc,
  m.evaluated_at_utc,
  m.freshness_status,
  m.quality_status,
  m.limitation_code
from daily d
cross join metadata m
