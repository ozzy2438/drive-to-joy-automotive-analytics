{{ config(schema='quality') }}

with events as (
  select * from {{ ref('stg_ga4_events') }}
),

sessions as (
  select * from {{ ref('int_sessions') }}
),

forms as (
  select * from {{ ref('int_form_funnel') }}
),

leads as (
  select * from {{ ref('int_crm_web_match') }}
),

crm as (
  select * from {{ ref('stg_crm_leads') }}
),

experiment_exposures as (
  select * from {{ ref('int_experiment_exposure') }}
),

personalisation_exposures as (
  select * from {{ ref('int_personalisation_exposure') }}
),

vehicles as (
  select distinct vehicle_model
  from {{ ref('stg_vehicle_catalogue') }}
),

dealers as (
  select distinct dealer_id
  from {{ ref('stg_dealers') }}
),

campaigns as (
  select distinct campaign_id
  from {{ ref('stg_campaign_registry') }}
),

checks as (
  select
    'event_id_unique' as check_name,
    'critical' as severity,
    'analytics_engineering' as owner,
    count(*) - count(distinct event_id) as failure_count,
    'Canonical event IDs must be unique.' as details
  from events

  union all

  select
    'business_event_consent_valid',
    'critical',
    'digital_analytics',
    countif(
      event_name != 'consent_update'
      and consent_analytics != 'granted'
    ),
    'Business events require granted analytics consent.'
  from events

  union all

  select
    'vehicle_event_context_complete',
    'high',
    'digital_analytics',
    countif(
      event_name in (
        'view_vehicle_model',
        'view_vehicle_variant',
        'configurator_start',
        'configurator_complete',
        'finance_calculator_start',
        'finance_calculator_complete'
      )
      and vehicle_model is null
    ),
    'Vehicle journey events require vehicle_model.'
  from events

  union all

  select
    'form_start_identity_complete',
    'high',
    'digital_analytics',
    countif(form_instance_id is null),
    'Form starts require form_instance_id.'
  from events
  where event_name in ('test_drive_start', 'quote_start')

  union all

  select
    'web_submission_identity_complete',
    'critical',
    'analytics_engineering',
    countif(
      form_instance_id is null
      or web_submission_id is null
      or lead_id_hash is null
      or form_instance_id = web_submission_id
      or web_submission_id = lead_id_hash
    ),
    'Accepted submits require three complete and distinct identity roles.'
  from events
  where event_name in ('test_drive_submit', 'quote_submit')

  union all

  select
    'form_lifecycle_valid',
    'critical',
    'digital_analytics',
    countif(
      form_submitted_flag
      and (
        form_start_at is null
        or form_submit_at < form_start_at
      )
    ),
    'Accepted submits require an earlier start for the same form instance.'
  from forms

  union all

  select
    'duplicate_web_conversion',
    'critical',
    'analytics_engineering',
    count(*) - count(distinct web_submission_id),
    'Accepted submission IDs must occur once in canonical conversion events.'
  from events
  where event_name in ('test_drive_submit', 'quote_submit')

  union all

  select
    'experiment_assignment_valid',
    'critical',
    'experimentation',
    countif(not coalesce(assignment_valid_flag, false)),
    'Experiment exposure must match assignment, user, variant and window.'
  from experiment_exposures

  union all

  select
    'personalisation_assignment_valid',
    'critical',
    'personalisation',
    countif(not coalesce(assignment_valid_flag, false)),
    'Personalisation exposure must match assignment, user and experience.'
  from personalisation_exposures

  union all

  select
    'crm_outcome_order_valid',
    'critical',
    'crm_analytics',
    countif(
      lead_created_at < web_submit_at
      or lead_status_updated_at < lead_created_at
      or appointment_booked_at < lead_created_at
    ),
    'CRM lifecycle timestamps must follow web acceptance and lead creation.'
  from crm

  union all

  select
    'crm_identifiers_unique',
    'critical',
    'crm_analytics',
    greatest(
      count(*) - count(distinct crm_lead_id),
      count(*) - count(distinct web_submission_id)
    ),
    'CRM and submission identifiers must be unique.'
  from crm

  union all

  select
    'crm_identity_conflict',
    'critical',
    'crm_analytics',
    countif(crm_match_status = 'identity_conflict'),
    'Submission matches must also agree on the opaque lead hash.'
  from leads

  union all

  select
    'crm_match_rate_minimum',
    'critical',
    'crm_analytics',
    if(
      {{ safe_divide(
        'countif(crm_matched_flag)',
        'countif(web_lead_flag)'
      ) }} >= 0.85,
      0,
      1
    ),
    'At least 85% of accepted synthetic submissions should match CRM.'
  from leads

  union all

  select
    'vehicle_reference_integrity',
    'high',
    'analytics_engineering',
    count(*),
    'Event vehicle models must resolve to the governed vehicle dimension.'
  from (
    select distinct e.vehicle_model
    from events e
    left join vehicles v
      on e.vehicle_model = v.vehicle_model
    where e.vehicle_model is not null
      and v.vehicle_model is null
  )

  union all

  select
    'dealer_reference_integrity',
    'high',
    'analytics_engineering',
    count(*),
    'Event dealer IDs must resolve to the governed dealer dimension.'
  from (
    select distinct e.dealer_id
    from events e
    left join dealers d
      on e.dealer_id = d.dealer_id
    where e.dealer_id is not null
      and d.dealer_id is null
  )

  union all

  select
    'campaign_reference_integrity',
    'high',
    'marketing_analytics',
    count(*),
    'Event campaign IDs must resolve to the governed campaign registry.'
  from (
    select distinct e.campaign_id
    from events e
    left join campaigns c
      on e.campaign_id = c.campaign_id
    where e.campaign_id is not null
      and c.campaign_id is null
  )

  union all

  select
    'paid_campaign_utm_complete',
    'high',
    'marketing_analytics',
    countif(
      channel like 'Paid%'
      and (
        source is null
        or medium is null
        or campaign_id is null
        or campaign_name is null
      )
    ),
    'Paid sessions require governed source, medium and campaign context.'
  from {{ ref('int_marketing_attribution') }}

  union all

  select
    'funnel_progression_valid',
    'high',
    'crm_analytics',
    countif(
      (
        appointment_attended_flag
        and not appointment_booked_flag
      )
      or (
        vehicle_ordered_flag
        and not appointment_attended_flag
      )
    ),
    'Attendance requires booking and order requires attendance.'
  from leads

  union all

  select
    'session_user_consistency',
    'high',
    'analytics_engineering',
    count(*),
    'One session ID must not resolve to multiple browser IDs.'
  from (
    select session_id
    from events
    where session_id is not null
    group by session_id
    having count(distinct user_pseudo_id) > 1
  )

  union all

  select
    'session_rows_present',
    'critical',
    'analytics_engineering',
    if(count(*) > 0, 0, 1),
    'The local mart must contain identified sessions.'
  from sessions
)

select
  current_date() as check_date,
  check_name,
  severity,
  owner,
  if(coalesce(failure_count, 0) = 0, 'pass', 'fail') as status,
  coalesce(failure_count, 0) as failure_count,
  details
from checks
