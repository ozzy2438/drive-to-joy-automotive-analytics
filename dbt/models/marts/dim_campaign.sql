select
  campaign_id,
  campaign_name,
  channel,
  source,
  medium,
  owner,
  objective,
  focus_type,
  focus_id,
  landing_page,
  active_start_date,
  active_end_date,
  governance_status,
  schema_version,
  record_version,
  data_origin
from {{ ref('stg_campaign_registry') }}
