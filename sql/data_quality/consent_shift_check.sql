-- Purpose: detect major consent shifts by day.

select
  event_date,
  consent_analytics,
  count(distinct user_pseudo_id) as users
from `analytics_staging.stg_ga4_events`
group by 1,2;
