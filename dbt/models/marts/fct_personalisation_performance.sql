with events as (
  select * from {{ ref('stg_ga4_events') }}
)

select
  event_date,
  audience_id,
  experience_id,
  holdout_flag,
  count(distinct user_pseudo_id) as exposed_users,
  countif(event_name in ('test_drive_submit', 'quote_submit')) as web_leads
from events
where event_name = 'personalisation_exposure'
group by 1, 2, 3, 4
