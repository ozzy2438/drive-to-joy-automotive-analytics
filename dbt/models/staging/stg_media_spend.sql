select
  date(spend_date) as spend_date,
  cast(channel as string) as channel,
  cast(source as string) as source,
  cast(medium as string) as medium,
  cast(campaign_id as string) as campaign_id,
  cast(campaign_name as string) as campaign_name,
  cast(objective as string) as objective,
  cast(vehicle_model as string) as vehicle_model,
  cast(spend_aud as numeric) as spend_aud,
  cast(impressions as int64) as impressions,
  cast(clicks as int64) as clicks
from {{ source('raw_media', 'daily_spend') }}
