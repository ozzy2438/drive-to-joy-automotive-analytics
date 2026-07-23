# Lead Quality Analysis

select
  form_type,
  count(*) as web_leads,
  countif(crm_matched_flag) as crm_matched_leads,
  countif(qualified_lead_flag) as qualified_leads,
  safe_divide(countif(qualified_lead_flag), count(*)) as qualified_lead_rate
from {{ ref('fct_lead_funnel') }}
group by 1
