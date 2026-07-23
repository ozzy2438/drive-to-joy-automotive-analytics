-- Purpose: campaign and channel performance extract.

select
  spend_date,
  channel,
  campaign_id,
  campaign_name,
  sum(spend_aud) as spend_aud,
  sum(clicks) as clicks,
  sum(sessions) as sessions,
  sum(web_lead_sessions) as web_leads,
  safe_divide(sum(spend_aud), nullif(sum(web_lead_sessions),0)) as cost_per_web_lead
from `analytics_marts.fct_media_performance`
group by 1,2,3,4;
