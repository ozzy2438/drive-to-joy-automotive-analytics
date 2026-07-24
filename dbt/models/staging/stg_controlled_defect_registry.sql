select
  cast(record_type as string) as record_type,
  cast(record_id as string) as record_id,
  cast(check_name as string) as check_name,
  cast(expected_result as string) as expected_result,
  cast(data_origin as string) as data_origin
from {{ source('raw_quality', 'controlled_defect_registry') }}
