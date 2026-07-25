select
  business_date,
  'utm_compliance_rate' as metric_id,
  compliant_paid_sessions as numerator,
  eligible_paid_sessions as denominator,
  utm_compliance_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_data_quality_daily
