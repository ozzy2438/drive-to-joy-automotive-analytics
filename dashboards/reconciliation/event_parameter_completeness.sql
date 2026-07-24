select
  business_date,
  'event_parameter_completeness' as metric_id,
  complete_required_events as numerator,
  eligible_required_events as denominator,
  event_parameter_completeness as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_data_quality_daily
