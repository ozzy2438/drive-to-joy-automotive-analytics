select *
from {{ ref('fct_lead_funnel') }}
where appointment_attended_flag = true
  and appointment_booked_flag = false
