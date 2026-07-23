-- Purpose: decision-ready experiment summary.

select
  experiment_id,
  variant_id,
  sum(exposed_users) as exposed_users,
  sum(qualified_lead_users) as qualified_lead_users,
  safe_divide(sum(qualified_lead_users), sum(exposed_users)) as qualified_lead_rate,
  case when sum(exposed_users) < 1000 then 'insufficient_sample_review_required' else 'ready_for_statistical_review' end as decision_status
from `analytics_marts.fct_experiment_results`
group by 1,2;
