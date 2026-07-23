select
  campaign_id,
  any_value(campaign_name) as campaign_name,
  any_value(channel) as channel,
  any_value(source) as source,
  any_value(medium) as medium,
  any_value(objective) as objective,
  any_value(vehicle_model) as vehicle_model
from {{ ref('stg_media_spend') }}
group by 1
