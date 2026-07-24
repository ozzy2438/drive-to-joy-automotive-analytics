{{ config(
  enabled=var('semantic_source_adapter', 'canonical_marts')
    == 'dashboard_fixture'
) }}

with inputs as (
  select
    cast(fixture_version as string) as fixture_version,
    cast(scenario_id as string) as scenario_id,
    cast(metric_id as string) as metric_id,
    cast(operation as string) as operation,
    cast(numerator as double) as numerator,
    cast(denominator as double) as denominator,
    cast(scale as double) as scale,
    cast(status_value as string) as status_value,
    cast(data_through_at_utc as timestamp) as data_through_at_utc,
    cast(evaluated_at_utc as timestamp) as evaluated_at_utc,
    cast(input_quality_status as string) as input_quality_status,
    cast(limitation_code as string) as limitation_code,
    cast(data_origin as string) as data_origin
  from {{ source('raw_dashboard_fixtures', 'metric_inputs') }}
),

calculated as (
  select
    *,
    {{ freshness_status(
      'data_through_at_utc',
      'evaluated_at_utc'
    ) }} as freshness_status,
    case
      when operation = 'ratio'
        then {{ safe_divide('numerator * scale', 'denominator') }}
      when operation = 'difference' then numerator - denominator
      when operation = 'count' then numerator
      else null
    end as metric_value
  from inputs
)

select
  fixture_version,
  scenario_id,
  metric_id,
  operation,
  numerator,
  denominator,
  scale,
  metric_value,
  case
    when operation = 'status' then status_value
    when operation = 'freshness' then freshness_status
    else null
  end as metric_status,
  '1.0.0' as metric_contract_version,
  'Australia/Melbourne' as reporting_timezone,
  data_origin,
  'SYNTHETIC DASHBOARD ACCEPTANCE FIXTURE - NOT REAL PERFORMANCE'
    as synthetic_watermark,
  data_through_at_utc,
  evaluated_at_utc,
  freshness_status,
  case
    when input_quality_status = 'fail' then 'fail'
    when freshness_status = 'stale' then 'stale'
    when input_quality_status = 'warn' then 'warn'
    when input_quality_status = 'unknown'
      or freshness_status = 'unknown'
      then 'unknown'
    else 'pass'
  end as quality_status,
  limitation_code
from calculated
