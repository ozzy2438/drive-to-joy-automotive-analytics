-- Channel Quality Analysis

select
  channel,
  sum(spend_aud) as spend_aud,
  sum(sessions) as sessions,
  sum(web_lead_sessions) as web_lead_sessions,
  safe_divide(sum(spend_aud), nullif(sum(web_lead_sessions), 0)) as cost_per_web_lead
from {{ ref('fct_media_performance') }}
group by 1
