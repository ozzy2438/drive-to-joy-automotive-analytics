with exposure as (
  select * from {{ ref('int_experiment_exposure') }}
),
leads as (
  select * from {{ ref('fct_lead_funnel') }}
)

select
  e.event_date,
  e.experiment_id,
  e.variant_id,
  count(distinct e.user_pseudo_id) as exposed_users,
  count(distinct l.web_submission_id) as web_submissions,
  count(distinct if(
    e.session_id = l.session_id,
    l.web_submission_id,
    null
  )) as same_session_web_submissions,
  count(distinct if(l.qualified_lead_flag, e.user_pseudo_id, null)) as qualified_lead_users,
  {{ safe_divide('count(distinct if(l.qualified_lead_flag, e.user_pseudo_id, null))', 'count(distinct e.user_pseudo_id)') }} as qualified_lead_rate
from exposure e
left join leads l
  on e.experiment_assignment_id = l.experiment_assignment_id
 and e.user_pseudo_id = l.user_pseudo_id
 and l.form_submit_at >= e.exposure_at
 and l.form_submit_at < timestamp_add(e.exposure_at, interval 30 day)
group by 1, 2, 3
