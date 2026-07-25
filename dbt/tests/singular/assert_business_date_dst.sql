with cases as (
  select
    cast('2026-04-04 15:30:00' as timestamp) as utc_at,
    cast('2026-04-05' as date) as expected_date

  union all

  select
    cast('2026-04-04 16:30:00' as timestamp),
    cast('2026-04-05' as date)

  union all

  select
    cast('2026-10-03 15:30:00' as timestamp),
    cast('2026-10-04' as date)

  union all

  select
    cast('2026-10-03 16:30:00' as timestamp),
    cast('2026-10-04' as date)
)

select *
from cases
where {{ business_date('utc_at') }} != expected_date
