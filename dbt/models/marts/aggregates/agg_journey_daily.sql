with daily as (
  select
    {{ business_date('journey_start_at') }} as business_date,
    vehicle_model,
    countif(viewed_model_flag = 1) as model_view_sessions,
    countif(test_drive_submit_flag = 1) as test_drive_submit_sessions,
    countif(configurator_start_flag = 1) as configurator_starts,
    countif(configurator_complete_flag = 1) as configurator_completions,
    countif(finance_complete_flag = 1) as finance_complete_sessions,
    countif(
      finance_complete_flag = 1
      and (
        test_drive_submit_flag = 1
        or quote_submit_flag = 1
      )
    ) as finance_complete_lead_sessions
  from {{ ref('fct_vehicle_journey') }}
  group by 1, 2
),

metadata as (
  select * from {{ ref('int_semantic_quality_status') }}
)

select
  d.business_date,
  d.vehicle_model,
  d.model_view_sessions,
  d.test_drive_submit_sessions,
  d.configurator_starts,
  d.configurator_completions,
  d.finance_complete_sessions,
  d.finance_complete_lead_sessions,
  {{ safe_divide(
    'd.test_drive_submit_sessions',
    'd.model_view_sessions'
  ) }} as model_to_test_drive_rate,
  {{ safe_divide(
    'd.configurator_completions',
    'd.configurator_starts'
  ) }} as configurator_completion_rate,
  {{ safe_divide(
    'd.finance_complete_lead_sessions',
    'd.finance_complete_sessions'
  ) }} as finance_to_lead_progression_rate,
  '1.0.0' as metric_contract_version,
  m.reporting_timezone,
  m.data_origin,
  m.synthetic_watermark,
  m.data_through_at_utc,
  m.evaluated_at_utc,
  m.freshness_status,
  m.quality_status,
  m.limitation_code
from daily d
cross join metadata m
