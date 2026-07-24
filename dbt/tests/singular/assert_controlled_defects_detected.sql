with registered_defects as (
  select *
  from {{ ref('stg_controlled_defect_registry') }}
  where expected_result = 'fail'
),

missing_vehicle_detected as (
  select
    'event' as record_type,
    event_id as record_id,
    'missing_required_vehicle_model' as check_name
  from {{ ref('stg_controlled_defect_events') }}
  where event_name in (
      'view_vehicle_model',
      'view_vehicle_variant',
      'configurator_start',
      'configurator_complete',
      'finance_calculator_start',
      'finance_calculator_complete'
    )
    and vehicle_model is null
),

duplicate_conversion_detected as (
  select
    'web_submission' as record_type,
    web_submission_id as record_id,
    'duplicate_conversion' as check_name
  from {{ ref('stg_controlled_defect_events') }}
  where event_name in ('test_drive_submit', 'quote_submit')
    and web_submission_id is not null
  group by 1, 2, 3
  having count(*) > 1
),

detected_defects as (
  select * from missing_vehicle_detected
  union all
  select * from duplicate_conversion_detected
)

select r.*
from registered_defects r
left join detected_defects d
  on r.record_type = d.record_type
 and r.record_id = d.record_id
 and r.check_name = d.check_name
where d.record_id is null
