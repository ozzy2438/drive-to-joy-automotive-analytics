-- Purpose: segment variant results. Add device/channel/model fields when exposure mart carries those dimensions.

select
  experiment_id,
  variant_id,
  sum(exposed_users) as exposed_users,
  safe_divide(sum(qualified_lead_users), sum(exposed_users)) as qualified_lead_rate
from `analytics_marts.fct_experiment_results`
group by 1,2;
