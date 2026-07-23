with sessions as (
  select * from {{ ref('int_sessions') }}
)

select
  event_date,
  'unattributed' as channel,
  'unknown' as source,
  'unknown' as medium,
  count(*) as sessions,
  countif(high_intent_flag = 1) as high_intent_sessions,
  countif(web_lead_flag = 1) as web_lead_sessions
from sessions
group by 1, 2, 3, 4
