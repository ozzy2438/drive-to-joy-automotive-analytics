select
  business_date,
  'qualified_leads_per_1000_engaged_sessions' as metric_id,
  qualified_leads as numerator,
  engaged_sessions as denominator,
  qualified_leads_per_1000_engaged_sessions as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_executive_daily
