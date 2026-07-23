-- Business question: Which channels bring quality, not only volume?
-- Grain: channel
-- Source: analytics_marts.fct_media_performance and fct_lead_funnel

select
  channel,
  sum(spend_aud) as spend_aud,
  sum(sessions) as sessions,
  sum(web_lead_sessions) as web_leads,
  safe_divide(sum(spend_aud), nullif(sum(web_lead_sessions), 0)) as cost_per_web_lead
from `analytics_marts.fct_media_performance`
group by 1
order by spend_aud desc;
