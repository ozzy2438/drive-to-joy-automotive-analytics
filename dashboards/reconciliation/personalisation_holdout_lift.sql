select
  business_date,
  'personalisation_holdout_lift' as metric_id,
  treatment_qualified_lead_rate as numerator,
  holdout_qualified_lead_rate as denominator,
  personalisation_holdout_lift as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_personalisation_daily
