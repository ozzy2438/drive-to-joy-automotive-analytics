-- Business question: Where do mobile form users experience friction?
-- Grain: form type
-- Source: analytics_marts.fct_lead_funnel

select
  form_type,
  count(*) as leads_with_form_context,
  countif(form_error_count > 0) as leads_with_errors,
  safe_divide(countif(form_error_count > 0), count(*)) as form_error_rate,
  avg(form_error_count) as avg_errors_per_lead
from `analytics_marts.fct_lead_funnel`
group by 1;
