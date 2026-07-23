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
  count(distinct if(l.qualified_lead_flag, e.user_pseudo_id, null)) as qualified_lead_users,
  {{ safe_divide('count(distinct if(l.qualified_lead_flag, e.user_pseudo_id, null))', 'count(distinct e.user_pseudo_id)') }} as qualified_lead_rate
from exposure e
left join leads l
  on e.session_id is not null
 and date(l.form_submit_at) >= e.event_date
group by 1, 2, 3
