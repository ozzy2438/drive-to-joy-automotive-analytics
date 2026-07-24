with expected_variants as (
  select 'EXP-CTA-001' as experiment_id, 'control' as variant_id
  union all
  select 'EXP-CTA-001', 'treatment_a'
  union all
  select 'EXP-CTA-001', 'treatment_b'
),
observed as (
  select
    experiment_id,
    variant_id,
    count(distinct experiment_assignment_id) as exposed_assignments
  from {{ ref('int_experiment_exposure') }}
  where experiment_id = 'EXP-CTA-001'
  group by 1, 2
),
allocation as (
  select
    v.experiment_id,
    v.variant_id,
    coalesce(o.exposed_assignments, 0) as exposed_assignments
  from expected_variants v
  left join observed o
    on v.experiment_id = o.experiment_id
   and v.variant_id = o.variant_id
),
totals as (
  select
    experiment_id,
    sum(exposed_assignments) as total_exposed_assignments
  from allocation
  group by 1
),
diagnostic as (
  select
    a.experiment_id,
    t.total_exposed_assignments,
    sum(
      power(
        a.exposed_assignments - (t.total_exposed_assignments * 1.0 / 3),
        2
      ) / nullif(t.total_exposed_assignments * 1.0 / 3, 0)
    ) as chi_square_statistic
  from allocation a
  inner join totals t using (experiment_id)
  group by 1, 2
)
select *
from diagnostic
where total_exposed_assignments >= 30
  and chi_square_statistic > 5.991
