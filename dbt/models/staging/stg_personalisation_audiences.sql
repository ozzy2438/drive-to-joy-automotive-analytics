select
  cast(schema_version as string) as schema_version,
  cast(record_version as int64) as record_version,
  cast(audience_id as string) as audience_id,
  cast(audience_name as string) as audience_name,
  cast(status as string) as status,
  cast(runtime_enabled as bool) as runtime_enabled,
  cast(eligibility_version as string) as eligibility_version,
  cast(holdout_allocation as double) as holdout_allocation,
  cast(cooldown_hours as int64) as cooldown_hours,
  cast(priority as int64) as priority,
  cast(exclusion_rule_reference as string) as exclusion_rule_reference,
  cast(treatment_experience_id as string) as treatment_experience_id,
  cast(holdout_experience_id as string) as holdout_experience_id,
  cast(collision_namespace as string) as collision_namespace,
  cast(owner as string) as owner,
  cast(data_origin as string) as data_origin
from {{ ref('personalisation_audience_registry') }}
