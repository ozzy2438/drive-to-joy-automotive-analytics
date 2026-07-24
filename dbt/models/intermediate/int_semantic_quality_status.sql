with metadata as (
  select * from {{ ref('int_semantic_run_metadata') }}
),

quality_checks as (
  select * from {{ ref('fct_data_quality_results') }}
),

reconciliation as (
  select * from {{ ref('fct_reconciliation_results') }}
),

quality_rollup as (
  select
    count(*) as check_count,
    countif(status = 'fail' and severity = 'critical') as critical_failures,
    countif(status = 'fail' and severity != 'critical') as other_failures
  from quality_checks
),

reconciliation_rollup as (
  select
    countif(reconciliation_status = 'fail') as reconciliation_failures,
    countif(reconciliation_status = 'warn') as reconciliation_warnings
  from reconciliation
)

select
  m.reporting_timezone,
  m.data_origin,
  m.synthetic_watermark,
  m.data_through_at_utc,
  m.evaluated_at_utc,
  m.freshness_status,
  case
    when q.critical_failures > 0
      or r.reconciliation_failures > 0
      then 'fail'
    when m.freshness_status = 'stale' then 'stale'
    when q.other_failures > 0
      or r.reconciliation_warnings > 0
      then 'warn'
    when q.check_count = 0 or m.freshness_status = 'unknown' then 'unknown'
    else 'pass'
  end as quality_status,
  m.limitation_code
from metadata m
cross join quality_rollup q
cross join reconciliation_rollup r
