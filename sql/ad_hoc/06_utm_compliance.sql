-- Business question: Which paid campaigns violate metadata rules?

select
  campaign_id,
  campaign_name,
  channel,
  source,
  medium,
  case
    when campaign_id is null or source is null or medium is null then 'invalid'
    else 'valid'
  end as utm_status
from `analytics_marts.dim_campaign`;
