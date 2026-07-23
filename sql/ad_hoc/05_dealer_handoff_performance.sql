-- Business question: How does lead progression differ by dealer?
-- Grain: dealer

select
  coalesce(crm_dealer_id, web_dealer_id) as dealer_id,
  count(*) as web_leads,
  countif(qualified_lead_flag) as qualified_leads,
  countif(appointment_booked_flag) as appointments,
  countif(appointment_attended_flag) as attended,
  countif(vehicle_ordered_flag) as orders
from `analytics_marts.fct_lead_funnel`
group by 1;
