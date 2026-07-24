with events as (
  select * from {{ ref('stg_ga4_events') }}
),

submitted_forms as (
  select *
  from {{ ref('int_crm_web_match') }}
  where form_submit_at is not null
),

crm as (
  select * from {{ ref('stg_crm_leads') }}
),

checks as (
  select
    'event_id_unique' as check_name,
    count(*) - count(distinct event_id) as failure_count,
    'Canonical event IDs must be unique.' as details
  from events

  union all

  select
    'form_start_identity_complete',
    countif(form_instance_id is null),
    'Form starts require form_instance_id.'
  from events
  where event_name in ('test_drive_start', 'quote_start')

  union all

  select
    'web_submission_identity_complete',
    countif(
      form_instance_id is null
      or web_submission_id is null
      or lead_id_hash is null
    ),
    'Accepted submits require all three distinct identity roles.'
  from events
  where event_name in ('test_drive_submit', 'quote_submit')

  union all

  select
    'experiment_assignment_complete',
    countif(
      experiment_assignment_id is null
      or experiment_id is null
      or variant_id is null
    ),
    'Experiment exposures require experiment, assignment and variant IDs.'
  from events
  where event_name = 'experiment_exposure'

  union all

  select
    'personalisation_assignment_complete',
    countif(
      personalisation_assignment_id is null
      or audience_id is null
      or experience_id is null
      or holdout_flag is null
    ),
    'Personalisation exposures require assignment, audience and experience.'
  from events
  where event_name = 'personalisation_exposure'

  union all

  select
    'crm_outcome_order_valid',
    countif(
      lead_created_at < web_submit_at
      or lead_status_updated_at < lead_created_at
    ),
    'CRM creation and status timestamps must follow the web submit.'
  from crm

  union all

  select
    'crm_match_rate_minimum',
    if(
      safe_divide(countif(crm_matched_flag), count(*)) >= 0.80,
      0,
      1
    ),
    'At least 80% of accepted synthetic submissions should match CRM.'
  from submitted_forms
)

select
  current_date() as check_date,
  check_name,
  if(failure_count = 0, 'pass', 'fail') as status,
  failure_count,
  details
from checks
