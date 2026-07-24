with events as (
  select * from {{ ref('stg_ga4_events') }}
)

select
  form_instance_id,
  any_value(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    web_submission_id,
    null
  )) as web_submission_id,
  any_value(if(
    event_name in ('test_drive_submit', 'quote_submit'),
    lead_id_hash,
    null
  )) as lead_id_hash,
  any_value(user_pseudo_id) as user_pseudo_id,
  any_value(session_id) as session_id,
  any_value(experiment_assignment_id) as experiment_assignment_id,
  any_value(personalisation_assignment_id) as personalisation_assignment_id,
  min(if(event_name in ('test_drive_start', 'quote_start'), event_at, null)) as form_start_at,
  min(if(event_name = 'form_error', event_at, null)) as first_form_error_at,
  countif(event_name = 'form_error') as form_error_count,
  min(if(event_name in ('test_drive_submit', 'quote_submit'), event_at, null)) as form_submit_at,
  any_value(if(event_name in ('test_drive_submit', 'quote_submit'), form_type, null)) as form_type,
  any_value(if(event_name in ('test_drive_submit', 'quote_submit'), vehicle_model, null)) as vehicle_model,
  any_value(if(event_name in ('test_drive_submit', 'quote_submit'), dealer_id, null)) as dealer_id
from events
where form_instance_id is not null
  and event_name in ('test_drive_start', 'quote_start', 'form_error', 'test_drive_submit', 'quote_submit')
group by 1
