with variants as (
  select
    {{ business_date('exposure_at') }} as business_date,
    experiment_id,
    variant_id,
    count(distinct experiment_assignment_id) as exposed_assignments,
    count(distinct if(
      qualified_lead_flag,
      web_submission_id,
      null
    )) as qualified_leads
  from {{ ref('int_experiment_outcomes') }}
  where assignment_valid_flag
  group by 1, 2, 3
),

totals as (
  select
    business_date,
    experiment_id,
    sum(exposed_assignments) as total_exposed_assignments,
    count(*) as variant_count
  from variants
  group by 1, 2
),

srm as (
  select
    v.business_date,
    v.experiment_id,
    t.total_exposed_assignments,
    t.variant_count,
    sum(
      (
        v.exposed_assignments
        - t.total_exposed_assignments * 1.0 / 3
      ) * (
        v.exposed_assignments
        - t.total_exposed_assignments * 1.0 / 3
      )
      / nullif(t.total_exposed_assignments * 1.0 / 3, 0)
    ) as srm_chi_square
  from variants v
  inner join totals t
    on v.business_date = t.business_date
   and v.experiment_id = t.experiment_id
  group by 1, 2, 3, 4
),

metadata as (
  select * from {{ ref('int_semantic_quality_status') }}
)

select
  v.business_date,
  v.experiment_id,
  v.variant_id,
  v.exposed_assignments,
  v.qualified_leads,
  {{ safe_divide(
    'v.qualified_leads',
    'v.exposed_assignments'
  ) }} as experiment_qualified_lead_rate,
  s.total_exposed_assignments,
  s.variant_count,
  s.srm_chi_square,
  case
    when s.variant_count != 3 or s.total_exposed_assignments < 30
      then 'unknown'
    when s.srm_chi_square > 5.991 then 'fail'
    else 'pass'
  end as srm_status,
  '1.0.0' as metric_contract_version,
  m.reporting_timezone,
  m.data_origin,
  m.synthetic_watermark,
  m.data_through_at_utc,
  m.evaluated_at_utc,
  m.freshness_status,
  case
    when s.variant_count = 3
      and s.total_exposed_assignments >= 30
      and s.srm_chi_square > 5.991
      then 'fail'
    else m.quality_status
  end as quality_status,
  m.limitation_code
from variants v
inner join srm s
  on v.business_date = s.business_date
 and v.experiment_id = s.experiment_id
cross join metadata m
