select distinct
  business_date,
  'experiment_srm_status' as metric_id,
  total_exposed_assignments as numerator,
  variant_count as denominator,
  srm_chi_square as metric_value,
  srm_status as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_experiment_daily
