with events as (
  select * from {{ ref('stg_ga4_events') }}
),

source_summary as (
  select
    max(event_at) as data_through_at_utc,
    count(distinct data_origin) as data_origin_count,
    max(data_origin) as data_origin
  from events
)

select
  'Australia/Melbourne' as reporting_timezone,
  case
    when data_origin_count = 1 then data_origin
    else 'mixed'
  end as data_origin,
  case
    when data_origin_count = 1 and data_origin = 'synthetic'
      then 'SYNTHETIC DEMONSTRATION DATA - NOT REAL PERFORMANCE'
    else 'NON-SYNTHETIC SOURCE - REVIEW DISCLOSURE'
  end as synthetic_watermark,
  data_through_at_utc,
  {{ semantic_evaluated_at() }} as evaluated_at_utc,
  {{ freshness_status(
    'data_through_at_utc',
    semantic_evaluated_at()
  ) }} as freshness_status,
  'synthetic_demo_only' as limitation_code
from source_summary
