select
  business_date,
  'test_drive_attendance_rate' as metric_id,
  attended_test_drives as numerator,
  booked_test_drives as denominator,
  test_drive_attendance_rate as metric_value,
  cast(null as varchar) as metric_status,
  metric_contract_version as metric_version,
  data_origin,
  quality_status,
  freshness_status,
  synthetic_watermark,
  limitation_code
from main_marts.agg_executive_daily
