-- Purpose: executive weekly KPI extract.

with sessions as (
  select event_date, countif(engaged_session_flag) as engaged_sessions
  from `analytics_marts.fct_sessions`
  group by 1
),
leads as (
  select date(form_submit_at) as event_date, countif(qualified_lead_flag) as qualified_leads
  from `analytics_marts.fct_lead_funnel`
  group by 1
)
select
  s.event_date,
  s.engaged_sessions,
  coalesce(l.qualified_leads,0) as qualified_leads,
  safe_divide(coalesce(l.qualified_leads,0), s.engaged_sessions) * 1000 as qualified_leads_per_1000_engaged_sessions
from sessions s
left join leads l using (event_date);
