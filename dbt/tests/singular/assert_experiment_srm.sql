with allocation as (
  select experiment_id, variant_id, sum(exposed_users) as users
  from {{ ref('fct_experiment_results') }}
  group by 1, 2
),
by_experiment as (
  select experiment_id, max(users) as max_users, min(users) as min_users
  from allocation
  group by 1
)
select *
from by_experiment
where safe_divide(max_users - min_users, max_users) > 0.1
