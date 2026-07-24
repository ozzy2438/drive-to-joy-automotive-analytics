{% if var('crm_source_adapter', 'synthetic_foundation') == 'local_demo' %}
  {% set crm_source = source('raw_local_demo', 'crm_leads') %}
{% elif var('crm_source_adapter', 'synthetic_foundation') == 'synthetic_foundation' %}
  {% set crm_source = source('raw_crm', 'leads') %}
{% else %}
  {{ exceptions.raise_compiler_error(
    "crm_source_adapter must be 'synthetic_foundation' or 'local_demo'"
  ) }}
{% endif %}

with source as (
  select * from {{ crm_source }}
)

select
  cast(schema_version as string) as schema_version,
  cast(crm_lead_id as string) as crm_lead_id,
  cast(web_submission_id as string) as web_submission_id,
  cast(lead_id_hash as string) as lead_id_hash,
  cast(web_submit_at as timestamp) as web_submit_at,
  cast(lead_created_at as timestamp) as lead_created_at,
  lower(cast(lead_status as string)) as lead_status,
  cast(lead_status_updated_at as timestamp) as lead_status_updated_at,
  cast(vehicle_model_interest as string) as vehicle_model_interest,
  cast(dealer_id as string) as dealer_id,
  lower(cast(disqualification_reason as string)) as disqualification_reason,
  cast(appointment_booked_at as timestamp) as appointment_booked_at,
  cast(appointment_attended_flag as bool) as appointment_attended_flag,
  cast(vehicle_ordered_flag as bool) as vehicle_ordered_flag,
  cast(order_value_band as string) as order_value_band,
  cast(data_origin as string) as data_origin
from source
