select
  business_date,
  'model_to_test_drive_rate' as metric_id,
  test_drive_submit_sessions as numerator,
  model_view_sessions as denominator,
  model_to_test_drive_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_journey_daily
