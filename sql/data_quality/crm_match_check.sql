-- Purpose: monitor web-to-CRM match rate.

select
  date(form_submit_at) as submit_date,
  count(*) as web_leads,
  countif(crm_matched_flag) as matched_leads,
  safe_divide(countif(crm_matched_flag), count(*)) as crm_match_rate
from `analytics_marts.fct_lead_funnel`
group by 1;
