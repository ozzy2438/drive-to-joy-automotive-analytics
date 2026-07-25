select
  business_date,
  'cost_per_qualified_lead' as metric_id,
  spend_aud as numerator,
  attributed_qualified_leads as denominator,
  cost_per_qualified_lead as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_marketing_daily
