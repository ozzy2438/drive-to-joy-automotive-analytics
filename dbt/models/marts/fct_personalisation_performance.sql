with events as (
  select * from {{ ref('stg_ga4_events') }}
),
exposures as (
  select
    event_date,
    user_pseudo_id,
    personalisation_assignment_id,
    audience_id,
    experience_id,
    holdout_flag,
    event_at as exposure_at
  from events
  where event_name = 'personalisation_exposure'
    and personalisation_assignment_id is not null
  qualify row_number() over (
    partition by personalisation_assignment_id
    order by event_at
  ) = 1
),
leads as (
  select * from {{ ref('fct_lead_funnel') }}
)

select
  e.event_date,
  e.audience_id,
  e.experience_id,
  e.holdout_flag,
  count(distinct e.user_pseudo_id) as exposed_users,
  count(distinct l.web_submission_id) as web_leads,
  count(distinct if(l.qualified_lead_flag, l.web_submission_id, null)) as qualified_leads
from exposures e
left join leads l
  on e.personalisation_assignment_id = l.personalisation_assignment_id
 and e.user_pseudo_id = l.user_pseudo_id
 and l.form_submit_at >= e.exposure_at
 and l.form_submit_at < timestamp_add(e.exposure_at, interval 14 day)
group by 1, 2, 3, 4
