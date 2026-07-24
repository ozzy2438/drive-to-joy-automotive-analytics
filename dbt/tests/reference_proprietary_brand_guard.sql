select 'vehicle_catalogue' as dataset
from {{ ref('vehicle_catalogue') }}
where lower(vehicle_model || ' ' || vehicle_variant) like '%honda%'
union all
select 'dealers'
from {{ ref('dealers') }}
where lower(dealer_name) like '%honda%'
union all
select 'campaign_registry'
from {{ ref('campaign_registry') }}
where lower(campaign_name) like '%honda%'
