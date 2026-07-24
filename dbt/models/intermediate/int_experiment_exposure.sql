with events as (
  select * from {{ ref('stg_ga4_events') }}
),

first_exposure as (
  select
    event_date,
    user_pseudo_id,
    session_id,
    experiment_assignment_id,
    experiment_id,
    variant_id,
    event_at as exposure_at
  from events
  where event_name = 'experiment_exposure'
    and experiment_assignment_id is not null
    and experiment_id is not null
    and variant_id is not null
  qualify row_number() over (
    partition by experiment_assignment_id
    order by event_at
  ) = 1
)

select * from first_exposure
