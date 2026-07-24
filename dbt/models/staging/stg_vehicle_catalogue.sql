select
  cast(schema_version as string) as schema_version,
  cast(record_version as int64) as record_version,
  cast(vehicle_model_id as string) as vehicle_model_id,
  cast(vehicle_model as string) as vehicle_model,
  cast(model_slug as string) as model_slug,
  cast(variant_id as string) as variant_id,
  cast(vehicle_variant as string) as vehicle_variant,
  cast(body_type as string) as body_type,
  cast(usage_segment as string) as usage_segment,
  cast(powertrain as string) as powertrain,
  cast(price_band as string) as price_band,
  cast(seats as int64) as seats,
  cast(launch_status as string) as launch_status,
  cast(data_origin as string) as data_origin
from {{ ref('vehicle_catalogue') }}
