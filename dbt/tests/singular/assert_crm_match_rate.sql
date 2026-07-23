with leads as (
  select * from {{ ref('fct_lead_funnel') }}
),
summary as (
  select safe_divide(countif(crm_matched_flag), countif(web_lead_flag)) as crm_match_rate
  from leads
)
select * from summary where crm_match_rate < 0.85
