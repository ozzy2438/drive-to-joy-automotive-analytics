select 'executive_ql_per_1000' as failure
from {{ ref('agg_executive_daily') }}
where abs(
  qualified_leads_per_1000_engaged_sessions
  - {{ safe_divide('qualified_leads * 1000', 'engaged_sessions') }}
) > 0.000001

union all

select 'executive_qualified_lead_rate'
from {{ ref('agg_executive_daily') }}
where abs(
  qualified_lead_rate
  - {{ safe_divide('qualified_leads', 'matched_web_submissions') }}
) > 0.000001

union all

select 'journey_configurator_completion'
from {{ ref('agg_journey_daily') }}
where abs(
  configurator_completion_rate
  - {{ safe_divide('configurator_completions', 'configurator_starts') }}
) > 0.000001

union all

select 'marketing_cpql'
from {{ ref('agg_marketing_daily') }}
where abs(
  cost_per_qualified_lead
  - {{ safe_divide('spend_aud', 'attributed_qualified_leads') }}
) > 0.01

union all

select 'experiment_qualified_lead_rate'
from {{ ref('agg_experiment_daily') }}
where abs(
  experiment_qualified_lead_rate
  - {{ safe_divide('qualified_leads', 'exposed_assignments') }}
) > 0.000001

union all

select 'personalisation_holdout_lift'
from {{ ref('agg_personalisation_daily') }}
where abs(
  personalisation_holdout_lift
  - (
    {{ safe_divide(
      'treatment_qualified_leads',
      'treatment_exposures'
    ) }}
    - {{ safe_divide(
      'holdout_qualified_leads',
      'holdout_exposures'
    ) }}
  )
) > 0.000001
