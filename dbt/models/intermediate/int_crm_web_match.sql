with forms as (
  select * from {{ ref('int_form_funnel') }}
),
crm as (
  select * from {{ ref('stg_crm_leads') }}
)

select
  f.lead_id_hash,
  f.form_start_at,
  f.first_form_error_at,
  f.form_error_count,
  f.form_submit_at,
  f.form_type,
  f.vehicle_model as web_vehicle_model,
  f.dealer_id as web_dealer_id,
  c.crm_lead_id,
  c.lead_created_at,
  c.lead_status,
  c.lead_status_updated_at,
  c.vehicle_model_interest,
  c.dealer_id as crm_dealer_id,
  c.disqualification_reason,
  c.appointment_booked_at,
  c.appointment_attended_flag,
  c.vehicle_ordered_flag,
  c.order_value_band,
  if(c.crm_lead_id is not null, true, false) as crm_matched_flag,
  if(c.lead_status = 'Qualified', true, false) as qualified_lead_flag
from forms f
left join crm c using (lead_id_hash)
