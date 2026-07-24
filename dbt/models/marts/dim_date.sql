with date_spine as (
  {{ date_spine("'2026-01-01'", "'2027-12-31'") }}
)

select
  date_day as date_key,
  extract(year from date_day) as year,
  extract(quarter from date_day) as quarter,
  extract(month from date_day) as month,
  {{ month_name('date_day') }} as month_name,
  {{ iso_week_number('date_day') }} as iso_week,
  {{ iso_day_of_week('date_day') }} as day_of_week
from date_spine
