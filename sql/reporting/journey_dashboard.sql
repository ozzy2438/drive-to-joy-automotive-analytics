-- Purpose: customer journey dashboard extract.

select
  vehicle_model,
  countif(viewed_model_flag) as model_sessions,
  countif(configurator_start_flag) as configurator_starts,
  countif(configurator_complete_flag) as configurator_completions,
  countif(finance_complete_flag) as finance_completions,
  countif(dealer_select_flag) as dealer_selects,
  countif(test_drive_submit_flag) as test_drive_submits
from `analytics_marts.fct_vehicle_journey`
group by 1;
