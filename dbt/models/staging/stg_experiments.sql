select
  cast(experiment_id as string) as experiment_id,
  cast(experiment_name as string) as experiment_name,
  date(start_date) as start_date,
  date(end_date) as end_date,
  cast(primary_metric as string) as primary_metric,
  cast(control_variant as string) as control_variant,
  cast(treatment_variants as string) as treatment_variants,
  cast(allocation_ratio as string) as allocation_ratio,
  cast(status as string) as status
from {{ ref('experiment_registry') }}
