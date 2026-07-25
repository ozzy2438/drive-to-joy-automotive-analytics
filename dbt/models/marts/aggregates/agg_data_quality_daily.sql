with events as (
  select
    {{ business_date('event_at') }} as business_date,
    countif(event_name in (
      'view_vehicle_model',
      'view_vehicle_variant',
      'configurator_start',
      'configurator_complete',
      'finance_calculator_start',
      'finance_calculator_complete'
    )) as eligible_required_events,
    countif(
      event_name in (
        'view_vehicle_model',
        'view_vehicle_variant',
        'configurator_start',
        'configurator_complete',
        'finance_calculator_start',
        'finance_calculator_complete'
      )
      and vehicle_model is not null
    ) as complete_required_events
  from {{ ref('stg_ga4_events') }}
  group by 1
),

sessions as (
  select
    {{ business_date('session_start_at') }} as business_date,
    countif(traffic_medium in ('cpc', 'paid_social'))
      as eligible_paid_sessions,
    countif(
      traffic_medium in ('cpc', 'paid_social')
      and traffic_source is not null
      and traffic_medium is not null
      and campaign_id is not null
      and campaign_name is not null
    ) as compliant_paid_sessions
  from {{ ref('fct_sessions') }}
  group by 1
),

daily as (
  select
    coalesce(e.business_date, s.business_date) as business_date,
    coalesce(e.eligible_required_events, 0) as eligible_required_events,
    coalesce(e.complete_required_events, 0) as complete_required_events,
    coalesce(s.eligible_paid_sessions, 0) as eligible_paid_sessions,
    coalesce(s.compliant_paid_sessions, 0) as compliant_paid_sessions
  from events e
  full outer join sessions s
    on e.business_date = s.business_date
),

metadata as (
  select * from {{ ref('int_semantic_quality_status') }}
)

select
  d.business_date,
  d.eligible_required_events,
  d.complete_required_events,
  d.eligible_paid_sessions,
  d.compliant_paid_sessions,
  {{ safe_divide(
    'd.complete_required_events',
    'd.eligible_required_events'
  ) }} as event_parameter_completeness,
  {{ safe_divide(
    'd.compliant_paid_sessions',
    'd.eligible_paid_sessions'
  ) }} as utm_compliance_rate,
  '1.0.0' as metric_contract_version,
  m.reporting_timezone,
  m.data_origin,
  m.synthetic_watermark,
  m.data_through_at_utc,
  m.evaluated_at_utc,
  m.freshness_status,
  m.quality_status,
  m.limitation_code
from daily d
cross join metadata m
