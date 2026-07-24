with web_submissions as (
  select *
  from {{ ref('int_form_funnel') }}
  where web_submission_id is not null
),

crm as (
  select * from {{ ref('stg_crm_leads') }}
)

select
  coalesce(w.web_submission_id, c.web_submission_id) as web_submission_id,
  coalesce(w.lead_id_hash, c.lead_id_hash) as lead_id_hash,
  w.lead_id_hash as web_lead_id_hash,
  c.lead_id_hash as crm_lead_id_hash,
  w.form_instance_id,
  w.user_pseudo_id,
  w.form_start_session_id,
  w.conversion_session_id as session_id,
  w.experiment_id,
  w.experiment_assignment_id,
  w.experiment_variant_id,
  w.personalisation_assignment_id,
  w.audience_id,
  w.experience_id,
  w.holdout_flag,
  w.form_start_at,
  w.first_form_error_at,
  w.form_error_count,
  w.form_submit_at,
  w.form_completion_time_seconds,
  w.form_type,
  w.vehicle_model as web_vehicle_model,
  w.vehicle_variant as web_vehicle_variant,
  w.dealer_id as web_dealer_id,
  w.dealer_state as web_dealer_state,
  c.crm_lead_id,
  c.lead_created_at,
  c.lead_status,
  c.lead_status_updated_at,
  c.vehicle_model_interest,
  c.dealer_id as crm_dealer_id,
  c.disqualification_reason,
  c.appointment_booked_at,
  c.order_value_band,
  coalesce(w.web_submission_id is not null, false) as web_lead_flag,
  coalesce(
    w.web_submission_id is not null
      and c.crm_lead_id is not null
      and w.lead_id_hash = c.lead_id_hash,
    false
  ) as crm_matched_flag,
  coalesce(
    w.web_submission_id is not null
      and c.crm_lead_id is not null
      and w.lead_id_hash = c.lead_id_hash
      and c.lead_status in (
        'qualified',
        'appointment_booked',
        'attended',
        'ordered'
      ),
    false
  ) as qualified_lead_flag,
  coalesce(
    w.web_submission_id is not null
      and c.crm_lead_id is not null
      and w.lead_id_hash = c.lead_id_hash
      and c.appointment_booked_at is not null,
    false
  )
    as appointment_booked_flag,
  coalesce(
    w.web_submission_id is not null
      and c.crm_lead_id is not null
      and w.lead_id_hash = c.lead_id_hash
      and c.appointment_attended_flag,
    false
  ) as appointment_attended_flag,
  coalesce(
    w.web_submission_id is not null
      and c.crm_lead_id is not null
      and w.lead_id_hash = c.lead_id_hash
      and c.vehicle_ordered_flag,
    false
  ) as vehicle_ordered_flag,
  case
    when w.web_submission_id is not null
      and c.crm_lead_id is not null
      and w.lead_id_hash = c.lead_id_hash
      then 'matched'
    when w.web_submission_id is not null and c.crm_lead_id is not null
      then 'identity_conflict'
    when w.web_submission_id is not null then 'web_only'
    else 'crm_only'
  end as crm_match_status
from web_submissions w
full outer join crm c
  on w.web_submission_id = c.web_submission_id
