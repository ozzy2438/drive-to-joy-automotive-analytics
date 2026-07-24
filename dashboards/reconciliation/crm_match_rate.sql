select
  business_date,
  'crm_match_rate' as metric_id,
  matched_web_submissions as numerator,
  eligible_web_submissions as denominator,
  crm_match_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_executive_daily
