select
  cast(schema_version as string) as schema_version,
  cast(record_version as int64) as record_version,
  cast(dealer_id as string) as dealer_id,
  cast(dealer_name as string) as dealer_name,
  cast(state as string) as state,
  cast(region_type as string) as region_type,
  cast(capacity_band as string) as capacity_band,
  cast(active_flag as bool) as active_flag,
  cast(availability_state as string) as availability_state,
  cast(data_origin as string) as data_origin
from {{ ref('dealers') }}
