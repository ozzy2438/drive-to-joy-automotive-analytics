select
  *,
  if(form_submit_at is not null, true, false) as web_lead_flag,
  if(appointment_booked_at is not null, true, false) as appointment_booked_flag
from {{ ref('int_crm_web_match') }}
where form_submit_at is not null
