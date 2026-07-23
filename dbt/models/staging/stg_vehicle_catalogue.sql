select
  cast(vehicle_model as string) as vehicle_model,
  cast(vehicle_variant as string) as vehicle_variant,
  cast(body_type as string) as body_type,
  cast(powertrain as string) as powertrain,
  cast(price_band as string) as price_band,
  cast(seats as int64) as seats,
  cast(launch_status as string) as launch_status
from {{ ref('vehicle_catalogue') }}
