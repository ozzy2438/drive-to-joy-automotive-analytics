with events as (
  select * from {{ ref('stg_ga4_events') }}
)

select
  event_date,
  user_pseudo_id,
  concat(user_pseudo_id, '-', ga_session_id) as session_id,
  experiment_id,
  variant_id,
  min(event_at) as exposure_at
from events
where event_name = 'experiment_exposure'
  and experiment_id is not null
  and variant_id is not null
group by 1, 2, 3, 4, 5
