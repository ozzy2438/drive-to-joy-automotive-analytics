select
  date_day as date_key,
  extract(year from date_day) as year,
  extract(quarter from date_day) as quarter,
  extract(month from date_day) as month,
  format_date('%B', date_day) as month_name,
  extract(isoweek from date_day) as iso_week,
  extract(dayofweek from date_day) as day_of_week
from unnest(generate_date_array('2026-01-01', '2027-12-31')) as date_day
