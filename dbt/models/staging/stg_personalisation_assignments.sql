{% if var('event_source_adapter', 'synthetic_flat') == 'local_demo' %}

with exposures as (
  select *
  from {{ ref('stg_ga4_events') }}
  where event_name = 'personalisation_exposure'
  qualify row_number() over (
    partition by personalisation_assignment_id
    order by event_at, event_id
  ) = 1
)

select
  schema_version,
  personalisation_assignment_id,
  audience_id,
  user_pseudo_id as assignment_key,
  experience_id,
  holdout_flag,
  event_at as eligible_at,
  event_at as assigned_at,
  event_at as exposed_at,
  event_id as exposure_event_id,
  {{ add_days('event_at', 14) }} as outcome_window_end_at,
  consent_analytics,
  data_origin
from exposures

{% else %}

select
  cast(schema_version as string) as schema_version,
  cast(personalisation_assignment_id as string)
    as personalisation_assignment_id,
  cast(audience_id as string) as audience_id,
  cast(assignment_key as string) as assignment_key,
  cast(experience_id as string) as experience_id,
  cast(holdout_flag as bool) as holdout_flag,
  cast(eligible_at as timestamp) as eligible_at,
  cast(assigned_at as timestamp) as assigned_at,
  cast(exposed_at as timestamp) as exposed_at,
  cast(exposure_event_id as string) as exposure_event_id,
  cast(outcome_window_end_at as timestamp) as outcome_window_end_at,
  cast(consent_analytics as string) as consent_analytics,
  cast(data_origin as string) as data_origin
from {{ source('raw_synthetic', 'personalisation_assignments') }}

{% endif %}
