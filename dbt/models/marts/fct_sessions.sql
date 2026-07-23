select
  session_id,
  user_pseudo_id,
  event_date,
  session_start_at,
  session_end_at,
  consent_analytics,
  viewed_model_flag,
  high_intent_flag,
  web_lead_flag,
  if(viewed_model_flag = 1 or high_intent_flag = 1, true, false) as engaged_session_flag
from {{ ref('int_sessions') }}
