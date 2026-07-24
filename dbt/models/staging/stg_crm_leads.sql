with source as (
  select * from {{ source('raw_crm', 'leads') }}
)

select
  cast(crm_lead_id as string) as crm_lead_id,
  cast(web_submission_id as string) as web_submission_id,
  cast(lead_id_hash as string) as lead_id_hash,
  timestamp(web_submit_at) as web_submit_at,
  timestamp(lead_created_at) as lead_created_at,
  lower(cast(lead_status as string)) as lead_status,
  timestamp(lead_status_updated_at) as lead_status_updated_at,
  cast(vehicle_model_interest as string) as vehicle_model_interest,
  cast(dealer_id as string) as dealer_id,
  lower(cast(disqualification_reason as string)) as disqualification_reason,
  timestamp(appointment_booked_at) as appointment_booked_at,
  cast(appointment_attended_flag as bool) as appointment_attended_flag,
  cast(vehicle_ordered_flag as bool) as vehicle_ordered_flag,
  cast(order_value_band as string) as order_value_band
from source
