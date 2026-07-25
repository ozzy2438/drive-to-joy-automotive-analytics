select 'agg_journey_daily' as model_name
from (
  select business_date, vehicle_model
  from {{ ref('agg_journey_daily') }}
  group by 1, 2
  having count(*) > 1
)

union all

select 'agg_marketing_daily'
from (
  select business_date, channel, campaign_id
  from {{ ref('agg_marketing_daily') }}
  group by 1, 2, 3
  having count(*) > 1
)

union all

select 'agg_experiment_daily'
from (
  select business_date, experiment_id, variant_id
  from {{ ref('agg_experiment_daily') }}
  group by 1, 2, 3
  having count(*) > 1
)

union all

select 'agg_personalisation_daily'
from (
  select business_date, audience_id, experience_id
  from {{ ref('agg_personalisation_daily') }}
  group by 1, 2, 3
  having count(*) > 1
)
