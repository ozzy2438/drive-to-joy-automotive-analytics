select
  session_id,
  user_pseudo_id,
  event_date,
  session_start_at,
  session_end_at,
  consent_analytics,
  device_category,
  traffic_source,
  traffic_medium,
  campaign_id,
  campaign_name,
  event_count,
  viewed_model_flag,
  high_intent_flag,
  web_lead_flag,
  (
    viewed_model_flag = 1
    or high_intent_flag = 1
  ) as engaged_session_flag
from {{ ref('int_sessions') }}
