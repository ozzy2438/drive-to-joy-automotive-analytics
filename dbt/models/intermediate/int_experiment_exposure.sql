with exposure_events as (
  select *
  from {{ ref('stg_ga4_events') }}
  where event_name = 'experiment_exposure'
    and experiment_assignment_id is not null
  qualify row_number() over (
    partition by experiment_assignment_id
    order by event_at, event_id
  ) = 1
),

assignments as (
  select * from {{ ref('stg_experiment_assignments') }}
)

select
  e.event_date as exposure_date,
  e.event_id as exposure_event_id,
  e.event_at as exposure_at,
  e.user_pseudo_id as exposure_user_pseudo_id,
  e.session_id as exposure_session_id,
  e.experiment_assignment_id,
  e.experiment_id,
  e.variant_id,
  a.assignment_key,
  a.eligible_at,
  a.assigned_at,
  a.outcome_window_end_at,
  a.allocation_unit,
  a.eligible_flag,
  (
    a.experiment_assignment_id is not null
    and e.user_pseudo_id = a.assignment_key
    and e.experiment_id = a.experiment_id
    and e.variant_id = a.variant_id
    and e.event_at >= a.assigned_at
    and e.event_at <= a.outcome_window_end_at
  ) as assignment_valid_flag
from exposure_events e
left join assignments a
  on e.experiment_assignment_id = a.experiment_assignment_id
