with exposures as (
  select * from {{ ref('int_experiment_exposure') }}
),

leads as (
  select * from {{ ref('int_crm_web_match') }}
  where web_lead_flag
)

select
  e.exposure_date,
  e.experiment_assignment_id,
  e.experiment_id,
  e.variant_id,
  e.assignment_key,
  e.exposure_event_id,
  e.exposure_at,
  e.exposure_session_id,
  e.outcome_window_end_at,
  e.assignment_valid_flag,
  l.web_submission_id,
  l.lead_id_hash,
  l.form_submit_at as outcome_at,
  l.session_id as outcome_session_id,
  l.form_type,
  l.crm_matched_flag,
  l.qualified_lead_flag,
  l.appointment_booked_flag,
  l.appointment_attended_flag,
  l.vehicle_ordered_flag,
  (
    l.web_submission_id is not null
    and e.exposure_session_id = l.session_id
  ) as same_session_outcome_flag
from exposures e
left join leads l
  on e.experiment_assignment_id = l.experiment_assignment_id
 and e.assignment_key = l.user_pseudo_id
 and l.form_submit_at >= e.exposure_at
 and l.form_submit_at <= e.outcome_window_end_at
