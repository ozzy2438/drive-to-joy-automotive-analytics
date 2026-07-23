-- Business question: Is experiment allocation materially imbalanced?

with allocation as (
  select experiment_id, variant_id, sum(exposed_users) as users
  from `analytics_marts.fct_experiment_results`
  group by 1,2
)
select
  experiment_id,
  max(users) as max_variant_users,
  min(users) as min_variant_users,
  safe_divide(max(users) - min(users), max(users)) as allocation_gap
from allocation
group by 1;
