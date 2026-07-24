{% if var('event_source_adapter', 'synthetic_flat') == 'local_demo' %}

with exposures as (
  select *
  from {{ ref('stg_ga4_events') }}
  where event_name = 'experiment_exposure'
  qualify row_number() over (
    partition by experiment_assignment_id
    order by event_at, event_id
  ) = 1
)

select
  schema_version,
  experiment_assignment_id,
  experiment_id,
  user_pseudo_id as assignment_key,
  variant_id,
  'browser' as allocation_unit,
  event_at as eligible_at,
  event_at as assigned_at,
  event_at as exposed_at,
  event_id as exposure_event_id,
  {{ add_days('event_at', 30) }} as outcome_window_end_at,
  true as eligible_flag,
  cast(null as string) as exclusion_reason,
  consent_analytics,
  data_origin
from exposures

{% else %}

select
  cast(schema_version as string) as schema_version,
  cast(experiment_assignment_id as string) as experiment_assignment_id,
  cast(experiment_id as string) as experiment_id,
  cast(assignment_key as string) as assignment_key,
  cast(variant_id as string) as variant_id,
  cast(allocation_unit as string) as allocation_unit,
  cast(eligible_at as timestamp) as eligible_at,
  cast(assigned_at as timestamp) as assigned_at,
  cast(exposed_at as timestamp) as exposed_at,
  cast(exposure_event_id as string) as exposure_event_id,
  cast(outcome_window_end_at as timestamp) as outcome_window_end_at,
  cast(eligible_flag as bool) as eligible_flag,
  cast(exclusion_reason as string) as exclusion_reason,
  cast(consent_analytics as string) as consent_analytics,
  cast(data_origin as string) as data_origin
from {{ source('raw_synthetic', 'experiment_assignments') }}

{% endif %}
