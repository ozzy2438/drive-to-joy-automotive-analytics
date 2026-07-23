select
  cast(dealer_id as string) as dealer_id,
  cast(dealer_name as string) as dealer_name,
  cast(state as string) as state,
  cast(region_type as string) as region_type,
  cast(active_flag as bool) as active_flag,
  cast(capacity_band as string) as capacity_band
from {{ ref('dealers') }}
