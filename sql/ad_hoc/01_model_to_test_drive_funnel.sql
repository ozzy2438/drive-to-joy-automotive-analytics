-- Business question: Which vehicle models move research sessions to test-drive requests?
-- Grain: vehicle model
-- Source: analytics_marts.fct_vehicle_journey

select
  vehicle_model,
  countif(viewed_model_flag = 1) as model_view_sessions,
  countif(configurator_start_flag = 1) as configurator_starts,
  countif(finance_complete_flag = 1) as finance_completions,
  countif(test_drive_submit_flag = 1) as test_drive_submits,
  safe_divide(countif(test_drive_submit_flag = 1), countif(viewed_model_flag = 1)) as model_to_test_drive_rate
from `analytics_marts.fct_vehicle_journey`
group by 1
order by test_drive_submits desc;
