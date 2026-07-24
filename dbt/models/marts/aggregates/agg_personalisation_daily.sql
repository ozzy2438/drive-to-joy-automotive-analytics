with outcomes as (
  select
    {{ business_date('exposure_at') }} as business_date,
    audience_id,
    experience_id,
    holdout_flag,
    count(distinct personalisation_assignment_id) as exposed_assignments,
    count(distinct if(
      qualified_lead_flag,
      web_submission_id,
      null
    )) as qualified_leads
  from {{ ref('int_personalisation_outcomes') }}
  where assignment_valid_flag
  group by 1, 2, 3, 4
),

treatment as (
  select *
  from outcomes
  where not holdout_flag
),

holdout as (
  select
    business_date,
    audience_id,
    sum(exposed_assignments) as holdout_exposures,
    sum(qualified_leads) as holdout_qualified_leads
  from outcomes
  where holdout_flag
  group by 1, 2
),

metadata as (
  select * from {{ ref('int_semantic_quality_status') }}
)

select
  t.business_date,
  t.audience_id,
  t.experience_id,
  t.exposed_assignments as treatment_exposures,
  t.qualified_leads as treatment_qualified_leads,
  coalesce(h.holdout_exposures, 0) as holdout_exposures,
  coalesce(h.holdout_qualified_leads, 0) as holdout_qualified_leads,
  {{ safe_divide(
    't.qualified_leads',
    't.exposed_assignments'
  ) }} as treatment_qualified_lead_rate,
  {{ safe_divide(
    'h.holdout_qualified_leads',
    'h.holdout_exposures'
  ) }} as holdout_qualified_lead_rate,
  (
    {{ safe_divide(
      't.qualified_leads',
      't.exposed_assignments'
    ) }}
    - {{ safe_divide(
      'h.holdout_qualified_leads',
      'h.holdout_exposures'
    ) }}
  ) as personalisation_holdout_lift,
  '1.0.0' as metric_contract_version,
  m.reporting_timezone,
  m.data_origin,
  m.synthetic_watermark,
  m.data_through_at_utc,
  m.evaluated_at_utc,
  m.freshness_status,
  case
    when coalesce(h.holdout_exposures, 0) = 0 then 'unknown'
    else m.quality_status
  end as quality_status,
  m.limitation_code
from treatment t
left join holdout h
  on t.business_date = h.business_date
 and t.audience_id = h.audience_id
cross join metadata m
