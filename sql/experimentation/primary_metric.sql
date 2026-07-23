-- Purpose: calculate primary qualified-lead metric by variant.

select
  experiment_id,
  variant_id,
  sum(exposed_users) as exposed_users,
  sum(qualified_lead_users) as qualified_lead_users,
  safe_divide(sum(qualified_lead_users), sum(exposed_users)) as qualified_lead_rate
from `analytics_marts.fct_experiment_results`
group by 1,2;
