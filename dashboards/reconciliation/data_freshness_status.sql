select distinct
  business_date,
  'data_freshness_status' as metric_id,
  cast(null as double) as numerator,
  cast(null as double) as denominator,
  cast(null as double) as metric_value,
  freshness_status as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_data_quality_daily
