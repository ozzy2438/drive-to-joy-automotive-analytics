with invalid_experiment_outcomes as (
  select
    'experiment' as runtime_type,
    experiment_assignment_id as assignment_id,
    web_submission_id,
    exposure_at,
    outcome_at,
    outcome_window_end_at
  from {{ ref('int_experiment_outcomes') }}
  where outcome_at is not null
    and (
      outcome_at < exposure_at
      or outcome_at > outcome_window_end_at
    )
),

invalid_personalisation_outcomes as (
  select
    'personalisation' as runtime_type,
    personalisation_assignment_id as assignment_id,
    web_submission_id,
    exposure_at,
    outcome_at,
    outcome_window_end_at
  from {{ ref('int_personalisation_outcomes') }}
  where outcome_at is not null
    and (
      outcome_at < exposure_at
      or outcome_at > outcome_window_end_at
    )
)

select * from invalid_experiment_outcomes
union all
select * from invalid_personalisation_outcomes
