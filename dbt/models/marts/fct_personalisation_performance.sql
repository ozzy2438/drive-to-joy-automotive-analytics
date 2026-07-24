with outcomes as (
  select * from {{ ref('int_personalisation_outcomes') }}
)

select
  exposure_date,
  audience_id,
  experience_id,
  holdout_flag,
  count(distinct personalisation_assignment_id) as exposed_assignments,
  count(distinct assignment_key) as exposed_users,
  count(distinct web_submission_id) as web_submissions,
  count(distinct if(
    same_session_outcome_flag,
    web_submission_id,
    null
  )) as same_session_web_submissions,
  count(distinct if(
    crm_matched_flag,
    web_submission_id,
    null
  )) as crm_matched_submissions,
  count(distinct if(
    qualified_lead_flag,
    web_submission_id,
    null
  )) as qualified_leads,
  count(distinct if(
    appointment_attended_flag,
    web_submission_id,
    null
  )) as attended_appointments,
  count(distinct if(
    vehicle_ordered_flag,
    web_submission_id,
    null
  )) as vehicle_orders,
  {{ safe_divide(
    'count(distinct if(qualified_lead_flag, web_submission_id, null))',
    'count(distinct personalisation_assignment_id)'
  ) }} as qualified_lead_rate,
  {{ safe_divide(
    'count(distinct web_submission_id)',
    'count(distinct personalisation_assignment_id)'
  ) }} as web_submission_rate
from outcomes
group by 1, 2, 3, 4
