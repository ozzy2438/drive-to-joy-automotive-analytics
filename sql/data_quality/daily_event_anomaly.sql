-- Purpose: detect daily event volume anomalies.

with daily as (
  select event_date, event_name, count(*) as event_count
  from `analytics_staging.stg_ga4_events`
  group by 1,2
),
stats as (
  select event_name, avg(event_count) as avg_count, stddev(event_count) as std_count
  from daily
  group by 1
)
select d.*, safe_divide(d.event_count - s.avg_count, nullif(s.std_count,0)) as z_score
from daily d
join stats s using (event_name)
where abs(safe_divide(d.event_count - s.avg_count, nullif(s.std_count,0))) >= 3;
