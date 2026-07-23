-- Purpose: guardrails for active experiment.
-- Extend with form error, exit, duplicate, rejection and page-performance sources.

select
  variant_id,
  sum(exposed_users) as exposed_users,
  sum(qualified_lead_users) as qualified_lead_users
from `analytics_marts.fct_experiment_results`
group by 1;
