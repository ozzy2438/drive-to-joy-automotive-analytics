with events as (
  select *
  from {{ ref('stg_ga4_events') }}
  where form_instance_id is not null
    and event_name in (
      'test_drive_start',
      'quote_start',
      'form_error',
      'test_drive_submit',
      'quote_submit'
    )
)

select
  form_instance_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    web_submission_id,
    null
  )) as web_submission_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    lead_id_hash,
    null
  )) as lead_id_hash,
  max(user_pseudo_id) as user_pseudo_id,
  max(if(
    event_name in ('test_drive_start', 'quote_start'),
    session_id,
    null
  )) as form_start_session_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    session_id,
    null
  )) as conversion_session_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    experiment_id,
    null
  )) as experiment_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    experiment_assignment_id,
    null
  )) as experiment_assignment_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    variant_id,
    null
  )) as experiment_variant_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    personalisation_assignment_id,
    null
  )) as personalisation_assignment_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    audience_id,
    null
  )) as audience_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    experience_id,
    null
  )) as experience_id,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    holdout_flag,
    null
  )) as holdout_flag,
  min(if(
    event_name in ('test_drive_start', 'quote_start'),
    event_at,
    null
  )) as form_start_at,
  min(if(event_name = 'form_error', event_at, null)) as first_form_error_at,
  countif(event_name = 'form_error') as form_error_count,
  min(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    event_at,
    null
  )) as form_submit_at,
  max(form_type) as form_type,
  max(vehicle_model) as vehicle_model,
  max(vehicle_variant) as vehicle_variant,
  max(dealer_id) as dealer_id,
  max(dealer_state) as dealer_state,
  max(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    form_completion_time_seconds,
    null
  )) as form_completion_time_seconds,
  true as form_started_flag,
  countif(event_name = 'form_error') > 0 as form_error_flag,
  countif(event_name in ('test_drive_submit', 'quote_submit')) > 0
    as form_submitted_flag
from events
group by form_instance_id
