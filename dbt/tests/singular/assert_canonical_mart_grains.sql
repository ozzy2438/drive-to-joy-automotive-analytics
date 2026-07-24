with duplicate_vehicle_journey as (
  select
    'fct_vehicle_journey' as model_name,
    session_id as primary_key_part,
    vehicle_model as secondary_key_part
  from {{ ref('fct_vehicle_journey') }}
  group by 1, 2, 3
  having count(*) > 1
),

duplicate_media as (
  select
    'fct_media_performance' as model_name,
    cast(spend_date as string) as primary_key_part,
    campaign_id as secondary_key_part
  from {{ ref('fct_media_performance') }}
  group by 1, 2, 3
  having count(*) > 1
),

duplicate_experiment as (
  select
    'fct_experiment_results' as model_name,
    concat(
      cast(exposure_date as string),
      '|',
      experiment_id
    ) as primary_key_part,
    variant_id as secondary_key_part
  from {{ ref('fct_experiment_results') }}
  group by 1, 2, 3
  having count(*) > 1
),

duplicate_personalisation as (
  select
    'fct_personalisation_performance' as model_name,
    concat(
      cast(exposure_date as string),
      '|',
      audience_id,
      '|',
      experience_id
    ) as primary_key_part,
    cast(holdout_flag as string) as secondary_key_part
  from {{ ref('fct_personalisation_performance') }}
  group by 1, 2, 3
  having count(*) > 1
)

select * from duplicate_vehicle_journey
union all
select * from duplicate_media
union all
select * from duplicate_experiment
union all
select * from duplicate_personalisation
