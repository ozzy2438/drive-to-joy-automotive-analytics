with leads as (
  select * from {{ ref('fct_lead_funnel') }}
),

daily as (
  select
    {{ business_date(
      'coalesce(form_submit_at, lead_created_at)'
    ) }} as business_date,
    countif(web_lead_flag) as eligible_web_submissions,
    countif(crm_matched_flag) as matched_web_submissions,
    countif(crm_match_status = 'web_only') as web_only_records,
    countif(crm_match_status = 'crm_only') as crm_only_records,
    countif(crm_match_status = 'identity_conflict') as identity_conflicts,
    countif(qualified_lead_flag) as qualified_leads
  from leads
  group by 1
)

select
  business_date,
  eligible_web_submissions,
  matched_web_submissions,
  web_only_records,
  crm_only_records,
  identity_conflicts,
  qualified_leads,
  {{ safe_divide(
    'matched_web_submissions',
    'eligible_web_submissions'
  ) }} as crm_match_rate,
  case
    when eligible_web_submissions = 0 then 'unknown'
    when identity_conflicts > 0 then 'fail'
    when eligible_web_submissions < 10 then 'unknown'
    when {{ safe_divide(
      'matched_web_submissions',
      'eligible_web_submissions'
    ) }} < 0.85 then 'fail'
    when {{ safe_divide(
      'matched_web_submissions',
      'eligible_web_submissions'
    ) }} < 0.90 then 'warn'
    else 'pass'
  end as reconciliation_status
from daily
