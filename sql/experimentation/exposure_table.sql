-- Purpose: one exposure row per user/session/experiment.

select
  user_pseudo_id,
  session_id,
  experiment_id,
  variant_id,
  min(exposure_at) as first_exposure_at
from `analytics_intermediate.int_experiment_exposure`
group by 1,2,3,4;
