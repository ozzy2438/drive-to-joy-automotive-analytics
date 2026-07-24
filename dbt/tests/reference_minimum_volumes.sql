with failures as (
  select 'vehicle_variants' as dataset
  where (select count(*) from {{ ref('vehicle_catalogue') }}) < 12
  union all
  select 'vehicle_models'
  where (
    select count(distinct vehicle_model_id)
    from {{ ref('vehicle_catalogue') }}
  ) < 5
  union all
  select 'dealers'
  where (select count(*) from {{ ref('dealers') }}) < 20
  union all
  select 'campaigns'
  where (select count(*) from {{ ref('campaign_registry') }}) < 10
  union all
  select 'experiments'
  where (select count(*) from {{ ref('experiment_registry') }}) < 4
  union all
  select 'audiences'
  where (
    select count(*)
    from {{ ref('personalisation_audience_registry') }}
  ) < 6
)

select * from failures
