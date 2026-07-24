select
  business_date,
  'experiment_qualified_lead_rate' as metric_id,
  qualified_leads as numerator,
  exposed_assignments as denominator,
  experiment_qualified_lead_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_experiment_daily
