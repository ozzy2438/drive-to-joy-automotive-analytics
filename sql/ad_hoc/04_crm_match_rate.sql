-- Business question: What share of web leads reaches CRM?
-- Grain: overall

select
  countif(web_lead_flag) as web_leads,
  countif(crm_matched_flag) as crm_matched_leads,
  safe_divide(countif(crm_matched_flag), countif(web_lead_flag)) as crm_match_rate
from `analytics_marts.fct_lead_funnel`;
