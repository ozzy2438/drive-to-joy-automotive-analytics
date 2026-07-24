select
  business_date,
  'configurator_completion_rate' as metric_id,
  configurator_completions as numerator,
  configurator_starts as denominator,
  configurator_completion_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_journey_daily
