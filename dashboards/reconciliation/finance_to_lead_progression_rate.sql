select
  business_date,
  'finance_to_lead_progression_rate' as metric_id,
  finance_complete_lead_sessions as numerator,
  finance_complete_sessions as denominator,
  finance_to_lead_progression_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_journey_daily
