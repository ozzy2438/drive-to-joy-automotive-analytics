select
  cast(schema_version as string) as schema_version,
  cast(record_version as int64) as record_version,
  cast(campaign_id as string) as campaign_id,
  cast(campaign_name as string) as campaign_name,
  cast(channel as string) as channel,
  cast(source as string) as source,
  cast(medium as string) as medium,
  cast(owner as string) as owner,
  cast(objective as string) as objective,
  cast(focus_type as string) as focus_type,
  cast(focus_id as string) as focus_id,
  cast(landing_page as string) as landing_page,
  date(active_start_date) as active_start_date,
  date(active_end_date) as active_end_date,
  cast(governance_status as string) as governance_status,
  cast(data_origin as string) as data_origin
from {{ ref('campaign_registry') }}
