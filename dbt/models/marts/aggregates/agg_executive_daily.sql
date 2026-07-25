with sessions as (
  select
    {{ business_date('session_start_at') }} as business_date,
    countif(engaged_session_flag) as engaged_sessions
  from {{ ref('fct_sessions') }}
  group by 1
),

leads as (
  select
    {{ business_date(
      'coalesce(form_submit_at, lead_created_at)'
    ) }} as business_date,
    countif(web_lead_flag) as eligible_web_submissions,
    countif(crm_matched_flag) as matched_web_submissions,
    countif(qualified_lead_flag) as qualified_leads,
    countif(
      form_type = 'test_drive'
      and appointment_booked_flag
    ) as booked_test_drives,
    countif(
      form_type = 'test_drive'
      and appointment_attended_flag
    ) as attended_test_drives,
    countif(vehicle_ordered_flag) as vehicle_orders
  from {{ ref('fct_lead_funnel') }}
  group by 1
),

daily as (
  select
    coalesce(s.business_date, l.business_date) as business_date,
    coalesce(s.engaged_sessions, 0) as engaged_sessions,
    coalesce(l.eligible_web_submissions, 0) as eligible_web_submissions,
    coalesce(l.matched_web_submissions, 0) as matched_web_submissions,
    coalesce(l.qualified_leads, 0) as qualified_leads,
    coalesce(l.booked_test_drives, 0) as booked_test_drives,
    coalesce(l.attended_test_drives, 0) as attended_test_drives,
    coalesce(l.vehicle_orders, 0) as vehicle_orders
  from sessions s
  full outer join leads l
    on s.business_date = l.business_date
),

metadata as (
  select * from {{ ref('int_semantic_quality_status') }}
)

select
  d.business_date,
  d.engaged_sessions,
  d.eligible_web_submissions,
  d.matched_web_submissions,
  d.qualified_leads,
  d.booked_test_drives,
  d.attended_test_drives,
  d.vehicle_orders,
  {{ safe_divide(
    'd.qualified_leads * 1000',
    'd.engaged_sessions'
  ) }} as qualified_leads_per_1000_engaged_sessions,
  {{ safe_divide(
    'd.qualified_leads',
    'd.matched_web_submissions'
  ) }} as qualified_lead_rate,
  {{ safe_divide(
    'd.matched_web_submissions',
    'd.eligible_web_submissions'
  ) }} as crm_match_rate,
  {{ safe_divide(
    'd.attended_test_drives',
    'd.booked_test_drives'
  ) }} as test_drive_attendance_rate,
  {{ safe_divide(
    'd.vehicle_orders',
    'd.qualified_leads'
  ) }} as vehicle_order_rate,
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
