-- Purpose: SRM triage summary.

with a as (
  select experiment_id, variant_id, sum(exposed_users) as users
  from `analytics_marts.fct_experiment_results`
  group by 1,2
)
select experiment_id, max(users) as max_users, min(users) as min_users,
  safe_divide(max(users)-min(users), max(users)) as max_allocation_gap
from a
group by 1;
