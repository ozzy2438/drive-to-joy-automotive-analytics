select
  cast(schema_version as string) as schema_version,
  cast(record_version as int64) as record_version,
  cast(experiment_id as string) as experiment_id,
  cast(experiment_name as string) as experiment_name,
  cast(collision_namespace as string) as collision_namespace,
  cast(status as string) as status,
  cast(runtime_enabled as bool) as runtime_enabled,
  cast(allocation_unit as string) as allocation_unit,
  cast(allocation_rule as string) as allocation_rule,
  cast(variant_ids as string) as variant_ids,
  cast(allocation as string) as allocation,
  date(planned_start_date) as planned_start_date,
  date(planned_end_date) as planned_end_date,
  cast(primary_metric as string) as primary_metric,
  cast(owner as string) as owner,
  cast(feature_flag as string) as feature_flag,
  cast(data_origin as string) as data_origin
from {{ ref('experiment_registry') }}
