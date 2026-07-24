-- Personalisation Analysis

select
  audience_id,
  experience_id,
  holdout_flag,
  sum(exposed_users) as exposed_users,
  sum(web_leads) as web_leads,
  safe_divide(sum(web_leads), sum(exposed_users)) as web_lead_rate
from {{ ref('fct_personalisation_performance') }}
group by 1, 2, 3
