-- Funnel Analysis

-- Purpose: model-page to test-drive funnel by vehicle and device.
-- Grain: vehicle model × reporting date.

select
  vehicle_model,
  countif(viewed_model_flag = 1) as model_sessions,
  countif(configurator_start_flag = 1) as configurator_starts,
  countif(configurator_complete_flag = 1) as configurator_completions,
  countif(test_drive_submit_flag = 1) as test_drive_submits,
  safe_divide(countif(test_drive_submit_flag = 1), countif(viewed_model_flag = 1)) as model_to_test_drive_rate
from {{ ref('fct_vehicle_journey') }}
group by 1
