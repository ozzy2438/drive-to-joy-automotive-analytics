with valid_focuses as (
  select distinct vehicle_model_id as focus_id
  from {{ ref('vehicle_catalogue') }}
  union all
  select audience_id
  from {{ ref('personalisation_audience_registry') }}
  union all
  select 'sitewide'
)

select c.campaign_id, c.focus_type, c.focus_id
from {{ ref('campaign_registry') }} c
left join valid_focuses v using (focus_id)
where v.focus_id is null
