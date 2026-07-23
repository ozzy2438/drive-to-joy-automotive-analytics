-- Business question: Which returning sessions show high intent?

select
  event_date,
  count(*) as sessions,
  countif(high_intent_flag) as high_intent_sessions,
  safe_divide(countif(high_intent_flag), count(*)) as high_intent_rate
from `analytics_marts.fct_sessions`
group by 1;
