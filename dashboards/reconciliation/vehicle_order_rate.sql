select
  business_date,
  'vehicle_order_rate' as metric_id,
  vehicle_orders as numerator,
  qualified_leads as denominator,
  vehicle_order_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_executive_daily
